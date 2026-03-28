import type { SessionStatusSnapshot } from "../types";

// Default cost per 1M tokens (USD) when provider does not report cost.
// Based on typical OpenRouter pricing for mid-tier models.
const DEFAULT_COST_PER_1M_TOKENS = 0.32;

export function parseSessionStatusText(sessionKey: string, raw: string): SessionStatusSnapshot {
  const model = matchOne(raw, /Model:\s*([^·\n]+)/)?.trim();
  const tokensIn = toInt(matchOne(raw, /Tokens:\s*(\d+)\s*in/i));
  const tokensOut = toInt(matchOne(raw, /in\s*\/\s*(\d+)\s*out/i));
  let cost = toFloat(
    matchOne(raw, /Cost:\s*\$?\s*([0-9]+(?:\.[0-9]+)?)/i) ??
      matchOne(raw, /Total\s+Cost:\s*\$?\s*([0-9]+(?:\.[0-9]+)?)/i),
  );

  // Fallback: estimate cost from token counts when provider does not report it.
  if (cost === undefined && (tokensIn ?? 0) + (tokensOut ?? 0) > 0) {
    cost = estimateCostFromTokens(tokensIn ?? 0, tokensOut ?? 0);
  }

  return {
    sessionKey,
    model,
    tokensIn,
    tokensOut,
    cost,
    updatedAt: new Date().toISOString(),
  };
}

function estimateCostFromTokens(tokensIn: number, tokensOut: number): number {
  const totalTokens = tokensIn + tokensOut;
  return (totalTokens / 1_000_000) * DEFAULT_COST_PER_1M_TOKENS;
}

function matchOne(text: string, re: RegExp): string | undefined {
  const m = text.match(re);
  return m?.[1];
}

function toInt(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? undefined : n;
}

function toFloat(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number.parseFloat(v);
  return Number.isNaN(n) ? undefined : n;
}

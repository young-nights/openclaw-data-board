// SSE Connection Manager for OpenClaw Data Board

export type SSEEventHandler = (data: unknown) => void;

export class SSEManager {
  private source: EventSource | null = null;
  private handlers = new Map<string, Set<SSEEventHandler>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectMs = 3000;
  private closed = false;

  connect(path: string): void {
    if (this.closed) return;
    this.disconnect();

    this.source = new EventSource(path);

    this.source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const type = data.type ?? 'message';
        this.emit(type, data);
      } catch {
        // ignore parse errors
      }
    };

    this.source.onerror = () => {
      this.disconnect();
      if (!this.closed) {
        this.reconnectTimer = setTimeout(() => this.connect(path), this.reconnectMs);
      }
    };
  }

  on(type: string, handler: SSEEventHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  private emit(type: string, data: unknown): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch {
          // ignore handler errors
        }
      }
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.source) {
      this.source.close();
      this.source = null;
    }
  }

  close(): void {
    this.closed = true;
    this.disconnect();
  }
}

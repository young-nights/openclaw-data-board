// API Client for OpenClaw Data Board

const API_BASE = '';

export class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Snapshot
  async getSnapshot() {
    return this.fetch('/api/brain/timeline?limit=50');
  }

  // Sessions
  async getSessions(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/api/sessions${params ? `?${params}` : ''}`);
  }

  async getSessionDetail(sessionKey: string, historyLimit = 50) {
    return this.fetch(`/api/sessions/${encodeURIComponent(sessionKey)}?historyLimit=${historyLimit}`);
  }

  // Tasks
  async getTasks(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/api/tasks${params ? `?${params}` : ''}`);
  }

  async createTask(payload: Record<string, unknown>) {
    return this.fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return this.fetch(`/api/tasks/${encodeURIComponent(taskId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  // Projects
  async getProjects(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/api/projects${params ? `?${params}` : ''}`);
  }

  // Brain
  async getBrainTimeline(limit = 50) {
    return this.fetch(`/api/brain/timeline?limit=${limit}`);
  }

  async getBrainSessions() {
    return this.fetch('/api/brain/sessions');
  }

  // Usage Cost
  async getUsageCost() {
    return this.fetch('/api/usage-cost');
  }

  // UI Preferences
  async getUiPreferences() {
    return this.fetch('/api/ui/preferences');
  }

  async saveUiPreferences(prefs: Record<string, unknown>) {
    return this.fetch('/api/ui/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });
  }

  // Search
  async searchTasks(query: string, limit = 50) {
    return this.fetch(`/api/search/tasks?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async searchProjects(query: string, limit = 50) {
    return this.fetch(`/api/search/projects?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async searchSessions(query: string, limit = 50) {
    return this.fetch(`/api/search/sessions?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Export
  async exportState() {
    return this.fetch('/api/export/state.json');
  }

  // Action Queue
  async getActionQueue() {
    return this.fetch('/api/action-queue');
  }

  async ackActionItem(itemId: string, note?: string) {
    return this.fetch(`/api/action-queue/${encodeURIComponent(itemId)}/ack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
  }

  // Exceptions
  async getCommanderExceptions() {
    return this.fetch('/api/commander/exceptions');
  }

  // Files
  async listEditableFiles(scope: 'memory' | 'workspace') {
    return this.fetch(`/api/files?scope=${scope}`);
  }

  async getFileContent(scope: 'memory' | 'workspace', path: string) {
    return this.fetch(`/api/files/content?scope=${scope}&path=${encodeURIComponent(path)}`);
  }

  async updateFileContent(scope: 'memory' | 'workspace', path: string, content: string) {
    return this.fetch('/api/files/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope, path, content }),
    });
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = ApiClient.getInstance();

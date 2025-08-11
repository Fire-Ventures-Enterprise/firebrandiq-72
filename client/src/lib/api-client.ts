// API client for server-side endpoints
export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '';  // Same origin requests
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // User methods
  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Profile methods
  async getProfileByUserId(userId: string) {
    return this.request(`/profiles/user/${userId}`);
  }

  async createProfile(profileData: any) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Client methods
  async getClients(agencyId: string) {
    return this.request(`/clients?agencyId=${agencyId}`);
  }

  async createClient(clientData: any) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  // Content generation
  async generateContent(requestData: any) {
    return this.request('/generate-content', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Analytics
  async getReviewAnalytics(brandId?: string) {
    const params = brandId ? `?brandId=${brandId}` : '';
    return this.request(`/review-analytics${params}`);
  }

  async getExposureAnalysis(brandId?: string) {
    const params = brandId ? `?brandId=${brandId}` : '';
    return this.request(`/exposure-analysis${params}`);
  }
}

export const apiClient = new ApiClient();
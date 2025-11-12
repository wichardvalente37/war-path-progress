const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiError {
  error: string;
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    return response.json();
  }

  // Auth
  async register(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<{ token: string; user: any }>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<{ token: string; user: any }>(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async logout() {
    localStorage.removeItem('auth_token');
  }

  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Profile
  async getProfile() {
    const response = await fetch(`${API_URL}/profile`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: { username?: string; avatar_url?: string }) {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Missions
  async getMissions() {
    const response = await fetch(`${API_URL}/missions`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  async createMission(data: any) {
    const response = await fetch(`${API_URL}/missions`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateMission(id: string, data: any) {
    const response = await fetch(`${API_URL}/missions/${id}`, {
      method: 'PUT',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteMission(id: string) {
    const response = await fetch(`${API_URL}/missions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Goals
  async getGoals() {
    const response = await fetch(`${API_URL}/goals`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  async createGoal(data: any) {
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateGoal(id: string, data: any) {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteGoal(id: string) {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Categories
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  async createCategory(data: { name: string }) {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteCategory(id: string) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Achievements
  async getAchievements() {
    const response = await fetch(`${API_URL}/achievements`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  async createAchievement(data: { title: string; description?: string; icon?: string }) {
    const response = await fetch(`${API_URL}/achievements`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteAchievement(id: string) {
    const response = await fetch(`${API_URL}/achievements/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }
}

export const api = new ApiClient();

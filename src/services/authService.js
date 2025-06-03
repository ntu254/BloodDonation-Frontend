// src/services/authService.js
import apiClient from './apiClient';

class AuthService {
    async register(fullName, email, password) {
        try {
            const response = await apiClient.post('/auth/register', { //
                fullName,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Registration failed");
        }
    }

    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', { email, password }); //
            const data = response.data;
            if (data && data.accessToken) {
                localStorage.setItem('authToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data));
            }
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Login failed");
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
                this.logout();
                return null;
            }
        }
        return null;
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }
}

export default new AuthService();
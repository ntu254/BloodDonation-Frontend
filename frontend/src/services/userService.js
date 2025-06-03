// src/services/userService.js
import apiClient from './apiClient';

class UserService {
    // Admin User Service Methods
    async getAllUsers(page = 0, size = 10, sort = ['id', 'asc']) {
        try {
            const sortParams = sort.join(',');
            const response = await apiClient.get(`/admin/users?page=${page}&size=${size}&sort=${sortParams}`); //
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Failed to fetch users");
        }
    }

    async createUserByAdmin(userData) {
        try {
            const response = await apiClient.post('/admin/users', userData); //
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Failed to create user");
        }
    }

    async getUserByIdForAdmin(userId) {
        try {
            const response = await apiClient.get(`/admin/users/${userId}`); //
            return response.data;
        } catch (error) {
            console.error(`Error fetching user by ID ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Failed to fetch user details");
        }
    }

    async updateUserByAdmin(userId, userData) {
        try {
            const response = await apiClient.put(`/admin/users/${userId}`, userData); //
            return response.data;
        } catch (error) {
            console.error(`Error updating user ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Failed to update user");
        }
    }

    async softDeleteUserByAdmin(userId) {
        try {
            const response = await apiClient.delete(`/admin/users/${userId}`); //
            return response.data;
        } catch (error) {
            console.error(`Error soft deleting user ${userId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.response?.data || error.message || "Failed to disable user");
        }
    }

    // Common data fetching (roles, blood types)
    async getRoles() {
        try {
            const response = await apiClient.get('/roles'); // Giả định endpoint là /api/roles
            return response.data;
        } catch (error) { //
            console.error("Error fetching roles:", error.response?.data || error.message);
            // Fallback data as in original AdminUserService.jsx
            return [
                { id: 1, name: "Guest", description: "Public users..." },
                { id: 2, name: "Member", description: "Registered users..." },
                { id: 3, name: "Staff", description: "Medical staff..." },
                { id: 4, name: "Admin", description: "System admins..." },
            ];
        }
    }

    async getBloodTypes() {
        try {
            const response = await apiClient.get('/blood-types'); //
            return response.data;
        } catch (error) { //
            console.error("Error fetching blood types:", error.response?.data || error.message);
            return []; // Fallback from original
        }
    }

    // General User Profile Methods
    async getCurrentUserProfile() {
        try {
            const response = await apiClient.get('/users/me/profile'); //
            return response.data;
        } catch (error) {
            console.error("Error fetching current user profile:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Failed to fetch user profile");
        }
    }

    async updateUserProfile(updateData) {
        try {
            const response = await apiClient.put('/users/me/profile', updateData); //
            return response.data;
        } catch (error) {
            console.error("Error updating user profile:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Failed to update profile");
        }
    }
}

export default new UserService();
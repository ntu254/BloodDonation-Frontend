// src/services/bloodCompatibilityService.js
import apiClient from './apiClient'; //

const bloodCompatibilityService = {
    getAll: async (page = 0, size = 10, sort = ['id', 'asc']) => {
        const sortParams = sort.join(',');
        const response = await apiClient.get(`/blood-compatibility?page=${page}&size=${size}&sort=${sortParams}`); //
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/blood-compatibility/${id}`); //
        return response.data;
    },
    create: async (data) => {
        // Data for CreateBloodCompatibilityRequest
        const response = await apiClient.post('/blood-compatibility', data); //
        return response.data;
    },
    update: async (id, data) => {
        // Data for UpdateBloodCompatibilityRequest
        const response = await apiClient.put(`/blood-compatibility/${id}`, data); //
        return response.data;
    },
    delete: async (id) => {
        await apiClient.delete(`/blood-compatibility/${id}`); //
    },
};

export default bloodCompatibilityService;
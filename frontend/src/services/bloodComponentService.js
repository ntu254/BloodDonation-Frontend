// src/services/bloodComponentService.js
import apiClient from './apiClient'; //

const bloodComponentService = {
    getAll: async () => {
        const response = await apiClient.get('/blood-components'); //
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/blood-components/${id}`); //
        return response.data;
    },
    create: async (data) => {
        // Data for CreateBloodComponentRequest
        const response = await apiClient.post('/blood-components', data); //
        return response.data;
    },
    update: async (id, data) => {
        // Data for UpdateBloodComponentRequest
        const response = await apiClient.put(`/blood-components/${id}`, data); //
        return response.data;
    },
    delete: async (id) => {
        await apiClient.delete(`/blood-components/${id}`); //
    },
};

export default bloodComponentService;
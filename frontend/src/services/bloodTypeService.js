// src/services/bloodTypeService.js
import apiClient from './apiClient'; //

const bloodTypeService = {
    getAll: async () => {
        const response = await apiClient.get('/blood-types'); //
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/blood-types/${id}`); //
        return response.data;
    },
    create: async (data) => {
        // Data: { bloodGroup, rhFactor, description }
        const response = await apiClient.post('/blood-types', data); //
        return response.data;
    },
    update: async (id, data) => {
        // Data: { description }
        const response = await apiClient.put(`/blood-types/${id}`, data); //
        return response.data;
    },
    delete: async (id) => {
        await apiClient.delete(`/blood-types/${id}`); //
    },
};

export default bloodTypeService;
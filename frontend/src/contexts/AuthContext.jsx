// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const initializeAuth = useCallback(() => {
        setLoading(true);
        const currentUserData = authService.getCurrentUser();
        const token = authService.getAuthToken();

        if (currentUserData && token) {
            setUser(currentUserData);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
            if (token) authService.logout();
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userData = await authService.login(email, password);
            setUser(userData);
            setIsAuthenticated(true);
            setLoading(false);
            return userData;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            throw error;
        }
    };

    const register = async (fullName, email, password) => { // Loại bỏ citizenId
        setLoading(true);
        try {
            // Gọi authService.register mà không có citizenId
            const response = await authService.register(fullName, email, password);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUserContext = (updatedUserData) => {
        const mergedUser = { ...user, ...updatedUserData, role: user?.role };
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, initializeAuth, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
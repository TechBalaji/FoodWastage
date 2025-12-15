import api from './api';

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Check if user is admin
export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'admin';
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Register function
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        const { token, user } = response.data.data;

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// Update user in localStorage
export const updateUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

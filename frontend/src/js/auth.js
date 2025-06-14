const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
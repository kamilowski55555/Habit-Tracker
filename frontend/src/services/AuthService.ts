import ApiClient from '../utils/api'; // Centralized Axios instance

// Define the types for login and registration payloads
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// Login API call
export const login = async (payload: LoginPayload): Promise<string> => {
    const response = await ApiClient.post('/auth/login', payload);
    return response.data.accessToken; // Return only the token
};

// Register API call
export const register = async (payload: RegisterPayload): Promise<void> => {
    await ApiClient.post('/users/register', payload);
};

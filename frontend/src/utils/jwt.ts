export const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
};

export const isTokenExpired = (token: string) => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
        return true;
    }
    return Date.now() >= payload.exp * 1000;
};

// Retrieve the JWT token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('token'); // Key should match where you save it
};

// Store the JWT token in localStorage
export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

// Clear the JWT token from localStorage
export const clearToken = () => {
    localStorage.removeItem('token');
};

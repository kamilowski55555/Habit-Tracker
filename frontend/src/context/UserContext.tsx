import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import UserService from '../services/UserService';
import { UserDetailsDto } from '../types/UserTypes';
import { getUserIdFromToken } from '../utils/jwt';
import {useAuth} from "./AuthContext.tsx";

interface UserContextType {
    user: UserDetailsDto | null; // The current user's details
    refreshUser: () => Promise<void>; // Function to refresh user data
    updateUser: (updatedData: Partial<UserDetailsDto>) => void; // Update user data locally
    clearUser: () => void; // Clear user data on logout
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Check if the user is authenticated
    const [user, setUser] = useState<UserDetailsDto | null>(null);

    // Fetch user data from the backend
    const refreshUser = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        try {
            const userDetails = await UserService.UserDetailsDto(userId);
            setUser(userDetails);
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    // Update the user data locally
    const updateUser = (updatedData: Partial<UserDetailsDto>) => {
        if (!user) return;
        setUser((prevUser) => ({
            ...prevUser!,
            ...updatedData,
        }));
    };

    // Clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
    };

    // Polling to refresh user data every 5 minutes (300,000 ms)
    useEffect(() => {
        if (!isAuthenticated) return; // Only start polling when authenticated

        const POLLING_INTERVAL = 300000; // 5 minutes
        const interval = setInterval(() => {
            console.log('Polling user data...');
            refreshUser();
        }, POLLING_INTERVAL);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isAuthenticated]); // Re-start polling only when authentication status changes

    // Initial fetch after login
    useEffect(() => {
        if (isAuthenticated) {
            refreshUser(); // Fetch user data only if authenticated
        }
    }, [isAuthenticated]); // Run once when `isAuthenticated` changes to true

    return (
        <UserContext.Provider value={{ user, refreshUser, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook for accessing the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

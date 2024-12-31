// services/UserService.ts
import ApiClient from '../utils/api'; // Replace with the path to your Axios instance
import { UserDetailsDto } from '../types'; // Correctly import the DTO type

const USER_BASE_URL = '/users'; // Base URL for user-related endpoints

const UserService = {
    // Fetch user details by user ID
    async UserDetailsDto(userId: string): Promise<UserDetailsDto> {
        try {
            const response = await ApiClient.get<UserDetailsDto>(`${USER_BASE_URL}/${userId}`);
            return response.data; // Return the user details
        } catch (error) {
            console.error(`Failed to fetch user details for ID ${userId}:`, error);
            throw error; // Re-throw error for the caller to handle
        }
    },
};

export default UserService;

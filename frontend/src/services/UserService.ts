// services/UserService.ts
import ApiClient from '../utils/api'; // Replace with the path to your Axios instance
import {NotificationEnableRequest, NotificationTimeRequest, UserDetailsDto} from '../types'; // Correctly import the DTO type

const USER_BASE_URL = '/users'; // Base URL for user-related endpoints

const UserService = {
    // Fetch user details by user ID
    async getUserDetails(userId: string): Promise<UserDetailsDto> {
        try {
            const response = await ApiClient.get<UserDetailsDto>(`${USER_BASE_URL}/${userId}`);
            return response.data; // Return the user details
        } catch (error) {
            console.error(`Failed to fetch user details for ID ${userId}:`, error);
            throw error; // Re-throw error for the caller to handle
        }
    },
    async toggleNotifications(userId: string, payload: NotificationEnableRequest): Promise<void> {
        try {
            await ApiClient.patch(`${USER_BASE_URL}/${userId}/notifications`, payload);
        } catch (error) {
            console.error(`Failed to update notifications for user ID ${userId}:`, error);
            throw error;
        }
    },

    // Add a notification time
    async addNotificationTime(userId: string, payload: NotificationTimeRequest): Promise<void> {
        try {
            await ApiClient.post(`${USER_BASE_URL}/${userId}/notifications`, payload);
        } catch (error) {
            console.error(`Failed to add notification time for user ID ${userId}:`, error);
            throw error;
        }
    },

    // Delete a notification time
    async deleteNotificationTime(userId: string, payload: NotificationTimeRequest): Promise<void> {
        try {
            await ApiClient.delete(`${USER_BASE_URL}/${userId}/notifications`, {
                data: payload,
            });
        } catch (error) {
            console.error(`Failed to delete notification time for user ID ${userId}:`, error);
            throw error;
        }
    },
};

export default UserService;

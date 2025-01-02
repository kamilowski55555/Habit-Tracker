// services/RewardService.ts

import ApiClient from '../utils/api'; // Assumes a centralized Axios instance
import { RewardListDto, RewardCreateDto, RewardModifyDto } from '../types/RewardTypes';

const REWARDS_BASE_URL = '/rewards'; // Base URL for rewards endpoints

const RewardService = {
    // Fetch all rewards
    async getRewards(): Promise<RewardListDto[]> {
        try {
            const response = await ApiClient.get<RewardListDto[]>(REWARDS_BASE_URL);
            return response.data; // List of rewards from the backend
        } catch (error) {
            console.error('Error fetching rewards:', error);
            throw error; // Rethrow for the caller to handle
        }
    },

    // Create a new reward
    async createReward(rewardData: RewardCreateDto): Promise<RewardListDto> {
        try {
            const response = await ApiClient.post<RewardListDto>(REWARDS_BASE_URL, rewardData);
            return response.data; // The newly created reward
        } catch (error) {
            console.error('Error creating reward:', error);
            throw error; // Rethrow for the caller to handle
        }
    },

    // Update an existing reward
    async updateReward(id: string, rewardData: RewardModifyDto): Promise<RewardListDto> {
        try {
            const response = await ApiClient.patch<RewardListDto>(
                `${REWARDS_BASE_URL}/${id}`,
                rewardData
            );
            return response.data; // The updated reward
        } catch (error) {
            console.error(`Error updating reward with ID ${id}:`, error);
            throw error; // Rethrow for the caller to handle
        }
    },

    // Delete a reward
    async deleteReward(id: string): Promise<void> {
        try {
            await ApiClient.delete(`${REWARDS_BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting reward with ID ${id}:`, error);
            throw error; // Rethrow for the caller to handle
        }
    },

    // Redeem a reward
    async redeemReward(id: string): Promise<{ success: boolean; message: string; updatedBalance?: number }> {
        try {
            const response = await ApiClient.post<{ success: boolean; message: string; updatedBalance?: number }>(
                `${REWARDS_BASE_URL}/${id}/redeem`
            );
            return response.data; // Success message and optional updated balance
        } catch (error) {
            console.error(`Error redeeming reward with ID ${id}:`, error);
            throw error; // Rethrow for the caller to handle
        }
    },
};

export default RewardService;

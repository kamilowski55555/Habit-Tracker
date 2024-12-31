import ApiClient from '../utils/api'; // Centralized Axios instance
import logError from '../utils/logError';
import {
    HabitCreateDto,
    HabitDetailsDto,
    HabitListDto,
    HabitModifyDto,
} from '../types';

const HABITS_BASE_URL = '/habits';

const HabitService = {
    // Fetch the list of habits
    async getHabits(): Promise<HabitListDto[]> {
        try {
            const response = await ApiClient.get<HabitListDto[]>(`${HABITS_BASE_URL}`);
            return response.data;
        } catch (error) {
            logError('Fetching habits', error);
            throw error;
        }
    },

    // Fetch habit details by ID
    async getHabitDetails(habitId: string): Promise<HabitDetailsDto> {
        try {
            const response = await ApiClient.get<HabitDetailsDto>(
                `${HABITS_BASE_URL}/${habitId}`
            );
            return response.data;
        } catch (error) {
            logError(`Fetching habit details (ID: ${habitId})`, error);
            throw error;
        }
    },

    // Create a new habit
    async createHabit(habitData: HabitCreateDto): Promise<string> {
        const transformedData = {
            ...habitData,
            habitDays: Array.from(habitData.habitDays), // Convert Set to Array if necessary
        };

        console.log('[HabitService] Creating habit with payload:', transformedData);

        try {
            const response = await ApiClient.post(`${HABITS_BASE_URL}`, transformedData);
            const locationHeader = response.headers['location'];
            console.log('[HabitService] Habit created successfully. Location:', locationHeader);
            return locationHeader;
        } catch (error) {
            logError('Creating habit', error, JSON.stringify(transformedData));
            throw error;
        }
    },

    // Modify an existing habit
    async modifyHabit(
        habitId: string,
        habitData: Partial<HabitModifyDto>
    ): Promise<HabitDetailsDto> {
        const transformedData = {
            ...habitData,
            habitDays: habitData.habitDays ? Array.from(habitData.habitDays) : undefined,
        };

        console.log('[HabitService] Modifying habit with payload:', transformedData);

        try {
            const response = await ApiClient.patch<HabitDetailsDto>(
                `${HABITS_BASE_URL}/${habitId}`,
                transformedData
            );
            console.log('[HabitService] Habit modified successfully (ID:', habitId, ')');
            return response.data;
        } catch (error) {
            logError(`Modifying habit (ID: ${habitId})`, error, JSON.stringify(transformedData));
            throw error;
        }
    },

    // Delete a habit
    async deleteHabit(habitId: string): Promise<void> {
        try {
            await ApiClient.delete(`${HABITS_BASE_URL}/${habitId}`);
            console.log(`[HabitService] Habit deleted successfully (ID: ${habitId})`);
        } catch (error) {
            logError(`Deleting habit (ID: ${habitId})`, error);
            throw error;
        }
    },
};

export default HabitService;

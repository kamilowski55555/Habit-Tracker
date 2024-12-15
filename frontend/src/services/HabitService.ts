import ApiClient from '../utils/api'; // Centralized Axios instance
import {HabitCreateDto, HabitDetailsDto, HabitListDto, HabitModifyDto} from '../types';

const HABITS_BASE_URL = '/habits';

const HabitService = {
    // Fetch the list of habits
    async getHabits(): Promise<HabitListDto[]> {
        try {
            const response = await ApiClient.get<HabitListDto[]>(`${HABITS_BASE_URL}`);
            return response.data; // Habit list returned from the backend
        } catch (error) {
            console.error('Error fetching habits:', error);
            throw error; // Forward error to the caller
        }
    },

    // Fetch habit details by ID
    async getHabitDetails(habitId: string): Promise<HabitDetailsDto> {
        try {
            const response = await ApiClient.get<HabitDetailsDto>(`${HABITS_BASE_URL}/${habitId}`);
            return response.data; // Return the habit details
        } catch (error) {
            console.error(`Error fetching habit details for ID ${habitId}:`, error);
            throw error;
        }
    },

    // Create a new habit
    async createHabit(habitData: HabitCreateDto): Promise<string> {
        try {
            const response = await ApiClient.post(`${HABITS_BASE_URL}`, habitData);
            const locationHeader = response.headers['location']; // Get the URI from headers
            return locationHeader; // Return the Location header (URI of created resource)
        } catch (error) {
            console.error('Error creating habit:', error);
            throw error;
        }
    },

    // Delete a habit by ID
    async deleteHabit(habitId: string): Promise<void> {
        try {
            await ApiClient.delete(`${HABITS_BASE_URL}/${habitId}`);
        } catch (error) {
            console.error(`Error deleting habit with ID ${habitId}:`, error);
            throw error;
        }
    },

    // Modify an existing habit
    async modifyHabit(habitId: string, habitData: HabitModifyDto): Promise<HabitDetailsDto> {
        try {
            const response = await ApiClient.put<HabitDetailsDto>(
                `${HABITS_BASE_URL}/${habitId}`,
                habitData
            );
            return response.data;
        } catch (error) {
            console.error(`Error modifying habit with ID ${habitId}:`, error);
            throw error;
        }
    },
};

export default HabitService;

import ApiClient from '../utils/api'; // Centralized Axios instance
import { HabitCreateDto, HabitDetailsDto, HabitListDto } from '../types';

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
    //THIS ONE IS MESSED UP, POST ISN'T RETURNING ANYTHING, WE MISS DETAILS HERE, BUT THAT FOR LATER
    // Create a new habit
    async createHabit(habitData: HabitCreateDto): Promise<HabitDetailsDto> {
        try {
            const response = await ApiClient.post<HabitDetailsDto>(`${HABITS_BASE_URL}`, habitData);
            return response.data; // Return the created habit's details
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
    async modifyHabit(habitId: string, habitData: HabitCreateDto): Promise<HabitDetailsDto> {
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

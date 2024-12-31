import ApiClient from '../utils/api'; // Centralized Axios instance
import { ProgressListDto, ProgressModifyDto } from '../types/ProgressTypes';
import logError from '../utils/logError';

const PROGRESS_BASE_URL = '/progress';

const ProgressService = {
    // Fetch the progress list
    async getProgress(): Promise<ProgressListDto[]> {
        try {
            const response = await ApiClient.get<ProgressListDto[]>(`${PROGRESS_BASE_URL}`);
            return response.data;
        } catch (error) {
            logError('Fetching progress list', error);
            throw error;
        }
    },

    // Update progress for a specific habit
    async updateProgress(id: string, data: ProgressModifyDto): Promise<void> {
        try {
            await ApiClient.patch(`${PROGRESS_BASE_URL}/${id}`, data);
        } catch (error) {
            logError(`Updating habit progress for ID: ${id}`, error, JSON.stringify(data));
            throw error;
        }
    },
};

export default ProgressService;

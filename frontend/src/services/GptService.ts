import ApiClient from '../utils/api'; // Centralized Axios instance
import logError from '../utils/logError';
import { GptRequestDto, GptResponseDto } from '../types/GptTypes';

const GPT_BASE_URL = '/gpt';

const GptService = {
    // Call GPT endpoint with the user's message
    async chat(message: string): Promise<GptResponseDto> {
        try {
            const requestData: GptRequestDto = { message };
            const response = await ApiClient.post<GptResponseDto>(`${GPT_BASE_URL}/chat`, requestData);
            return response.data;
        } catch (error) {
            logError('GPT Chat request failed', error, JSON.stringify({ message }));
            throw error;
        }
    },
};

export default GptService;

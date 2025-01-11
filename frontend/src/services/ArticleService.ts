import ApiClient from '../utils/api'; // Reusable Axios instance
import {ArticleCreateDto, ArticleDetailsDto, PaginatedArticles} from '../types/ArticleTypes.ts';

const BASE_URL = '/articles';

const ArticleService = {
    // Fetch paginated articles with optional search parameter
    async getArticles(
        page: number,
        size: number,
        sort: string,
        search?: string // Optional search query
    ): Promise<PaginatedArticles> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sort,
            });

            if (search) {
                params.append('search', search); // Add search query if provided
            }

            const response = await ApiClient.get<PaginatedArticles>(`${BASE_URL}?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw error;
        }
    },

    // Fetch detailed article by ID
    async getArticleDetails(id: string): Promise<ArticleDetailsDto> {
        try {
            const response = await ApiClient.get<ArticleDetailsDto>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching article details for ID: ${id}`, error);
            throw error;
        }
    },
    async createArticle(payload: ArticleCreateDto): Promise<void> {
        try {
            await ApiClient.post(BASE_URL, payload); // POST request to create a new article
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    },

    // Delete an article by ID
    async deleteArticle(id: string): Promise<void> {
        try {
            await ApiClient.delete(`${BASE_URL}/${id}`); // DELETE request for the article
        } catch (error) {
            console.error(`Error deleting article with ID ${id}:`, error);
            throw error;
        }
    }
};

export default ArticleService;

// Enum for Article Categories
export enum ArticleCategory {
    MOTIVATION = 'MOTIVATION',
    HEALTH = 'HEALTH',
    PRODUCTIVITY = 'PRODUCTIVITY',
    LIFESTYLE = 'LIFESTYLE',
}

export interface ArticleCreateDto {
    title: string; // Title of the article
    content: string; // Content of the article
    categories: ArticleCategory[]; // Array of categories
}

// DTO for an article in the list
export interface ArticleListDto {
    id: string; // UUID
    title: string; // Title of the article
    categories: ArticleCategory[]; // Array of categories
    createdAt: string; // ISO date string
}

// DTO for detailed article content
export interface ArticleDetailsDto {
    id: string; // UUID
    title: string; // Title of the article
    content: string; // Markdown content of the article
    categories: ArticleCategory[]; // Array of categories
    createdAt: string; // ISO date string
    modifiedAt: string; // ISO date string
}

// Pagination metadata for list response
export interface PaginationMeta {
    pageNumber: number; // Current page number (0-based)
    pageSize: number; // Number of elements per page
    sort: {
        empty: boolean; // Whether sorting is applied
        sorted: boolean; // Whether sorting is enabled
        unsorted: boolean; // Whether sorting is disabled
    };
    offset: number; // Offset from the start of the data
    paged: boolean; // Whether the data is paginated
    unpaged: boolean; // Whether the data is unpaginated
}


// API response for paginated articles
export interface PaginatedArticles {
    content: ArticleListDto[]; // Array of articles
    pageable: PaginationMeta; // Pagination metadata
    totalPages: number; // Total number of pages (root-level)
    totalElements: number; // Total number of elements (root-level)
    last: boolean; // Whether this is the last page
    first: boolean; // Whether this is the first page
    number: number; // Current page number (0-based)
    size: number; // Number of elements per page
    numberOfElements: number; // Number of elements in the current page
    empty: boolean; // Whether the current page is empty
}



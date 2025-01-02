import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Pagination, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import ArticleList from '../components/article/ArticleList';
import ArticleDetailsDialog from '../components/article/ArticleDetailsDialog';
import ArticleService from '../services/ArticleService';
import { ArticleListDto, PaginatedArticles } from '../types/ArticleTypes';

const ArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<ArticleListDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sort, setSort] = useState<string>('createdAt,desc');
    const [search, setSearch] = useState<string>(''); // Current search query
    const [debouncedSearch, setDebouncedSearch] = useState<string>(''); // Debounced search query

    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const pageSize = 5;

    // Debounce logic for search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search); // Set debounced value after delay
        }, 500); // Adjust delay as needed (e.g., 500ms)

        return () => {
            clearTimeout(handler); // Clear timeout if user types again
        };
    }, [search]); // Runs whenever `search` changes

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: PaginatedArticles = await ArticleService.getArticles(page - 1, pageSize, sort, debouncedSearch);
            setArticles(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('Failed to load articles. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [page, sort, debouncedSearch]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSort(event.target.value as string);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1); // Reset to first page when search changes
    };

    const handleArticleClick = (id: string) => {
        setSelectedArticleId(id);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setSelectedArticleId(null);
        setIsDialogOpen(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Articles
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <TextField
                            label="Search by title"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={handleSearchChange}
                            sx={{ flexGrow: 1, marginRight: 2 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sort} onChange={handleSortChange}>
                                <MenuItem value="createdAt,desc">Newest</MenuItem>
                                <MenuItem value="createdAt,asc">Oldest</MenuItem>
                                <MenuItem value="title,asc">Title (A-Z)</MenuItem>
                                <MenuItem value="title,desc">Title (Z-A)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <ArticleList articles={articles} onArticleClick={handleArticleClick} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                    </Box>
                </>
            )}

            <ArticleDetailsDialog open={isDialogOpen} articleId={selectedArticleId} onClose={handleCloseDialog} />
        </Box>
    );
};

export default ArticlesPage;

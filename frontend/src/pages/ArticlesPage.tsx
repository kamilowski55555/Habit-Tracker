import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Grid,
} from '@mui/material';
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
    const [submittedSearch, setSubmittedSearch] = useState<string>(''); // Search query submitted via button/Enter

    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const pageSize = 5;

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: PaginatedArticles = await ArticleService.getArticles(
                page - 1,
                pageSize,
                sort,
                submittedSearch // Use the submitted search query
            );
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
    }, [page, sort, submittedSearch]); // Run fetch on page, sort, or search submit

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSort(event.target.value as string);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearchSubmit = () => {
        setSubmittedSearch(search); // Update the search term
        setPage(1); // Reset to first page when search changes
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(); // Trigger search on Enter key press
        }
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
                    {/* Search and Sort Section */}
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                        <Grid item xs={12} sm={6} md={8}>
                            <TextField
                                label="Search by title"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown} // Trigger search on Enter
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearchSubmit} // Trigger search on button click
                                fullWidth
                            >
                                Search
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sort By</InputLabel>
                                <Select value={sort} onChange={handleSortChange}>
                                    <MenuItem value="createdAt,desc">Newest</MenuItem>
                                    <MenuItem value="createdAt,asc">Oldest</MenuItem>
                                    <MenuItem value="title,asc">Title (A-Z)</MenuItem>
                                    <MenuItem value="title,desc">Title (Z-A)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <ArticleList articles={articles} onArticleClick={handleArticleClick} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            <ArticleDetailsDialog
                open={isDialogOpen}
                articleId={selectedArticleId}
                onClose={handleCloseDialog}
            />
        </Box>
    );
};

export default ArticlesPage;

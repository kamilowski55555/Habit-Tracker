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
import ArticleCreateModal from '../components/article/ArticleCreateModal'; // Import the modal
import ArticleService from '../services/ArticleService';
import { ArticleListDto, PaginatedArticles } from '../types/ArticleTypes';
import { useUser } from '../context/UserContext';

const ArticlesPage: React.FC = () => {
    const { user } = useUser();
    const [articles, setArticles] = useState<ArticleListDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sort, setSort] = useState<string>('createdAt,desc');
    const [search, setSearch] = useState<string>('');
    const [submittedSearch, setSubmittedSearch] = useState<string>('');

    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false); // State for modal

    const pageSize = 5;

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data: PaginatedArticles = await ArticleService.getArticles(
                page - 1,
                pageSize,
                sort,
                submittedSearch
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
    }, [page, sort, submittedSearch]);

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
        setSubmittedSearch(search);
        setPage(1);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
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

    const handleCreateArticle = async (title: string, content: string, categories: string[]) => {
        try {
            await ArticleService.createArticle({ title, content, categories });
            fetchArticles(); // Refresh articles after creation
            alert('Article created successfully!');
        } catch (error) {
            console.error('Error creating article:', error);
            alert('Failed to create article. Please try again.');
        } finally {
            setIsCreateModalOpen(false); // Close the modal
        }
    };

    const handleDeleteArticle = async (id: string) => {
        // if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await ArticleService.deleteArticle(id); // Call the delete service
                fetchArticles(); // Refresh the article list
                alert('Article deleted successfully.');
            } catch (error) {
                console.error('Error deleting article:', error);
                alert('Failed to delete article. Please try again.');
            }
        // }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Articles
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {user?.role === 'ROLE_ADMIN' && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{ marginBottom: 2 }}
                >
                    Add New Article
                </Button>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                        <Grid item xs={12} sm={6} md={8}>
                            <TextField
                                label="Search by title"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearchSubmit}
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

                    <ArticleList
                        articles={articles}
                        onArticleClick={handleArticleClick}
                        onDelete={handleDeleteArticle} // Pass delete callback to ArticleList
                    />

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

            {isCreateModalOpen && (
                <ArticleCreateModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateArticle}
                />
            )}
        </Box>
    );
};

export default ArticlesPage;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ArticleService from '../../services/ArticleService';
import { ArticleDetailsDto } from '../../types/ArticleTypes';

interface ArticleDetailsDialogProps {
    open: boolean; // Whether the dialog is open
    articleId: string | null; // The ID of the article to fetch
    onClose: () => void; // Callback to close the dialog
}

const ArticleDetailsDialog: React.FC<ArticleDetailsDialogProps> = ({ open, articleId, onClose }) => {
    const [article, setArticle] = useState<ArticleDetailsDto | null>(null); // Article details
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch article details when dialog is opened
    useEffect(() => {
        if (open && articleId) {
            const fetchArticleDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await ArticleService.getArticleDetails(articleId);
                    setArticle(data);
                } catch (error) {
                    console.error('Error fetching article details:', error);
                    setError('Failed to load article details. Please try again.');
                } finally {
                    setLoading(false);
                }
            };

            fetchArticleDetails();
        }
    }, [open, articleId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            {loading ? (
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            ) : error ? (
                <DialogContent>
                    <Alert severity="error">{error}</Alert>
                </DialogContent>
            ) : article ? (
                <>
                    <DialogTitle>{article.title}</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Categories: {article.categories.join(', ')}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Created: {new Date(article.createdAt).toLocaleDateString()}
                        </Typography>
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} variant="contained" color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </>
            ) : null}
        </Dialog>
    );
};

export default ArticleDetailsDialog;

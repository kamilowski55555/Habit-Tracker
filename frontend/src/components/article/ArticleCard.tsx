import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ArticleListDto } from '../../types/ArticleTypes';
import { useUser } from '../../context/UserContext';

interface ArticleCardProps {
    article: ArticleListDto; // The article to display
    onClick: (id: string) => void; // Callback for handling clicks
    onDelete: (id: string) => void; // Callback for handling delete
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, onDelete }) => {
    const { user } = useUser(); // Fetch the current user context

    return (
        <Card
            sx={{
                marginBottom: 2,
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 4, // Add a hover effect
                },
                position: 'relative',
            }}
            onClick={() => onClick(article.id)} // Open detailed view on click
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {article.title}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 1 }}>
                    {article.categories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            color="primary"
                            size="small"
                        />
                    ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Created: {new Date(article.createdAt).toLocaleDateString()}
                </Typography>

                {/* Admin-Only Delete Button */}
                {user?.role === 'ROLE_ADMIN' && (
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                        }}
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onClick for the card
                            onDelete(article.id); // Call delete callback
                        }}
                    >
                        <Delete />
                    </IconButton>
                )}
            </CardContent>
        </Card>
    );
};

export default ArticleCard;

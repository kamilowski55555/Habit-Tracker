import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { ArticleListDto } from '../../types/ArticleTypes';

interface ArticleCardProps {
    article: ArticleListDto; // The article to display
    onClick: (id: string) => void; // Callback for handling clicks
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
    return (
        <Card
            sx={{
                marginBottom: 2,
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 4, // Add a hover effect
                },
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
            </CardContent>
        </Card>
    );
};

export default ArticleCard;

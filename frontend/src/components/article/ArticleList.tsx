import React from 'react';
import { Box } from '@mui/material';
import { ArticleListDto } from '../../types/ArticleTypes';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
    articles: ArticleListDto[];
    onArticleClick: (id: string) => void;
    onDelete: (id: string) => void; // Add delete handler
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onArticleClick, onDelete }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {articles.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={onArticleClick}
                    onDelete={onDelete} // Pass delete handler to ArticleCard
                />
            ))}
        </Box>
    );
};

export default ArticleList;

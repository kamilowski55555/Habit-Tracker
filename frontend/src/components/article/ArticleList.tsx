import React from 'react';
import { Box } from '@mui/material';
import { ArticleListDto } from '../../types/ArticleTypes';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
    articles: ArticleListDto[];
    onArticleClick: (id: string) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onArticleClick }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} onClick={onArticleClick} />
            ))}
        </Box>
    );
};

export default ArticleList;

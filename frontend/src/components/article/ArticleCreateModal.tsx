import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from '@mui/material';
import { ArticleCategory } from '../../types/ArticleTypes';

interface ArticleCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (title: string, content: string, categories: string[]) => void;
}

const ArticleCreateModal: React.FC<ArticleCreateModalProps> = ({ open, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleSubmit = () => {
        if (title && content && selectedCategories.length > 0) {
            onSubmit(title, content, selectedCategories);
        } else {
            alert('Please fill in all fields and select at least one category.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Article</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                    margin="dense"
                    multiline
                    rows={4}
                />
                <FormGroup>
                    {Object.values(ArticleCategory).map((category) => (
                        <FormControlLabel
                            key={category}
                            control={
                                <Checkbox
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                            }
                            label={category}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ArticleCreateModal;

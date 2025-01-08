import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Grid,
} from '@mui/material';
import DaySelector, { mapToBackendDays } from './DaySelector';
import { HabitCreateDto } from '../../types';

const habitTemplates = [
    {
        name: 'Drink Water',
        type: 'GOOD',
        targetValue: 8,
        habitDays: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
        currencyAmount: 10,
        icon: '💧',
    },
    {
        name: 'Avoid Junk Food',
        type: 'BAD',
        targetValue: 5,
        habitDays: ['MO', 'TU', 'WE', 'TH', 'FR'],
        currencyAmount: 20,
        icon: '🍔',
    },
];

interface CreateHabitModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (habitData: HabitCreateDto) => void;
}

const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<HabitCreateDto>({
        name: '',
        type: 'GOOD',
        targetValue: 0,
        habitDays: [],
        currencyAmount: 0,
        icon: '',
    });

    // Handle input changes for text and number fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'targetValue' || name === 'currencyAmount' ? +value : value,
        });
    };

    // Prefill form data when a template is selected
    const handleTemplateSelect = (template: HabitCreateDto) => {
        setFormData(template);
    };

    const handleSubmit = () => {
        const backendData = {
            ...formData,
            habitDays: mapToBackendDays(formData.habitDays),
        };
        onSubmit(backendData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'GOOD',
            targetValue: 0,
            habitDays: [],
            currencyAmount: 0,
            icon: '',
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create a New Habit</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Template Selection */}
                <Box>
                    <Typography variant="h6">Choose a Template</Typography>
                    <Grid container spacing={2}>
                        {habitTemplates.map((template, index) => (
                            <Grid item xs={6} key={index}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    {template.name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Form Fields */}
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    select
                    fullWidth
                    margin="normal"
                    required
                >
                    <MenuItem value="GOOD">Good Habit</MenuItem>
                    <MenuItem value="BAD">Bad Habit</MenuItem>
                </TextField>
                <TextField
                    label="Target Value"
                    name="targetValue"
                    value={formData.targetValue || ''}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Reward (Currency Amount)"
                    name="currencyAmount"
                    value={formData.currencyAmount || ''}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <DaySelector
                    selectedDays={formData.habitDays}
                    onChange={(days) => setFormData({ ...formData, habitDays: days })}
                />
                <TextField
                    label="Icon (Emoji)"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Create Habit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateHabitModal;

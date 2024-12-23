import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import DaySelector, { mapToBackendDays, mapToFrontendDays } from './DaySelector'; // Import DaySelector and mapping functions
import { HabitListDto, HabitCreateDto } from '../../types';

interface EditHabitModalProps {
    open: boolean;
    habit: HabitListDto; // The habit to edit
    onClose: () => void;
    onSubmit: (habitData: HabitCreateDto) => void; // Callback for saving changes
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ open, habit, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<HabitCreateDto>({
        name: '',
        type: 'GOOD',
        targetValue: 0,
        habitDays: [],
        currencyAmount: 0,
        icon: '',
    });

    // Populate the form with the habit data when the modal opens
    useEffect(() => {
        if (habit) {
            setFormData({
                name: habit.name,
                type: habit.type,
                targetValue: habit.targetValue,
                habitDays: mapToFrontendDays(habit.habitDays), // Convert backend days to frontend format
                currencyAmount: habit.currencyAmount,
                icon: habit.icon,
            });
        }
    }, [habit]);

    // Handle input changes for text and numeric fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'targetValue' || name === 'currencyAmount' ? +value : value,
        });
    };

    // Handle submission of the form
    const handleSubmit = () => {
        const backendData = {
            ...formData,
            habitDays: mapToBackendDays(formData.habitDays), // Convert frontend days to backend format
        };
        onSubmit(backendData); // Pass processed data to parent
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogContent>
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
                    selectedDays={formData.habitDays} // Pass current habitDays in frontend format
                    onChange={(days) => setFormData({ ...formData, habitDays: days })} // Update state
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
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditHabitModal;

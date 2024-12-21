import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { HabitCreateDto } from '../../types';

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
        habitDays: [], // Default as an empty array
        currencyAmount: 0,
        icon: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'targetValue' || name === 'currencyAmount' ? +value : value,
        });
    };

    const handleSubmit = () => {
        onSubmit(formData); // Send form data to parent
        setFormData({
            name: '',
            type: 'GOOD',
            targetValue: 0,
            habitDays: [],
            currencyAmount: 0,
            icon: '',
        }); // Reset form for next use
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a New Habit</DialogTitle>
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
                    value={formData.targetValue}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Reward (Currency Amount)"
                    name="currencyAmount"
                    value={formData.currencyAmount}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Habit Days (comma-separated)"
                    name="habitDays"
                    value={formData.habitDays.join(', ')}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            habitDays: e.target.value.split(',').map((day) => day.trim()),
                        })
                    }
                    fullWidth
                    margin="normal"
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

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { HabitListDto, HabitCreateDto } from '../../types';

interface EditHabitModalProps {
    open: boolean;
    habit: HabitListDto;
    onClose: () => void;
    onSubmit: (habitData: HabitCreateDto) => void;
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

    useEffect(() => {
        if (habit) {
            setFormData({
                name: habit.name,
                type: habit.type,
                targetValue: habit.targetValue,
                habitDays: habit.habitDays,
                currencyAmount: habit.currencyAmount,
                icon: habit.icon,
            });
        }
    }, [habit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'targetValue' || name === 'currencyAmount' ? +value : value,
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
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
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditHabitModal;

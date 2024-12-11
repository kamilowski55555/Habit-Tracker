import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
} from '@mui/material';
import axios from 'axios';

const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const HabitFormModal = ({ isOpen, onClose, habit, onHabitUpdated }) => {
    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState('GOOD'); // Default to GOOD
    const [targetValue, setTargetValue] = useState(1);
    const [habitDays, setHabitDays] = useState([]);
    const [currencyAmount, setCurrencyAmount] = useState('');
    const [icon, setIcon] = useState('');

    // Populate form fields if editing a habit
    useEffect(() => {
        if (habit) {
            setName(habit.name);
            setType(habit.type);
            setTargetValue(habit.targetValue);
            setHabitDays(habit.habitDays || []);
            setCurrencyAmount(habit.currencyAmount);
            setIcon(habit.icon || '');
        } else {
            // Reset fields for adding a new habit
            setName('');
            setType('GOOD');
            setTargetValue(1);
            setHabitDays([]);
            setCurrencyAmount('');
            setIcon('');
        }
    }, [habit]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const habitData = {
                name,
                type,
                targetValue,
                habitDays,
                currencyAmount: parseInt(currencyAmount, 10),
                icon,
            };

            let response;
            if (habit) {
                // Editing a habit
                response = await axios.patch(`/api/habits/${habit.id}`, habitData);
            } else {
                // Adding a new habit
                response = await axios.post('/api/habits', habitData);
            }

            onHabitUpdated(response.data); // Notify parent of the new/updated habit
        } catch (error) {
            console.error('Failed to save habit', error);
        }
    };

    // Handle checkbox toggling for habit days
    const toggleDay = (day) => {
        setHabitDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>{habit ? 'Edit Habit' : 'Add Habit'}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select value={type} onChange={(e) => setType(e.target.value)}>
                            <MenuItem value="GOOD">Good Habit</MenuItem>
                            <MenuItem value="BAD">Bad Habit</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Target Value"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={targetValue}
                        onChange={(e) => setTargetValue(parseInt(e.target.value, 10))}
                        required
                    />
                    <TextField
                        label="Currency Amount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={currencyAmount}
                        onChange={(e) => setCurrencyAmount(e.target.value)}
                        required
                    />
                    <TextField
                        label="Icon (Emoji)"
                        fullWidth
                        margin="normal"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                    />
                    <FormGroup>
                        {daysOfWeek.map((day) => (
                            <FormControlLabel
                                key={day}
                                control={
                                    <Checkbox
                                        checked={habitDays.includes(day)}
                                        onChange={() => toggleDay(day)}
                                    />
                                }
                                label={day}
                            />
                        ))}
                    </FormGroup>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {habit ? 'Save Changes' : 'Add Habit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HabitFormModal;

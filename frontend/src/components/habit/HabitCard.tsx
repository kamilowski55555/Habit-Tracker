import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { HabitListDto } from '../../types';
import { mapToFrontendDays } from './DaySelector'; // Import mapping function

interface HabitCardProps {
    habit: HabitListDto;
    onEdit: () => void;
    onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">{habit.name}</Typography>
                <Typography color="text.secondary">
                    Type: {habit.type === 'GOOD' ? 'Good Habit' : 'Bad Habit'}
                </Typography>
                <Typography color="text.secondary">
                    Target: {habit.targetValue}
                </Typography>
                <Typography color="text.secondary">
                    Reward: {habit.currencyAmount > 0 ? `+${habit.currencyAmount}` : habit.currencyAmount}
                </Typography>
                <Typography color="text.secondary">
                    Days: {mapToFrontendDays(habit.habitDays).join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={onEdit}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={onDelete}>
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default HabitCard;

import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { HabitListDto } from '../../types';
import { mapToFrontendDays } from './DaySelector';

interface HabitCardProps {
    habit: HabitListDto;
    onEdit: () => void;
    onDelete: () => void;
    onStats: () => void; // New handler for viewing stats
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete, onStats }) => {
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
                    <Button variant="contained" color="info" onClick={onStats}>
                        Stats
                    </Button>
                    <Button variant="contained" color="warning" onClick={onEdit}>
                        Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Delete
                    </Button>

                </Box>
            </CardContent>
        </Card>
    );
};

export default HabitCard;

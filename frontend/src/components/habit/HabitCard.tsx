import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { HabitListDto } from '../../types';

interface HabitCardProps {
    habit: HabitListDto;
    onEdit: () => void;
    onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                {/* Habit name */}
                <Typography variant="h6">{habit.name}</Typography>

                {/* Habit type */}
                <Typography color="text.secondary">
                    Type: {habit.type === 'GOOD' ? 'Good Habit' : 'Bad Habit'}
                </Typography>

                {/* Habit target and reward */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                    <Typography>Target: {habit.targetValue}</Typography>
                    <Typography>
                        Reward: {habit.currencyAmount > 0 ? `+${habit.currencyAmount}` : habit.currencyAmount}
                    </Typography>
                </Box>

                {/* Edit and Delete buttons */}
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

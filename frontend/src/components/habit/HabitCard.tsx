import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { HabitListDto } from '../../types';

interface HabitCardProps {
    habit: HabitListDto;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">{habit.name}</Typography>
                <Typography color="text.secondary">
                    Type: {habit.type === 'GOOD' ? 'Good Habit' : 'Bad Habit'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                    <Typography>Target: {habit.targetValue}</Typography>
                    <Typography>
                        Reward: {habit.currencyAmount > 0 ? `+${habit.currencyAmount}` : habit.currencyAmount}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default HabitCard;

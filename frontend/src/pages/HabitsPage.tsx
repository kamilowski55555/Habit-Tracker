import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import HabitList from '../components/habit/HabitList';
import HabitService from '../services/HabitService'; // Use our service
import { HabitListDto } from '../types';

const HabitsPage = () => {
    const [habits, setHabits] = useState<HabitListDto[]>([]); // Store habit list
    const [loading, setLoading] = useState(true); // Loading indicator

    // Fetch habits from the backend
    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const data = await HabitService.getHabits();
                setHabits(data); // Update the state with habits
            } catch (error) {
                console.error('Failed to fetch habits:', error);
            } finally {
                setLoading(false); // Hide loading spinner
            }
        };

        fetchHabits();
    }, []); // Empty dependency means it runs only once on mount

    return (
        <Box sx={{ padding: 3 }}>
            {/* Header */}
            <Typography variant="h4" gutterBottom>
                Your Habits
            </Typography>

            {/* Loading Spinner */}
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            ) : (
                // Habit List Component
                <HabitList habits={habits} />
            )}
        </Box>
    );
};

export default HabitsPage;

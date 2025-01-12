import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert, Divider } from '@mui/material';
import ProgressService from '../services/ProgressService';
import { ProgressListDto } from '../types/ProgressTypes';
import ProgressList from '../components/progress/ProgressList';
import { useUser } from '../context/UserContext';

const HomePage: React.FC = () => {
    const [progressData, setProgressData] = useState<ProgressListDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { refreshUser } = useUser();

    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const fetchProgress = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProgressService.getProgress();
            setProgressData(data);
        } catch (error) {
            console.error('Error fetching progress data:', error);
            setError('Failed to load progress data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (id: string, updatedValue: number) => {
        try {
            await ProgressService.updateProgress(id, { currentValue: updatedValue });
            setProgressData((prevData) =>
                prevData.map((progress) =>
                    progress.id === id
                        ? { ...progress, currentValue: updatedValue }
                        : progress
                )
            );
            await refreshUser();
        } catch (error) {
            console.error(`Error updating progress for habit ID: ${id}`, error);
            setError('Failed to update progress. Please try again.');
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const goodHabits = progressData.filter((habit) => habit.type === 'GOOD');
    const badHabits = progressData.filter((habit) => habit.type === 'BAD');

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {dayName}, {formattedDate}
            </Typography>
            <Typography variant="h4" gutterBottom>
                Your Progress
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom sx={{ marginTop: 2 }}>
                        Keep Progressing These!
                    </Typography>
                    <ProgressList progressData={goodHabits} onUpdate={updateProgress} />

                    <Divider sx={{ marginY: 4 }} />

                    <Typography variant="h5" gutterBottom>
                        Avoid Progressing These!
                    </Typography>
                    <ProgressList progressData={badHabits} onUpdate={updateProgress} />
                </>
            )}
        </Box>
    );
};

export default HomePage;

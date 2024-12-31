import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import ProgressList from '../components/progress/ProgressList';
import ProgressService from '../services/ProgressService';
import { ProgressListDto } from '../types/ProgressTypes';
import { useUser } from '../context/UserContext'; // Import useUser hook

const HomePage: React.FC = () => {
    const [progressData, setProgressData] = useState<ProgressListDto[]>([]); // Store progress data
    const [loading, setLoading] = useState<boolean>(true); // Show loading spinner
    const [error, setError] = useState<string | null>(null); // Handle errors
    const { refreshUser } = useUser(); // Access the refreshUser function from context

    // Fetch progress data from the backend
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

    // Update progress for a specific habit
    const updateProgress = async (id: string, updatedValue: number) => {
        try {
            await ProgressService.updateProgress(id, { currentValue: updatedValue });
            // Update local state to reflect the change
            setProgressData((prevData) =>
                prevData.map((progress) =>
                    progress.id === id
                        ? { ...progress, currentValue: updatedValue }
                        : progress
                )
            );
            await refreshUser()
        } catch (error) {
            console.error(`Error updating progress for habit ID: ${id}`, error);
            setError('Failed to update progress. Please try again.');
        }
    };

    // Fetch progress data on component mount
    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Habit Progress
            </Typography>

            {/* Error Message */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Loading Spinner */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <ProgressList progressData={progressData} onUpdate={updateProgress} />
            )}
        </Box>
    );
};

export default HomePage;

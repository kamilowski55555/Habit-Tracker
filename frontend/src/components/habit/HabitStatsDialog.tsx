import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    LinearProgress,
} from '@mui/material';
import HabitService from '../../services/HabitService';
import { HabitStatsDto } from '../../types';

interface HabitStatsDialogProps {
    open: boolean;
    habitId: string | null; // ID of the selected habit
    onClose: () => void; // Callback to close the dialog
}

const HabitStatsDialog: React.FC<HabitStatsDialogProps> = ({ open, habitId, onClose }) => {
    const [stats, setStats] = useState<HabitStatsDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && habitId) {
            fetchHabitStats();
        }
    }, [open, habitId]);

    const fetchHabitStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await HabitService.getHabitStats(habitId!);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch habit stats:', error);
            setError('Failed to load habit statistics. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const calculateCompletionPercentage = () => {
        if (!stats) return 0;
        return Math.round(
            (stats.completedDaysThisMonth / stats.projectedDaysThisMonth) * 100
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Habit Statistics</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Typography align="center">Loading...</Typography>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : stats ? (
                    <Box>
                        <Typography variant="h6">{stats.name}</Typography>
                        <Typography color="text.secondary">
                            Type: {stats.type === 'GOOD' ? 'Good Habit' : 'Bad Habit'}
                        </Typography>
                        <Typography color="text.secondary">
                            Created On: {new Date(stats.creationDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                            Total Completions: {stats.totalCompletions}
                        </Typography>
                        <Typography variant="subtitle1">
                            Completions This Month: {stats.completionsThisMonth}
                        </Typography>
                        <Typography variant="subtitle1">
                            Current Streak: {stats.currentStreak} days
                        </Typography>
                        <Typography variant="subtitle1">
                            Longest Streak: {stats.longestStreak} days
                        </Typography>

                        {/* Linear Progress Bar */}
                        <Box sx={{ marginTop: 3 }}>
                            <Typography variant="subtitle1">
                                Monthly Quota: {stats.completedDaysThisMonth}/{stats.projectedDaysThisMonth} (
                                {calculateCompletionPercentage()}%)
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={calculateCompletionPercentage()}
                                sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Typography>No statistics available.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HabitStatsDialog;

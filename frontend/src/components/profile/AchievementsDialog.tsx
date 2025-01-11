import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { UserDetailsDto } from '../../types';

interface AchievementsDialogProps {
    open: boolean;
    onClose: () => void;
    user: UserDetailsDto | null; // Pass user data to determine achievements
}

const AchievementsDialog: React.FC<AchievementsDialogProps> = ({ open, onClose, user }) => {
    const achievements = [
        {
            id: 'firstHabit',
            title: 'First Habit Created',
            date: user?.achievementFirstHabitCreatedDate,
        },
        {
            id: 'sevenDayStreak',
            title: 'Seven-Day Streak',
            date: user?.achievementSevenDayStreakDate,
        },
        {
            id: 'complete50Habits',
            title: 'Complete 50 Habits Successfully',
            date: user?.achievementCompleteHabit50TimesSuccessfullyDate,
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Achievements</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {achievements.map((achievement) => (
                        <Card key={achievement.id} sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardContent>
                                <Typography variant="h6">{achievement.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {achievement.date
                                        ? `Achieved on: ${new Date(achievement.date).toLocaleDateString()}`
                                        : 'Not achieved yet'}
                                </Typography>
                            </CardContent>
                            {achievement.date ? (
                                <CheckCircleIcon sx={{ color: 'green', fontSize: 40, marginLeft: 'auto', marginRight: 2 }} />
                            ) : (
                                <CancelIcon sx={{ color: 'gray', fontSize: 40, marginLeft: 'auto', marginRight: 2 }} />
                            )}
                        </Card>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AchievementsDialog;

import React, { useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Button } from '@mui/material';
import { ProgressListDto } from '../../types/ProgressTypes';
import UpdateProgressDialog from './UpdateProgressDialog';

interface ProgressCardProps {
    progress: ProgressListDto; // Habit progress details
    onUpdate: (id: string, updatedValue: number) => void; // Callback to update progress
}

const ProgressCard: React.FC<ProgressCardProps> = ({ progress, onUpdate }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleDialogSave = (updatedValue: number) => {
        onUpdate(progress.id, updatedValue); // Call parent update function
        setIsDialogOpen(false); // Close the dialog
    };

    // Define colors based on habit type
    const cardColor = progress.type === 'GOOD' ? '#e8f5e9' : '#ffebee'; // Light green or light red
    const progressColor = progress.type === 'GOOD' ? '#4caf50' : '#f44336'; // Green or red

    return (
        <Card
            sx={{
                marginBottom: 2,
                height: '100%',
                width: 300, // Fixed width for cards
                maxWidth: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 2,
                textAlign: 'center',
                margin: '0 auto',
                backgroundColor: cardColor, // Dynamic background color
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: progress.type === 'GOOD' ? '#2e7d32' : '#c62828', // Dark green or dark red
                    }}
                >
                    {progress.name}
                </Typography>
                <Typography color="text.secondary">
                    Type: {progress.type === 'GOOD' ? 'Good Habit' : 'Bad Habit'}
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                    <Typography color="text.secondary">
                        Progress: {progress.currentValue}/{progress.targetValue}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(progress.currentValue / progress.targetValue) * 100}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            marginTop: 1,
                            backgroundColor: '#e0e0e0', // Neutral background for progress bar
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: progressColor, // Dynamic bar color
                            },
                        }}
                    />
                </Box>
            </CardContent>
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setIsDialogOpen(true)}
                >
                    Update
                </Button>
            </Box>

            {/* Dialog for updating progress */}
            <UpdateProgressDialog
                open={isDialogOpen}
                progress={progress}
                onClose={handleDialogClose}
                onSave={handleDialogSave}
            />
        </Card>
    );
};

export default ProgressCard;

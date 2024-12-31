import React from 'react';
import Grid2 from '@mui/material/Grid2';
import { ProgressListDto } from '../../types/ProgressTypes';
import ProgressCard from './ProgressCard';

interface ProgressListProps {
    progressData: ProgressListDto[]; // List of habit progress data
    onUpdate: (id: string, updatedValue: number) => void; // Callback to update progress
}

const ProgressList: React.FC<ProgressListProps> = ({ progressData, onUpdate }) => {
    return (
        <Grid2
            container
            spacing={3}
            justifyContent="center"
            alignItems="flex-start"
        >
            {progressData.map((progress) => (
                <Grid2
                    xs={12}
                    sm={6}
                    md={4}
                    key={progress.id}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <ProgressCard progress={progress} onUpdate={onUpdate} />
                </Grid2>
            ))}
        </Grid2>
    );
};

export default ProgressList;

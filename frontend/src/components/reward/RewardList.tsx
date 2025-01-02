import React from 'react';
import Grid2 from '@mui/material/Grid2';
import { RewardListDto } from '../../types/RewardTypes';
import RewardCard from './RewardCard';

interface RewardListProps {
    rewards: RewardListDto[]; // List of rewards to display
    onBuy: (id: string) => void; // Callback for buying a reward
    onEdit: (reward: RewardListDto) => void; // Callback for editing a reward
    onDelete: (id: string) => void; // Callback for deleting a reward
}

const RewardList: React.FC<RewardListProps> = ({ rewards, onBuy, onEdit, onDelete }) => {
    return (
        <Grid2 container spacing={3} justifyContent="center">
            {rewards.map((reward) => (
                <Grid2 key={reward.id} xs={12} sm={6} md={4}>
                    <RewardCard
                        reward={reward}
                        onBuy={onBuy}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Grid2>
            ))}
        </Grid2>
    );
};

export default RewardList;

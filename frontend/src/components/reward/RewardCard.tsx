import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { RewardListDto } from '../../types/RewardTypes';

interface RewardCardProps {
    reward: RewardListDto; // Reward details
    onBuy: (id: string) => void; // Callback for buying a reward
    onEdit: (reward: RewardListDto) => void; // Callback for editing a reward
    onDelete: (id: string) => void; // Callback for deleting a reward
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, onBuy, onEdit, onDelete }) => {
    return (
        <Card sx={{ marginBottom: 2, padding: 2 }}>
            <CardContent>
                {/* Reward Name */}
                <Typography variant="h6" gutterBottom>
                    {reward.name}
                </Typography>

                {/* Reward Cost */}
                <Typography color="text.secondary" sx={{ marginBottom: 2 }}>
                    Cost: {reward.cost} coins
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Button variant="contained" color="primary" onClick={() => onBuy(reward.id)}>
                        Buy
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => onEdit(reward)}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => onDelete(reward.id)}>
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RewardCard;

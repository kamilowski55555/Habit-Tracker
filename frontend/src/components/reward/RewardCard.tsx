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
        <Card sx={{ marginBottom: 1, padding: 2, textAlign: 'center' }}>
            <CardContent>
                {/* Emoji */}
                <Typography
                    sx={{
                        fontSize: '3rem',
                        marginBottom: 1,
                        lineHeight: 1,
                    }}
                >
                    {reward.emoji}
                </Typography>

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
                    <Button variant="contained" color="warning" onClick={() => onEdit(reward)}>
                        Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => onDelete(reward.id)}>
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RewardCard;

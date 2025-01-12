import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import RewardList from '../components/reward/RewardList';
import RewardService from '../services/RewardService';
import { RewardListDto } from '../types/RewardTypes';
import { useUser } from '../context/UserContext';
import CreateRewardModal from '../components/reward/CreateRewardModal';
import EditRewardModal from '../components/reward/EditRewardModal';
import BuyConfirmationDialog from '../components/reward/BuyConfirmationDialog';
import GptFloatingButton from '../components/layout/GptFloatingButton'; // Import the floating button

const RewardsPage: React.FC = () => {
    const [rewards, setRewards] = useState<RewardListDto[]>([]); // List of rewards
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [selectedReward, setSelectedReward] = useState<RewardListDto | null>(null); // Selected reward for edit/buy
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false); // Create modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // Edit modal state
    const [isBuyDialogOpen, setIsBuyDialogOpen] = useState<boolean>(false); // Buy dialog state
    const { refreshUser } = useUser(); // Access user context to refresh balance

    // Fetch rewards from the backend
    const fetchRewards = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await RewardService.getRewards();
            setRewards(data);
        } catch (error) {
            console.error('Error fetching rewards:', error);
            setError('Failed to load rewards. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handle reward creation
    const handleCreateReward = async (newReward: { name: string; cost: number; emoji: string }) => {
        try {
            await RewardService.createReward(newReward);
            fetchRewards(); // Refresh the rewards list
        } catch (error) {
            console.error('Error creating reward:', error);
            setError('Failed to create reward. Please try again.');
        }
    };

    // Handle reward update
    const handleEditReward = async (updatedReward: { id: string; name: string; cost: number; emoji: string }) => {
        try {
            await RewardService.updateReward(updatedReward.id, {
                name: updatedReward.name,
                cost: updatedReward.cost,
                emoji: updatedReward.emoji,
            });
            fetchRewards(); // Refresh the rewards list
        } catch (error) {
            console.error('Error updating reward:', error);
            setError('Failed to update reward. Please try again.');
        }
    };

    // Handle reward deletion
    const handleDeleteReward = async (id: string) => {
        try {
            await RewardService.deleteReward(id);
            fetchRewards(); // Refresh the rewards list
        } catch (error) {
            console.error('Error deleting reward:', error);
            setError('Failed to delete reward. Please try again.');
        }
    };

    // Handle reward redemption (buy)
    const handleBuyReward = async (id: string) => {
        try {
            const response = await RewardService.redeemReward(id);
            if (response.success) {
                fetchRewards(); // Refresh the rewards list
            } else {
                setError(response.message);
            }
            await refreshUser();
        } catch (error) {
            console.error('Error redeeming reward:', error);
            setError('Failed to redeem reward. Please try again.');
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Rewards Shop
            </Typography>

            {/* Add New Reward Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreateModalOpen(true)}
                sx={{ marginBottom: 2 }}
            >
                Add New Reward
            </Button>

            {/* Error Alert */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Loading Indicator */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Reward List */}
                    <RewardList
                        rewards={rewards}
                        onBuy={(id) => {
                            setSelectedReward(rewards.find((r) => r.id === id) || null);
                            setIsBuyDialogOpen(true);
                        }}
                        onEdit={(reward) => {
                            setSelectedReward(reward);
                            setIsEditModalOpen(true);
                        }}
                        onDelete={handleDeleteReward}
                    />
                </>
            )}

            {/* Modals and Dialogs */}
            <CreateRewardModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateReward}
            />
            <EditRewardModal
                open={isEditModalOpen}
                reward={selectedReward}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditReward}
            />
            <BuyConfirmationDialog
                open={isBuyDialogOpen}
                reward={selectedReward}
                onClose={() => setIsBuyDialogOpen(false)}
                onConfirm={() => {
                    if (selectedReward) {
                        handleBuyReward(selectedReward.id);
                        setIsBuyDialogOpen(false);
                    }
                }}
            />

            {/* Floating GPT Assistant Button */}
            <GptFloatingButton />
        </Box>
    );
};

export default RewardsPage;

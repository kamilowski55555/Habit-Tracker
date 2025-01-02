import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from '@mui/material';
import { RewardListDto } from '../../types/RewardTypes';

interface EditRewardModalProps {
    open: boolean; // Controls whether the modal is open or closed
    reward: RewardListDto | null; // The reward to edit (null if no reward is selected)
    onClose: () => void; // Callback to close the modal
    onSubmit: (updatedReward: { id: string; name: string; cost: number }) => void; // Callback to submit the updated reward data
}

const EditRewardModal: React.FC<EditRewardModalProps> = ({ open, reward, onClose, onSubmit }) => {
    const [name, setName] = useState<string>(''); // Reward name
    const [cost, setCost] = useState<number>(0); // Reward cost
    const [error, setError] = useState<string | null>(null); // Form validation error

    // Populate the fields with the selected reward's data when it changes
    useEffect(() => {
        if (reward) {
            setName(reward.name);
            setCost(reward.cost);
        }
    }, [reward]);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Reward name cannot be empty.');
            return;
        }
        if (cost <= 0) {
            setError('Cost must be greater than 0.');
            return;
        }
        if (reward) {
            // Submit the updated reward data
            onSubmit({ id: reward.id, name, cost });
            // Reset state and close the modal
            setName('');
            setCost(0);
            setError(null);
            onClose();
        }
    };

    const handleClose = () => {
        // Reset state and close the modal
        setName('');
        setCost(0);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Reward</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Reward Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Reward Cost"
                        value={cost}
                        onChange={(e) => setCost(Number(e.target.value))}
                        type="number"
                        fullWidth
                        required
                    />
                    {error && (
                        <Box sx={{ color: 'red', fontSize: '0.875rem', marginTop: 1 }}>
                            {error}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRewardModal;

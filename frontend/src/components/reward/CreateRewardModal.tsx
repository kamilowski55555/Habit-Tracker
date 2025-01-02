import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from '@mui/material';

interface CreateRewardModalProps {
    open: boolean; // Controls whether the modal is open or closed
    onClose: () => void; // Callback to close the modal
    onSubmit: (rewardData: { name: string; cost: number }) => void; // Callback to submit the reward data
}

const CreateRewardModal: React.FC<CreateRewardModalProps> = ({ open, onClose, onSubmit }) => {
    const [name, setName] = useState<string>(''); // Reward name
    const [cost, setCost] = useState<number>(0); // Reward cost
    const [error, setError] = useState<string | null>(null); // Form validation error

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Reward name cannot be empty.');
            return;
        }
        if (cost <= 0) {
            setError('Cost must be greater than 0.');
            return;
        }
        // Submit the reward data
        onSubmit({ name, cost });
        // Reset state and close the modal
        setName('');
        setCost(0);
        setError(null);
        onClose();
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
            <DialogTitle>Create New Reward</DialogTitle>
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
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRewardModal;

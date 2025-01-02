import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { RewardListDto } from '../../types/RewardTypes';

interface BuyConfirmationDialogProps {
    open: boolean; // Controls whether the dialog is open or closed
    reward: RewardListDto | null; // The reward being purchased
    onClose: () => void; // Callback to close the dialog
    onConfirm: () => void; // Callback to confirm the purchase
}

const BuyConfirmationDialog: React.FC<BuyConfirmationDialogProps> = ({
                                                                         open,
                                                                         reward,
                                                                         onClose,
                                                                         onConfirm,
                                                                     }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogContent>
                {reward ? (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            Are you sure you want to redeem <strong>{reward.name}</strong> for{' '}
                            <strong>{reward.cost} coins</strong>?
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No reward selected.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm(); // Call confirm action
                    }}
                    variant="contained"
                    color="primary"
                    disabled={!reward} // Disable if no reward is selected
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BuyConfirmationDialog;

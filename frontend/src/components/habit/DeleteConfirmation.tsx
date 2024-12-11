import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Are you sure you want to delete this habit?</DialogTitle>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" onClick={onConfirm}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmation;

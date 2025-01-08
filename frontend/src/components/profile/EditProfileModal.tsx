import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { UserUpdateDto } from '../../types/UserTypes';
import UserService from '../../services/UserService';
import { useUser } from '../../context/UserContext';

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, userId }) => {
    const { refreshUser } = useUser(); // Refresh the user context
    const [formData, setFormData] = useState<UserUpdateDto>({
        firstName: '',
        lastName: '',
        goal: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await UserService.updateUser(userId, formData);
            await refreshUser(); // Refresh the user context after update
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to update user details:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;

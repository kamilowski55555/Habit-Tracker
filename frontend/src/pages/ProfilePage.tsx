import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import NotificationSettings from '../components/profile/NotificationSettings';
import EditProfileModal from '../components/profile/EditProfileModal';
import AchievementsDialog from '../components/profile/AchievementsDialog'; // Import the new AchievementsDialog
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const { user } = useUser();
    const { logout } = useAuth();
    const [editOpen, setEditOpen] = useState(false);
    const [achievementsOpen, setAchievementsOpen] = useState(false); // State for achievements dialog

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>

            {/* Display User Details */}
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6">Welcome, {user?.firstName || 'User'}!</Typography>
                <Typography>
                    <strong>Name:</strong> {user?.firstName} {user?.lastName}
                </Typography>
                <Typography>
                    <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography>
                    <strong>Goal:</strong> {user?.goal || 'No goal set'}
                </Typography>
                <Typography>
                    <strong>Balance:</strong> {user?.currencyBalance} coins
                </Typography>
                <Typography>
                    <strong>Account Created:</strong>{' '}
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Button variant="contained" onClick={() => setEditOpen(true)}>
                    Edit Profile
                </Button>
            </Box>

            {/* Achievements Button */}
            <Box sx={{ marginBottom: 3 }}>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => setAchievementsOpen(true)} // Open AchievementsDialog
                >
                    View Achievements
                </Button>
            </Box>

            {/* Logout Button */}
            <Box sx={{ marginBottom: 3 }}>
                <Button variant="contained" color="error" onClick={logout}>
                    Logout
                </Button>
            </Box>

            {/* Notification Settings Section */}
            <Box sx={{ marginTop: 3 }}>
                <NotificationSettings userId={user?.id || ''} />
            </Box>

            {/* Dialog Components */}
            <EditProfileModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                userId={user?.id || ''}
            />
            <AchievementsDialog
                open={achievementsOpen}
                onClose={() => setAchievementsOpen(false)}
                user={user} // Pass user data to the achievements dialog
            />
        </Box>
    );
};

export default ProfilePage;

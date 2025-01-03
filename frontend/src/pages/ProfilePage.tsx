import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationSettings from '../components/profile/NotificationSettings';
import { useUser } from '../context/UserContext';

const ProfilePage: React.FC = () => {
    const { user } = useUser();

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Typography variant="h6">Welcome, {user?.firstName || 'User'}!</Typography>
            <Typography>Email: {user?.email}</Typography>
            <Typography>Balance: {user?.currencyBalance} coins</Typography>

            {/* Notification Settings Section */}
            <Box sx={{ marginTop: 3 }}>
                <NotificationSettings userId={user?.id || ''} />
            </Box>
        </Box>
    );
};

export default ProfilePage;

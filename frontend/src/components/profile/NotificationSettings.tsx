import React, { useEffect, useState } from 'react';
import { Box, Typography, Switch, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from '../../context/UserContext';
import UserService from '../../services/UserService';

interface NotificationSettingsProps {
    userId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ userId }) => {
    const { refreshUser } = useUser(); // Refresh user context
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationTimes, setNotificationTimes] = useState<string[]>([]);
    const [newTime, setNewTime] = useState<string>(''); // To hold the new time to add

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetails = await UserService.getUserDetails(userId);
                setNotificationsEnabled(userDetails.notificationsEnabled ?? false);
                setNotificationTimes(userDetails.notificationTimes || []);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };
        fetchUserDetails();
    }, [userId]);


    const handleToggleNotifications = async () => {
        try {
            await UserService.toggleNotifications(userId, { enabled: !notificationsEnabled });
            setNotificationsEnabled(!notificationsEnabled);
            refreshUser();
        } catch (error) {
            console.error('Failed to toggle notifications:', error);
        }
    };

    const handleAddNotificationTime = async () => {
        if (!newTime) return;
        try {
            await UserService.addNotificationTime(userId, { time: newTime });
            setNotificationTimes((prev) => [...prev, newTime]);
            setNewTime('');
            refreshUser();
        } catch (error) {
            console.error('Failed to add notification time:', error);
        }
    };

    const handleDeleteNotificationTime = async (time: string) => {
        try {
            await UserService.deleteNotificationTime(userId, { time });
            setNotificationTimes((prev) => prev.filter((t) => t !== time));
            refreshUser();
        } catch (error) {
            console.error('Failed to delete notification time:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h6">Notification Settings</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <Typography>Enable Notifications:</Typography>
                <Switch
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                />
            </Box>
            <Box sx={{ marginTop: 3 }}>
                <Typography>Notification Times:</Typography>
                <List>
                    {(notificationTimes || []).map((time, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleDeleteNotificationTime(time)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={time} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        style={{ marginRight: '1rem' }}
                    />
                    <Button variant="contained" onClick={handleAddNotificationTime}>
                        Add Time
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default NotificationSettings;

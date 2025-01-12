import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useUser } from '../../context/UserContext'; // Import the `useUser` hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const TopBar = () => {
    const { user } = useUser(); // Get the user data from the context
    const navigate = useNavigate(); // Hook for navigating to other pages

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: 'primary.main',
                width: '100%',
                padding: (theme) => theme.spacing(0.5),
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Hi, {user?.firstName || 'Guest'}!{' '}
                    <MonetizationOnIcon sx={{ fontSize: 18, marginLeft: 1, marginRight: 0.5, marginBottom: -0.4 }} />
                    {user?.currencyBalance ?? 0} coins
                </Typography>
                <IconButton color="inherit" onClick={() => navigate('/profile')}>
                    <SettingsIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;

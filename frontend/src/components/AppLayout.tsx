import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import Box from '@mui/material/Box';

const AppLayout = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Full viewport height
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            {/* Top Bar */}
            <TopBar />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1, // Fills the space between TopBar and BottomNav
                    padding: (theme) => theme.spacing(3),
                    marginTop: (theme) => theme.mixins.toolbar.minHeight, // Account for TopBar height
                    marginBottom: (theme) => theme.spacing(7), // Account for BottomNavBar height
                    width: '100%', // Full width of the screen
                    maxWidth: 1200, // Limit width on large screens
                    margin: 'auto', // Center horizontally
                }}
            >
                <Outlet />
            </Box>

            {/* Bottom Navigation */}
            <BottomNavBar />
        </Box>
    );
};

export default AppLayout;

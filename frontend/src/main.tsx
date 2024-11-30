import React from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'; // Add MUI essentials
import App from './App';
import { AuthProvider } from './context/AuthContext';

// 1. Create an MUI theme
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' }, // A nice blue for buttons, links, etc.
        secondary: { main: '#dc004e' }, // A flashy red for accents
        background: { default: '#f5f5f5', paper: '#ffffff' }, // App-wide background
        text: { primary: '#000000', secondary: '#757575' }, // Text colors
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // MUI's default
    },
});

// 2. Create the root element
const rootElement = document.getElementById('root') as HTMLElement;

// 3. Render the app with providers
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Resets default browser styles */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);

import React, { useState } from 'react';
import { LOGIN_URL } from '../utils/api.ts';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material'; // Import MUI components

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(''); // Handle error messages

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.accessToken);
                window.location.href = '/home';
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: (theme) => theme.palette.background.default,
                padding: 3,
            }}
        >
            {/* Title */}
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Login Form */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                {/* Email Input */}
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />

                {/* Password Input */}
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading} // Disable while loading
                    sx={{ height: 48 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </Box>

            {/* Register Link */}
            <Typography variant="body2" sx={{ marginTop: 2 }}>
                Don’t have an account yet?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Register
                </Link>
            </Typography>
        </Box>
    );
};

export default LoginPage;

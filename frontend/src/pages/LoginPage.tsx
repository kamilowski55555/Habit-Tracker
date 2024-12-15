import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/AuthService';
import { LoginPayload } from '../types/UserTypes';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';

const LoginPage: React.FC = () => {
    const { login: loginToContext } = useAuth(); // Login function from AuthContext
    const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = await login(formData); // Call AuthService
            loginToContext(token); // Save token in AuthContext
            window.location.href = '/home'; // Redirect to home
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
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
                padding: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}
            >
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </Box>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
                Don’t have an account yet?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                    Register
                </Link>
            </Typography>
        </Box>
    );
};

export default LoginPage;

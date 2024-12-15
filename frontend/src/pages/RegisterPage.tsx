import React, { useState } from 'react';
import { register } from '../services/AuthService';
import { RegisterPayload } from '../types/UserTypes';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterPayload>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
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
            await register(formData); // Call AuthService
            window.location.href = '/login'; // Redirect to login
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                Register
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 400 }}
            >
                <TextField
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                </Button>
            </Box>
            <Typography variant="body2" sx={{ marginTop: 2 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                    Log in
                </Link>
            </Typography>
        </Box>
    );
};

export default RegisterPage;

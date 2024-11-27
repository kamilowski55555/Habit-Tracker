import React, { useState } from 'react';
import { REGISTER_URL } from '../utils/api.ts';
import {Link} from "react-router-dom";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName }),
            });

            if (response.status === 201) {
                // Handle successful registration
                alert('Registration successful! Please log in.');
                window.location.href = '/login'; // Redirect to login page
            } else {
                // Handle failure cases
                let errorMessage = 'Registration failed';
                try {
                    const error = await response.json(); // Attempt to parse error response
                    errorMessage = error.message || errorMessage;
                } catch (jsonError) {
                    console.error('Failed to parse error response:', jsonError);
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    };


    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
                <p>
                    Already have an account?{' '}
                    <Link to="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;

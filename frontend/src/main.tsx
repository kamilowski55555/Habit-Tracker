import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Get the root element from the DOM
const rootElement = document.getElementById('root') as HTMLElement;

// Create a root and render the application
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);

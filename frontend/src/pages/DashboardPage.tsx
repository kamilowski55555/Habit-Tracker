// import React from 'react';

// import Navbar from "../components/Navbar.tsx";

const DashboardPage = () => {
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        window.location.href = '/login'; // Redirect to login
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <button onClick={handleLogout}>Logout</button>
            {/*<>*/}
            {/*    <Navbar />*/}
            {/*    <h1>Dashboard</h1>*/}
            {/*</>*/}
        </div>
    );
};

export default DashboardPage;

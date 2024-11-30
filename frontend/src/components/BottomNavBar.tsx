import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path

    // Map routes to navigation values
    const routes = ['home', 'habits', 'extras', 'explore'];

    // Derive the active tab based on the current URL path
    const currentTab = routes.findIndex((route) => location.pathname.includes(route));

    const handleNavigation = (_event, newValue) => {
        navigate(`/${routes[newValue]}`); // Navigate to the selected tab
    };

    return (
        <BottomNavigation
            value={currentTab}
            onChange={handleNavigation}
            sx={{
                position: 'sticky',
                zIndex: (theme) => theme.zIndex.appBar,
                bottom: 0,
                width: '100%',
                height: (theme) => theme.spacing(7), // Explicit height (default for BottomNavigation)
                boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.2)', // Add a slight shadow
            }}
        >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Habits" icon={<StarIcon />} />
            <BottomNavigationAction label="Extras" icon={<SportsEsportsIcon />} />
            <BottomNavigationAction label="Explore" icon={<SearchIcon />} />
        </BottomNavigation>
    );
};

export default BottomNavBar;

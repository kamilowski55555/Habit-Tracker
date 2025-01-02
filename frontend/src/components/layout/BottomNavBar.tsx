
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import RedeemIcon from '@mui/icons-material/Redeem';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current URL path

    // Map routes to navigation values
    const routes = ['home', 'habits', 'rewards', 'explore'];

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
            <BottomNavigationAction label="Rewards" icon={<RedeemIcon />} />
            <BottomNavigationAction label="Explore" icon={<SearchIcon />} />
        </BottomNavigation>
    );
};

export default BottomNavBar;

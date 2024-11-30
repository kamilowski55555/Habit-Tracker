import {AppBar, IconButton, Toolbar, Typography} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const TopBar = () => {
    return (
        <AppBar
            position="sticky"
            sx={{
            backgroundColor: 'primary.main',
                width: '100%',
                padding: (theme) => theme.spacing(0.5)
        }}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6" sx={{fontSize: {xs: '1rem', sm: '1.25rem'}}}>
                    Hi, John!{' '}
                    <EmojiEventsIcon sx={{fontSize: 18, marginLeft: 1, marginRight: 0.5}}/>
                    1000 coins
                </Typography>
                <IconButton color="inherit">
                    <SettingsIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>

    );
};

export default TopBar;

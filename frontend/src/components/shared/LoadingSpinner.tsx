import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', margin: 2 }}>
        <CircularProgress />
    </Box>
);

export default LoadingSpinner;

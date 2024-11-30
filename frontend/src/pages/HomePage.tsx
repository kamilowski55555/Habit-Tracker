import {Box, Card, CardContent, Grid, Typography} from "@mui/material";

const HomePage = () => {
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        window.location.href = '/login'; // Redirect to login
    };
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome Back, John!
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Habits Completed</Typography>
                            <Typography variant="h4">5</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Coins Earned</Typography>
                            <Typography variant="h4">1000</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;

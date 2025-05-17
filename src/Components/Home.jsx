import React from 'react';
import { Box, Typography, Container } from '@mui/material';


const Home = ({ username }) => {
    return (
            <Container maxWidth="sm">
                <Box
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h3" color="white" gutterBottom>
                        Welcome, {username}!
                    </Typography>
                    <Typography variant="h6" color="gray">
                        We’re glad to have you back.
                    </Typography>
                </Box>
            </Container>
    );
};

export default Home;

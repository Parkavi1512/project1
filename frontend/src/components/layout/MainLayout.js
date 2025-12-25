import React from 'react';
import {
    Box,
    Container,
    CssBaseline
} from '@mui/material';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <Navbar />
            <Container 
                component="main" 
                sx={{ 
                    mt: { xs: 7, sm: 8 },
                    mb: 4,
                    flex: 1 
                }}
            >
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default MainLayout;
import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider
} from '@mui/material';
import {
    Facebook,
    Twitter,
    LinkedIn,
    Instagram,
    GitHub
} from '@mui/icons-material';
import { APP_CONSTANTS } from '../../utils/constants';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
                            {APP_CONSTANTS.APP_NAME}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Bridging the gap between students' skills and real-world internship opportunities.
                            We connect talented students with relevant internships using intelligent matching.
                        </Typography>
                        
                        {/* Social Links */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <IconButton size="small" color="primary">
                                <Facebook fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <Twitter fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <LinkedIn fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <Instagram fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary">
                                <GitHub fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            For Students
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/student/internships" color="text.secondary" underline="hover">
                                Browse Internships
                            </Link>
                            <Link href="/student/recommendations" color="text.secondary" underline="hover">
                                Recommendations
                            </Link>
                            <Link href="/student/applications" color="text.secondary" underline="hover">
                                My Applications
                            </Link>
                            <Link href="/student/profile" color="text.secondary" underline="hover">
                                My Profile
                            </Link>
                        </Box>
                    </Grid>

                    {/* For Recruiters */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            For Recruiters
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/recruiter/post-internship" color="text.secondary" underline="hover">
                                Post Internship
                            </Link>
                            <Link href="/recruiter/internships" color="text.secondary" underline="hover">
                                Manage Internships
                            </Link>
                            <Link href="/recruiter/applications" color="text.secondary" underline="hover">
                                View Applications
                            </Link>
                            <Link href="/recruiter/analytics" color="text.secondary" underline="hover">
                                Analytics
                            </Link>
                        </Box>
                    </Grid>

                    {/* Resources */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/about" color="text.secondary" underline="hover">
                                About Us
                            </Link>
                            <Link href="/contact" color="text.secondary" underline="hover">
                                Contact
                            </Link>
                            <Link href="/help" color="text.secondary" underline="hover">
                                Help Center
                            </Link>
                            <Link href="/privacy" color="text.secondary" underline="hover">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" color="text.secondary" underline="hover">
                                Terms of Service
                            </Link>
                        </Box>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                support@internshipmatcher.com
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                +1 (555) 123-4567
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                123 Innovation Street
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tech City, TC 12345
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Copyright */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {currentYear} {APP_CONSTANTS.APP_NAME}. All rights reserved.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            10,000+ Students
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            500+ Companies
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            5,000+ Internships
                        </Typography>
                    </Box>
                </Box>

                {/* Stats Banner */}
                <Box sx={{ 
                    mt: 4, 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundColor: 'primary.50',
                    border: '1px solid',
                    borderColor: 'primary.100',
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            95%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Match Accuracy
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            85%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Student Satisfaction
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            90%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Recruiter Satisfaction
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            10K+
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Successful Matches
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
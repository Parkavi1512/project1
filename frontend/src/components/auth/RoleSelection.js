import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Alert,
    useTheme
} from '@mui/material';
import {
    School as SchoolIcon,
    Business as BusinessIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { APP_CONSTANTS } from '../../utils/constants';

const RoleSelection = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [error, setError] = useState('');

    const roles = [
        {
            id: 'student',
            title: 'Student',
            description: 'Looking for internship opportunities',
            icon: <SchoolIcon sx={{ fontSize: 60 }} />,
            color: theme.palette.secondary.main,
            features: [
                'Personalized internship recommendations',
                'Skill-based matching',
                'Easy application process',
                'Track your applications',
                'Get career guidance'
            ],
            buttonText: 'Continue as Student',
            path: '/register?role=student'
        },
        {
            id: 'recruiter',
            title: 'Recruiter',
            description: 'Hiring interns for your company',
            icon: <BusinessIcon sx={{ fontSize: 60 }} />,
            color: theme.palette.primary.main,
            features: [
                'Post internship opportunities',
                'Find qualified candidates',
                'Intelligent matching algorithm',
                'Manage applications easily',
                'Analytics and insights'
            ],
            buttonText: 'Continue as Recruiter',
            path: '/register?role=recruiter'
        }
    ];

    const handleRoleSelect = (role) => {
        setSelectedRole(role.id);
        setTimeout(() => {
            navigate(role.path);
        }, 300);
    };

    const handleAdminClick = () => {
        // For admin access, typically there would be a separate login
        setError('Admin access requires special credentials. Please contact support.');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 6 },
                    borderRadius: 3,
                    backgroundColor: 'transparent',
                    textAlign: 'center'
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        fontWeight="bold"
                        color="primary.main"
                    >
                        Welcome to {APP_CONSTANTS.APP_NAME}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Select your role to get started with our intelligent internship matching platform
                    </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 4, 
                            maxWidth: 600, 
                            mx: 'auto',
                            borderRadius: 2
                        }}
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}

                {/* Role Selection Cards */}
                <Grid container spacing={4} justifyContent="center">
                    {roles.map((role) => (
                        <Grid item xs={12} md={6} key={role.id}>
                            <Card
                                elevation={selectedRole === role.id ? 8 : 3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    border: `3px solid ${
                                        selectedRole === role.id ? role.color : 'transparent'
                                    }`,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 8,
                                        borderColor: role.color
                                    }
                                }}
                                onClick={() => handleRoleSelect(role)}
                            >
                                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            backgroundColor: `${role.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                            border: `2px solid ${role.color}30`
                                        }}
                                    >
                                        <Box sx={{ color: role.color }}>
                                            {role.icon}
                                        </Box>
                                    </Box>

                                    {/* Title */}
                                    <Typography
                                        variant="h4"
                                        component="h2"
                                        gutterBottom
                                        fontWeight="bold"
                                        color={role.color}
                                    >
                                        {role.title}
                                    </Typography>

                                    {/* Description */}
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        paragraph
                                        sx={{ mb: 3 }}
                                    >
                                        {role.description}
                                    </Typography>

                                    {/* Features */}
                                    <Box sx={{ textAlign: 'left', mb: 3 }}>
                                        {role.features.map((feature, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: role.color,
                                                        mr: 2,
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    {feature}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>

                                <CardActions sx={{ p: 3, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: role.color,
                                            '&:hover': {
                                                backgroundColor: role.color,
                                                opacity: 0.9
                                            },
                                            textTransform: 'none',
                                            fontWeight: 'bold'
                                        }}
                                        onClick={() => handleRoleSelect(role)}
                                    >
                                        {role.buttonText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Already have an account */}
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Already have an account?
                    </Typography>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign In to Your Account
                    </Button>
                </Box>

                {/* Admin Access (Hidden by default) */}
                <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Are you an administrator?
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleAdminClick}
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary'
                        }}
                    >
                        Click here for admin access
                    </Button>
                </Box>
            </Paper>

            {/* Stats Section */}
            <Box sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Why Choose {APP_CONSTANTS.APP_NAME}?
                </Typography>
                
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" fontWeight="bold" color="primary.main" gutterBottom>
                                95%
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Match Accuracy
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Our AI algorithm ensures highly relevant matches
                            </Typography>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" fontWeight="bold" color="primary.main" gutterBottom>
                                10K+
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Students
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Join our growing community of talented students
                            </Typography>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" fontWeight="bold" color="primary.main" gutterBottom>
                                500+
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Companies
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Partnered with top companies worldwide
                            </Typography>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" fontWeight="bold" color="primary.main" gutterBottom>
                                5K+
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Successful Matches
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Students placed in their dream internships
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default RoleSelection;
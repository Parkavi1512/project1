import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    Avatar,
    Chip,
    Divider,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    TrendingUp,
    People,
    BusinessCenter,
    Description,
    Warning,
    CheckCircle,
    Block,
    MoreVert,
    Refresh,
    Download,
    PersonAdd,
    Security,
    Timeline,
    BarChart,
    PieChart
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { APP_CONSTANTS } from '../../utils/constants';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const theme = useTheme();
    const [timeframe, setTimeframe] = useState('30d');

    // Fetch system stats
    const { data: stats, isLoading, refetch } = useQuery({
        queryKey: ['admin-stats', timeframe],
        queryFn: async () => {
            const response = await adminAPI.getSystemStats();
            return response.data.data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Fetch recent activities
    const { data: recentActivities } = useQuery({
        queryKey: ['recent-activities'],
        queryFn: async () => {
            // Mock data - replace with actual API call
            return [
                {
                    id: 1,
                    user: 'John Doe',
                    action: 'User registered',
                    role: 'student',
                    timestamp: new Date(Date.now() - 3600000),
                    status: 'success'
                },
                {
                    id: 2,
                    user: 'Jane Smith',
                    action: 'Profile updated',
                    role: 'student',
                    timestamp: new Date(Date.now() - 7200000),
                    status: 'success'
                },
                {
                    id: 3,
                    user: 'Tech Corp',
                    action: 'Internship posted',
                    role: 'recruiter',
                    timestamp: new Date(Date.now() - 10800000),
                    status: 'success'
                },
                {
                    id: 4,
                    user: 'Bob Johnson',
                    action: 'Account suspended',
                    role: 'student',
                    timestamp: new Date(Date.now() - 14400000),
                    status: 'warning'
                },
                {
                    id: 5,
                    user: 'Alice Brown',
                    action: 'Verification approved',
                    role: 'recruiter',
                    timestamp: new Date(Date.now() - 18000000),
                    status: 'success'
                }
            ];
        }
    });

    // Stats cards data
    const statCards = [
        {
            title: 'Total Users',
            value: stats?.overview?.totalUsers || 0,
            change: '+12%',
            icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            color: theme.palette.primary.main,
            link: '/admin/users'
        },
        {
            title: 'Active Internships',
            value: stats?.overview?.activeInternships || 0,
            change: '+8%',
            icon: <BusinessCenter sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
            color: theme.palette.secondary.main,
            link: '/admin/internships'
        },
        {
            title: 'Pending Verifications',
            value: stats?.overview?.pendingVerifications || 0,
            change: '-3%',
            icon: <Warning sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
            color: theme.palette.warning.main,
            link: '/admin/users?status=pending'
        },
        {
            title: 'Total Applications',
            value: stats?.overview?.totalApplications || 0,
            change: '+15%',
            icon: <Description sx={{ fontSize: 40, color: theme.palette.info.main }} />,
            color: theme.palette.info.main,
            link: '/admin/applications'
        }
    ];

    // Quick action buttons
    const quickActions = [
        {
            label: 'Add New User',
            icon: <PersonAdd />,
            action: () => console.log('Add new user'),
            color: 'primary'
        },
        {
            label: 'View Reports',
            icon: <BarChart />,
            action: () => console.log('View reports'),
            color: 'secondary'
        },
        {
            label: 'Backup Database',
            icon: <Download />,
            action: () => handleBackup(),
            color: 'info'
        },
        {
            label: 'System Logs',
            icon: <Security />,
            action: () => console.log('View system logs'),
            color: 'warning'
        }
    ];

    const handleBackup = async () => {
        try {
            await adminAPI.backupDatabase();
            // Show success message
        } catch (error) {
            // Show error message
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'default';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'student': return 'secondary';
            case 'recruiter': return 'primary';
            case 'admin': return 'error';
            default: return 'default';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ width: '100%', p: 3 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Overview of platform statistics and activities
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<Refresh />}
                        onClick={() => refetch()}
                        variant="outlined"
                        size="small"
                    >
                        Refresh
                    </Button>
                    <Button
                        startIcon={<Download />}
                        variant="contained"
                        size="small"
                        onClick={handleBackup}
                    >
                        Backup
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                boxShadow: 2,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" color={card.color}>
                                            {card.value.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.title}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            backgroundColor: `${card.color}15`
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUp sx={{ fontSize: 16, color: card.change.startsWith('+') ? 'success.main' : 'error.main' }} />
                                    <Typography 
                                        variant="body2" 
                                        color={card.change.startsWith('+') ? 'success.main' : 'error.main'}
                                        fontWeight="medium"
                                    >
                                        {card.change} from last month
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button 
                                    size="small" 
                                    sx={{ color: card.color }}
                                    onClick={() => window.location.href = card.link}
                                >
                                    View Details
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    {quickActions.map((action, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={action.icon}
                                onClick={action.action}
                                sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    borderColor: `${action.color}.main`,
                                    color: `${action.color}.main`,
                                    '&:hover': {
                                        backgroundColor: `${action.color}.10`,
                                        borderColor: `${action.color}.dark`
                                    }
                                }}
                            >
                                {action.label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {/* Left Column - Recent Activities */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Recent Activities
                            </Typography>
                            <Button size="small" endIcon={<MoreVert />}>
                                View All
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentActivities?.map((activity) => (
                                        <TableRow key={activity.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: getRoleColor(activity.role) }}>
                                                        {activity.user.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {activity.user}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {activity.action}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={activity.role}
                                                    size="small"
                                                    color={getRoleColor(activity.role)}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {format(activity.timestamp, 'MMM dd, HH:mm')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={activity.status}
                                                    size="small"
                                                    color={getStatusColor(activity.status)}
                                                    icon={activity.status === 'success' ? <CheckCircle /> : <Warning />}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Right Column - System Health */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            System Health
                        </Typography>

                        {/* Database Status */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    Database
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                    Healthy
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={95} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: 'success.50',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'success.main'
                                    }
                                }}
                            />
                        </Box>

                        {/* API Status */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    API Response
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                    99.9%
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={99.9} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: 'success.50',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'success.main'
                                    }
                                }}
                            />
                        </Box>

                        {/* Storage */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    Storage
                                </Typography>
                                <Typography variant="body2" color="warning.main" fontWeight="bold">
                                    75% Used
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={75} 
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: 'warning.50',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'warning.main'
                                    }
                                }}
                            />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* System Info */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                System Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Version
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        2.1.0
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Backup
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        Today, 02:00 AM
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Uptime
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        99.8%
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Active Sessions
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        1,245
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* System Alerts */}
                        <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: 'warning.50', border: '1px solid', borderColor: 'warning.100' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="bold" color="warning.main">
                                    System Alert
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Database backup scheduled for maintenance tonight at 2:00 AM. Expected downtime: 15 minutes.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Platform Growth Chart */}
            <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Platform Growth
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            User growth over the last 30 days
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {['7d', '30d', '90d'].map((period) => (
                            <Chip
                                key={period}
                                label={period}
                                variant={timeframe === period ? 'filled' : 'outlined'}
                                color="primary"
                                onClick={() => setTimeframe(period)}
                                size="small"
                            />
                        ))}
                    </Box>
                </Box>

                {/* Mock Growth Chart */}
                <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, px: 2 }}>
                    {[65, 80, 75, 90, 85, 95, 100].map((height, index) => (
                        <Tooltip key={index} title={`Day ${index + 1}: ${height} users`}>
                            <Box
                                sx={{
                                    flex: 1,
                                    height: `${height}%`,
                                    backgroundColor: theme.palette.primary.main,
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            />
                        </Tooltip>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 2 }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <Typography key={day} variant="caption" color="text.secondary">
                            {day}
                        </Typography>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminDashboard;
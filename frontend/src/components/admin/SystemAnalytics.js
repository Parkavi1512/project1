import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme,
    LinearProgress,
    Divider,
    Chip,
    Tooltip
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    People,
    BusinessCenter,
    Description,
    Timeline,
    BarChart,
    PieChart,
    Download,
    Refresh,
    CalendarToday,
    ArrowUpward,
    ArrowDownward
} from '@mui/icons-material';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { APP_CONSTANTS } from '../../utils/constants';

const SystemAnalytics = () => {
    const theme = useTheme();
    const [timeframe, setTimeframe] = useState('30d');
    const [chartType, setChartType] = useState('bar');

    // Fetch analytics data
    const { data: analytics, isLoading, refetch } = useQuery({
        queryKey: ['system-analytics', timeframe],
        queryFn: async () => {
            const response = await adminAPI.getSystemStats();
            return response.data.data;
        }
    });

    // Mock data for charts
    const userGrowthData = [
        { month: 'Jan', students: 1200, recruiters: 300, total: 1500 },
        { month: 'Feb', students: 1400, recruiters: 350, total: 1750 },
        { month: 'Mar', students: 1600, recruiters: 400, total: 2000 },
        { month: 'Apr', students: 1800, recruiters: 450, total: 2250 },
        { month: 'May', students: 2000, recruiters: 500, total: 2500 },
        { month: 'Jun', students: 2200, recruiters: 550, total: 2750 },
    ];

    const internshipData = [
        { category: 'Tech', active: 150, closed: 50, total: 200 },
        { category: 'Business', active: 80, closed: 30, total: 110 },
        { category: 'Design', active: 60, closed: 20, total: 80 },
        { category: 'Marketing', active: 40, closed: 10, total: 50 },
        { category: 'Other', active: 30, closed: 5, total: 35 },
    ];

    const applicationStatusData = [
        { name: 'Pending', value: 45, color: theme.palette.warning.main },
        { name: 'Reviewed', value: 30, color: theme.palette.info.main },
        { name: 'Shortlisted', value: 15, color: theme.palette.success.main },
        { name: 'Rejected', value: 8, color: theme.palette.error.main },
        { name: 'Accepted', value: 2, color: theme.palette.secondary.main },
    ];

    const platformMetrics = [
        {
            title: 'Avg. Response Time',
            value: '1.2s',
            change: '-0.3s',
            trend: 'down',
            icon: <Timeline sx={{ color: theme.palette.success.main }} />
        },
        {
            title: 'Server Uptime',
            value: '99.8%',
            change: '+0.1%',
            trend: 'up',
            icon: <TrendingUp sx={{ color: theme.palette.success.main }} />
        },
        {
            title: 'Error Rate',
            value: '0.2%',
            change: '-0.1%',
            trend: 'down',
            icon: <TrendingDown sx={{ color: theme.palette.success.main }} />
        },
        {
            title: 'Active Sessions',
            value: '1,245',
            change: '+45',
            trend: 'up',
            icon: <People sx={{ color: theme.palette.primary.main }} />
        }
    ];

    const topSkillsData = [
        { skill: 'React', count: 1200, growth: 25 },
        { skill: 'Python', count: 1100, growth: 20 },
        { skill: 'JavaScript', count: 1000, growth: 15 },
        { skill: 'Node.js', count: 800, growth: 30 },
        { skill: 'Machine Learning', count: 600, growth: 40 },
        { skill: 'UI/UX Design', count: 500, growth: 18 },
        { skill: 'Data Analysis', count: 450, growth: 22 },
        { skill: 'Cloud Computing', count: 400, growth: 35 },
    ];

    const handleExportData = (type) => {
        console.log(`Exporting ${type} data`);
        // Implement export logic
    };

    const getChangeColor = (trend) => {
        return trend === 'up' ? 'success.main' : 'error.main';
    };

    const getChangeIcon = (trend) => {
        return trend === 'up' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="bold">{label}</Typography>
                    {payload.map((entry, index) => (
                        <Typography key={index} variant="caption" sx={{ color: entry.color, display: 'block' }}>
                            {entry.name}: {entry.value}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <LinearProgress sx={{ width: '50%' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        System Analytics
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive platform insights and performance metrics
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Timeframe</InputLabel>
                        <Select
                            value={timeframe}
                            label="Timeframe"
                            onChange={(e) => setTimeframe(e.target.value)}
                        >
                            <MenuItem value="7d">Last 7 Days</MenuItem>
                            <MenuItem value="30d">Last 30 Days</MenuItem>
                            <MenuItem value="90d">Last 90 Days</MenuItem>
                            <MenuItem value="1y">Last Year</MenuItem>
                        </Select>
                    </FormControl>
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
                        onClick={() => handleExportData('all')}
                    >
                        Export Report
                    </Button>
                </Box>
            </Box>

            {/* Platform Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {platformMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ borderRadius: 2, height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {metric.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {metric.title}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            backgroundColor: `${getChangeColor(metric.trend)}15`
                                        }}
                                    >
                                        {metric.icon}
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: getChangeColor(metric.trend) }}>
                                        {getChangeIcon(metric.trend)}
                                    </Box>
                                    <Typography 
                                        variant="body2" 
                                        color={getChangeColor(metric.trend)}
                                        fontWeight="medium"
                                    >
                                        {metric.change} from last month
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                {/* User Growth Chart */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    User Growth
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Platform user growth over time
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small" onClick={() => setChartType('bar')}>
                                    <BarChart />
                                </IconButton>
                                <IconButton size="small" onClick={() => setChartType('line')}>
                                    <Timeline />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleExportData('user-growth')}>
                                    <Download />
                                </IconButton>
                            </Box>
                        </Box>
                        
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'bar' ? (
                                    <RechartsBarChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="students" fill={theme.palette.secondary.main} name="Students" />
                                        <Bar dataKey="recruiters" fill={theme.palette.primary.main} name="Recruiters" />
                                        <Bar dataKey="total" fill={theme.palette.success.main} name="Total Users" />
                                    </RechartsBarChart>
                                ) : (
                                    <LineChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="students" 
                                            stroke={theme.palette.secondary.main} 
                                            name="Students"
                                            strokeWidth={2}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="recruiters" 
                                            stroke={theme.palette.primary.main} 
                                            name="Recruiters"
                                            strokeWidth={2}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="total" 
                                            stroke={theme.palette.success.main} 
                                            name="Total Users"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Application Status Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Application Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Distribution of application statuses
                        </Typography>
                        
                        <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={applicationStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {applicationStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value) => [`${value} applications`, 'Count']} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </Box>
                        
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                            {applicationStatusData.map((status, index) => (
                                <Chip
                                    key={index}
                                    label={`${status.name}: ${status.value}%`}
                                    size="small"
                                    sx={{
                                        backgroundColor: `${status.color}15`,
                                        color: status.color,
                                        border: `1px solid ${status.color}30`
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Internships by Category */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Internships by Category
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active vs closed internships across categories
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => handleExportData('internships')}>
                                <Download />
                            </IconButton>
                        </Box>
                        
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={internshipData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="active" fill={theme.palette.success.main} name="Active" />
                                    <Bar dataKey="closed" fill={theme.palette.error.main} name="Closed" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Top Skills Demand */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Top Skills Demand
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Most requested skills in internships
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => handleExportData('skills')}>
                                <Download />
                            </IconButton>
                        </Box>
                        
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={topSkillsData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="skill" />
                                    <RechartsTooltip formatter={(value) => [`${value} internships`, 'Count']} />
                                    <Legend />
                                    <Bar dataKey="count" fill={theme.palette.primary.main} name="Number of Internships" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Platform Performance */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Platform Performance Metrics
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        API Performance
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Typography variant="h4" fontWeight="bold">
                                            99.9%
                                        </Typography>
                                        <Chip label="Excellent" color="success" size="small" />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Average response time: 120ms
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={99.9} 
                                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Database Health
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Typography variant="h4" fontWeight="bold">
                                            98.5%
                                        </Typography>
                                        <Chip label="Good" color="success" size="small" />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Queries per second: 1,245
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={98.5} 
                                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        User Satisfaction
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Typography variant="h4" fontWeight="bold">
                                            4.8/5
                                        </Typography>
                                        <Chip label="Excellent" color="success" size="small" />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Based on 1,245 reviews
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={96} 
                                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* System Alerts */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            System Alerts & Notifications
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'warning.200', backgroundColor: 'warning.50' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="warning.main" gutterBottom>
                                        Scheduled Maintenance
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Database maintenance scheduled for tonight at 2:00 AM. Expected downtime: 15 minutes.
                                    </Typography>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'info.200', backgroundColor: 'info.50' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                                        Backup Successful
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Daily backup completed successfully at 3:00 AM. Backup size: 2.5 GB.
                                    </Typography>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'success.200', backgroundColor: 'success.50' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="success.main" gutterBottom>
                                        Performance Improved
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        API response time improved by 15% after recent optimizations.
                                    </Typography>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'error.200', backgroundColor: 'error.50' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="error.main" gutterBottom>
                                        High Memory Usage
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Server memory usage at 85%. Consider scaling or optimization.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SystemAnalytics;
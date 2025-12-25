import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    LinearProgress,
    useTheme,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    MoreVert,
    Visibility,
    Edit,
    Delete,
    Download,
    CalendarToday,
    Business,
    LocationOn,
    Schedule,
    CheckCircle,
    Pending,
    Cancel,
    Warning,
    TrendingUp,
    FilterList
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI } from '../../services/api';
import { APP_CONSTANTS } from '../../utils/constants';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Applications = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        shortlisted: 0,
        rejected: 0,
        accepted: 0,
        averageMatchScore: 0
    });

    // Fetch applications
    const { data: applicationsData, isLoading } = useQuery({
        queryKey: ['student-applications', page, rowsPerPage, statusFilter],
        queryFn: async () => {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                status: statusFilter || undefined
            };
            const response = await studentAPI.getApplications(params);
            
            // Calculate stats
            const apps = response.data.data.applications;
            const stats = {
                total: apps.length,
                pending: apps.filter(a => a.status === 'pending').length,
                shortlisted: apps.filter(a => a.status === 'shortlisted').length,
                rejected: apps.filter(a => a.status === 'rejected').length,
                accepted: apps.filter(a => a.status === 'accepted').length,
                averageMatchScore: apps.reduce((sum, app) => sum + (app.matchScore || 0), 0) / apps.length || 0
            };
            setStats(stats);
            
            return response.data.data;
        }
    });

    // Fetch application stats separately
    const { data: applicationStats } = useQuery({
        queryKey: ['application-stats'],
        queryFn: async () => {
            const response = await studentAPI.getApplicationStats();
            return response.data.data;
        }
    });

    // Mutation for deleting application
    const deleteApplicationMutation = useMutation({
        mutationFn: (applicationId) => studentAPI.deleteApplication(applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries(['student-applications']);
            queryClient.invalidateQueries(['application-stats']);
            setWithdrawDialogOpen(false);
            setSelectedApplication(null);
        }
    });

    const applications = applicationsData?.applications || [];
    const pagination = applicationsData?.pagination;

    const handleMenuOpen = (event, application) => {
        setAnchorEl(event.currentTarget);
        setSelectedApplication(application);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setViewDialogOpen(true);
        handleMenuClose();
    };

    const handleWithdraw = () => {
        setWithdrawDialogOpen(true);
        handleMenuClose();
    };

    const confirmWithdraw = () => {
        if (selectedApplication) {
            deleteApplicationMutation.mutate(selectedApplication._id);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'success';
            case 'shortlisted': return 'info';
            case 'reviewed': return 'primary';
            case 'rejected': return 'error';
            default: return 'warning';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle />;
            case 'shortlisted': return <TrendingUp />;
            case 'reviewed': return <Visibility />;
            case 'rejected': return <Cancel />;
            default: return <Pending />;
        }
    };

    const getMatchColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy');
    };

    const statusFilters = [
        { value: '', label: 'All Applications' },
        { value: 'pending', label: 'Pending', color: 'warning' },
        { value: 'reviewed', label: 'Reviewed', color: 'info' },
        { value: 'shortlisted', label: 'Shortlisted', color: 'success' },
        { value: 'rejected', label: 'Rejected', color: 'error' },
        { value: 'accepted', label: 'Accepted', color: 'success' }
    ];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    My Applications
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track and manage your internship applications
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" color="primary.main" align="center">
                                {stats.total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Total Applications
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" color="warning.main" align="center">
                                {stats.pending}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Pending
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" color="info.main" align="center">
                                {stats.shortlisted}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Shortlisted
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" color="error.main" align="center">
                                {stats.rejected}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Rejected
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" color="success.main" align="center">
                                {stats.accepted}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Accepted
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" align="center">
                                {Math.round(stats.averageMatchScore)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Avg. Match Score
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filter Bar */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <FilterList color="action" />
                    <Typography variant="body2" color="text.secondary">
                        Filter by status:
                    </Typography>
                    {statusFilters.map((filter) => (
                        <Chip
                            key={filter.value}
                            label={filter.label}
                            variant={statusFilter === filter.value ? 'filled' : 'outlined'}
                            color={filter.color || 'default'}
                            onClick={() => {
                                setStatusFilter(filter.value);
                                setPage(0);
                            }}
                            icon={filter.value === '' ? undefined : getStatusIcon(filter.value)}
                        />
                    ))}
                </Box>
            </Paper>

            {/* Applications Table */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'background.default' }}>
                            <TableRow>
                                <TableCell>Internship</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Match Score</TableCell>
                                <TableCell>Applied Date</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Business sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            No applications found
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" paragraph>
                                            {statusFilter 
                                                ? 'No applications match the selected filter'
                                                : "You haven't applied to any internships yet"
                                            }
                                        </Typography>
                                        {!statusFilter && (
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/student/internships')}
                                            >
                                                Browse Internships
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((application) => (
                                    <TableRow key={application._id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {application.internship?.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <LocationOn fontSize="small" color="action" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {application.internship?.location}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {application.internship?.companyName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={application.status}
                                                color={getStatusColor(application.status)}
                                                icon={getStatusIcon(application.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={application.matchScore || 0} 
                                                        sx={{ 
                                                            height: 6, 
                                                            borderRadius: 3,
                                                            backgroundColor: `${getMatchColor(application.matchScore)}.50`,
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: `${getMatchColor(application.matchScore)}.main`
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {application.matchScore || 0}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(application.appliedAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(application.updatedAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, application)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {applications.length > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={pagination?.totalItems || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </Paper>

            {/* Application Insights */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Application Insights
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'primary.50' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary.main">
                                Success Rate
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={stats.total > 0 ? (stats.shortlisted / stats.total) * 100 : 0} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4 
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {stats.total > 0 ? Math.round((stats.shortlisted / stats.total) * 100) : 0}%
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {stats.shortlisted} out of {stats.total} applications shortlisted
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'info.50' }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.main">
                                Average Response Time
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                3.5 days
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Average time for first response from companies
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: { width: 200 }
                }}
            >
                <MenuItem onClick={() => handleViewDetails(selectedApplication)}>
                    <Visibility sx={{ mr: 2, fontSize: 20 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => navigate(`/internships/${selectedApplication?.internship?._id}`)}>
                    <Business sx={{ mr: 2, fontSize: 20 }} />
                    View Internship
                </MenuItem>
                <Divider />
                <MenuItem 
                    onClick={handleWithdraw}
                    sx={{ color: 'error.main' }}
                    disabled={selectedApplication?.status === 'accepted' || selectedApplication?.status === 'rejected'}
                >
                    <Delete sx={{ mr: 2, fontSize: 20 }} />
                    Withdraw Application
                </MenuItem>
            </Menu>

            {/* Application Details Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedApplication && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5" fontWeight="bold">
                                Application Details
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {selectedApplication.internship?.title} at {selectedApplication.internship?.companyName}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Chip
                                            label={selectedApplication.status}
                                            color={getStatusColor(selectedApplication.status)}
                                            icon={getStatusIcon(selectedApplication.status)}
                                            size="medium"
                                        />
                                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                                            Match Score: {selectedApplication.matchScore || 0}%
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Applied Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatDate(selectedApplication.appliedAt)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatDate(selectedApplication.updatedAt)}
                                    </Typography>
                                </Grid>

                                {selectedApplication.coverLetter && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Cover Letter
                                        </Typography>
                                        <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                                            <Typography variant="body2">
                                                {selectedApplication.coverLetter}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}

                                {selectedApplication.recruiterFeedback && (
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: 'info.50', border: '1px solid', borderColor: 'info.100' }}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.main">
                                                Recruiter Feedback
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedApplication.recruiterFeedback}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}

                                {selectedApplication.interviewDate && (
                                    <Grid item xs={12}>
                                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Interview Scheduled
                                            </Typography>
                                            <Typography variant="body2">
                                                Your interview is scheduled for {formatDate(selectedApplication.interviewDate)}
                                            </Typography>
                                        </Alert>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Internship Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Location
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedApplication.internship?.location}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Type
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedApplication.internship?.internshipType}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Duration
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedApplication.internship?.duration?.value} {selectedApplication.internship?.duration?.unit}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Stipend
                                            </Typography>
                                            <Typography variant="body1">
                                                ${selectedApplication.internship?.stipend?.amount?.toLocaleString() || '0'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 0 }}>
                            <Button onClick={() => setViewDialogOpen(false)}>
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/internships/${selectedApplication.internship?._id}`)}
                            >
                                View Internship
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Withdraw Confirmation Dialog */}
            <Dialog open={withdrawDialogOpen} onClose={() => !deleteApplicationMutation.isLoading && setWithdrawDialogOpen(false)}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Withdraw Application
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                        Are you sure you want to withdraw your application?
                    </Alert>
                    <Typography variant="body1" paragraph>
                        You are about to withdraw your application for{' '}
                        <Typography component="span" fontWeight="bold">
                            {selectedApplication?.internship?.title}
                        </Typography>
                        {' '}at{' '}
                        <Typography component="span" fontWeight="bold">
                            {selectedApplication?.internship?.companyName}
                        </Typography>
                        .
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone. The recruiter will be notified of your withdrawal.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                        onClick={() => setWithdrawDialogOpen(false)}
                        disabled={deleteApplicationMutation.isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmWithdraw}
                        disabled={deleteApplicationMutation.isLoading}
                        startIcon={deleteApplicationMutation.isLoading && <CircularProgress size={20} />}
                    >
                        {deleteApplicationMutation.isLoading ? 'Withdrawing...' : 'Withdraw Application'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Applications;
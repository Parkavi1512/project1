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
    IconButton,
    Button,
    Chip,
    Avatar,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Alert,
    useTheme,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    Search,
    FilterList,
    MoreVert,
    Edit,
    Delete,
    Block,
    CheckCircle,
    PersonAdd,
    Refresh,
    Download,
    Visibility,
    Email,
    Phone,
    Business
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { APP_CONSTANTS } from '../../utils/constants';
import { format } from 'date-fns';

const UserManagement = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    
    // State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('view'); // view, edit, delete, status
    const [formData, setFormData] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch users
    const { data: usersData, isLoading } = useQuery({
        queryKey: ['admin-users', page, rowsPerPage, searchTerm, roleFilter, statusFilter],
        queryFn: async () => {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm,
                role: roleFilter || undefined,
                status: statusFilter || undefined
            };
            const response = await adminAPI.getAllUsers(params);
            return response.data.data;
        }
    });

    // Mutation for updating user status
    const updateUserStatusMutation = useMutation({
        mutationFn: ({ userId, statusData }) => adminAPI.updateUserStatus(userId, statusData),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setSnackbar({ open: true, message: 'User status updated successfully', severity: 'success' });
            handleDialogClose();
        },
        onError: (error) => {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
    });

    // Mutation for deleting user
    const deleteUserMutation = useMutation({
        mutationFn: (userId) => adminAPI.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
            handleDialogClose();
        },
        onError: (error) => {
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
    });

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = (type, user = null) => {
        setDialogType(type);
        setSelectedUser(user);
        if (user) {
            setFormData(user);
        }
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedUser(null);
        setFormData({});
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleStatusUpdate = () => {
        if (selectedUser && formData.status) {
            updateUserStatusMutation.mutate({
                userId: selectedUser._id,
                statusData: { isActive: formData.status === 'active' }
            });
        }
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            deleteUserMutation.mutate(selectedUser._id);
        }
    };

    const handleExportUsers = () => {
        // Implement export logic
        console.log('Export users');
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'student': return 'secondary';
            case 'recruiter': return 'primary';
            case 'admin': return 'error';
            default: return 'default';
        }
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'success' : 'error';
    };

    const getVerificationColor = (status) => {
        switch (status) {
            case 'verified': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy');
    };

    const UserDialog = () => {
        const renderContent = () => {
            switch (dialogType) {
                case 'view':
                    return (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: getRoleColor(selectedUser?.role),
                                        fontSize: '2rem'
                                    }}
                                >
                                    {selectedUser?.firstName?.charAt(0) || selectedUser?.email?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {selectedUser?.firstName && selectedUser?.lastName 
                                            ? `${selectedUser.firstName} ${selectedUser.lastName}`
                                            : selectedUser?.contactPerson?.firstName
                                            ? `${selectedUser.contactPerson.firstName} ${selectedUser.contactPerson.lastName}`
                                            : selectedUser?.email
                                        }
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                        <Chip
                                            label={selectedUser?.role}
                                            size="small"
                                            color={getRoleColor(selectedUser?.role)}
                                        />
                                        <Chip
                                            label={selectedUser?.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            color={getStatusColor(selectedUser?.isActive)}
                                        />
                                        {selectedUser?.role === 'recruiter' && (
                                            <Chip
                                                label={selectedUser?.verificationStatus || 'pending'}
                                                size="small"
                                                color={getVerificationColor(selectedUser?.verificationStatus)}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Email fontSize="small" />
                                        {selectedUser?.email}
                                    </Typography>
                                </Grid>

                                {selectedUser?.phone && (
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Phone
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone fontSize="small" />
                                            {selectedUser.phone}
                                        </Typography>
                                    </Grid>
                                )}

                                {selectedUser?.role === 'student' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                University
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedUser?.university || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Major
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedUser?.major || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}

                                {selectedUser?.role === 'recruiter' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Company
                                            </Typography>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Business fontSize="small" />
                                                {selectedUser?.companyName || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Industry
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedUser?.industry || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Joined Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedUser?.createdAt)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Last Login
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedUser?.lastLogin) || 'Never'}
                                    </Typography>
                                </Grid>

                                {selectedUser?.profileCompleted !== undefined && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Profile Completion
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={selectedUser.profileCompleted ? 100 : 50} 
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {selectedUser.profileCompleted ? '100%' : '50%'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    );

                case 'status':
                    return (
                        <Box>
                            <Typography variant="body1" paragraph>
                                Update status for{' '}
                                <Typography component="span" fontWeight="bold">
                                    {selectedUser?.email}
                                </Typography>
                            </Typography>
                            
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status || (selectedUser?.isActive ? 'active' : 'inactive')}
                                    label="Status"
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Notes (Optional)"
                                multiline
                                rows={3}
                                sx={{ mt: 3 }}
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Box>
                    );

                case 'delete':
                    return (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                This action cannot be undone. The user will be deactivated and their data will be archived.
                            </Alert>
                            <Typography variant="body1" paragraph>
                                Are you sure you want to deactivate{' '}
                                <Typography component="span" fontWeight="bold">
                                    {selectedUser?.email}
                                </Typography>
                                ?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                The user will no longer be able to access their account. You can reactivate them later if needed.
                            </Typography>
                        </Box>
                    );

                default:
                    return null;
            }
        };

        const getDialogTitle = () => {
            switch (dialogType) {
                case 'view': return 'User Details';
                case 'status': return 'Update User Status';
                case 'delete': return 'Deactivate User';
                default: return 'User Management';
            }
        };

        const getDialogActions = () => {
            switch (dialogType) {
                case 'view':
                    return (
                        <>
                            <Button onClick={handleDialogClose}>Close</Button>
                            <Button 
                                variant="contained" 
                                onClick={() => handleDialogOpen('status', selectedUser)}
                            >
                                Update Status
                            </Button>
                        </>
                    );
                case 'status':
                    return (
                        <>
                            <Button onClick={handleDialogClose} disabled={updateUserStatusMutation.isLoading}>
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleStatusUpdate}
                                disabled={updateUserStatusMutation.isLoading}
                                startIcon={updateUserStatusMutation.isLoading && <CircularProgress size={20} />}
                            >
                                {updateUserStatusMutation.isLoading ? 'Updating...' : 'Update Status'}
                            </Button>
                        </>
                    );
                case 'delete':
                    return (
                        <>
                            <Button onClick={handleDialogClose} disabled={deleteUserMutation.isLoading}>
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error"
                                onClick={handleDeleteUser}
                                disabled={deleteUserMutation.isLoading}
                                startIcon={deleteUserMutation.isLoading && <CircularProgress size={20} />}
                            >
                                {deleteUserMutation.isLoading ? 'Deactivating...' : 'Deactivate User'}
                            </Button>
                        </>
                    );
                default:
                    return null;
            }
        };

        return (
            <Dialog 
                open={dialogOpen} 
                onClose={handleDialogClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        {getDialogTitle()}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {renderContent()}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    {getDialogActions()}
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        User Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage all platform users including students, recruiters, and admins
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<PersonAdd />}
                        variant="outlined"
                        onClick={() => console.log('Add new user')}
                    >
                        Add User
                    </Button>
                    <Button
                        startIcon={<Download />}
                        variant="contained"
                        onClick={handleExportUsers}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {/* Filters and Search */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search users by name, email, or company..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={roleFilter}
                                label="Role"
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <MenuItem value="">All Roles</MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="recruiter">Recruiter</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(0);
                                }}
                            >
                                <MenuItem value="">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Users Table */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ backgroundColor: 'background.default' }}>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Verification</TableCell>
                                        <TableCell>Joined Date</TableCell>
                                        <TableCell>Last Login</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usersData?.users?.map((user) => (
                                        <TableRow key={user._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: getRoleColor(user.role),
                                                            width: 36,
                                                            height: 36
                                                        }}
                                                    >
                                                        {user.firstName?.charAt(0) || user.email?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {user.firstName && user.lastName 
                                                                ? `${user.firstName} ${user.lastName}`
                                                                : user.contactPerson?.firstName
                                                                ? `${user.contactPerson.firstName} ${user.contactPerson.lastName}`
                                                                : user.email
                                                            }
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {user.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    color={getRoleColor(user.role)}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.isActive ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    color={getStatusColor(user.isActive)}
                                                    icon={user.isActive ? <CheckCircle /> : <Block />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {user.role === 'recruiter' && (
                                                    <Chip
                                                        label={user.verificationStatus || 'pending'}
                                                        size="small"
                                                        color={getVerificationColor(user.verificationStatus)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {formatDate(user.createdAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(user.lastLogin) || 'Never'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, user)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={usersData?.pagination?.totalItems || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: 200,
                    },
                }}
            >
                <MenuItem onClick={() => handleDialogOpen('view', selectedUser)}>
                    <Visibility sx={{ mr: 2, fontSize: 20 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => handleDialogOpen('status', selectedUser)}>
                    <Edit sx={{ mr: 2, fontSize: 20 }} />
                    Update Status
                </MenuItem>
                <Divider />
                <MenuItem 
                    onClick={() => handleDialogOpen('delete', selectedUser)}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 2, fontSize: 20 }} />
                    Deactivate User
                </MenuItem>
            </Menu>

            {/* Dialog */}
            <UserDialog />

            {/* Snackbar */}
            {snackbar.open && (
                <Alert 
                    severity={snackbar.severity} 
                    sx={{ 
                        position: 'fixed', 
                        bottom: 20, 
                        right: 20,
                        minWidth: 300
                    }}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            )}
        </Box>
    );
};

export default UserManagement;
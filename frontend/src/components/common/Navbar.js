import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Badge,
    InputBase,
    alpha,
    styled,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    BusinessCenter as BusinessIcon,
    School as SchoolIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_CONSTANTS } from '../../utils/constants';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Navbar = ({ onMenuClick, drawerWidth }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, getUserDisplayName, getUserInitials, getUserRole } = useAuth();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    
    const isMenuOpen = Boolean(anchorEl);
    const isNotificationMenuOpen = Boolean(notificationAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenuOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationMenuClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    const handleNavigate = (path) => {
        handleMenuClose();
        navigate(path);
    };

    const getRoleIcon = () => {
        const role = getUserRole();
        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return <SchoolIcon sx={{ mr: 1 }} />;
            case APP_CONSTANTS.ROLES.RECRUITER:
                return <BusinessIcon sx={{ mr: 1 }} />;
            case APP_CONSTANTS.ROLES.ADMIN:
                return <AdminIcon sx={{ mr: 1 }} />;
            default:
                return <PersonIcon sx={{ mr: 1 }} />;
        }
    };

    const getRoleColor = () => {
        const role = getUserRole();
        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return theme.palette.secondary.main;
            case APP_CONSTANTS.ROLES.RECRUITER:
                return theme.palette.primary.main;
            case APP_CONSTANTS.ROLES.ADMIN:
                return theme.palette.error.main;
            default:
                return theme.palette.grey[500];
        }
    };

    // Don't show navbar on auth pages
    const hideNavbarPaths = ['/login', '/register'];
    if (hideNavbarPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: 1,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ 
                        display: { xs: 'none', sm: 'block' },
                        color: 'primary.main',
                        fontWeight: 600 
                    }}
                >
                    {APP_CONSTANTS.APP_NAME}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Search Bar (only on dashboard pages) */}
                {location.pathname.includes('/student/internships') && (
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search internships..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                )}

                {/* Notifications */}
                <IconButton
                    size="large"
                    aria-label="show notifications"
                    color="inherit"
                    onClick={handleNotificationMenuOpen}
                    sx={{ mr: 1 }}
                >
                    <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                {/* User Profile */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            bgcolor: getRoleColor(),
                            width: 36,
                            height: 36,
                            cursor: 'pointer',
                            border: `2px solid ${getRoleColor()}`
                        }}
                        onClick={handleProfileMenuOpen}
                    >
                        {getUserInitials()}
                    </Avatar>
                    
                    <Box sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
                        <Typography variant="body2" fontWeight="medium">
                            {getUserDisplayName()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {getUserRole()?.charAt(0).toUpperCase() + getUserRole()?.slice(1)}
                        </Typography>
                    </Box>
                </Box>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            minWidth: 200,
                            '& .MuiMenuItem-root': {
                                px: 2,
                                py: 1,
                                typography: 'body2',
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => handleNavigate(getDashboardRoute())}>
                        <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                        Dashboard
                    </MenuItem>
                    
                    <MenuItem onClick={() => {
                        const role = getUserRole();
                        if (role === APP_CONSTANTS.ROLES.STUDENT) {
                            navigate('/student/profile');
                        } else if (role === APP_CONSTANTS.ROLES.RECRUITER) {
                            navigate('/recruiter/profile');
                        }
                    }}>
                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                        My Profile
                    </MenuItem>

                    <MenuItem onClick={() => handleNavigate('/settings')}>
                        <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                        Settings
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                        Logout
                    </MenuItem>
                </Menu>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={notificationAnchorEl}
                    open={isNotificationMenuOpen}
                    onClose={handleNotificationMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            minWidth: 320,
                            maxHeight: 400,
                            overflowY: 'auto',
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Notifications
                        </Typography>
                    </Box>
                    <Divider />
                    
                    {/* Notification Items */}
                    <MenuItem onClick={handleNotificationMenuClose}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="body2" fontWeight="medium">
                                New internship match!
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Software Developer Intern at Google
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                2 hours ago
                            </Typography>
                        </Box>
                    </MenuItem>
                    
                    <MenuItem onClick={handleNotificationMenuClose}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="body2" fontWeight="medium">
                                Application status updated
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Your application has been reviewed
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                1 day ago
                            </Typography>
                        </Box>
                    </MenuItem>
                    
                    <MenuItem onClick={handleNotificationMenuClose}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="body2" fontWeight="medium">
                                Profile incomplete
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Complete your profile for better matches
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                3 days ago
                            </Typography>
                        </Box>
                    </MenuItem>
                    
                    <Divider />
                    <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: 'center' }}>
                        <Typography variant="body2" color="primary">
                            View All Notifications
                        </Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
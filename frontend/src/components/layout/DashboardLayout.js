import React, { useState } from 'react';
import {
    Box,
    Drawer,
    CssBaseline,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Badge,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    BusinessCenter as BusinessIcon,
    School as SchoolIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Analytics as AnalyticsIcon,
    AdminPanelSettings as AdminIcon,
    People as PeopleIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_CONSTANTS } from '../../utils/constants';

const drawerWidth = 280;

const DashboardLayout = ({ children, role = 'student' }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, getUserDisplayName, getUserInitials } = useAuth();
    
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getMenuItems = () => {
        const baseItems = [
            { 
                text: 'Dashboard', 
                icon: <DashboardIcon />, 
                path: getDashboardPath(),
                badge: 0
            },
            { 
                text: 'My Profile', 
                icon: <PersonIcon />, 
                path: getProfilePath(),
                badge: 0
            }
        ];

        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return [
                    ...baseItems,
                    { 
                        text: 'Internships', 
                        icon: <BusinessIcon />, 
                        path: APP_CONSTANTS.ROUTES.STUDENT_INTERNSHIPS,
                        badge: 0
                    },
                    { 
                        text: 'Recommendations', 
                        icon: <SchoolIcon />, 
                        path: APP_CONSTANTS.ROUTES.STUDENT_RECOMMENDATIONS,
                        badge: 3
                    },
                    { 
                        text: 'Applications', 
                        icon: <DescriptionIcon />, 
                        path: APP_CONSTANTS.ROUTES.STUDENT_APPLICATIONS,
                        badge: 2
                    }
                ];
            
            case APP_CONSTANTS.ROLES.RECRUITER:
                return [
                    ...baseItems,
                    { 
                        text: 'Post Internship', 
                        icon: <BusinessIcon />, 
                        path: APP_CONSTANTS.ROUTES.RECRUITER_POST_INTERNSHIP,
                        badge: 0
                    },
                    { 
                        text: 'Manage Internships', 
                        icon: <DescriptionIcon />, 
                        path: APP_CONSTANTS.ROUTES.RECRUITER_INTERNSHIPS,
                        badge: 5
                    },
                    { 
                        text: 'Applications', 
                        icon: <PeopleIcon />, 
                        path: APP_CONSTANTS.ROUTES.RECRUITER_APPLICATIONS,
                        badge: 12
                    },
                    { 
                        text: 'Analytics', 
                        icon: <AnalyticsIcon />, 
                        path: APP_CONSTANTS.ROUTES.RECRUITER_ANALYTICS,
                        badge: 0
                    }
                ];
            
            case APP_CONSTANTS.ROLES.ADMIN:
                return [
                    ...baseItems,
                    { 
                        text: 'User Management', 
                        icon: <PeopleIcon />, 
                        path: APP_CONSTANTS.ROUTES.ADMIN_USERS,
                        badge: 5
                    },
                    { 
                        text: 'Internship Management', 
                        icon: <DescriptionIcon />, 
                        path: APP_CONSTANTS.ROUTES.ADMIN_INTERNSHIPS,
                        badge: 3
                    },
                    { 
                        text: 'System Analytics', 
                        icon: <AnalyticsIcon />, 
                        path: '/admin/analytics',
                        badge: 0
                    }
                ];
            
            default:
                return baseItems;
        }
    };

    const getDashboardPath = () => {
        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return APP_CONSTANTS.ROUTES.STUDENT_DASHBOARD;
            case APP_CONSTANTS.ROLES.RECRUITER:
                return APP_CONSTANTS.ROUTES.RECRUITER_DASHBOARD;
            case APP_CONSTANTS.ROLES.ADMIN:
                return APP_CONSTANTS.ROUTES.ADMIN_DASHBOARD;
            default:
                return '/';
        }
    };

    const getProfilePath = () => {
        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return APP_CONSTANTS.ROUTES.STUDENT_PROFILE;
            case APP_CONSTANTS.ROLES.RECRUITER:
                return '/recruiter/profile';
            default:
                return '/profile';
        }
    };

    const getRoleColor = () => {
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

    const getRoleIcon = () => {
        switch (role) {
            case APP_CONSTANTS.ROLES.STUDENT:
                return <SchoolIcon />;
            case APP_CONSTANTS.ROLES.RECRUITER:
                return <BusinessIcon />;
            case APP_CONSTANTS.ROLES.ADMIN:
                return <AdminIcon />;
            default:
                return <PersonIcon />;
        }
    };

    const menuItems = getMenuItems();

    const drawer = (
        <Box>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: getRoleColor() }}>
                        {getRoleIcon()}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {APP_CONSTANTS.APP_NAME}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            
            <Divider />
            
            {/* User Profile Section */}
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: getRoleColor(),
                        border: `3px solid ${getRoleColor()}`
                    }}
                >
                    <Typography variant="h4">{getUserInitials()}</Typography>
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {getUserDisplayName()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </Typography>
            </Box>
            
            <Divider />
            
            {/* Main Menu */}
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                mx: 1,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.50',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.100',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.badge > 0 ? (
                                    <Badge badgeContent={item.badge} color="error" size="small">
                                        {item.icon}
                                    </Badge>
                                ) : (
                                    item.icon
                                )}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Bottom Menu */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/notifications')}>
                        <ListItemIcon>
                            <Badge badgeContent={5} color="error" size="small">
                                <NotificationsIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Notifications" />
                    </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/settings')}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
                
                <ListItem disablePadding>
                    <ListItemButton onClick={logout} sx={{ color: 'error.main' }}>
                        <ListItemIcon sx={{ color: 'error.main' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth 
                    },
                }}
            >
                {drawer}
            </Drawer>
            
            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: open ? drawerWidth : theme.spacing(9),
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: 'hidden',
                        border: 'none',
                        boxShadow: 2
                    },
                }}
                open={open}
            >
                {drawer}
            </Drawer>
            
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${open ? drawerWidth : theme.spacing(9)}px)` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    backgroundColor: 'background.default',
                    minHeight: '100vh'
                }}
            >
                {/* Mobile Menu Button */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ 
                        mr: 2, 
                        mb: 2, 
                        display: { sm: 'none' },
                        position: 'fixed',
                        top: 16,
                        left: 16,
                        zIndex: 1100,
                        backgroundColor: 'background.paper',
                        boxShadow: 2
                    }}
                >
                    <MenuIcon />
                </IconButton>
                
                {/* Content */}
                <Box sx={{ mt: { xs: 6, sm: 0 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
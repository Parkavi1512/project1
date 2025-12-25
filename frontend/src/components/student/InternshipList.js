import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    IconButton,
    Pagination,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    useTheme,
    Tooltip
} from '@mui/material';
import {
    Search,
    FilterList,
    LocationOn,
    Business,
    Schedule,
    Star,
    Bookmark,
    BookmarkBorder,
    Share,
    ArrowForward,
    TrendingUp,
    Work
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { internshipAPI } from '../../services/api';
import MatchingService from '../../services/matching';
import { APP_CONSTANTS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const InternshipList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        type: '',
        category: '',
        duration: [1, 6],
        minStipend: 0,
        skills: []
    });
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');
    const [bookmarks, setBookmarks] = useState(new Set());
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    // Fetch internships
    const { data: internshipsData, isLoading, refetch } = useQuery({
        queryKey: ['internships', page, search, filters, sortBy],
        queryFn: async () => {
            const params = {
                page,
                limit: 12,
                search: search || undefined,
                ...filters
            };
            
            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === 0 || (Array.isArray(params[key]) && params[key].length === 0)) {
                    delete params[key];
                }
            });
            
            const response = await internshipAPI.getAll(params);
            return response.data.data;
        }
    });

    const internships = internshipsData?.internships || [];
    const pagination = internshipsData?.pagination;

    // Handle search
    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    // Handle filter change
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        setPage(1);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            location: '',
            type: '',
            category: '',
            duration: [1, 6],
            minStipend: 0,
            skills: []
        });
        setSearch('');
        setPage(1);
    };

    // Toggle bookmark
    const handleBookmark = (internshipId) => {
        const newBookmarks = new Set(bookmarks);
        if (newBookmarks.has(internshipId)) {
            newBookmarks.delete(internshipId);
        } else {
            newBookmarks.add(internshipId);
        }
        setBookmarks(newBookmarks);
    };

    // View internship details
    const handleViewDetails = (internship) => {
        setSelectedInternship(internship);
        setDetailDialogOpen(true);
    };

    // Apply for internship
    const handleApply = (internshipId) => {
        navigate(`/internships/${internshipId}/apply`);
    };

    // Calculate match score
    const calculateMatchScore = (internship) => {
        if (!user) return 0;
        return MatchingService.calculateMatchScore(user, internship);
    };

    // Get match color
    const getMatchColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const activeFilterCount = Object.values(filters).filter(val => 
        val !== '' && val !== 0 && (!Array.isArray(val) || val.length > 0)
    ).length;

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Browse Internships
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Discover internships that match your skills and interests
                </Typography>
            </Box>

            {/* Search and Filter Bar */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search internships by title, company, or skills..."
                            value={search}
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
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="relevance">Relevance</MenuItem>
                                <MenuItem value="latest">Latest</MenuItem>
                                <MenuItem value="deadline">Deadline</MenuItem>
                                <MenuItem value="stipend">Stipend (High to Low)</MenuItem>
                                <MenuItem value="match">Match Score</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            fullWidth
                            startIcon={<FilterList />}
                            variant={showFilters ? "contained" : "outlined"}
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{ height: '56px' }}
                        >
                            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                        </Button>
                    </Grid>
                </Grid>

                {/* Advanced Filters */}
                {showFilters && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Location</InputLabel>
                                    <Select
                                        value={filters.location}
                                        label="Location"
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                    >
                                        <MenuItem value="">All Locations</MenuItem>
                                        {APP_CONSTANTS.LOCATIONS.map((location) => (
                                            <MenuItem key={location} value={location}>
                                                {location}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Internship Type</InputLabel>
                                    <Select
                                        value={filters.type}
                                        label="Internship Type"
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                    >
                                        <MenuItem value="">All Types</MenuItem>
                                        {APP_CONSTANTS.INTERNSHIP_TYPES.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={filters.category}
                                        label="Category"
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {APP_CONSTANTS.JOB_CATEGORIES.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Min Stipend"
                                    type="number"
                                    value={filters.minStipend}
                                    onChange={(e) => handleFilterChange('minStipend', parseInt(e.target.value) || 0)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Duration: {filters.duration[0]} - {filters.duration[1]} months
                                </Typography>
                                <Slider
                                    value={filters.duration}
                                    onChange={(e, newValue) => handleFilterChange('duration', newValue)}
                                    valueLabelDisplay="auto"
                                    min={1}
                                    max={12}
                                    marks={[
                                        { value: 1, label: '1 month' },
                                        { value: 6, label: '6 months' },
                                        { value: 12, label: '1 year' }
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button onClick={handleClearFilters}>
                                        Clear All
                                    </Button>
                                    <Button variant="contained" onClick={() => setShowFilters(false)}>
                                        Apply Filters
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* Results Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    {pagination?.totalItems || 0} internships found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Page {page} of {pagination?.totalPages || 1}
                </Typography>
            </Box>

            {/* Internships Grid */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <LinearProgress sx={{ width: '50%' }} />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {internships.map((internship) => {
                            const matchScore = calculateMatchScore(internship);
                            
                            return (
                                <Grid item xs={12} sm={6} md={4} key={internship._id}>
                                    <Card 
                                        sx={{ 
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 8
                                            }
                                        }}
                                    >
                                        {/* Header */}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                        {internship.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Business fontSize="small" color="action" />
                                                        <Typography variant="body2">
                                                            {internship.companyName}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleBookmark(internship._id)}
                                                >
                                                    {bookmarks.has(internship._id) ? (
                                                        <Bookmark color="primary" />
                                                    ) : (
                                                        <BookmarkBorder />
                                                    )}
                                                </IconButton>
                                            </Box>

                                            {/* Match Score */}
                                            {matchScore > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Your Match
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold" color={getMatchColor(matchScore)}>
                                                            {matchScore}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={matchScore} 
                                                        sx={{ 
                                                            height: 6, 
                                                            borderRadius: 3,
                                                            backgroundColor: `${getMatchColor(matchScore)}.50`,
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: `${getMatchColor(matchScore)}.main`
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}

                                            {/* Details */}
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                                <Chip
                                                    icon={<LocationOn fontSize="small" />}
                                                    label={internship.location}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={internship.internshipType}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    icon={<Schedule fontSize="small" />}
                                                    label={`${internship.duration?.value} ${internship.duration?.unit}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>

                                            {/* Stipend */}
                                            {internship.stipend?.amount && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Stipend
                                                    </Typography>
                                                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                                                        ${internship.stipend.amount.toLocaleString()}
                                                        {internship.stipend.frequency && (
                                                            <Typography component="span" variant="body2" color="text.secondary">
                                                                /{internship.stipend.frequency}
                                                            </Typography>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Skills */}
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Required Skills
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {internship.requiredSkills?.slice(0, 3).map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill.skill}
                                                            size="small"
                                                        />
                                                    ))}
                                                    {internship.requiredSkills?.length > 3 && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            +{internship.requiredSkills.length - 3} more
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>

                                            {/* Deadline */}
                                            {internship.applicationDeadline && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday fontSize="small" color="action" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Apply by {new Date(internship.applicationDeadline).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>

                                        {/* Actions */}
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                size="small"
                                                onClick={() => handleViewDetails(internship)}
                                                sx={{ flexGrow: 1 }}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleApply(internship._id)}
                                            >
                                                Apply
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* No Results */}
                    {internships.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No internships found
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Try adjusting your search or filters to find more opportunities
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleClearFilters}
                            >
                                Clear All Filters
                            </Button>
                        </Box>
                    )}

                    {/* Pagination */}
                    {pagination?.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={pagination.totalPages}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Quick Stats */}
            <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h5" fontWeight="bold">
                                {pagination?.totalItems || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Internships
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h5" fontWeight="bold">
                                {internships.filter(i => calculateMatchScore(i) >= 80).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Excellent Matches
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Business sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                            <Typography variant="h5" fontWeight="bold">
                                24
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                New Today
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Bookmark sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                            <Typography variant="h5" fontWeight="bold">
                                {bookmarks.size}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Saved Internships
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Internship Detail Dialog */}
            <Dialog 
                open={detailDialogOpen} 
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedInternship && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5" fontWeight="bold">
                                {selectedInternship.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Business fontSize="small" color="action" />
                                <Typography variant="body1">
                                    {selectedInternship.companyName}
                                </Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                        <Chip
                                            icon={<LocationOn />}
                                            label={selectedInternship.location}
                                            size="medium"
                                        />
                                        <Chip
                                            label={selectedInternship.internshipType}
                                            size="medium"
                                            color="primary"
                                        />
                                        <Chip
                                            icon={<Schedule />}
                                            label={`${selectedInternship.duration?.value} ${selectedInternship.duration?.unit}`}
                                            size="medium"
                                        />
                                        {selectedInternship.stipend?.amount && (
                                            <Chip
                                                label={`$${selectedInternship.stipend.amount.toLocaleString()}`}
                                                size="medium"
                                                color="success"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {selectedInternship.description}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>
                                        Responsibilities
                                    </Typography>
                                    <List>
                                        {selectedInternship.responsibilities?.map((resp, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CheckCircle color="success" />
                                                </ListItemIcon>
                                                <ListItemText primary={resp} />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Typography variant="h6" gutterBottom>
                                        Requirements
                                    </Typography>
                                    <List>
                                        {selectedInternship.requirements?.map((req, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <CheckCircle color="primary" />
                                                </ListItemIcon>
                                                <ListItemText primary={req} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card sx={{ borderRadius: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Quick Details
                                            </Typography>
                                            
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Application Deadline
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedInternship.applicationDeadline 
                                                        ? new Date(selectedInternship.applicationDeadline).toLocaleDateString()
                                                        : 'Rolling Basis'
                                                    }
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Start Date
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedInternship.startDate 
                                                        ? new Date(selectedInternship.startDate).toLocaleDateString()
                                                        : 'Flexible'
                                                    }
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Positions Available
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedInternship.positionsAvailable}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Category
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedInternship.category || 'General'}
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Required Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selectedInternship.requiredSkills?.map((skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill.skill}
                                                        size="small"
                                                        color={skill.proficiency === 'required' ? 'error' : 'default'}
                                                    />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 0 }}>
                            <Button onClick={() => setDetailDialogOpen(false)}>
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDetailDialogOpen(false);
                                    handleApply(selectedInternship._id);
                                }}
                            >
                                Apply Now
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default InternshipList;
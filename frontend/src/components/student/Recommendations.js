import React, { useState } from 'react';
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
    LinearProgress,
    Tabs,
    Tab,
    Paper,
    useTheme,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Star,
    TrendingUp,
    Business,
    LocationOn,
    Schedule,
    Bookmark,
    BookmarkBorder,
    Share,
    FilterList,
    Refresh,
    Warning
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { internshipAPI } from '../../services/api';
import MatchingService from '../../services/matching';
import { APP_CONSTANTS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    // State
    const [tabValue, setTabValue] = useState(0);
    const [bookmarks, setBookmarks] = useState(new Set());
    const [filter, setFilter] = useState('all'); // all, high, medium, low

    // Fetch recommendations
    const { data: recommendations, isLoading, error, refetch } = useQuery({
        queryKey: ['student-recommendations'],
        queryFn: async () => {
            const response = await internshipAPI.getRecommendations(20);
            return response.data.data;
        }
    });

    // Filter recommendations based on match score
    const filteredRecommendations = recommendations?.filter(rec => {
        if (filter === 'all') return true;
        if (filter === 'high') return rec.score >= 80;
        if (filter === 'medium') return rec.score >= 60 && rec.score < 80;
        if (filter === 'low') return rec.score < 60;
        return true;
    }) || [];

    // Group recommendations by match score
    const highMatches = filteredRecommendations.filter(r => r.score >= 80);
    const mediumMatches = filteredRecommendations.filter(r => r.score >= 60 && r.score < 80);
    const lowMatches = filteredRecommendations.filter(r => r.score < 60);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleBookmark = (internshipId) => {
        const newBookmarks = new Set(bookmarks);
        if (newBookmarks.has(internshipId)) {
            newBookmarks.delete(internshipId);
        } else {
            newBookmarks.add(internshipId);
        }
        setBookmarks(newBookmarks);
    };

    const handleApply = (internshipId) => {
        navigate(`/internships/${internshipId}/apply`);
    };

    const handleViewDetails = (internshipId) => {
        navigate(`/internships/${internshipId}`);
    };

    const getMatchColor = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const getMatchLabel = (score) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 70) return 'Good Match';
        if (score >= 60) return 'Fair Match';
        return 'Poor Match';
    };

    const RecommendationCard = ({ recommendation }) => {
        const internship = recommendation.internship;
        const matchScore = recommendation.score;
        const matchBreakdown = recommendation.matchDetails;

        return (
            <Card 
                sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    border: `2px solid ${theme.palette[getMatchColor(matchScore)].main}`,
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8
                    },
                    transition: 'all 0.2s'
                }}
            >
                {/* Match Score Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -12,
                        right: 16,
                        zIndex: 1
                    }}
                >
                    <Chip
                        label={`${matchScore}% Match`}
                        color={getMatchColor(matchScore)}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            height: 24
                        }}
                    />
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                    {/* Title and Company */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {internship.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Business fontSize="small" color="action" />
                        <Typography variant="body1">
                            {internship.companyName}
                        </Typography>
                    </Box>

                    {/* Match Breakdown */}
                    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: 'background.default' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Match Breakdown
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Skills
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(matchBreakdown?.skillMatch || 0) * 100} 
                                    sx={{ 
                                        height: 4, 
                                        mt: 0.5,
                                        backgroundColor: 'success.50',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'success.main'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Location
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(matchBreakdown?.locationMatch || 0) * 100} 
                                    sx={{ 
                                        height: 4, 
                                        mt: 0.5,
                                        backgroundColor: 'primary.50',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'primary.main'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Duration
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(matchBreakdown?.durationMatch || 0) * 100} 
                                    sx={{ 
                                        height: 4, 
                                        mt: 0.5,
                                        backgroundColor: 'warning.50',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'warning.main'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="text.secondary">
                                    Type
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(matchBreakdown?.interestMatch || 0) * 100} 
                                    sx={{ 
                                        height: 4, 
                                        mt: 0.5,
                                        backgroundColor: 'info.50',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: 'info.main'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

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
                            Key Skills Required
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {internship.requiredSkills?.slice(0, 4).map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill.skill}
                                    size="small"
                                    color={skill.proficiency === 'required' ? 'error' : 'default'}
                                />
                            ))}
                            {internship.requiredSkills?.length > 4 && (
                                <Typography variant="caption" color="text.secondary">
                                    +{internship.requiredSkills.length - 4} more
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Why it's a good match */}
                    <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: `${getMatchColor(matchScore)}.50` }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color={`${getMatchColor(matchScore)}.main`}>
                            Why this is a {getMatchLabel(matchScore).toLowerCase()}
                        </Typography>
                        <Typography variant="body2">
                            {matchScore >= 80 
                                ? 'Your skills and preferences align perfectly with this internship.'
                                : matchScore >= 60
                                ? 'Your profile matches most of the key requirements.'
                                : 'Some skills may need development for this role.'
                            }
                        </Typography>
                    </Paper>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
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
                        <Button
                            size="small"
                            onClick={() => handleViewDetails(internship._id)}
                            sx={{ flexGrow: 1 }}
                        >
                            View Details
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleApply(internship._id)}
                        >
                            Apply Now
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load recommendations. Please try again.
                </Alert>
                <Button
                    startIcon={<Refresh />}
                    onClick={() => refetch()}
                    variant="contained"
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Your Recommendations
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Internships matched to your skills and preferences
                        </Typography>
                    </Box>
                    <Button
                        startIcon={<Refresh />}
                        onClick={() => refetch()}
                        variant="outlined"
                    >
                        Refresh
                    </Button>
                </Box>

                {/* Stats */}
                <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Star sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold" color="success.main">
                                    {highMatches.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Excellent Matches
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold" color="warning.main">
                                    {mediumMatches.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Good Matches
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Business sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold">
                                    {filteredRecommendations.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Matches
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Warning sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold" color="error.main">
                                    {lowMatches.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Needs Improvement
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 4, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            fontWeight: 600
                        }
                    }}
                >
                    <Tab 
                        label={`All Recommendations (${filteredRecommendations.length})`}
                        icon={<Star />}
                        iconPosition="start"
                    />
                    <Tab 
                        label={`Excellent Matches (${highMatches.length})`}
                        icon={<Star color="success" />}
                        iconPosition="start"
                    />
                    <Tab 
                        label={`Good Matches (${mediumMatches.length})`}
                        icon={<TrendingUp color="warning" />}
                        iconPosition="start"
                    />
                    <Tab 
                        label={`Other Matches (${lowMatches.length})`}
                        icon={<Warning color="error" />}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Filter Bar */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterList color="action" />
                <Typography variant="body2" color="text.secondary">
                    Filter by:
                </Typography>
                <Chip
                    label="All"
                    variant={filter === 'all' ? 'filled' : 'outlined'}
                    onClick={() => setFilter('all')}
                />
                <Chip
                    label="High Match (80%+)"
                    variant={filter === 'high' ? 'filled' : 'outlined'}
                    color="success"
                    onClick={() => setFilter('high')}
                />
                <Chip
                    label="Medium Match (60-80%)"
                    variant={filter === 'medium' ? 'filled' : 'outlined'}
                    color="warning"
                    onClick={() => setFilter('medium')}
                />
                <Chip
                    label="Low Match (<60%)"
                    variant={filter === 'low' ? 'filled' : 'outlined'}
                    color="error"
                    onClick={() => setFilter('low')}
                />
            </Paper>

            {/* Recommendations Grid */}
            {filteredRecommendations.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
                    <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        No recommendations found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {filter !== 'all' 
                            ? 'No internships match your current filter. Try a different filter.'
                            : 'Complete your profile and add more skills to get personalized recommendations.'
                        }
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => filter !== 'all' ? setFilter('all') : navigate('/student/profile')}
                    >
                        {filter !== 'all' ? 'Show All Recommendations' : 'Complete Profile'}
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {/* Display recommendations based on selected tab */}
                    {(tabValue === 0 ? filteredRecommendations :
                      tabValue === 1 ? highMatches :
                      tabValue === 2 ? mediumMatches : lowMatches).map((recommendation) => (
                        <Grid item xs={12} md={6} lg={4} key={recommendation.internship._id}>
                            <RecommendationCard recommendation={recommendation} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Tips for Better Matches */}
            <Paper sx={{ p: 3, mt: 4, borderRadius: 2, backgroundColor: 'info.50', border: '1px solid', borderColor: 'info.100' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    Tips to Improve Your Matches
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                                <Star />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Add More Skills
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    The more skills you add, the better our algorithm can match you with relevant internships.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                                <TrendingUp />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Update Your Resume
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Uploading your resume helps us extract additional skills and experiences.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                                <LocationOn />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Specify Preferences
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Clearly define your location preferences and internship types for better matches.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                                <Business />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    Apply to Matches
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    The more you apply, the better our algorithm understands your preferences.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Algorithm Explanation */}
            <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    How Our Matching Algorithm Works
                </Typography>
                <Typography variant="body1" paragraph>
                    Our intelligent matching algorithm analyzes multiple factors to provide you with the most relevant internship recommendations:
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" color="success.main" fontWeight="bold">
                                40%
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Skill Matching
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Matches your skills with internship requirements
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" color="primary.main" fontWeight="bold">
                                30%
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Location & Type
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Considers your preferred locations and work types
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" color="warning.main" fontWeight="bold">
                                20%
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Duration Fit
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Matches internship duration with your availability
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h2" color="info.main" fontWeight="bold">
                                10%
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Interests & Goals
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Aligns with your career interests and goals
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Recommendations;
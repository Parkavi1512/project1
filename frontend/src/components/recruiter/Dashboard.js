import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, 
  CardContent, Button, LinearProgress, Chip
} from '@mui/material';
import { 
  Business, People, Work, TrendingUp,
  AddCircle, Description, Notifications
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeInternships: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [recentInternships, setRecentInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/recruiter/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setRecentInternships(response.data.recentInternships);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'scale(1.02)' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '12px',
              p: 1,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Recruiter Dashboard
      </Typography>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => navigate('/recruiter/post-internship')}
            >
              Post New Internship
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<People />}
              onClick={() => navigate('/recruiter/applications')}
            >
              View Applications
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Description />}
              onClick={() => navigate('/recruiter/internships')}
            >
              Manage Internships
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Internships"
            value={stats.totalInternships}
            icon={<Work color="primary" />}
            color="#1976d2"
            onClick={() => navigate('/recruiter/internships')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Internships"
            value={stats.activeInternships}
            icon={<Business color="success" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={<People color="secondary" />}
            color="#9c27b0"
            onClick={() => navigate('/recruiter/applications')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Review"
            value={stats.pendingApplications}
            icon={<Notifications color="warning" />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Recent Internships */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Recent Internships</Typography>
          <Button onClick={() => navigate('/recruiter/internships')}>
            View All
          </Button>
        </Box>
        <Grid container spacing={2}>
          {recentInternships.map((internship) => (
            <Grid item xs={12} md={6} key={internship._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {internship.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {internship.company} • {internship.location}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={internship.type} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${internship.applications} applications`} 
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small"
                      onClick={() => navigate(`/recruiter/internship/${internship._id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recent Activity Placeholder */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your recent activities will appear here...
        </Typography>
      </Paper>
    </Box>
  );
};

export default RecruiterDashboard;
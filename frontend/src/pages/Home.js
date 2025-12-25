import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import { Work, School, TrendingUp, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 10,
        background: 'linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)',
        borderRadius: 3,
        color: 'white',
        mb: 6,
        px: 3
      }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Find Your Dream Internship
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          AI-powered matching connects students with perfect internship opportunities
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{ 
            bgcolor: 'white', 
            color: '#1976d2',
            fontSize: '1.1rem',
            py: 1.5,
            px: 4,
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Box>

      {/* Features */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
            <Work sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Upload Resume
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your resume and let our AI extract your skills automatically
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
            <TrendingUp sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Smart Matching
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get personalized internship recommendations based on your skills and preferences
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
            <School sx={{ fontSize: 50, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Track Applications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all your applications in one place with real-time status updates
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Demo Preview */}
      <Card sx={{ mb: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            See How It Works
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                bgcolor: '#f0f8ff', 
                borderRadius: 2,
                border: '2px dashed #1976d2'
              }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  📄 Upload Your Resume
                </Typography>
                <Typography paragraph>
                  1. Upload PDF/DOCX resume
                </Typography>
                <Typography paragraph>
                  2. AI extracts your skills automatically
                </Typography>
                <Typography paragraph>
                  3. Get your skill profile
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                bgcolor: '#e8f5e9', 
                borderRadius: 2,
                border: '2px dashed #2e7d32'
              }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  🎯 Get Matched Internships
                </Typography>
                <Typography paragraph>
                  1. View internships matching your skills
                </Typography>
                <Typography paragraph>
                  2. See match percentage for each
                </Typography>
                <Typography paragraph>
                  3. Apply with one click
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Join thousands of students who found their dream internships through our platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}
        >
          Start Matching Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
import React from 'react';
import {
  Box, Container, Typography, Grid, Paper,
  Card, CardContent, Avatar, List, ListItem,
  ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  CheckCircle, People, School, Security,
  TrendingUp, Visibility, Diversity3, Handshake
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former HR Director with 10+ years experience in talent acquisition"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "AI/ML expert specializing in recommendation systems"
    },
    {
      name: "Priya Sharma",
      role: "Head of Partnerships",
      bio: "Connects students with leading tech companies"
    },
    {
      name: "David Wilson",
      role: "Student Success",
      bio: "Career counselor dedicated to student development"
    }
  ];

  const values = [
    {
      icon: <People />,
      title: "Student-First Approach",
      description: "We prioritize student success and career growth above all else"
    },
    {
      icon: <Security />,
      title: "Trust & Safety",
      description: "Verified companies and secure application process"
    },
    {
      icon: <Diversity3 />,
      title: "Inclusivity",
      description: "Equal opportunities for students from all backgrounds"
    },
    {
      icon: <TrendingUp />,
      title: "Innovation",
      description: "Continuous improvement through technology and feedback"
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            About Internship Matcher
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, opacity: 0.9 }}>
            Bridging the gap between talented students and innovative companies through intelligent matching
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              At Internship Matcher, we believe every student deserves access to meaningful internship 
              opportunities that align with their skills and career aspirations.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              Our platform leverages advanced AI algorithms to connect students with companies 
              that value their unique talents, creating win-win partnerships that drive innovation 
              and career growth.
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Democratize internship opportunities"
                  secondary="Making quality internships accessible to all students"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Streamline the hiring process"
                  secondary="Reducing time-to-hire for companies and applications for students"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Build career-ready talent"
                  secondary="Equipping students with skills and experiences for future success"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                What We Do
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" paragraph>
                  • <strong>AI-Powered Matching:</strong> Our algorithms analyze skills, interests, and company needs
                </Typography>
                <Typography variant="body1" paragraph>
                  • <strong>Skill Development:</strong> Resources and guidance to enhance employability
                </Typography>
                <Typography variant="body1" paragraph>
                  • <strong>Career Support:</strong> Resume building, interview preparation, and mentorship
                </Typography>
                <Typography variant="body1" paragraph>
                  • <strong>Company Partnerships:</strong> Connecting with innovative companies across industries
                </Typography>
                <Typography variant="body1" paragraph>
                  • <strong>Application Tracking:</strong> Centralized dashboard for managing all applications
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Our Values
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            The principles that guide everything we do
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: 'primary.main', fontSize: 40, mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          Meet Our Team
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          Passionate professionals dedicated to your success
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.bio}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Impact Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Making an Impact
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Since our founding, we've helped thousands of students launch their careers
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Our success stories include students from diverse backgrounds who have gone on 
                to work at leading companies like Google, Microsoft, Amazon, and innovative startups.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Typography variant="h5" gutterBottom>
                  Success Metrics
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="h4" fontWeight="bold">95%</Typography>
                    <Typography variant="body2">Student Satisfaction</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" fontWeight="bold">85%</Typography>
                    <Typography variant="body2">Conversion Rate</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" fontWeight="bold">4.8/5</Typography>
                    <Typography variant="body2">Company Rating</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" fontWeight="bold">30%</Typography>
                    <Typography variant="body2">Return Interns</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact CTA */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Want to learn more about our platform?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We're always happy to answer questions or discuss partnerships
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
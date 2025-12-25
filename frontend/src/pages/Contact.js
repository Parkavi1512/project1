import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper,
  TextField, Button, Alert, Snackbar,
  Card, CardContent, Divider, Stack
} from '@mui/material';
import {
  Email, Phone, LocationOn, Send,
  CheckCircle, Business, Schedule
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Contact = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required'),
    category: Yup.string().required('Please select a category')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Contact form submitted:', values);
        setSubmitSuccess(true);
        resetForm();
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    }
  });

  const contactInfo = [
    {
      icon: <Email />,
      title: "Email",
      details: ["support@internshipmatcher.com", "partnerships@internshipmatcher.com"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: <Phone />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Monday to Friday, 9AM - 6PM EST"
    },
    {
      icon: <LocationOn />,
      title: "Office",
      details: ["123 Tech Street", "San Francisco, CA 94107"],
      description: "Visit us during business hours"
    }
  ];

  const faqs = [
    {
      question: "How do I get started as a student?",
      answer: "Simply create an account, complete your profile with skills and preferences, and start browsing matched internships."
    },
    {
      question: "How can companies post internships?",
      answer: "Companies need to register as recruiters, verify their business, and can then post internships through our dashboard."
    },
    {
      question: "Is there a cost for students?",
      answer: "No, our platform is completely free for students. We believe in providing equal opportunities to all."
    },
    {
      question: "How does the matching algorithm work?",
      answer: "Our AI analyzes skills, experience, preferences, and company requirements to provide the best matches."
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, opacity: 0.9 }}>
            Have questions? We're here to help! Reach out to our team for support or partnership inquiries.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Send Us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Your Name *"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Category *"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      error={formik.touched.category && Boolean(formik.errors.category)}
                      helperText={formik.touched.category && formik.errors.category}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="student">Student Support</option>
                      <option value="recruiter">Recruiter Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Subject *"
                      name="subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      error={formik.touched.subject && Boolean(formik.errors.subject)}
                      helperText={formik.touched.subject && formik.errors.subject}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message *"
                      name="message"
                      multiline
                      rows={6}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      disabled={loading}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* FAQ Section */}
            <Paper sx={{ p: 4, mt: 4 }}>
              <Typography variant="h4" gutterBottom>
                Frequently Asked Questions
              </Typography>
              <Stack spacing={3} sx={{ mt: 3 }}>
                {faqs.map((faq, index) => (
                  <Box key={index}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                    {index < faqs.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Choose your preferred method of contact or visit our office.
              </Typography>

              <Stack spacing={4} sx={{ mt: 4 }}>
                {contactInfo.map((info, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ color: 'primary.main', mr: 2 }}>
                          {info.icon}
                        </Box>
                        <Typography variant="h6">
                          {info.title}
                        </Typography>
                      </Box>
                      <Stack spacing={0.5}>
                        {info.details.map((detail, i) => (
                          <Typography key={i} variant="body1">
                            {detail}
                          </Typography>
                        ))}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {info.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              {/* Office Hours */}
              <Card sx={{ mt: 4, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Schedule color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6">
                      Office Hours
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        Monday - Friday
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        9:00 AM - 6:00 PM EST
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        Saturday - Sunday
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Closed
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card sx={{ mt: 4, borderColor: 'warning.main' }}>
                <CardContent>
                  <Typography variant="h6" color="warning.main" gutterBottom>
                    Need Immediate Assistance?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    For urgent technical issues affecting your account, email us at:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    urgent@internshipmatcher.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    We prioritize these requests and aim to respond within 2 hours during business hours.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSubmitSuccess(false)}
          severity="success"
          icon={<CheckCircle />}
          sx={{ width: '100%' }}
        >
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
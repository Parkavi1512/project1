import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Grid, FormControl, InputLabel, Select, MenuItem,
  Chip, IconButton, LinearProgress, Alert
} from '@mui/material';
import { Add, Delete, Save, Upload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const PostInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [success, setSuccess] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    company: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    type: Yup.string().required('Internship type is required'),
    duration: Yup.number().min(1, 'Duration must be at least 1 month'),
    stipend: Yup.number().min(0, 'Stipend cannot be negative'),
    description: Yup.string().required('Description is required'),
    responsibilities: Yup.string().required('Responsibilities are required'),
    requirements: Yup.string().required('Requirements are required'),
    deadline: Yup.date().min(new Date(), 'Deadline must be in the future')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      company: '',
      location: '',
      type: 'full-time',
      duration: 3,
      stipend: 0,
      description: '',
      responsibilities: '',
      requirements: '',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remote: false,
      positions: 1
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const data = {
          ...values,
          skills,
          deadline: new Date(values.deadline)
        };

        await axios.post(`${API_URL}/recruiter/internships`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/recruiter/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error posting internship:', error);
        alert('Failed to post internship. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter(skill => skill !== skillToDelete));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Post New Internship
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Internship posted successfully! Redirecting...
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Internship Title *"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name *"
                name="company"
                value={formik.values.company}
                onChange={formik.handleChange}
                error={formik.touched.company && Boolean(formik.errors.company)}
                helperText={formik.touched.company && formik.errors.company}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location *"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Internship Type *</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  label="Internship Type *"
                >
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Duration and Stipend */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (months)"
                name="duration"
                type="number"
                value={formik.values.duration}
                onChange={formik.handleChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stipend (per month)"
                name="stipend"
                type="number"
                value={formik.values.stipend}
                onChange={formik.handleChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Skills */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add a skill"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="small"
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddSkill}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    deleteIcon={<Delete />}
                  />
                ))}
              </Box>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            {/* Responsibilities */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Responsibilities *"
                name="responsibilities"
                multiline
                rows={4}
                value={formik.values.responsibilities}
                onChange={formik.handleChange}
                error={formik.touched.responsibilities && Boolean(formik.errors.responsibilities)}
                helperText={formik.touched.responsibilities && formik.errors.responsibilities}
                placeholder="Enter each responsibility on a new line"
              />
            </Grid>

            {/* Requirements */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Requirements *"
                name="requirements"
                multiline
                rows={4}
                value={formik.values.requirements}
                onChange={formik.handleChange}
                error={formik.touched.requirements && Boolean(formik.errors.requirements)}
                helperText={formik.touched.requirements && formik.errors.requirements}
                placeholder="Enter each requirement on a new line"
              />
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Positions"
                name="positions"
                type="number"
                value={formik.values.positions}
                onChange={formik.handleChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formik.values.deadline}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/recruiter/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Internship'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};

export default PostInternship;
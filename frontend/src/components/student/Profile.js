import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Chip,
    Avatar,
    Divider,
    Stepper,
    Step,
    StepLabel,
    LinearProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    CircularProgress
} from '@mui/material';
import {
    Edit,
    Save,
    Cancel,
    Add,
    Delete,
    Upload,
    Download,
    School,
    Work,
    LocationOn,
    Schedule,
    CheckCircle,
    Warning,
    Person,
    Email,
    Phone,
    CalendarToday
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI } from '../../services/api';
import SkillInput from '../common/SkillInput';
import { APP_CONSTANTS } from '../../utils/constants';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfile = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { updateProfile } = useAuth();
    
    // State
    const [editMode, setEditMode] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch student profile
    const { data: profile, isLoading } = useQuery({
        queryKey: ['student-profile'],
        queryFn: async () => {
            const response = await studentAPI.getProfile();
            return response.data.data;
        }
    });

    // Mutation for updating profile
    const updateProfileMutation = useMutation({
        mutationFn: (profileData) => studentAPI.updateProfile(profileData),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['student-profile']);
            queryClient.invalidateQueries(['student-dashboard']);
            updateProfile(data.data);
            setEditMode(false);
        }
    });

    // Mutation for uploading resume
    const uploadResumeMutation = useMutation({
        mutationFn: (formData) => studentAPI.uploadResume(formData),
        onSuccess: () => {
            queryClient.invalidateQueries(['student-profile']);
            setUploadDialogOpen(false);
            setResumeFile(null);
        }
    });

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: profile || {}
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: (acceptedFiles) => {
            setResumeFile(acceptedFiles[0]);
        }
    });

    const steps = ['Basic Info', 'Education', 'Skills', 'Preferences'];

    const handleEdit = () => {
        reset(profile);
        setEditMode(true);
    };

    const handleCancel = () => {
        reset(profile);
        setEditMode(false);
    };

    const onSubmit = (data) => {
        updateProfileMutation.mutate(data);
    };

    const handleUploadResume = () => {
        if (!resumeFile) return;
        
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        setUploading(true);
        uploadResumeMutation.mutate(formData, {
            onSettled: () => setUploading(false)
        });
    };

    const calculateProfileCompleteness = () => {
        if (!profile) return 0;
        
        let score = 0;
        const requiredFields = [
            profile.firstName,
            profile.lastName,
            profile.university,
            profile.major,
            profile.graduationYear,
            profile.skills?.length > 0,
            profile.resumeUrl
        ];
        
        score = (requiredFields.filter(Boolean).length / requiredFields.length) * 100;
        return Math.round(score);
    };

    const getProficiencyColor = (proficiency) => {
        switch (proficiency) {
            case 'expert': return 'error';
            case 'advanced': return 'warning';
            case 'intermediate': return 'info';
            default: return 'success';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        My Profile
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your profile information and settings
                    </Typography>
                </Box>
                
                {!editMode ? (
                    <Button
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        variant="contained"
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            startIcon={<Cancel />}
                            onClick={handleCancel}
                            variant="outlined"
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button
                            startIcon={<Save />}
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                            disabled={updateProfileMutation.isLoading}
                        >
                            {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Profile Completeness */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Profile Completeness
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Complete your profile to unlock all features
                        </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                        {calculateProfileCompleteness()}%
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={calculateProfileCompleteness()} 
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                />
                
                {calculateProfileCompleteness() < 100 && (
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        Complete your profile to get better internship matches and recommendations
                    </Alert>
                )}
            </Paper>

            <Grid container spacing={3}>
                {/* Left Column - Profile Form */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            {/* Step 1: Basic Info */}
                            {activeStep === 0 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            rules={{ required: 'First name is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="First Name"
                                                    disabled={!editMode}
                                                    error={!!errors.firstName}
                                                    helperText={errors.firstName?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            rules={{ required: 'Last name is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Last Name"
                                                    disabled={!editMode}
                                                    error={!!errors.lastName}
                                                    helperText={errors.lastName?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Email"
                                                    disabled
                                                    InputProps={{
                                                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Phone Number"
                                                    disabled={!editMode}
                                                    InputProps={{
                                                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="graduationYear"
                                            control={control}
                                            rules={{ 
                                                required: 'Graduation year is required',
                                                min: { value: new Date().getFullYear(), message: 'Year cannot be in the past' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Graduation Year"
                                                    type="number"
                                                    disabled={!editMode}
                                                    error={!!errors.graduationYear}
                                                    helperText={errors.graduationYear?.message}
                                                    InputProps={{
                                                        startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {/* Step 2: Education */}
                            {activeStep === 1 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="university"
                                            control={control}
                                            rules={{ required: 'University is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    select
                                                    label="University"
                                                    disabled={!editMode}
                                                    error={!!errors.university}
                                                    helperText={errors.university?.message}
                                                    SelectProps={{
                                                        native: true
                                                    }}
                                                    InputProps={{
                                                        startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                >
                                                    <option value=""></option>
                                                    {APP_CONSTANTS.UNIVERSITIES.map((univ) => (
                                                        <option key={univ} value={univ}>{univ}</option>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="major"
                                            control={control}
                                            rules={{ required: 'Major is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    select
                                                    label="Major/Stream"
                                                    disabled={!editMode}
                                                    error={!!errors.major}
                                                    helperText={errors.major?.message}
                                                    SelectProps={{
                                                        native: true
                                                    }}
                                                >
                                                    <option value=""></option>
                                                    {APP_CONSTANTS.MAJORS.map((major) => (
                                                        <option key={major} value={major}>{major}</option>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="degree"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    select
                                                    label="Degree"
                                                    disabled={!editMode}
                                                    SelectProps={{
                                                        native: true
                                                    }}
                                                >
                                                    <option value=""></option>
                                                    {APP_CONSTANTS.DEGREES.map((degree) => (
                                                        <option key={degree} value={degree}>{degree}</option>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="gpa"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="GPA"
                                                    type="number"
                                                    step="0.01"
                                                    disabled={!editMode}
                                                    inputProps={{
                                                        min: 0,
                                                        max: 4.0,
                                                        step: 0.01
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {/* Step 3: Skills */}
                            {activeStep === 2 && editMode && (
                                <Box>
                                    <Controller
                                        name="skills"
                                        control={control}
                                        render={({ field }) => (
                                            <SkillInput
                                                skills={field.value || []}
                                                onChange={field.onChange}
                                                disabled={!editMode}
                                            />
                                        )}
                                    />
                                </Box>
                            )}

                            {activeStep === 2 && !editMode && profile?.skills && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Skills ({profile.skills.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                        {profile.skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={`${skill.name} (${skill.proficiency})`}
                                                color={getProficiencyColor(skill.proficiency)}
                                                variant="outlined"
                                                size="medium"
                                            />
                                        ))}
                                    </Box>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="h6" gutterBottom>
                                        Interests
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {profile.interests?.map((interest, index) => (
                                            <Chip key={index} label={interest} />
                                        )) || (
                                            <Typography variant="body2" color="text.secondary">
                                                No interests added yet
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}

                            {/* Step 4: Preferences */}
                            {activeStep === 3 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="preferredLocations"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    select
                                                    SelectProps={{
                                                        multiple: true,
                                                        native: true
                                                    }}
                                                    label="Preferred Locations"
                                                    disabled={!editMode}
                                                    InputProps={{
                                                        startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                                                    }}
                                                >
                                                    <option value=""></option>
                                                    {APP_CONSTANTS.LOCATIONS.map((location) => (
                                                        <option key={location} value={location}>{location}</option>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="preferredInternshipTypes"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    select
                                                    SelectProps={{
                                                        multiple: true,
                                                        native: true
                                                    }}
                                                    label="Internship Types"
                                                    disabled={!editMode}
                                                >
                                                    <option value=""></option>
                                                    {APP_CONSTANTS.INTERNSHIP_TYPES.map((type) => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="careerGoals"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Career Goals"
                                                    multiline
                                                    rows={3}
                                                    disabled={!editMode}
                                                    placeholder="Enter your career goals..."
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {/* Navigation Buttons */}
                            {editMode && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={() => setActiveStep(activeStep - 1)}
                                    >
                                        Back
                                    </Button>
                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={updateProfileMutation.isLoading}
                                        >
                                            {updateProfileMutation.isLoading ? 'Saving...' : 'Save Profile'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={() => setActiveStep(activeStep + 1)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column - Resume & Stats */}
                <Grid item xs={12} md={4}>
                    {/* Resume Card */}
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.50', mr: 2 }}>
                                    <Download sx={{ color: 'primary.main' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Resume
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Upload your resume for better matching
                                    </Typography>
                                </Box>
                            </Box>

                            {profile?.resumeUrl ? (
                                <Box>
                                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                        Resume uploaded successfully
                                    </Alert>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Download />}
                                        href={profile.resumeUrl}
                                        target="_blank"
                                    >
                                        View Resume
                                    </Button>
                                </Box>
                            ) : (
                                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                    No resume uploaded yet
                                </Alert>
                            )}

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<Upload />}
                                onClick={() => setUploadDialogOpen(true)}
                                sx={{ mt: 1 }}
                            >
                                {profile?.resumeUrl ? 'Update Resume' : 'Upload Resume'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Profile Stats */}
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Profile Stats
                            </Typography>
                            
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <School color="primary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Profile Views"
                                        secondary="45 this month"
                                    />
                                </ListItem>
                                
                                <ListItem>
                                    <ListItemIcon>
                                        <Work color="secondary" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Match Score"
                                        secondary={`${profile?.profileScore || 0}/100`}
                                    />
                                </ListItem>
                                
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle color="success" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Profile Strength"
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={calculateProfileCompleteness()} 
                                                    sx={{ flexGrow: 1, height: 6 }}
                                                />
                                                <Typography variant="body2">
                                                    {calculateProfileCompleteness()}%
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarToday color="warning" />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Last Updated"
                                        secondary={profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Never'}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card sx={{ mt: 3, borderRadius: 2, backgroundColor: 'primary.50' }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary.main">
                                Quick Actions
                            </Typography>
                            
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                                onClick={() => window.open('/student/recommendations', '_blank')}
                            >
                                View Recommendations
                            </Button>
                            
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                                onClick={() => window.open('/student/applications', '_blank')}
                            >
                                Check Applications
                            </Button>
                            
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => window.open('/student/internships', '_blank')}
                            >
                                Browse Internships
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Resume Upload Dialog */}
            <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Upload Resume
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                borderRadius: 2,
                                p: 4,
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isDragActive ? 'primary.50' : 'background.default',
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            <input {...getInputProps()} />
                            <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            {isDragActive ? (
                                <Typography variant="body1" color="primary.main">
                                    Drop the file here...
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="body1" gutterBottom>
                                        Drag & drop your resume here, or click to select
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Supported formats: PDF, DOC, DOCX (Max 5MB)
                                    </Typography>
                                </>
                            )}
                        </Box>

                        {resumeFile && (
                            <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: 'success.50', border: '1px solid', borderColor: 'success.100' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" fontWeight="medium">
                                        {resumeFile.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => {
                            setUploadDialogOpen(false);
                            setResumeFile(null);
                        }}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUploadResume}
                        disabled={!resumeFile || uploading}
                        startIcon={uploading && <CircularProgress size={20} />}
                    >
                        {uploading ? 'Uploading...' : 'Upload Resume'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentProfile;
import React, { useState, useEffect } from 'react';
import {
    Box,
    Chip,
    TextField,
    Autocomplete,
    IconButton,
    Typography,
    Paper,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { APP_CONSTANTS } from '../../utils/constants';
import { useQuery } from '@tanstack/react-query';

const SkillInput = ({
    skills = [],
    onChange,
    label = "Skills",
    placeholder = "Add skills...",
    maxSkills = 20,
    showProficiency = true,
    disabled = false,
    required = false,
    error = false,
    helperText = ""
}) => {
    const [inputValue, setInputValue] = useState('');
    const [localSkills, setLocalSkills] = useState(skills);
    const [suggestedSkills, setSuggestedSkills] = useState([]);

    // Fetch trending skills
    const { data: trendingSkills } = useQuery({
        queryKey: ['trending-skills'],
        queryFn: async () => {
            // This would fetch from your API
            return [
                'React',
                'JavaScript',
                'Python',
                'Node.js',
                'TypeScript',
                'MongoDB',
                'AWS',
                'Docker',
                'Machine Learning',
                'Data Analysis'
            ];
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    useEffect(() => {
        setLocalSkills(skills);
    }, [skills]);

    useEffect(() => {
        if (inputValue.trim() && trendingSkills) {
            const filtered = trendingSkills.filter(skill =>
                skill.toLowerCase().includes(inputValue.toLowerCase()) &&
                !localSkills.some(s => s.name === skill)
            );
            setSuggestedSkills(filtered.slice(0, 5));
        } else {
            setSuggestedSkills([]);
        }
    }, [inputValue, trendingSkills, localSkills]);

    const handleAddSkill = (skillName, proficiency = 'intermediate') => {
        if (!skillName.trim() || localSkills.length >= maxSkills) return;

        const newSkill = {
            name: skillName.trim(),
            proficiency,
            yearsOfExperience: 0
        };

        const updatedSkills = [...localSkills, newSkill];
        setLocalSkills(updatedSkills);
        onChange(updatedSkills);
        setInputValue('');
        setSuggestedSkills([]);
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = localSkills.filter((_, i) => i !== index);
        setLocalSkills(updatedSkills);
        onChange(updatedSkills);
    };

    const handleUpdateProficiency = (index, proficiency) => {
        const updatedSkills = [...localSkills];
        updatedSkills[index] = { ...updatedSkills[index], proficiency };
        setLocalSkills(updatedSkills);
        onChange(updatedSkills);
    };

    const handleUpdateExperience = (index, years) => {
        const updatedSkills = [...localSkills];
        updatedSkills[index] = { ...updatedSkills[index], yearsOfExperience: years };
        setLocalSkills(updatedSkills);
        onChange(updatedSkills);
    };

    const getProficiencyColor = (proficiency) => {
        switch (proficiency) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'info';
            case 'expert': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                {label} {required && <span style={{ color: 'red' }}>*</span>}
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({localSkills.length}/{maxSkills})
                </Typography>
            </Typography>

            {/* Input with suggestions */}
            <Box sx={{ position: 'relative', mb: 2 }}>
                <Autocomplete
                    freeSolo
                    disabled={disabled}
                    options={suggestedSkills}
                    inputValue={inputValue}
                    onInputChange={(event, newValue) => setInputValue(newValue)}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            handleAddSkill(newValue);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={placeholder}
                            error={error}
                            helperText={helperText}
                            size="small"
                            fullWidth
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && inputValue.trim()) {
                                    e.preventDefault();
                                    handleAddSkill(inputValue);
                                }
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">{option}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                    Trending
                                </Typography>
                            </Box>
                        </li>
                    )}
                />
                
                {inputValue.trim() && (
                    <IconButton
                        size="small"
                        onClick={() => handleAddSkill(inputValue)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                )}
            </Box>

            {/* Selected Skills */}
            {localSkills.length > 0 && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: 'background.default',
                        borderRadius: 2
                    }}
                >
                    <Stack spacing={1.5}>
                        {localSkills.map((skill, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    borderRadius: 1,
                                    backgroundColor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                    }
                                }}
                            >
                                {/* Skill Name */}
                                <Chip
                                    label={skill.name}
                                    size="small"
                                    sx={{ mr: 2, fontWeight: 500 }}
                                />

                                {/* Proficiency Selector */}
                                {showProficiency && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Proficiency:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {APP_CONSTANTS.PROFICIENCY_LEVELS.map((level) => (
                                                <Chip
                                                    key={level.value}
                                                    label={level.label}
                                                    size="small"
                                                    variant={skill.proficiency === level.value ? "filled" : "outlined"}
                                                    color={getProficiencyColor(level.value)}
                                                    onClick={() => handleUpdateProficiency(index, level.value)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        fontSize: '0.7rem',
                                                        height: 24
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Years of Experience */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Experience:
                                    </Typography>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={skill.yearsOfExperience}
                                        onChange={(e) => handleUpdateExperience(index, parseInt(e.target.value) || 0)}
                                        inputProps={{ 
                                            min: 0, 
                                            max: 50,
                                            style: { width: 60, textAlign: 'center' }
                                        }}
                                        variant="outlined"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        years
                                    </Typography>
                                </Box>

                                {/* Remove Button */}
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveSkill(index)}
                                    sx={{ ml: 'auto', color: 'error.main' }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            )}

            {/* Trending Skills */}
            {trendingSkills && localSkills.length < maxSkills && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                        Trending Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {trendingSkills.slice(0, 8).map((skill, index) => {
                            const isAdded = localSkills.some(s => s.name === skill);
                            return (
                                <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    variant={isAdded ? "filled" : "outlined"}
                                    color={isAdded ? "success" : "default"}
                                    onClick={() => {
                                        if (!isAdded) handleAddSkill(skill);
                                    }}
                                    disabled={isAdded}
                                    sx={{
                                        cursor: isAdded ? 'default' : 'pointer',
                                        '&:hover': {
                                            backgroundColor: isAdded ? undefined : 'action.hover'
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            )}

            {/* Skill Categories */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    Browse by Category:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {APP_CONSTANTS.SKILL_CATEGORIES.slice(0, 5).map((category) => (
                        <Chip
                            key={category.value}
                            label={category.label}
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                // Would fetch skills by category from API
                                console.log(`Fetch skills for category: ${category.label}`);
                            }}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default SkillInput;
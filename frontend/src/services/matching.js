import { internshipAPI, studentAPI, recruiterAPI } from './api';

class MatchingService {
    // Get recommendations for student
    static async getStudentRecommendations(limit = 10) {
        try {
            const response = await internshipAPI.getRecommendations(limit);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to get recommendations'
            };
        }
    }

    // Get top candidates for internship
    static async getTopCandidates(internshipId, limit = 20) {
        try {
            const response = await recruiterAPI.getTopCandidates(internshipId, limit);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to get top candidates'
            };
        }
    }

    // Calculate match score between student and internship
    static calculateMatchScore(student, internship) {
        let score = 0;
        
        // Skills matching (40%)
        if (student.skills && internship.requiredSkills) {
            const studentSkills = student.skills.map(s => s.name.toLowerCase());
            const requiredSkills = internship.requiredSkills.map(s => s.skill.toLowerCase());
            
            const matchingSkills = studentSkills.filter(skill => 
                requiredSkills.includes(skill)
            );
            
            const skillScore = (matchingSkills.length / Math.max(requiredSkills.length, 1)) * 40;
            score += skillScore;
        }

        // Location matching (20%)
        if (student.preferredLocations && internship.location) {
            const studentLocations = student.preferredLocations.map(l => l.toLowerCase());
            const internshipLocation = internship.location.toLowerCase();
            
            const locationMatch = studentLocations.some(location => 
                internshipLocation.includes(location) || location.includes(internshipLocation)
            );
            
            if (locationMatch) {
                score += 20;
            }
        }

        // Duration matching (20%)
        if (student.preferredDuration && internship.duration) {
            const studentMin = student.preferredDuration.min || 1;
            const studentMax = student.preferredDuration.max || 6;
            const internshipDuration = internship.duration.value || 3;
            
            if (internshipDuration >= studentMin && internshipDuration <= studentMax) {
                score += 20;
            }
        }

        // Type matching (20%)
        if (student.preferredInternshipTypes && internship.internshipType) {
            const studentTypes = student.preferredInternshipTypes;
            const internshipType = internship.internshipType;
            
            if (studentTypes.includes(internshipType)) {
                score += 20;
            }
        }

        return Math.min(100, Math.round(score));
    }

    // Get match color based on score
    static getMatchColor(score) {
        if (score >= 80) return '#10B981'; // Green
        if (score >= 60) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    }

    // Get match label based on score
    static getMatchLabel(score) {
        if (score >= 80) return 'Excellent Match';
        if (score >= 70) return 'Good Match';
        if (score >= 60) return 'Fair Match';
        if (score >= 40) return 'Low Match';
        return 'Poor Match';
    }

    // Analyze student's skills for dashboard
    static analyzeStudentSkills(skills) {
        if (!skills || skills.length === 0) {
            return {
                total: 0,
                byCategory: {},
                topSkills: []
            };
        }

        const categories = {};
        skills.forEach(skill => {
            const category = skill.category || 'other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(skill);
        });

        // Sort skills by proficiency
        const sortedSkills = [...skills].sort((a, b) => {
            const proficiencyOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
            return (proficiencyOrder[b.proficiency] || 0) - (proficiencyOrder[a.proficiency] || 0);
        });

        return {
            total: skills.length,
            byCategory: categories,
            topSkills: sortedSkills.slice(0, 5)
        };
    }

    // Analyze internship requirements
    static analyzeInternshipRequirements(requiredSkills) {
        if (!requiredSkills || requiredSkills.length === 0) {
            return {
                total: 0,
                byProficiency: {},
                requiredSkills: [],
                preferredSkills: []
            };
        }

        const byProficiency = {
            required: [],
            preferred: [],
            'nice-to-have': []
        };

        requiredSkills.forEach(skill => {
            const proficiency = skill.proficiency || 'required';
            if (byProficiency[proficiency]) {
                byProficiency[proficiency].push(skill);
            }
        });

        return {
            total: requiredSkills.length,
            byProficiency,
            requiredSkills: byProficiency.required,
            preferredSkills: [...byProficiency.preferred, ...byProficiency['nice-to-have']]
        };
    }

    // Get skill suggestions based on student profile
    static async getSkillSuggestions() {
        try {
            const response = await studentAPI.getSkillSuggestions();
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to get skill suggestions'
            };
        }
    }

    // Filter internships based on student preferences
    static filterInternshipsByPreferences(internships, student) {
        if (!internships || !student) return internships;

        return internships.filter(internship => {
            // Location filter
            if (student.preferredLocations && student.preferredLocations.length > 0) {
                const locationMatch = student.preferredLocations.some(location => 
                    internship.location.toLowerCase().includes(location.toLowerCase())
                );
                if (!locationMatch) return false;
            }

            // Type filter
            if (student.preferredInternshipTypes && student.preferredInternshipTypes.length > 0) {
                if (!student.preferredInternshipTypes.includes(internship.internshipType)) {
                    return false;
                }
            }

            // Duration filter
            if (student.preferredDuration && internship.duration) {
                const studentMin = student.preferredDuration.min || 1;
                const studentMax = student.preferredDuration.max || 6;
                const internshipDuration = internship.duration.value || 3;
                
                if (internshipDuration < studentMin || internshipDuration > studentMax) {
                    return false;
                }
            }

            return true;
        });
    }

    // Sort internships by match score
    static sortInternshipsByMatch(internships, student) {
        if (!internships || !student) return internships;

        return [...internships].sort((a, b) => {
            const scoreA = this.calculateMatchScore(student, a);
            const scoreB = this.calculateMatchScore(student, b);
            return scoreB - scoreA;
        });
    }

    // Get internship match breakdown
    static getMatchBreakdown(student, internship) {
        const breakdown = {
            skills: 0,
            location: 0,
            duration: 0,
            type: 0,
            total: 0
        };

        // Skills breakdown
        if (student.skills && internship.requiredSkills) {
            const studentSkills = student.skills.map(s => s.name.toLowerCase());
            const requiredSkills = internship.requiredSkills.map(s => s.skill.toLowerCase());
            
            const matchingSkills = studentSkills.filter(skill => 
                requiredSkills.includes(skill)
            );
            
            breakdown.skills = Math.round((matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100);
        }

        // Location breakdown
        if (student.preferredLocations && internship.location) {
            const studentLocations = student.preferredLocations.map(l => l.toLowerCase());
            const internshipLocation = internship.location.toLowerCase();
            
            const locationMatch = studentLocations.some(location => 
                internshipLocation.includes(location) || location.includes(internshipLocation)
            );
            
            breakdown.location = locationMatch ? 100 : 0;
        }

        // Duration breakdown
        if (student.preferredDuration && internship.duration) {
            const studentMin = student.preferredDuration.min || 1;
            const studentMax = student.preferredDuration.max || 6;
            const internshipDuration = internship.duration.value || 3;
            
            if (internshipDuration >= studentMin && internshipDuration <= studentMax) {
                breakdown.duration = 100;
            } else if (internshipDuration < studentMin) {
                breakdown.duration = 50;
            } else {
                breakdown.duration = 70;
            }
        }

        // Type breakdown
        if (student.preferredInternshipTypes && internship.internshipType) {
            const studentTypes = student.preferredInternshipTypes;
            const internshipType = internship.internshipType;
            
            breakdown.type = studentTypes.includes(internshipType) ? 100 : 0;
        }

        // Calculate total (weighted average)
        breakdown.total = Math.round(
            (breakdown.skills * 0.4) + 
            (breakdown.location * 0.2) + 
            (breakdown.duration * 0.2) + 
            (breakdown.type * 0.2)
        );

        return breakdown;
    }

    // Get trending skills from internships
    static getTrendingSkills(internships, limit = 10) {
        if (!internships) return [];

        const skillCount = {};
        
        internships.forEach(internship => {
            if (internship.requiredSkills) {
                internship.requiredSkills.forEach(skill => {
                    const skillName = skill.skill.toLowerCase();
                    skillCount[skillName] = (skillCount[skillName] || 0) + 1;
                });
            }
        });

        // Sort by frequency and get top skills
        return Object.entries(skillCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([skill]) => skill);
    }

    // Check if student meets minimum requirements
    static meetsMinimumRequirements(student, internship) {
        if (!student.skills || !internship.requiredSkills) return false;

        // Check required skills
        const requiredSkills = internship.requiredSkills
            .filter(skill => skill.proficiency === 'required')
            .map(skill => skill.skill.toLowerCase());

        const studentSkills = student.skills.map(s => s.name.toLowerCase());

        // Student must have all required skills
        return requiredSkills.every(skill => studentSkills.includes(skill));
    }
}

export default MatchingService;
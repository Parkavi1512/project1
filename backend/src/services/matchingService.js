const natural = require('natural');
const tfidf = new natural.TfIdf();

class MatchingService {
    constructor() {
        this.skillWeight = 0.4;
        this.interestWeight = 0.3;
        this.locationWeight = 0.2;
        this.durationWeight = 0.1;
    }

    // Calculate match score between student and internship
    async calculateMatchScore(student, internship) {
        let score = 0;
        const weights = internship.matchScoreWeights || {
            skills: this.skillWeight,
            interests: this.interestWeight,
            location: this.locationWeight,
            duration: this.durationWeight
        };

        // Skill matching (40%)
        const skillScore = this.calculateSkillMatch(student.skills, internship.requiredSkills);
        score += skillScore * weights.skills;

        // Interest matching (30%)
        const interestScore = this.calculateInterestMatch(student.interests, internship);
        score += interestScore * weights.interest;

        // Location preference (20%)
        const locationScore = this.calculateLocationMatch(student.preferredLocations, internship.location);
        score += locationScore * weights.location;

        // Duration preference (10%)
        const durationScore = this.calculateDurationMatch(
            student.preferredDuration,
            internship.duration
        );
        score += durationScore * weights.duration;

        // Additional factors
        score += this.calculateAdditionalFactors(student, internship);

        return Math.min(100, Math.round(score * 100));
    }

    calculateSkillMatch(studentSkills, requiredSkills) {
        if (!requiredSkills || requiredSkills.length === 0) return 0.5;

        let totalScore = 0;
        let maxPossibleScore = 0;

        requiredSkills.forEach(reqSkill => {
            const studentSkill = studentSkills.find(s => 
                s.name.toLowerCase() === reqSkill.skill.toLowerCase()
            );

            let skillScore = 0;
            if (studentSkill) {
                // Base score for having the skill
                skillScore = 0.7;
                
                // Adjust based on proficiency
                const proficiencyScore = this.getProficiencyScore(studentSkill.proficiency);
                skillScore += proficiencyScore * 0.3;
            }

            // Weight by importance
            const weight = reqSkill.importance / 10;
            totalScore += skillScore * weight;
            maxPossibleScore += weight;
        });

        return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
    }

    calculateInterestMatch(studentInterests, internship) {
        if (!studentInterests || studentInterests.length === 0) return 0.5;

        const internshipText = `${internship.title} ${internship.description} ${internship.category || ''}`.toLowerCase();
        let matches = 0;

        studentInterests.forEach(interest => {
            if (internshipText.includes(interest.toLowerCase())) {
                matches++;
            }
        });

        return matches / studentInterests.length;
    }

    calculateLocationMatch(preferredLocations, internshipLocation) {
        if (!preferredLocations || preferredLocations.length === 0) return 0.5;
        if (!internshipLocation) return 0;

        const internshipLocLower = internshipLocation.toLowerCase();
        
        for (const prefLocation of preferredLocations) {
            if (internshipLocLower.includes(prefLocation.toLowerCase()) ||
                prefLocation.toLowerCase().includes(internshipLocLower)) {
                return 1.0;
            }
        }

        // Partial match using tokenization
        const internshipTokens = new Set(internshipLocLower.split(/[,\s]+/));
        for (const prefLocation of preferredLocations) {
            const prefTokens = new Set(prefLocation.toLowerCase().split(/[,\s]+/));
            const intersection = [...internshipTokens].filter(x => prefTokens.has(x));
            if (intersection.length > 0) {
                return 0.7;
            }
        }

        return 0;
    }

    calculateDurationMatch(preferredDuration, internshipDuration) {
        if (!preferredDuration || !internshipDuration) return 0.5;

        const internshipMonths = internshipDuration.unit === 'weeks' 
            ? internshipDuration.value / 4 
            : internshipDuration.value;

        const minPref = preferredDuration.min || 1;
        const maxPref = preferredDuration.max || 6;

        if (internshipMonths >= minPref && internshipMonths <= maxPref) {
            return 1.0;
        } else if (internshipMonths < minPref) {
            return 0.3;
        } else {
            return 0.7; // Slightly higher score for longer internships
        }
    }

    calculateAdditionalFactors(student, internship) {
        let additionalScore = 0;

        // University prestige factor (example)
        const topUniversities = ['mit', 'stanford', 'harvard', 'caltech', 'princeton'];
        if (topUniversities.includes(student.university.toLowerCase())) {
            additionalScore += 0.05;
        }

        // GPA factor
        if (student.gpa && student.gpa >= 3.5) {
            additionalScore += 0.05;
        }

        return additionalScore;
    }

    getProficiencyScore(proficiency) {
        const scores = {
            'beginner': 0.3,
            'intermediate': 0.6,
            'advanced': 0.8,
            'expert': 1.0
        };
        return scores[proficiency] || 0.5;
    }

    // Get top matches for a student
    async getTopMatchesForStudent(studentId, limit = 10) {
        const Student = require('../models/Student');
        const Internship = require('../models/Internship');

        const student = await Student.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        const internships = await Internship.find({ status: 'active' })
            .populate('company', 'companyName companyLogo')
            .limit(100); // Limit for performance

        const matches = [];
        for (const internship of internships) {
            const score = await this.calculateMatchScore(student, internship);
            if (score >= 40) { // Only include matches with at least 40% score
                matches.push({
                    internship,
                    score,
                    matchDetails: {
                        skillMatch: this.calculateSkillMatch(student.skills, internship.requiredSkills),
                        interestMatch: this.calculateInterestMatch(student.interests, internship),
                        locationMatch: this.calculateLocationMatch(student.preferredLocations, internship.location),
                        durationMatch: this.calculateDurationMatch(student.preferredDuration, internship.duration)
                    }
                });
            }
        }

        // Sort by score and return top matches
        return matches
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // Get top candidates for an internship
    async getTopCandidatesForInternship(internshipId, limit = 20) {
        const Internship = require('../models/Internship');
        const Student = require('../models/Student');

        const internship = await Internship.findById(internshipId);
        if (!internship) {
            throw new Error('Internship not found');
        }

        const students = await Student.find({ profileCompleted: true })
            .limit(200) // Limit for performance
            .select('-password');

        const candidates = [];
        for (const student of students) {
            const score = await this.calculateMatchScore(student, internship);
            if (score >= 50) { // Only include candidates with at least 50% match
                candidates.push({
                    student,
                    score,
                    matchDetails: {
                        skillMatch: this.calculateSkillMatch(student.skills, internship.requiredSkills),
                        interestMatch: this.calculateInterestMatch(student.interests, internship),
                        locationMatch: this.calculateLocationMatch(student.preferredLocations, internship.location),
                        durationMatch: this.calculateDurationMatch(student.preferredDuration, internship.duration)
                    }
                });
            }
        }

        // Sort by score and return top candidates
        return candidates
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}

module.exports = new MatchingService();
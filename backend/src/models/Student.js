const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    university: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    major: {
        type: String,
        required: true,
        trim: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    gpa: {
        type: Number,
        min: 0,
        max: 4.0
    },
    skills: [{
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        proficiency: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'intermediate'
        },
        yearsOfExperience: {
            type: Number,
            default: 0
        }
    }],
    interests: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    careerGoals: [{
        type: String,
        trim: true
    }],
    resumeUrl: {
        type: String
    },
    preferredLocations: [{
        type: String,
        trim: true
    }],
    preferredInternshipTypes: [{
        type: String,
        enum: ['onsite', 'remote', 'hybrid']
    }],
    preferredDuration: {
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: 6
        }
    },
    profileScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Indexes
studentSchema.index({ skills: 1 });
studentSchema.index({ university: 1 });
studentSchema.index({ 'preferredLocations': 1 });

const Student = User.discriminator('student', studentSchema);

module.exports = Student;
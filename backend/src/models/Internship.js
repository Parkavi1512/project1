const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    internshipType: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        required: true
    },
    duration: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            enum: ['weeks', 'months'],
            default: 'months'
        }
    },
    stipend: {
        amount: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'one-time', 'performance-based']
        }
    },
    requiredSkills: [{
        skill: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        proficiency: {
            type: String,
            enum: ['required', 'preferred', 'nice-to-have'],
            default: 'required'
        },
        importance: {
            type: Number,
            min: 1,
            max: 10,
            default: 5
        }
    }],
    responsibilities: [{
        type: String,
        trim: true
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    benefits: [{
        type: String,
        trim: true
    }],
    applicationDeadline: {
        type: Date
    },
    startDate: {
        type: Date
    },
    positionsAvailable: {
        type: Number,
        default: 1,
        min: 1
    },
    applicationsReceived: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    },
    category: {
        type: String,
        trim: true
    },
    keywords: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    matchScoreWeights: {
        skills: {
            type: Number,
            default: 0.4,
            min: 0,
            max: 1
        },
        interests: {
            type: Number,
            default: 0.3,
            min: 0,
            max: 1
        },
        location: {
            type: Number,
            default: 0.2,
            min: 0,
            max: 1
        },
        duration: {
            type: Number,
            default: 0.1,
            min: 0,
            max: 1
        }
    }
}, {
    timestamps: true
});

// Text index for search
internshipSchema.index({ title: 'text', description: 'text', 'requiredSkills.skill': 'text' });

// Compound indexes for performance
internshipSchema.index({ status: 1, applicationDeadline: 1 });
internshipSchema.index({ company: 1, status: 1 });

// Virtual for calculating days until deadline
internshipSchema.virtual('daysUntilDeadline').get(function() {
    if (!this.applicationDeadline) return null;
    const now = new Date();
    const deadline = new Date(this.applicationDeadline);
    const diffTime = deadline - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check if internship is still open
internshipSchema.methods.isOpen = function() {
    if (this.status !== 'active') return false;
    if (!this.applicationDeadline) return true;
    return new Date() <= new Date(this.applicationDeadline);
};

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    coverLetter: {
        type: String,
        trim: true
    },
    resumeUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    recruiterFeedback: {
        type: String,
        trim: true
    },
    interviewDate: {
        type: Date
    },
    notes: [{
        content: String,
        addedBy: {
            type: String,
            enum: ['student', 'recruiter', 'system']
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Ensure one student can apply only once per internship
applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

// Indexes for query performance
applicationSchema.index({ internship: 1, status: 1 });
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ matchScore: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
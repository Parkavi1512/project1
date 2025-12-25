const mongoose = require('mongoose');
const User = require('./User');

const recruiterSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
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
        position: {
            type: String,
            trim: true
        }
    },
    phone: {
        type: String,
        trim: true
    },
    companyWebsite: {
        type: String,
        trim: true
    },
    companyDescription: {
        type: String,
        trim: true
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    industry: {
        type: String,
        trim: true
    },
    companyLogo: {
        type: String
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    postedInternshipsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Recruiter = User.discriminator('recruiter', recruiterSchema);

module.exports = Recruiter;
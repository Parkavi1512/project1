const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'programming',
            'design',
            'data_science',
            'marketing',
            'business',
            'language',
            'soft_skills',
            'technical',
            'creative',
            'analytical'
        ]
    },
    description: {
        type: String,
        trim: true
    },
    popularity: {
        type: Number,
        default: 0,
        min: 0
    },
    relatedSkills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    industryDemand: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    averageSalary: {
        amount: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    trendingScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for text search
skillSchema.index({ name: 'text', description: 'text', category: 'text' });

// Compound index for popular skills
skillSchema.index({ popularity: -1, industryDemand: -1 });

// Virtual for related skills count
skillSchema.virtual('relatedSkillsCount').get(function() {
    return this.relatedSkills.length;
});

// Method to increment popularity
skillSchema.methods.incrementPopularity = function() {
    this.popularity += 1;
    return this.save();
};

// Static method to get trending skills
skillSchema.statics.getTrendingSkills = async function(limit = 10) {
    return this.find()
        .sort({ trendingScore: -1, popularity: -1 })
        .limit(limit);
};

// Static method to get skills by category
skillSchema.statics.getSkillsByCategory = async function(category, limit = 20) {
    return this.find({ category })
        .sort({ popularity: -1 })
        .limit(limit);
};

// Static method to search skills
skillSchema.statics.searchSkills = async function(query, limit = 10) {
    return this.find({
        $text: { $search: query }
    })
    .sort({ score: { $meta: "textScore" } })
    .limit(limit);
};

const Skill = mongoose.model('Skill', skillSchema);

// Default skills to seed
const defaultSkills = [
    // Programming
    { name: 'javascript', category: 'programming', description: 'JavaScript programming language' },
    { name: 'python', category: 'programming', description: 'Python programming language' },
    { name: 'java', category: 'programming', description: 'Java programming language' },
    { name: 'react', category: 'programming', description: 'React.js library' },
    { name: 'node.js', category: 'programming', description: 'Node.js runtime' },
    { name: 'typescript', category: 'programming', description: 'TypeScript programming language' },
    
    // Data Science
    { name: 'machine learning', category: 'data_science', description: 'Machine learning algorithms' },
    { name: 'data analysis', category: 'data_science', description: 'Data analysis techniques' },
    { name: 'sql', category: 'data_science', description: 'Structured Query Language' },
    
    // Design
    { name: 'ui/ux design', category: 'design', description: 'User interface and experience design' },
    { name: 'figma', category: 'design', description: 'Figma design tool' },
    
    // Business
    { name: 'project management', category: 'business', description: 'Project management skills' },
    { name: 'communication', category: 'soft_skills', description: 'Communication skills' },
];

// Seed skills if collection is empty
Skill.countDocuments({})
    .then(count => {
        if (count === 0) {
            Skill.insertMany(defaultSkills)
                .then(() => console.log('Default skills seeded'))
                .catch(err => console.error('Error seeding skills:', err));
        }
    });

module.exports = Skill;
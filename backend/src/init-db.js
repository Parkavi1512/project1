const mongoose = require('mongoose');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship_matcher', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Create sample data
    const db = mongoose.connection.db;
    
    // Create collections if they don't exist
    const collections = ['users', 'students', 'recruiters', 'internships', 'applications', 'skills'];
    
    for (const collection of collections) {
      try {
        await db.createCollection(collection);
        console.log(`✅ Created collection: ${collection}`);
      } catch (err) {
        console.log(`📁 Collection already exists: ${collection}`);
      }
    }
    
    // Insert sample users
    const usersCollection = db.collection('users');
    await usersCollection.deleteMany({}); // Clear existing data
    
    const sampleUsers = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$examplehash', // Hashed password
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Google HR',
        email: 'hr@google.com',
        password: '$2a$10$examplehash',
        role: 'recruiter',
        company: 'Google',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Alice Johnson',
        email: 'alice@mit.edu',
        password: '$2a$10$examplehash',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await usersCollection.insertMany(sampleUsers);
    console.log(`✅ Inserted ${sampleUsers.length} users`);
    
    // Insert sample internships
    const internshipsCollection = db.collection('internships');
    await internshipsCollection.deleteMany({});
    
    const sampleInternships = [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Software Engineer Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        type: 'On-site',
        salary: 6000,
        skills: ['JavaScript', 'React', 'Python', 'AWS'],
        description: 'Work on cutting-edge web applications at Google.',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Frontend Developer Intern',
        company: 'Facebook',
        location: 'Remote',
        type: 'Remote',
        salary: 5500,
        skills: ['JavaScript', 'React', 'CSS', 'TypeScript'],
        description: 'Build user interfaces for billions of users.',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Cloud Engineer Intern',
        company: 'Amazon',
        location: 'Seattle, WA',
        type: 'On-site',
        salary: 6200,
        skills: ['AWS', 'Python', 'Docker', 'Linux'],
        description: 'Work with AWS cloud infrastructure.',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await internshipsCollection.insertMany(sampleInternships);
    console.log(`✅ Inserted ${sampleInternships.length} internships`);
    
    // Insert sample applications
    const applicationsCollection = db.collection('applications');
    await applicationsCollection.deleteMany({});
    
    const sampleApplications = [
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: sampleUsers[0]._id, // John Doe
        internshipId: sampleInternships[0]._id, // Google
        status: 'under_review',
        matchScore: 92,
        appliedAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: sampleUsers[0]._id, // John Doe
        internshipId: sampleInternships[1]._id, // Facebook
        status: 'interview',
        matchScore: 88,
        appliedAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await applicationsCollection.insertMany(sampleApplications);
    console.log(`✅ Inserted ${sampleApplications.length} applications`);
    
    // Show database stats
    const stats = {
      users: await usersCollection.countDocuments(),
      internships: await internshipsCollection.countDocuments(),
      applications: await applicationsCollection.countDocuments(),
      database: db.databaseName,
      collections: await db.listCollections().toArray()
    };
    
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('=' .repeat(40));
    console.log(`Database: ${stats.database}`);
    console.log(`Users: ${stats.users}`);
    console.log(`Internships: ${stats.internships}`);
    console.log(`Applications: ${stats.applications}`);
    console.log('\nCollections:');
    stats.collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    console.log('=' .repeat(40));
    
    console.log('\n🎉 Database initialized successfully!');
    console.log('\n📡 You can now view data at:');
    console.log('1. MongoDB Compass: mongodb://localhost:27017');
    console.log('2. API Endpoint: http://localhost:5004/api/db/stats');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

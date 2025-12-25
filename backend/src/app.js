const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Root route - shows welcome message
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Internship Matcher API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 50px;
          background: #f5f5f5;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #1976d2;
        }
        .endpoint {
          background: #f0f8ff;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
          font-family: monospace;
        }
        .success {
          color: green;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Internship Matcher Backend API</h1>
        <p class="success">Server is running successfully!</p>
        
        <h2>Available Endpoints:</h2>
        <div class="endpoint">GET <a href="/api/health">/api/health</a> - Health check</div>
        <div class="endpoint">GET <a href="/api/test">/api/test</a> - Test endpoint</div>
        
        <h2>Frontend:</h2>
        <p><a href="http://localhost:3000" target="_blank">Open Frontend App</a></p>
        
        <h2>Server Info:</h2>
        <p><strong>Port:</strong> 5002</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Backend server is running! 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      root: "GET /",
      health: "GET /api/health",
      test: "GET /api/test"
    }
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true,
    data: "Backend API is working correctly",
    timestamp: new Date().toISOString()
  });
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("✅ INTERNSHIP MATCHER BACKEND");
  console.log("=".repeat(50));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test:   http://localhost:${PORT}/api/test`);
  console.log("=".repeat(50));
  console.log("\n🌐 Open these URLs in your browser:");
  console.log(`1. Frontend: http://localhost:3001`);
  console.log(`2. Backend UI: http://localhost:${PORT}`);
  console.log(`3. API Health: http://localhost:${PORT}/api/health`);
});

// Database status endpoint
app.get("/api/db/status", async (req, res) => {
  try {
    const db = mongoose.connection;
    
    const status = {
      connected: db.readyState === 1,
      database: db.name,
      host: db.host,
      port: db.port,
      collections: [],
      stats: {}
    };
    
    if (status.connected) {
      const collections = await db.db.listCollections().toArray();
      status.collections = collections.map(col => col.name);
      
      // Get counts for main collections
      const counts = await Promise.all([
        db.db.collection('users').countDocuments(),
        db.db.collection('internships').countDocuments(),
        db.db.collection('applications').countDocuments(),
        db.db.collection('students').countDocuments(),
        db.db.collection('recruiters').countDocuments()
      ]);
      
      status.stats = {
        users: counts[0],
        internships: counts[1],
        applications: counts[2],
        students: counts[3],
        recruiters: counts[4]
      };
    }
    
    res.json({
      success: true,
      message: status.connected ? "Database is connected and working!" : "Database not connected",
      data: status
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking database status",
      error: error.message
    });
  }
});

// Get sample data
app.get("/api/db/sample", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    const [users, internships, applications] = await Promise.all([
      db.collection('users').find({}).limit(3).toArray(),
      db.collection('internships').find({}).limit(3).toArray(),
      db.collection('applications').find({}).limit(3).toArray()
    ]);
    
    // Remove sensitive data
    const safeUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
    
    res.json({
      success: true,
      message: "Sample data retrieved",
      data: {
        users: safeUsers,
        internships: internships,
        applications: applications
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sample data",
      error: error.message
    });
  }
});

// Create test data endpoint
app.get("/api/db/create-test", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Create test user
    const testUser = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Student",
      email: "test@example.com",
      password: "$2a$10$testhash",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('users').insertOne(testUser);
    
    // Create test internship
    const testInternship = {
      _id: new mongoose.Types.ObjectId(),
      title: "Test Internship Position",
      company: "Test Company",
      location: "Remote",
      salary: 5000,
      skills: ["JavaScript", "React"],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('internships').insertOne(testInternship);
    
    // Create test application
    const testApplication = {
      _id: new mongoose.Types.ObjectId(),
      studentId: testUser._id,
      internshipId: testInternship._id,
      status: "applied",
      matchScore: 85,
      appliedAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('applications').insertOne(testApplication);
    
    res.json({
      success: true,
      message: "Test data created successfully!",
      data: {
        user: {
          id: testUser._id,
          name: testUser.name,
          email: testUser.email
        },
        internship: {
          id: testInternship._id,
          title: testInternship.title,
          company: testInternship.company
        },
        application: {
          id: testApplication._id,
          status: testApplication.status,
          matchScore: testApplication.matchScore
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating test data",
      error: error.message
    });
  }
});

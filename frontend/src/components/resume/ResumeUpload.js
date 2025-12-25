import React, { useState } from "react";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    
    // Simulate API call for resume parsing
    setTimeout(() => {
      // Mock extracted skills (in real app, this comes from backend AI)
      const mockSkills = [
        { name: "JavaScript", level: 5, experience: "2 years" },
        { name: "React", level: 4, experience: "1.5 years" },
        { name: "Python", level: 4, experience: "2 years" },
        { name: "Node.js", level: 3, experience: "1 year" },
        { name: "MongoDB", level: 3, experience: "1 year" },
        { name: "AWS", level: 2, experience: "6 months" },
        { name: "Git", level: 4, experience: "2 years" },
        { name: "Docker", level: 2, experience: "4 months" },
      ];

      const mockData = {
        name: "John Doe",
        email: "john@example.com",
        education: "Stanford University - Computer Science (GPA: 3.8)",
        experience: "1. Software Intern at Google (Summer 2023)\n2. Research Assistant at Stanford AI Lab",
        projects: "• E-commerce Website with React & Node.js\n• ML Model for Stock Prediction",
        languages: "English (Native), Spanish (Fluent)",
      };

      setSkills(mockSkills);
      setExtractedData(mockData);
      setUploading(false);
      
      alert("✅ Resume uploaded successfully! Skills extracted.");
    }, 2000);
  };

  const getStars = (level) => {
    return "★".repeat(level) + "☆".repeat(5 - level);
  };

  return (
    <div style={{ 
      maxWidth: "900px", 
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#1976d2", textAlign: "center", marginBottom: "30px" }}>
        📄 Resume Upload & Analysis
      </h1>

      {/* Upload Section */}
      <div style={{ 
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginBottom: "30px",
        border: "2px dashed #1976d2"
      }}>
        <h2 style={{ color: "#333", marginTop: "0" }}>1. Upload Your Resume</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Upload your resume (PDF, DOCX) and our AI will extract your skills automatically.
        </p>

        <div style={{ 
          border: "2px dashed #1976d2",
          borderRadius: "10px",
          padding: "40px",
          textAlign: "center",
          marginBottom: "20px",
          backgroundColor: "#f8fbff"
        }}>
          <div style={{ fontSize: "60px", color: "#1976d2", marginBottom: "10px" }}>📄</div>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            {file ? `Selected: ${file.name}` : "Drag & drop your resume here"}
          </p>
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <label htmlFor="resume-upload" style={{
              padding: "12px 24px",
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}>
              📁 Choose File
            </label>
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              style={{
                padding: "12px 24px",
                backgroundColor: uploading ? "#ccc" : "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: uploading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: !file ? 0.5 : 1
              }}
            >
              {uploading ? "⏳ Processing..." : "🚀 Upload & Analyze"}
            </button>
          </div>
          <p style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
            Supported formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>

        {file && (
          <div style={{ 
            backgroundColor: "#e8f5e9",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>📋</span>
              <div>
                <strong>Selected File:</strong> {file.name}
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Information */}
      {extractedData && (
        <>
          {/* Personal Information */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: "#333", marginTop: "0" }}>👤 Extracted Information</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", marginTop: "20px" }}>
              <div>
                <h3 style={{ color: "#1976d2", fontSize: "16px" }}>Personal Details</h3>
                <p><strong>Name:</strong> {extractedData.name}</p>
                <p><strong>Email:</strong> {extractedData.email}</p>
                <p><strong>Languages:</strong> {extractedData.languages}</p>
              </div>
              <div>
                <h3 style={{ color: "#1976d2", fontSize: "16px" }}>Education</h3>
                <p>{extractedData.education}</p>
              </div>
              <div>
                <h3 style={{ color: "#1976d2", fontSize: "16px" }}>Experience</h3>
                <p style={{ whiteSpace: "pre-line" }}>{extractedData.experience}</p>
              </div>
              <div>
                <h3 style={{ color: "#1976d2", fontSize: "16px" }}>Projects</h3>
                <p style={{ whiteSpace: "pre-line" }}>{extractedData.projects}</p>
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            marginBottom: "30px"
          }}>
            <h2 style={{ color: "#333", marginTop: "0", marginBottom: "25px" }}>
              🎯 Extracted Skills
              <span style={{ 
                marginLeft: "10px",
                backgroundColor: "#4caf50",
                color: "white",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "14px"
              }}>
                {skills.length} skills found
              </span>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              {skills.map((skill, index) => (
                <div key={index} style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: "#f8fbff"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: "0", color: "#1976d2" }}>{skill.name}</h3>
                    <span style={{ 
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "bold"
                    }}>
                      {getStars(skill.level)}
                    </span>
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "#666" }}>
                    <strong>Experience:</strong> {skill.experience}
                  </p>
                  <div style={{ 
                    height: "6px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "3px",
                    marginTop: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${(skill.level / 5) * 100}%`,
                      height: "100%",
                      backgroundColor: "#1976d2",
                      borderRadius: "3px"
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            textAlign: "center"
          }}>
            <h2 style={{ color: "#333", marginTop: "0" }}>🚀 Next Steps</h2>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Your skills have been extracted! Now find internships that match your profile.
            </p>
            
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button style={{
                padding: "15px 30px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                🔍 Find Matching Internships
              </button>
              
              <button style={{
                padding: "15px 30px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                ✏️ Edit Skills
              </button>
              
              <button style={{
                padding: "15px 30px",
                backgroundColor: "#9c27b0",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📊 View Match Statistics
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumeUpload;

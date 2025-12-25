import React from "react";

const Dashboard = () => {
  const skills = ["JavaScript", "React", "Python", "Node.js", "MongoDB", "AWS", "Git", "Docker"];
  const internships = [
    { company: "Google", role: "Software Engineer Intern", match: "92%", salary: "$6,000/month", location: "Mountain View, CA" },
    { company: "Microsoft", role: "Frontend Developer Intern", match: "88%", salary: "$5,500/month", location: "Redmond, WA" },
    { company: "Amazon", role: "Cloud Engineer Intern", match: "85%", salary: "$6,200/month", location: "Seattle, WA" },
    { company: "Meta", role: "Full Stack Intern", match: "82%", salary: "$5,800/month", location: "Remote" },
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
        color: "white",
        padding: "30px",
        borderRadius: "15px",
        marginBottom: "30px"
      }}>
        <h1 style={{ margin: "0 0 10px 0" }}>👋 Welcome back, John!</h1>
        <p style={{ margin: "0", opacity: 0.9 }}>Stanford University • Computer Science • GPA: 3.8</p>
        <button style={{ 
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "white",
          color: "#1976d2",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          📄 Upload Resume
        </button>
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        {/* Left Column - Skills & Stats */}
        <div style={{ flex: 1 }}>
          {/* Skills Card */}
          <div style={{ 
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ color: "#333", marginTop: "0" }}>🎯 Your Skills</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>Extracted from your resume</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {skills.map((skill, index) => (
                <span key={index} style={{ 
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div style={{ 
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ color: "#333", marginTop: "0" }}>📊 Your Stats</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: "#1976d2" }}>85%</div>
                <div style={{ color: "#666" }}>Avg Match</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: "#4caf50" }}>12</div>
                <div style={{ color: "#666" }}>Applications</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: "#9c27b0" }}>8</div>
                <div style={{ color: "#666" }}>Interviews</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: "#ff9800" }}>3</div>
                <div style={{ color: "#666" }}>Offers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Internships */}
        <div style={{ flex: 2 }}>
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h2 style={{ color: "#333", margin: "0" }}>🎯 Recommended Internships</h2>
              <button style={{ 
                padding: "10px 20px",
                backgroundColor: "#f5f5f5",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer"
              }}>
                🔍 Search More
              </button>
            </div>

            {internships.map((internship, index) => (
              <div key={index} style={{ 
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>{internship.role}</h3>
                    <p style={{ margin: "0 0 10px 0", color: "#1976d2", fontWeight: "bold" }}>
                      {internship.company} • {internship.location}
                    </p>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                      <span style={{ 
                        backgroundColor: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}>
                        💰 {internship.salary}
                      </span>
                      <span style={{ 
                        backgroundColor: "#f3e5f5",
                        color: "#7b1fa2",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}>
                        🏢 {internship.location.includes("Remote") ? "Remote" : "On-site"}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ 
                      fontSize: "32px", 
                      fontWeight: "bold", 
                      color: "#4caf50",
                      marginBottom: "5px"
                    }}>
                      {internship.match}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px" }}>Match Score</div>
                  </div>
                </div>
                <div style={{ 
                  height: "8px", 
                  backgroundColor: "#e0e0e0",
                  borderRadius: "4px",
                  overflow: "hidden",
                  margin: "15px 0"
                }}>
                  <div style={{ 
                    width: internship.match.replace("%", "") + "%",
                    height: "100%",
                    backgroundColor: "#4caf50",
                    borderRadius: "4px"
                  }}></div>
                </div>
                <button style={{ 
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}>
                  🚀 Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

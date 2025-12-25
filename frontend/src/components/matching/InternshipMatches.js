import React, { useState } from "react";

const InternshipMatches = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: "all",
    type: "all",
    salary: "all",
    duration: "all"
  });

  // Mock data - In real app, this comes from backend API
  const userSkills = ["JavaScript", "React", "Python", "Node.js", "MongoDB", "AWS", "Git", "Docker"];
  
  const internships = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "Google",
      logo: "G",
      location: "Mountain View, CA",
      type: "On-site",
      salary: "$6,000/month",
      duration: "3 months",
      match: 92,
      skills: ["JavaScript", "React", "Python", "AWS", "Docker", "Git"],
      description: "Work on cutting-edge web applications using modern technologies.",
      applyLink: "#"
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      company: "Facebook",
      logo: "F",
      location: "Remote",
      type: "Remote",
      salary: "$5,500/month",
      duration: "4 months",
      match: 88,
      skills: ["JavaScript", "React", "CSS", "TypeScript", "GraphQL"],
      description: "Build user interfaces for billions of users worldwide.",
      applyLink: "#"
    },
    {
      id: 3,
      title: "Full Stack Developer Intern",
      company: "Microsoft",
      logo: "M",
      location: "Redmond, WA",
      type: "Hybrid",
      salary: "$5,800/month",
      duration: "3 months",
      match: 85,
      skills: ["JavaScript", "React", "Node.js", "Azure", "MongoDB"],
      description: "Develop full-stack applications using Azure cloud services.",
      applyLink: "#"
    },
    {
      id: 4,
      title: "Cloud Engineer Intern",
      company: "Amazon",
      logo: "A",
      location: "Seattle, WA",
      type: "On-site",
      salary: "$6,200/month",
      duration: "4 months",
      match: 83,
      skills: ["AWS", "Python", "Docker", "Linux", "Networking"],
      description: "Work with AWS cloud infrastructure and services.",
      applyLink: "#"
    },
    {
      id: 5,
      title: "Data Science Intern",
      company: "Netflix",
      logo: "N",
      location: "Los Gatos, CA",
      type: "Remote",
      salary: "$6,500/month",
      duration: "3 months",
      match: 78,
      skills: ["Python", "Machine Learning", "SQL", "Pandas", "Statistics"],
      description: "Analyze user data to improve recommendation algorithms.",
      applyLink: "#"
    },
    {
      id: 6,
      title: "DevOps Engineer Intern",
      company: "Spotify",
      logo: "S",
      location: "New York, NY",
      type: "Hybrid",
      salary: "$5,700/month",
      duration: "4 months",
      match: 75,
      skills: ["Docker", "Kubernetes", "AWS", "Git", "CI/CD"],
      description: "Build and maintain deployment pipelines for music streaming services.",
      applyLink: "#"
    }
  ];

  const calculateSkillMatch = (internshipSkills) => {
    const matchedSkills = internshipSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.round((matchedSkills.length / internshipSkills.length) * 100);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return "#4caf50"; // Green
    if (percentage >= 80) return "#8bc34a"; // Light green
    if (percentage >= 70) return "#ffc107"; // Yellow
    if (percentage >= 60) return "#ff9800"; // Orange
    return "#f44336"; // Red
  };

  const filteredInternships = internships.filter(internship => {
    if (selectedFilters.location !== "all" && internship.location.toLowerCase() !== selectedFilters.location.toLowerCase()) {
      return false;
    }
    if (selectedFilters.type !== "all" && internship.type.toLowerCase() !== selectedFilters.type.toLowerCase()) {
      return false;
    }
    if (selectedFilters.salary !== "all") {
      const minSalary = parseInt(selectedFilters.salary);
      const internshipSalary = parseInt(internship.salary.replace(/[^0-9]/g, ''));
      if (internshipSalary < minSalary) return false;
    }
    return true;
  });

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
        color: "white",
        padding: "30px",
        borderRadius: "15px",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "36px", margin: "0 0 10px 0" }}>🎯 Internship Matches</h1>
        <p style={{ fontSize: "18px", opacity: 0.9, margin: "0 0 20px 0" }}>
          Based on your skills: {userSkills.join(", ")}
        </p>
        <div style={{ 
          display: "inline-flex", 
          gap: "15px",
          backgroundColor: "rgba(255,255,255,0.2)",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>{filteredInternships.length}</div>
            <div style={{ fontSize: "14px" }}>Matches Found</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {Math.round(filteredInternships.reduce((acc, curr) => acc + curr.match, 0) / filteredInternships.length) || 0}%
            </div>
            <div style={{ fontSize: "14px" }}>Avg Match</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>6</div>
            <div style={{ fontSize: "14px" }}>Companies</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#333", marginTop: "0", marginBottom: "20px" }}>🔍 Filter Internships</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>📍 Location</label>
            <select 
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
              style={{ 
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote</option>
              <option value="mountain view">Mountain View</option>
              <option value="seattle">Seattle</option>
              <option value="new york">New York</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>🏢 Type</label>
            <select 
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
              style={{ 
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              <option value="all">All Types</option>
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>💰 Min Salary</label>
            <select 
              value={selectedFilters.salary}
              onChange={(e) => setSelectedFilters({...selectedFilters, salary: e.target.value})}
              style={{ 
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              <option value="all">Any Salary</option>
              <option value="5000">$5,000+</option>
              <option value="5500">$5,500+</option>
              <option value="6000">$6,000+</option>
              <option value="6500">$6,500+</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>⏱️ Duration</label>
            <select 
              value={selectedFilters.duration}
              onChange={(e) => setSelectedFilters({...selectedFilters, duration: e.target.value})}
              style={{ 
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              <option value="all">Any Duration</option>
              <option value="3">3 months</option>
              <option value="4">4 months</option>
              <option value="6">6 months</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            Apply Filters
          </button>
          <button 
            onClick={() => setSelectedFilters({ location: "all", type: "all", salary: "all", duration: "all" })}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Internship Cards */}
      <div>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>
          🎯 Recommended for You ({filteredInternships.length} matches)
        </h2>
        
        <div style={{ display: "grid", gap: "25px" }}>
          {filteredInternships.map((internship) => {
            const matchColor = getMatchColor(internship.match);
            const matchedSkills = internship.skills.filter(skill => 
              userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                skill.toLowerCase().includes(userSkill.toLowerCase())
              )
            );
            const unmatchedSkills = internship.skills.filter(skill => 
              !userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase()) || 
                skill.toLowerCase().includes(userSkill.toLowerCase())
              )
            );

            return (
              <div key={internship.id} style={{ 
                backgroundColor: "white",
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
                border: `3px solid ${matchColor}30`
              }}>
                <div style={{ display: "flex" }}>
                  {/* Left Column - Company Info */}
                  <div style={{ 
                    width: "120px",
                    backgroundColor: "#f8fbff",
                    padding: "25px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: matchColor,
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                      marginBottom: "15px"
                    }}>
                      {internship.logo}
                    </div>
                    <div style={{ 
                      fontSize: "14px", 
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#333"
                    }}>
                      {internship.company}
                    </div>
                  </div>

                  {/* Middle Column - Details */}
                  <div style={{ flex: 1, padding: "25px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ 
                          margin: "0 0 10px 0", 
                          color: "#333",
                          fontSize: "22px"
                        }}>
                          {internship.title}
                        </h3>
                        <div style={{ display: "flex", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
                          <span style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#666"
                          }}>
                            📍 {internship.location}
                          </span>
                          <span style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#666"
                          }}>
                            🏢 {internship.type}
                          </span>
                          <span style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#666"
                          }}>
                            💰 {internship.salary}
                          </span>
                          <span style={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#666"
                          }}>
                            ⏱️ {internship.duration}
                          </span>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ 
                          fontSize: "36px", 
                          fontWeight: "bold", 
                          color: matchColor
                        }}>
                          {internship.match}%
                        </div>
                        <div style={{ 
                          color: "#666", 
                          fontSize: "14px",
                          marginTop: "5px"
                        }}>
                          Match Score
                        </div>
                      </div>
                    </div>

                    <p style={{ 
                      color: "#666", 
                      lineHeight: "1.6",
                      marginBottom: "20px"
                    }}>
                      {internship.description}
                    </p>

                    {/* Skills Match */}
                    <div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        marginBottom: "10px" 
                      }}>
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          Skills Match ({matchedSkills.length}/{internship.skills.length})
                        </span>
                        <span style={{ color: matchColor, fontWeight: "bold" }}>
                          {Math.round((matchedSkills.length / internship.skills.length) * 100)}% match
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {matchedSkills.map((skill, idx) => (
                          <span key={idx} style={{
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            fontWeight: "bold"
                          }}>
                            ✅ {skill}
                          </span>
                        ))}
                        {unmatchedSkills.map((skill, idx) => (
                          <span key={idx} style={{
                            backgroundColor: "#ffebee",
                            color: "#c62828",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "14px"
                          }}>
                            ⚠️ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Apply Button */}
                  <div style={{ 
                    width: "200px",
                    padding: "25px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fafafa",
                    borderLeft: "1px solid #eee"
                  }}>
                    <button style={{
                      width: "100%",
                      padding: "15px",
                      backgroundColor: matchColor,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginBottom: "15px"
                    }}>
                      🚀 Apply Now
                    </button>
                    
                    <div style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
                      <div style={{ marginBottom: "5px" }}>⏰ Apply by: 2 weeks</div>
                      <div>👥 45 applicants</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ 
                  height: "8px",
                  backgroundColor: "#e0e0e0"
                }}>
                  <div style={{
                    width: `${internship.match}%`,
                    height: "100%",
                    backgroundColor: matchColor,
                    borderRadius: "0 0 0 15px"
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div style={{ 
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginTop: "40px"
      }}>
        <h2 style={{ color: "#333", marginTop: "0", marginBottom: "25px" }}>📊 Matching Statistics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#1976d2" }}>
              {userSkills.length}
            </div>
            <div style={{ color: "#666" }}>Your Skills</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#4caf50" }}>
              {Math.round(filteredInternships.reduce((acc, curr) => acc + curr.match, 0) / filteredInternships.length) || 0}%
            </div>
            <div style={{ color: "#666" }}>Average Match</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#9c27b0" }}>
              {filteredInternships.length}
            </div>
            <div style={{ color: "#666" }}>Available Internships</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipMatches;

import React, { useState } from "react";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "Google",
      position: "Software Engineer Intern",
      appliedDate: "2024-01-15",
      status: "under_review",
      statusText: "Under Review",
      matchScore: 92,
      lastUpdate: "2 days ago",
      interviewDate: "2024-02-01",
      notes: "Technical interview scheduled"
    },
    {
      id: 2,
      company: "Microsoft",
      position: "Frontend Developer Intern",
      appliedDate: "2024-01-10",
      status: "interview",
      statusText: "Interview Scheduled",
      matchScore: 88,
      lastUpdate: "Yesterday",
      interviewDate: "2024-01-25",
      notes: "HR screening completed"
    },
    {
      id: 3,
      company: "Amazon",
      position: "Cloud Engineer Intern",
      appliedDate: "2024-01-05",
      status: "accepted",
      statusText: "Offer Received",
      matchScore: 83,
      lastUpdate: "3 days ago",
      offerDetails: "$6,200/month + Housing",
      notes: "Offer deadline: 2024-02-10"
    },
    {
      id: 4,
      company: "Facebook",
      position: "Full Stack Intern",
      appliedDate: "2024-01-03",
      status: "rejected",
      statusText: "Not Selected",
      matchScore: 78,
      lastUpdate: "1 week ago",
      notes: "Position filled internally"
    },
    {
      id: 5,
      company: "Netflix",
      position: "Data Science Intern",
      appliedDate: "2024-01-20",
      status: "applied",
      statusText: "Application Submitted",
      matchScore: 75,
      lastUpdate: "Just now",
      notes: "Awaiting response"
    },
    {
      id: 6,
      company: "Spotify",
      position: "DevOps Intern",
      appliedDate: "2024-01-18",
      status: "assessment",
      statusText: "Assessment Stage",
      matchScore: 70,
      lastUpdate: "Today",
      notes: "Coding assessment due: 2024-01-28"
    }
  ]);

  const [stats, setStats] = useState({
    total: 12,
    underReview: 4,
    interviews: 3,
    offers: 1,
    rejected: 2
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "accepted": return "#4caf50";
      case "interview": return "#2196f3";
      case "assessment": return "#9c27b0";
      case "under_review": return "#ff9800";
      case "applied": return "#607d8b";
      case "rejected": return "#f44336";
      default: return "#757575";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "accepted": return "🎉";
      case "interview": return "💼";
      case "assessment": return "📝";
      case "under_review": return "⏳";
      case "applied": return "📨";
      case "rejected": return "❌";
      default: return "📊";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const addApplication = () => {
    const newApp = {
      id: applications.length + 1,
      company: "New Company",
      position: "New Position",
      appliedDate: new Date().toISOString().split('T')[0],
      status: "applied",
      statusText: "Application Submitted",
      matchScore: 65,
      lastUpdate: "Just now",
      notes: "Application submitted successfully"
    };
    setApplications([newApp, ...applications]);
    setStats({...stats, total: stats.total + 1});
  };

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
        marginBottom: "30px"
      }}>
        <h1 style={{ fontSize: "36px", margin: "0 0 10px 0" }}>📊 Application Tracker</h1>
        <p style={{ fontSize: "18px", opacity: 0.9, margin: "0" }}>
          Track all your internship applications in one place
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {[
          { label: "Total Applications", value: stats.total, color: "#1976d2", icon: "📋" },
          { label: "Under Review", value: stats.underReview, color: "#ff9800", icon: "⏳" },
          { label: "Interviews", value: stats.interviews, color: "#2196f3", icon: "💼" },
          { label: "Offers", value: stats.offers, color: "#4caf50", icon: "🎉" },
          { label: "Rejected", value: stats.rejected, color: "#f44336", icon: "❌" }
        ].map((stat, index) => (
          <div key={index} style={{ 
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ 
              fontSize: "36px", 
              fontWeight: "bold", 
              color: stat.color,
              marginBottom: "5px"
            }}>
              {stat.value}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Application Button */}
      <div style={{ 
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Track a New Application</h3>
          <p style={{ margin: "0", color: "#666" }}>Add internships you've applied to manually</p>
        </div>
        <button 
          onClick={addApplication}
          style={{
            padding: "12px 30px",
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
          }}
        >
          ➕ Add Application
        </button>
      </div>

      {/* Applications Table */}
      <div style={{ 
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
        marginBottom: "30px"
      }}>
        <div style={{ 
          backgroundColor: "#f8fbff",
          padding: "20px 30px",
          borderBottom: "1px solid #eee"
        }}>
          <h2 style={{ margin: "0", color: "#333" }}>Your Applications ({applications.length})</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ 
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Company</th>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Position</th>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Applied Date</th>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Status</th>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Match Score</th>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Last Update</th>
                <th style={{ padding: "20px", textAlign: "left", color: "#666" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{ 
                  borderBottom: "1px solid #eee",
                  "&:hover": { backgroundColor: "#fafafa" }
                }}>
                  <td style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: getStatusColor(app.status),
                        color: "white",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold"
                      }}>
                        {app.company.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#333" }}>{app.company}</div>
                        <div style={{ color: "#666", fontSize: "14px" }}>Technology</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <div style={{ fontWeight: "bold", color: "#333" }}>{app.position}</div>
                    <div style={{ color: "#666", fontSize: "14px" }}>
                      {app.interviewDate ? `Interview: ${formatDate(app.interviewDate)}` : "No interview scheduled"}
                    </div>
                  </td>
                  <td style={{ padding: "20px", color: "#666" }}>
                    {formatDate(app.appliedDate)}
                  </td>
                  <td style={{ padding: "20px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      backgroundColor: `${getStatusColor(app.status)}20`,
                      color: getStatusColor(app.status),
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "14px"
                    }}>
                      {getStatusIcon(app.status)} {app.statusText}
                    </span>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ 
                        fontSize: "24px", 
                        fontWeight: "bold", 
                        color: getStatusColor(app.status)
                      }}>
                        {app.matchScore}%
                      </div>
                      <div style={{ color: "#666", fontSize: "12px" }}>Match</div>
                    </div>
                  </td>
                  <td style={{ padding: "20px", color: "#666" }}>
                    {app.lastUpdate}
                  </td>
                  <td style={{ padding: "20px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button style={{
                        padding: "8px 16px",
                        backgroundColor: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}>
                        View
                      </button>
                      <button style={{
                        padding: "8px 16px",
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline View */}
      <div style={{ 
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h2 style={{ color: "#333", marginTop: "0", marginBottom: "25px" }}>📅 Application Timeline</h2>
        <div style={{ 
          display: "flex", 
          overflowX: "auto",
          gap: "30px",
          padding: "20px 0"
        }}>
          {applications.slice(0, 4).map((app, index) => (
            <div key={app.id} style={{
              minWidth: "250px",
              backgroundColor: "#f8fbff",
              borderRadius: "10px",
              padding: "20px",
              borderLeft: `4px solid ${getStatusColor(app.status)}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: getStatusColor(app.status),
                  color: "white",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}>
                  {getStatusIcon(app.status)}
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#333" }}>{app.company}</div>
                  <div style={{ color: "#666", fontSize: "14px" }}>{app.position}</div>
                </div>
              </div>
              <div style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
                Applied: {formatDate(app.appliedDate)}
              </div>
              <div style={{ 
                fontSize: "12px",
                color: getStatusColor(app.status),
                backgroundColor: `${getStatusColor(app.status)}20`,
                padding: "4px 10px",
                borderRadius: "12px",
                display: "inline-block",
                marginBottom: "15px"
              }}>
                {app.statusText}
              </div>
              <p style={{ 
                color: "#666", 
                fontSize: "14px",
                margin: "10px 0",
                lineHeight: "1.5"
              }}>
                {app.notes}
              </p>
              <div style={{ 
                height: "6px",
                backgroundColor: "#e0e0e0",
                borderRadius: "3px",
                margin: "15px 0"
              }}>
                <div style={{
                  width: `${app.matchScore}%`,
                  height: "100%",
                  backgroundColor: getStatusColor(app.status),
                  borderRadius: "3px"
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px"
      }}>
        {/* Insights Card */}
        <div style={{ 
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ color: "#333", marginTop: "0", marginBottom: "25px" }}>💡 Insights</h2>
          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{
              padding: "15px",
              backgroundColor: "#e8f5e9",
              borderRadius: "10px",
              borderLeft: "4px solid #4caf50"
            }}>
              <div style={{ fontWeight: "bold", color: "#2e7d32", marginBottom: "5px" }}>
                ✅ High Match Applications
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Applications with match scores above 80% have 3x higher interview rate
              </div>
            </div>
            <div style={{
              padding: "15px",
              backgroundColor: "#fff3e0",
              borderRadius: "10px",
              borderLeft: "4px solid #ff9800"
            }}>
              <div style={{ fontWeight: "bold", color: "#f57c00", marginBottom: "5px" }}>
                ⚡ Response Time
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Average response time: 7-14 days. Follow up if no response after 2 weeks
              </div>
            </div>
            <div style={{
              padding: "15px",
              backgroundColor: "#f3e5f5",
              borderRadius: "10px",
              borderLeft: "4px solid #9c27b0"
            }}>
              <div style={{ fontWeight: "bold", color: "#7b1fa2", marginBottom: "5px" }}>
                📈 Success Rate
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Your current success rate: 25% (higher than platform average of 18%)
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Card */}
        <div style={{ 
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ color: "#333", marginTop: "0", marginBottom: "25px" }}>🎯 Recommendations</h2>
          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{
              padding: "15px",
              backgroundColor: "#e3f2fd",
              borderRadius: "10px"
            }}>
              <div style={{ fontWeight: "bold", color: "#1976d2", marginBottom: "5px" }}>
                1. Follow Up with Google
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Send a follow-up email to the recruiter. Your application has been under review for 2 weeks.
              </div>
            </div>
            <div style={{
              padding: "15px",
              backgroundColor: "#e3f2fd",
              borderRadius: "10px"
            }}>
              <div style={{ fontWeight: "bold", color: "#1976d2", marginBottom: "5px" }}>
                2. Prepare for Microsoft Interview
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Review data structures & algorithms. Interview scheduled for Jan 25.
              </div>
            </div>
            <div style={{
              padding: "15px",
              backgroundColor: "#e3f2fd",
              borderRadius: "10px"
            }}>
              <div style={{ fontWeight: "bold", color: "#1976d2", marginBottom: "5px" }}>
                3. Apply to 3 More Companies
              </div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                Increase your chances by applying to more positions matching your skills.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracker;

import React, { useState } from "react";
import ResumeUpload from "./components/resume/ResumeUpload";
import InternshipMatches from "./components/matching/InternshipMatches";
import ApplicationTracker from "./components/dashboard/ApplicationTracker";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({ name: "John Doe", email: "john@example.com", type: "student" });
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch(currentPage) {
      case "login":
        return <Login onLogin={handleLogin} />;
      case "register":
        return <Register />;
      case "resume":
        return <ResumeUpload />;
      case "matches":
        return <InternshipMatches />;
      case "tracker":
        return <ApplicationTracker />;
      case "dashboard":
        return renderDashboard();
      default:
        return renderHomePage();
    }
  };

  const renderDashboard = () => {
    return (
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px"
      }}>
        {/* Dashboard Header */}
        <div style={{ 
          background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "30px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "36px", margin: "0 0 10px 0" }}>👋 Welcome back, {user?.name}!</h1>
              <p style={{ fontSize: "18px", opacity: 0.9, margin: "0" }}>
                Student Dashboard • Stanford University • Computer Science
              </p>
            </div>
            <div style={{ 
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "15px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>85%</div>
              <div style={{ fontSize: "14px" }}>Profile Complete</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {[
            { label: "Applications", value: "12", color: "#1976d2", icon: "📋" },
            { label: "Interviews", value: "3", color: "#2196f3", icon: "💼" },
            { label: "Match Score", value: "85%", color: "#4caf50", icon: "🎯" },
            { label: "Skills", value: "8", color: "#9c27b0", icon: "⚡" }
          ].map((stat, index) => (
            <div key={index} style={{ 
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer"
            }} onClick={() => setCurrentPage(stat.label === "Applications" ? "tracker" : "matches")}>
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

        {/* Features Grid */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "30px"
        }}>
          {/* Resume Upload Card */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            cursor: "pointer"
          }} onClick={() => setCurrentPage("resume")}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px"
              }}>
                📄
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Upload Resume</h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>AI-powered skill extraction</p>
              </div>
            </div>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Upload your resume and let our AI extract your skills, education, and experience automatically.
            </p>
            <button style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              Upload Now →
            </button>
          </div>

          {/* Internship Matches Card */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            cursor: "pointer"
          }} onClick={() => setCurrentPage("matches")}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#4caf50",
                color: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px"
              }}>
                🎯
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Find Matches</h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Personalized recommendations</p>
              </div>
            </div>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Discover internships that match your skills with personalized match scores and recommendations.
            </p>
            <button style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              View Matches →
            </button>
          </div>

          {/* Application Tracker Card */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            cursor: "pointer"
          }} onClick={() => setCurrentPage("tracker")}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#2196f3",
                color: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px"
              }}>
                📊
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Track Applications</h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Monitor your progress</p>
              </div>
            </div>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Track all your internship applications in one place with status updates and interview schedules.
            </p>
            <button style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              Track Now →
            </button>
          </div>

          {/* Profile Card */}
          <div style={{ 
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#9c27b0",
                color: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px"
              }}>
                👤
              </div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Your Profile</h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Complete your profile</p>
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#666" }}>Profile Completion</span>
                <span style={{ fontWeight: "bold", color: "#1976d2" }}>85%</span>
              </div>
              <div style={{ 
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{ 
                  width: "85%",
                  height: "100%",
                  backgroundColor: "#1976d2",
                  borderRadius: "4px"
                }}></div>
              </div>
            </div>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Skills Added</span>
                <span style={{ fontWeight: "bold" }}>8/10</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Resume Uploaded</span>
                <span style={{ fontWeight: "bold", color: "#4caf50" }}>✅</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Profile Views</span>
                <span style={{ fontWeight: "bold" }}>24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomePage = () => {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f5f5f5",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
      }}>
        <h1 style={{ color: "#1976d2", textAlign: "center", fontSize: "48px", marginBottom: "10px" }}>🎯 Internship Matcher</h1>
        <p style={{ textAlign: "center", fontSize: "20px", color: "#666", marginBottom: "40px" }}>
          AI-powered platform connecting students with perfect internship opportunities
        </p>
        
        <div style={{ 
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "30px", 
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
        }}>
          
          {/* Hero Section */}
          <div style={{ 
            background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
            color: "white",
            padding: "50px",
            borderRadius: "15px",
            textAlign: "center",
            marginBottom: "50px"
          }}>
            <h2 style={{ fontSize: "36px", margin: "0 0 20px 0" }}>Find Your Dream Internship</h2>
            <p style={{ fontSize: "20px", opacity: 0.9, margin: "0 0 30px 0", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
              Upload your resume, get matched with internships, and track your applications - all in one platform
            </p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button 
                onClick={() => setCurrentPage("register")}
                style={{
                  padding: "15px 40px",
                  backgroundColor: "white",
                  color: "#1976d2",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Get Started Free
              </button>
              <button 
                onClick={() => setCurrentPage("login")}
                style={{
                  padding: "15px 40px",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Features */}
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            marginBottom: "50px"
          }}>
            {[
              {
                icon: "📄",
                title: "AI Resume Analysis",
                desc: "Upload your resume and let AI extract your skills automatically"
              },
              {
                icon: "🎯",
                title: "Smart Matching",
                desc: "Get personalized internship recommendations based on your profile"
              },
              {
                icon: "📊",
                title: "Application Tracking",
                desc: "Track all your applications with status updates and interviews"
              }
            ].map((feature, index) => (
              <div key={index} style={{ 
                backgroundColor: "#f8fbff",
                padding: "30px",
                borderRadius: "15px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>{feature.icon}</div>
                <h3 style={{ color: "#333", margin: "0 0 15px 0" }}>{feature.title}</h3>
                <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Demo Preview */}
          <div style={{ 
            backgroundColor: "#fff3e0",
            padding: "30px",
            borderRadius: "15px",
            marginBottom: "50px",
            border: "2px dashed #ff9800"
          }}>
            <h3 style={{ color: "#f57c00", textAlign: "center", margin: "0 0 20px 0" }}>🚀 Try Our Demo Features</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
              {[
                { label: "Resume Upload", page: "resume", color: "#1976d2" },
                { label: "Find Matches", page: "matches", color: "#4caf50" },
                { label: "Track Apps", page: "tracker", color: "#2196f3" },
                { label: "Dashboard", page: "dashboard", color: "#9c27b0" }
              ].map((demo, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentPage(demo.page)}
                  style={{
                    padding: "15px",
                    backgroundColor: demo.color,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer"
                  }}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: "center",
            paddingTop: "30px",
            borderTop: "1px solid #eee",
            color: "#666"
          }}>
            <p>Internship Matcher © 2024 • Connecting Students with Opportunities</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
              <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Privacy Policy</a>
              <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Terms of Service</a>
              <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => setCurrentPage("home")}>
          <span style={{ fontSize: "28px", fontWeight: "bold" }}>🎯</span>
          <h1 style={{ margin: "0", fontSize: "22px" }}>Internship Matcher</h1>
        </div>
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => setCurrentPage("dashboard")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === "dashboard" ? "white" : "transparent",
                  color: currentPage === "dashboard" ? "#1976d2" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage("resume")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === "resume" ? "white" : "transparent",
                  color: currentPage === "resume" ? "#1976d2" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Resume
              </button>
              <button 
                onClick={() => setCurrentPage("matches")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === "matches" ? "white" : "transparent",
                  color: currentPage === "matches" ? "#1976d2" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Matches
              </button>
              <button 
                onClick={() => setCurrentPage("tracker")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === "tracker" ? "white" : "transparent",
                  color: currentPage === "tracker" ? "#1976d2" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Tracker
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentPage("home")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === "home" ? "white" : "transparent",
                  color: currentPage === "home" ? "#1976d2" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage("login")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === "login" ? "white" : "transparent",
                  color: currentPage === "login" ? "#1976d2" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentPage("register")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "white",
                  color: "#1976d2",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Page Content */}
      {renderPage()}
    </div>
  );
}

export default App;

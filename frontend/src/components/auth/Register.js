import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registration attempt:", formData);
    alert("Account created successfully! (Demo)");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "500px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ 
          background: "linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)",
          color: "white",
          padding: "30px",
          textAlign: "center"
        }}>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>Create Account</h1>
          <p style={{ margin: "0", opacity: 0.9 }}>Join Internship Matcher today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              Full Name
            </label>
            <input 
              type="text" 
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              I am a
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["student", "recruiter"].map((type) => (
                <label key={type} style={{
                  flex: 1,
                  padding: "15px",
                  border: `2px solid ${formData.userType === type ? "#1976d2" : "#ddd"}`,
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: formData.userType === type ? "#e3f2fd" : "white"
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={(e) => setFormData({...formData, userType: e.target.value})}
                    style={{ display: "none" }}
                  />
                  <div style={{ fontSize: "24px", marginBottom: "5px" }}>
                    {type === "student" ? "🎓" : "💼"}
                  </div>
                  <div style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              Confirm Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px"
            }}
          >
            Create Account
          </button>

          <div style={{ textAlign: "center", color: "#666" }}>
            Already have an account?{" "}
            <a href="#" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
              Sign in here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

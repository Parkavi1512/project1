import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // In real app, call API here
    if (onLogin) {
      onLogin();
    }
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
        maxWidth: "400px",
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
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px" }}>Welcome Back</h1>
          <p style={{ margin: "0", opacity: 0.9 }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
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

          <div style={{ marginBottom: "30px" }}>
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
            Sign In
          </button>

          <div style={{ textAlign: "center", color: "#666" }}>
            Don't have an account?{" "}
            <a href="#" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
              Create one here
            </a>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <a href="#" style={{ color: "#1976d2", textDecoration: "none", fontSize: "14px" }}>
              Forgot password?
            </a>
          </div>
        </form>

        {/* Demo Login */}
        <div style={{ 
          padding: "20px 30px 30px",
          borderTop: "1px solid #eee"
        }}>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "15px" }}>
            Want to try the demo?
          </p>
          <button 
            onClick={onLogin}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            🚀 Try Demo Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

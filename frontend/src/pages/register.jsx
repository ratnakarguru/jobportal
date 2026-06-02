import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // 2. Initialize the navigate function

  async function createUser(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const userData = { name, email, password };

    try {
      const response = await fetch("http://127.0.0.1:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to create user.");

      alert("User Created Successfully!");
      setName(""); 
      setEmail(""); 
      setPassword("");
      
      // 3. Navigate the user to the login route after successful signup
      navigate("/login"); 

    } catch (error) {
      alert("Something went wrong connecting to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg border-0 p-4 w-100" style={{ maxWidth: "450px", borderRadius: "12px" }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark mb-1">Job Portal</h2>
          <p className="text-muted">Create your account to get started</p>
        </div>

        <form onSubmit={createUser}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wide">Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-control form-control-lg bg-light"
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wide">Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-control form-control-lg bg-light"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary small text-uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-control form-control-lg bg-light"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
            style={{ transition: "all 0.2s" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted mb-0">
            Already have an account?{" "}
            {/* 4. Use navigate here as well for the manual switch */}
            <button 
              onClick={() => navigate("/login")} 
              className="btn btn-link text-decoration-none fw-semibold p-0 align-baseline"
            >
              Login here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
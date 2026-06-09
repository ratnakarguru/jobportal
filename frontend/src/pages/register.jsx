import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

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
      
      // Navigate to your onboarding / login channel
      navigate("/login"); 

    } catch (error) {
      alert("Something went wrong connecting to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100 p-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="row g-0 min-vh-100">
        
        {/* LEFT PANEL: Branding & Visual Value (Hidden on Mobile) */}
        <div 
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
          style={{
            background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
          }}
        >
          {/* Top Brand Mark */}
          <div className="d-flex align-items-center">
            <span className="fw-bold fs-3 text-white tracking-tight">Work</span>
            <span className="fw-bold fs-3 text-opacity-75" style={{ color: "#38bdf8" }}>line</span>
          </div>

          {/* Middle Value Pitch Text */}
          <div className="my-auto" style={{ maxWidth: "500px" }}>
            <span className="badge bg-white bg-opacity-10 text-white mb-3 px-3 py-2 rounded-pill fw-semibold text-uppercase tracking-wider">
              Get Started
            </span>
            <h1 className="display-4 fw-bold mb-3 tracking-tight">
              Kickstart your professional path.
            </h1>
            <p className="fs-5 text-white-50 lh-base">
              Create an account to gain access to our custom parsing matches, simple submission monitoring tools, and elite tech employers.
            </p>
          </div>

          {/* Base Brand Footer Annotation */}
          <div className="small opacity-50">
            &copy; {new Date().getFullYear()} Workline Inc. All rights reserved.
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Registration Entry Sheet Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white px-4 py-5">
          <div className="w-100" style={{ maxWidth: "420px" }}>
            
            {/* Fallback Mobile Header Branding Component */}
            <div className="text-center mb-4 d-block d-lg-none">
              <span className="fw-bold h2 text-dark tracking-tight">Work</span>
              <span className="fw-bold h2 text-primary tracking-tight">line</span>
              <p className="text-muted small mt-1">Create your profile gateway</p>
            </div>

            {/* Core Header Elements */}
            <div className="mb-4">
              <h2 className="fw-bold text-dark tracking-tight mb-1">Create Account</h2>
              <p className="text-muted small">Fill out your information to build your career console profile</p>
            </div>

            <form onSubmit={createUser}>
              
              {/* Full Name Parameter Field */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  required 
                />
              </div>

              {/* Electronic Mail Parameter Field */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  required 
                />
              </div>

              {/* Security Key Credentials Field */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  required 
                />
              </div>

              {/* Operation Process Execution Action Button */}
              <button 
                type="submit" 
                disabled={loading} 
                className={`btn w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center transition-all ${
                  loading ? 'btn-secondary text-white-50' : 'btn-primary'
                }`}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Provisioning Account Profile...
                  </>
                ) : (
                  <>
                    Register <i className="bi bi-person-plus ms-2"></i>
                  </>
                )}
              </button>
            </form>

            {/* Split Account View Routing Core Navigation Link Elements */}
            <div className="text-center mt-4 pt-4 border-top">
              <p className="text-muted small mb-0">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate("/login")} 
                  className="btn btn-link text-decoration-none small fw-bold p-0 ms-1 align-baseline"
                >
                  Login here
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
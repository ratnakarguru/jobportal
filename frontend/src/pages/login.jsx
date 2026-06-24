import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loginUser(e) {
    e.preventDefault(); 

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const loginData = { email, password };

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        const userObj = data.user;
        const userId = userObj?.id;

        // Secure active user state caches locally
        localStorage.setItem("user_id", userId);
        localStorage.setItem("user", JSON.stringify(userObj));

        // Evaluate user onboarding status milestones
        const statusResponse = await fetch(`http://127.0.0.1:8000/onboarding/status/${userId}`);
        const status = await statusResponse.json();

        // Redirect directly to the parameter-free clean path channels
        if (!status.role_completed) {
          navigate("/select-role");
        } else if (!status.profile_completed) {
          navigate("/profile-setup");
        } else if (!status.resume_completed) {
          navigate("/upload-resume");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.detail || "Invalid email or password.");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Could not connect to the server. Is your FastAPI running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100 p-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="row g-0 min-vh-100">
        
        {/* LEFT PANEL: Branding & Taglines (Visible on Desktop) */}
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

          {/* Middle Value Text */}
          <div className="my-auto" style={{ maxWidth: "500px" }}>
            <span className="badge bg-white bg-opacity-10 text-white mb-3 px-3 py-2 rounded-pill fw-semibold text-uppercase tracking-wider">
              Now Live
            </span>
            <h1 className="display-4 fw-bold mb-3 tracking-tight">
              Find your dream job layout.
            </h1>
            <p className="fs-5 text-white-50 lh-base">
              Join thousands of developers tracking applications, matching parsing parameters, and landing milestone tech roles.
            </p>
          </div>

          {/* Bottom Footer Text */}
          <div className="small opacity-50">
            &copy; {new Date().getFullYear()} Workline Inc. All rights reserved.
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Authentication Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white px-4 py-5">
          <div className="w-100" style={{ maxWidth: "420px" }}>
            
            {/* Fallback Mobile Header Branding */}
            <div className="text-center mb-4 d-block d-lg-none">
              <span className="fw-bold h2 text-dark tracking-tight">Work</span>
              <span className="fw-bold h2 text-primary tracking-tight">line</span>
              <p className="text-muted small mt-1">Find your dream job overview console</p>
            </div>

            {/* Core Form Area Header */}
            <div className="mb-4">
              <h2 className="fw-bold text-dark tracking-tight mb-1">Welcome Back</h2>
              <p className="text-muted small">Please enter your account details to sign in</p>
            </div>

            <form onSubmit={loginUser}>
              {/* Email Address Field */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-0">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-decoration-none small fw-semibold text-primary">
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Action Button Trigger */}
              <button 
                type="submit" 
                className={`btn w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center transition-all ${
                  loading ? 'btn-secondary text-white-50' : 'btn-primary'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In <i className="bi bi-box-arrow-in-right ms-2"></i>
                  </>
                )}
              </button>
            </form>

            {/* Switch Account Routing Route Links */}
            <div className="mt-4 text-center border-top pt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/" className="text-primary text-decoration-none small fw-bold ms-1">
                Create Account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
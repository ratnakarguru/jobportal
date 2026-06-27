import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function RecruiterLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRecruiterLogin(e) {
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

        // Fetch onboarding role tracking indices
        const statusResponse = await fetch(`http://127.0.0.1:8000/onboarding/status/${userId}`);
        const status = await statusResponse.json();
        
        const userRole = userObj?.role || status.role_name;

        // ── ENFORCEMENT GUARD: Block candidate users from employer portal ──
        if (status.role_completed && userRole !== "recruiter") {
          alert("Access Denied: This workspace portal is reserved exclusively for corporate recruiters.");
          setLoading(false);
          return;
        }

        // Secure active recruiter token states locally
        localStorage.setItem("user_id", userId);
        localStorage.setItem("user", JSON.stringify(userObj));

        // ── ROUTING FORK ──
        if (!status.role_completed) {
          navigate("/select-role");
        } else if (!status.profile_completed) {
          navigate("/recruiter-setup");
        } else {
          navigate("/recruiter-dashboard");
        }
      } else {
        alert(data.detail || "Invalid corporate credentials.");
      }
    } catch (error) {
      console.error("Recruiter Authentication Exception:", error);
      alert("Could not establish handshake with server. Verify FastAPI runtime instance status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100 p-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="row g-0 min-vh-100">
        
        {/* LEFT PANEL: Executive Employer Branding Panel */}
        <div 
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          <div className="d-flex align-items-center">
            <span className="fw-bold fs-3 text-white tracking-tight">Work</span>
            <span className="fw-bold fs-3 text-primary" style={{ color: "#3b82f6" }}>line</span>
            <span className="badge bg-primary ms-2 px-2.5 py-1 text-uppercase small" style={{ fontSize: '0.65rem' }}>Talent Hub</span>
          </div>

          <div className="my-auto" style={{ maxWidth: "500px" }}>
            <span className="badge bg-white bg-opacity-10 text-white mb-3 px-3 py-2 rounded-pill fw-semibold text-uppercase tracking-wider">
              Enterprise Console
            </span>
            <h1 className="display-4 fw-black mb-3 tracking-tight">
              Recruit top-tier engineering talent.
            </h1>
            <p className="fs-5 text-white-50 lh-base">
              Access your dedicated workspace station to deploy job opening configurations, review automated parsing indices, and screen applicant queues.
            </p>
          </div>

          <div className="small opacity-50">
            &copy; {new Date().getFullYear()} Workline Inc. Enterprise Edition.
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Recruiter Login Credentials sheet */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white px-4 py-5">
          <div className="w-100" style={{ maxWidth: "420px" }}>
            
            <div className="text-center mb-4 d-block d-lg-none">
              <span className="fw-bold h2 text-dark tracking-tight">Work</span>
              <span className="fw-bold h2 text-primary tracking-tight">line</span>
              <p className="text-muted small mt-1">Enterprise Gateway</p>
            </div>

            <div className="mb-4">
              <h2 className="fw-bold text-dark tracking-tight mb-1">Recruiter Sign In</h2>
              <p className="text-muted small">Enter your corporate credentials to manage your positions</p>
            </div>

            <form onSubmit={handleRecruiterLogin}>
              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Corporate Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="recruiter@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-0">
                    Password
                  </label>
                  <a href="/forgot-password" style={{ color: "#3b82f6" }} className="text-decoration-none small fw-semibold">
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

              {/* Submit Trigger */}
              <button 
                type="submit" 
                className="btn btn-dark w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Authorizing Terminal Session...
                  </>
                ) : (
                  <>
                    Access Recruiter Console <i className="bi bi-box-arrow-in-right ms-2"></i>
                  </>
                )}
              </button>
            </form>

            {/* Redirection Link to standard login */}
            <div className="mt-4 text-center border-top pt-4">
              <span className="text-muted small">Are you looking for employment? </span>
              <Link to="/login" style={{ color: "#3b82f6" }} className="text-decoration-none small fw-bold ms-1">
                Go to Candidate Portal
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default RecruiterLogin;
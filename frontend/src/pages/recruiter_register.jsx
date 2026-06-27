import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function RecruiterRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      alert("Please populate all registration attributes.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password validation mismatch. Fields must be identical.");
      return;
    }

    setLoading(true);

    try {
      // 1. Core Authentication Registration request payload
      const registerRes = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        alert(registerData.detail || "Registration node failed to deploy.");
        setLoading(false);
        return;
      }

      // 2. Fetch the user row id using their email to cleanly append their role parameter
      const userRes = await fetch(`http://127.0.0.1:8000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      const userData = await userRes.json();
      
      if (userRes.ok) {
        const userId = userData.user.id;

        // 3. Directly bind the 'recruiter' structural string role to this account inside the database
        const roleRes = await fetch(`http://127.0.0.1:8000/select-role/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_name: "recruiter" })
        });

        if (roleRes.ok) {
          // Cache session keys flatly
          localStorage.setItem("user_id", userId);
          localStorage.setItem("user", JSON.stringify(userData.user));
          
          alert("Recruiter account authorized successfully!");
          // Bypasses role card screen and routes straight to workspace inputs
          navigate("/recruiter-setup");
        } else {
          navigate("/recruiter/login");
        }
      } else {
        navigate("/recruiter/login");
      }

    } catch (error) {
      console.error("Recruiter registration pipeline breakdown:", error);
      alert("Handshake mismatch with backend. Make sure your FastAPI Uvicorn engine is online.");
    } finally {
      setLoading(false);
    }
  };

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
              Employer Network
            </span>
            <h1 className="display-4 fw-black mb-3 tracking-tight">
              Build your corporate hiring workspace.
            </h1>
            <p className="fs-5 text-white-50 lh-base">
              Create an enterprise account today to gain complete access to inbound job pipelines, automatic algorithmic resume parsers, and candidate evaluation console tools.
            </p>
          </div>

          <div className="small opacity-50">
            &copy; {new Date().getFullYear()} Workline Inc. Enterprise Edition.
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Recruiter Registration Credentials Sheet */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white px-4 py-5">
          <div className="w-100" style={{ maxWidth: "420px" }}>
            
            <div className="text-center mb-4 d-block d-lg-none">
              <span className="fw-bold h2 text-dark tracking-tight">Work</span>
              <span className="fw-bold h2 text-primary tracking-tight">line</span>
              <p className="text-muted small mt-1">Enterprise Registration Gateway</p>
            </div>

            <div className="mb-4">
              <h2 className="fw-bold text-dark tracking-tight mb-1">Create Recruiter Account</h2>
              <p className="text-muted small">Set up your administration profiles to start posting open roles</p>
            </div>

            <form onSubmit={handleRegister}>
              {/* Full Name Input */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Full Name / Admin Name
                </label>
                <input
                  type="text" name="name"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="e.g. Rachel Green"
                  value={formData.name} onChange={handleChange} required
                />
              </div>

              {/* Corporate Email Input */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Corporate Email Address
                </label>
                <input
                  type="email" name="email"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="hr@company.com"
                  value={formData.email} onChange={handleChange} required
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password" name="password"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="••••••••"
                  value={formData.password} onChange={handleChange} required
                />
              </div>

              {/* Confirm Password Input */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password" name="confirmPassword"
                  className="form-control form-control-lg border-2 bg-light bg-opacity-25 shadow-none rounded-3 fs-6"
                  placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleChange} required
                />
              </div>

              {/* Submit Trigger Button */}
              <button 
                type="submit" 
                className="btn btn-dark w-100 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Provisioning Corporate Admin...
                  </>
                ) : (
                  <>
                    Register Corporate Portal <i className="bi bi-person-plus-fill ms-2"></i>
                  </>
                )}
              </button>
            </form>

            {/* Redirection Links */}
            <div className="mt-4 text-center border-top pt-4">
              <span className="text-muted small">Already managing an account? </span>
              <Link to="/recruiter/login" style={{ color: "#3b82f6" }} className="text-decoration-none small fw-bold ms-1">
                Sign In Here
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default RecruiterRegister;
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";


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

    const userId = data.user_id;

    // Save user id
    localStorage.setItem("user_id", userId);

    const statusResponse = await fetch(
      `http://127.0.0.1:8000/onboarding/status/${userId}`
    );

    const status = await statusResponse.json();

    if (!status.role_completed) {
        navigate(`/select-role/${userId}`);
    }
    else if (!status.profile_completed) {
        navigate(`/profile-setup/${userId}`);
    }
    else if (!status.resume_completed) {
        navigate(`/upload-resume/${userId}`);
    }
    else {
        navigate(`/dashboard/${userId}`);
    }

}else {

    alert(data.detail || "Invalid email or password.");
}

    } catch (error) {
      console.error("Login Error:", error);
      alert("Could not connect to the server. Is your FastAPI running?");
    } finally {
      setLoading(false);
    }
  }

  // Find the top return statement in your component and replace the outer div:
return (
  <div 
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "#f8fafc",
      position: "fixed", // Forces it to position itself relative to the screen
      top: 0,
      left: 0,
      margin: 0,
      padding: "20px"
    }}
  >
    {/* Bootstrap Card Container */}
    <div className="card shadow-lg p-4 w-100 border-0" style={{ maxWidth: "450px", borderRadius: "1rem", backgroundColor: "#ffffff" }}>
      
      <div className="card-body">
        <h2 className="text-center fw-bold text-dark mb-2">Welcome Back</h2>
        {/* ... rest of your form code stays exactly the same ... */}
          <p className="text-center text-muted mb-4">
            Please enter your details to sign in
          </p>

          <form onSubmit={loginUser}>
            
            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`btn w-100 py-2 fs-5 fw-bold ${loading ? 'btn-secondary' : 'btn-primary'}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Link back to Register Route */}
          <div className="mt-4 text-center">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/" className="text-primary text-decoration-none fw-semibold">
              Sign up here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
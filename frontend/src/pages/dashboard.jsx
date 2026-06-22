import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar"; 

function Dashboard() {
  const navigate = useNavigate();

  // Component States
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total_jobs: 0, applications: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Key Fix: Pull userId to the top level of the component scope so the JSX can see it!
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // If the token isn't in local storage, kick them back to login immediately
    if (!userId) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    fetchDashboard(userId, controller.signal);

    return () => controller.abort(); 
  }, [userId, navigate]); // Added standard router dependencies

  const fetchDashboard = async (currentUserId, signal) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/dashboard/${currentUserId}`, { signal });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to load dashboard.");
        setLoading(false);
        return;
      }

      setUser({ name: data.name, email: data.email });
      setStats({
        total_jobs: data.total_jobs,
        applications: data.applications,
        interviews: data.interviews,
      });
      setLoading(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Server error. Please try again.");
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted fw-medium">Loading your Workline dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center shadow-sm p-5 bg-white rounded-4" style={{ maxWidth: "400px" }}>
          <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3 d-block"></i>
          <p className="text-danger fw-semibold fs-5 mb-2">{error}</p>
          <p className="text-muted small mb-4">We encountered an issue pulling up your profile data.</p>
          <button className="btn btn-primary w-100 rounded-3 py-2" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Jobs Available",
      value: stats.total_jobs,
      icon: "bi-briefcase-fill",
      color: "primary",
    },
    {
      label: "Your Applications",
      value: stats.applications,
      icon: "bi-file-earmark-check-fill",
      color: "success",
    },
    {
      label: "Scheduled Interviews",
      value: stats.interviews,
      icon: "bi-calendar2-event-fill",
      color: "warning",
    },
  ];

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* <Navbar user={user} /> */}

      <div className="container py-5">
        
        {/* Big Hero Welcome Bar */}
        <div 
          className="p-5 mb-5 rounded-4 text-white shadow-sm d-flex flex-column justify-content-center"
          style={{
            background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
            minHeight: "200px"
          }}
        >
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-2 rounded-pill fw-semibold text-uppercase tracking-wider fs-7">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </span>
              <h1 className="display-5 fw-bold mb-2">Welcome to Workline</h1>
              <p className="fs-5 opacity-75 mb-0">
                Find your dream job, manage your applications, and track your career milestones.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              {/* Working Navigation Trigger */}
              <button 
                className="btn btn-light btn-lg px-4 py-3 rounded-3 fw-bold text-primary shadow-sm"
                onClick={() => navigate(`/jobs/${userId}`)} 
              >
                Explore Jobs <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Overview Heading */}
        <div className="d-flex align-items-center mb-4">
          <h4 className="fw-bold text-dark mb-0 me-3">Your Console Overview</h4>
          <div className="flex-grow-1 border-bottom opacity-25"></div>
        </div>

        {/* Stat Cards Grid */}
        <div className="row g-4">
          {statCards.map((card) => (
            <div className="col-md-12 col-lg-4" key={card.label}>
              <div className="card border-0 shadow-sm rounded-4 h-100 transition-all card-hover p-2">
                <div className="card-body d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h6
                      className="text-muted text-uppercase fw-bold mb-2"
                      style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
                    >
                      {card.label}
                    </h6>
                    <h1 className="display-6 mb-0 fw-extrabold text-dark tracking-tight">
                      {card.value.toLocaleString()}
                    </h1>
                  </div>
                  <div className={`bg-${card.color} bg-opacity-10 p-3 rounded-4`}>
                    <i className={`bi ${card.icon} text-${card.color} fs-2`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Help Footer */}
        <div className="text-center mt-5">
          <p className="text-muted small">
            Need help? Check out our <a href="/tips" className="text-decoration-none fw-medium">Job Hunting Guide</a> or update your profile visibility settings.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
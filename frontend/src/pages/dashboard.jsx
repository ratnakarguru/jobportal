import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user,     setUser]     = useState(null);
  const [stats,    setStats]    = useState({ total_jobs: 0, applications: 0, interviews: 0 });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchDashboard(userId);
  }, []);

  const fetchDashboard = async (userId) => {
    try {
      const res  = await fetch(`http://127.0.0.1:8000/dashboard/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to load dashboard.");
        return;
      }

      setUser({ name: data.name, email: data.email });
      setStats({
        total_jobs:   data.total_jobs,
        applications: data.applications,
        interviews:   data.interviews,
      });
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ── Avatar initial from name ──
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <p className="text-danger fw-semibold">{error}</p>
          <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label:   "Total Jobs",
      value:   stats.total_jobs,
      icon:    "bi-building",
      color:   "primary",
    },
    {
      label:   "Applications",
      value:   stats.applications,
      icon:    "bi-file-earmark-text",
      color:   "success",
    },
    {
      label:   "Interviews",
      value:   stats.interviews,
      icon:    "bi-calendar-check",
      color:   "warning",
    },
  ];

  return (
    <div className="min-vh-100 bg-light pb-5">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 fw-bold text-primary fs-4">
            <i className="bi bi-briefcase-fill me-2"></i>
            Workline
          </span>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-block text-end">
              <p className="mb-0 fw-semibold fs-6">{user?.name}</p>
              <small className="text-muted">{user?.email}</small>
            </div>

            {/* Avatar */}
            <div
              className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
              style={{ width: "40px", height: "40px", flexShrink: 0 }}
            >
              {getInitial(user?.name)}
            </div>

            <div className="vr mx-2" />

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm px-3 fw-semibold rounded-pill"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">

        {/* Welcome */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted fs-5">
            Here is your overview for today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="row g-4 mb-5">
          {statCards.map((card) => (
            <div className="col-md-4" key={card.label}>
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="card-body d-flex align-items-center">
                  <div className={`bg-${card.color} bg-opacity-10 p-3 rounded-4 me-4`}>
                    <i className={`bi ${card.icon} text-${card.color} fs-3`}></i>
                  </div>
                  <div>
                    <h6
                      className="text-muted text-uppercase fw-semibold mb-1"
                      style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}
                    >
                      {card.label}
                    </h6>
                    <h2 className="mb-0 fw-bold text-dark">{card.value}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
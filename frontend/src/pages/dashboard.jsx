import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar"; 

function Dashboard() {
  const navigate = useNavigate();

  const [user,    setUser]    = useState(null);
  const [stats,   setStats]   = useState({ total_jobs: 0, applications: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    fetchDashboard(userId, controller.signal);

    return () => controller.abort(); 
  }, []);

  const fetchDashboard = async (userId, signal) => {
    try {
      const res  = await fetch(`http://127.0.0.1:8000/dashboard/${userId}`, { signal });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to load dashboard.");
        setLoading(false);
        return;
      }

      setUser({ name: data.name, email: data.email });
      setStats({
        total_jobs:   data.total_jobs,
        applications: data.applications,
        interviews:   data.interviews,
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
          <p className="text-muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

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
      {/* Reusable Navbar Component */}
      <Navbar user={user} />

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
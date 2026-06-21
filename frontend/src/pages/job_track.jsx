import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";

function TrackerPage() {
  const navigate = useNavigate();

  // Component States
  const [userData, setUserData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("user_id");

  // 1. Instantly load authentication data cache
  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        setUserData(JSON.parse(cachedUser));
      } catch (e) {
        console.error("Error decoding local user payload:", e);
      }
    }
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // 2. Fetch all user applications from backend endpoint
  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/applications/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const appsArray = Array.isArray(data) ? data : data.applications || [];
        setApplications(appsArray);
        setFilteredApps(appsArray);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error pulling tracking entries:", error);
        setIsLoading(false);
      });
  }, [userId]);

  // 3. Dynamic client-side dynamic search and status categorization filters
  useEffect(() => {
    let result = [...applications];

    if (statusFilter !== "All") {
      result = result.filter((app) => app.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          (app.job_title && app.job_title.toLowerCase().includes(query)) ||
          (app.company && app.company.toLowerCase().includes(query))
      );
    }

    setFilteredApps(result);
  }, [searchTerm, statusFilter, applications]);

  // Dynamic helper function to return uniform color schemes per status metric
  const getStatusBadgeStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return { bg: "bg-primary bg-opacity-10 text-primary", label: "Review Pending" };
      case "interview":
      case "interviewing":
        return { bg: "bg-warning bg-opacity-10 text-warning-custom", label: "Interview Scheduled" };
      case "offered":
      case "accepted":
        return { bg: "bg-success bg-opacity-10 text-success", label: "Offer Received 🎉" };
      case "rejected":
      case "declined":
        return { bg: "bg-danger bg-opacity-10 text-danger", label: "Archived / Closed" };
      default:
        return { bg: "bg-secondary bg-opacity-10 text-secondary", label: "Processing" };
    }
  };

  // Compute metric distribution metrics for the pipeline summary row
  const countByStatus = (statusStr) => applications.filter((a) => a.status?.toLowerCase() === statusStr.toLowerCase()).length;

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .text-warning-custom { color: #d97706 !important; }
        .tracking-card { transition: transform 0.2s ease, box-shadow 0.2s ease; border: 1px solid rgba(0,0,0,0.04) !important; }
        .tracking-card:hover { transform: translateY(-3px); box-shadow: 0 12px 20px rgba(0,0,0,0.06) !important; }
        .metric-pill { cursor: pointer; transition: all 0.2s ease; }
        .metric-pill:hover { transform: scale(1.02); }
      `}</style>

      <Navbar user={userData} />

      {/* Page Title & Dashboard Heading */}
      <div className="bg-dark text-white py-4 mb-5 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div>
              <h1 className="fw-bold tracking-tight mb-1 fs-2">Application Tracker</h1>
              <p className="text-white-50 mb-0 small">Monitor review status updates, coding rounds, and response histories.</p>
            </div>
            <button className="btn btn-primary btn-sm rounded-3 px-3 fw-bold mt-2 mt-sm-0" onClick={() => navigate(`/jobs/${userId}`)}>
              <i className="bi bi-plus-lg me-1"></i> Apply For More Roles
            </button>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        
        {/* Pipeline Aggregates Dashboard Banner row */}
        <div className="row g-3 mb-5">
          {[
            { label: "Active Nodes", count: applications.length, color: "text-dark bg-white" },
            { label: "Under Review", count: countByStatus("applied"), color: "text-primary bg-primary bg-opacity-10" },
            { label: "Interviews", count: countByStatus("interview") + countByStatus("interviewing"), color: "text-warning-custom bg-warning bg-opacity-10" },
            { label: "Offers Locked", count: countByStatus("offered") + countByStatus("accepted"), color: "text-success bg-success bg-opacity-10" }
          ].map((item, idx) => (
            <div className="col-6 col-md-3" key={idx}>
              <div className={`p-3 rounded-4 border-0 shadow-sm text-center metric-pill ${item.color}`}>
                <span className="small d-block text-uppercase fw-bold tracking-wider mb-1 opacity-75" style={{ fontSize: "0.65rem" }}>{item.label}</span>
                <h3 className="fw-extrabold mb-0">{item.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Control Ribbon */}
        <div className="row g-3 align-items-center justify-content-between mb-4">
          <div className="col-md-5 col-lg-4">
            <div className="input-group shadow-sm rounded-3 overflow-hidden border-0">
              <span className="input-group-text bg-white border-0 text-muted ps-3"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-0 ps-2 fs-6 shadow-none py-2"
                placeholder="Search company or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5 col-lg-4 d-flex justify-content-md-end">
            <select
              className="form-select border-0 shadow-sm bg-white py-2 rounded-3 text-secondary shadow-none font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ maxWidth: "200px" }}
            >
              <option value="All">All Pipelines</option>
              <option value="applied">Review Pending</option>
              <option value="interview">Interviews</option>
              <option value="offered">Offers</option>
              <option value="rejected">Archived</option>
            </select>
          </div>
        </div>

        {/* Core Layout Evaluation Loops */}
        {isLoading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Parsing nodes...</span></div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="card border-0 shadow-sm text-center p-5 rounded-4 bg-white mx-auto" style={{ maxWidth: "500px" }}>
            <i className="bi bi-journal-x text-muted mb-3 d-block" style={{ fontSize: "3.5rem" }}></i>
            <h4 className="fw-bold text-dark">No Applications Logged</h4>
            <p className="text-muted small mb-0">Try clearing active pipeline status selections or browsing live roles.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredApps.map((app) => {
              const appStyles = getStatusBadgeStyles(app.status);
              return (
                <div className="col-md-6 col-lg-4" key={app.id || app._id}>
                  <div className="card tracking-card h-100 p-3 rounded-4 bg-white d-flex flex-column justify-content-between">
                    <div>
                      {/* Identity Row Context */}
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="d-flex align-items-center overflow-hidden">
                          <div className="bg-light border text-secondary rounded-3 d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "44px", height: "44px", flexShrink: 0 }}>
                            {app.company ? app.company.substring(0, 2).toUpperCase() : "JB"}
                          </div>
                          <div className="overflow-hidden">
                            <h6 className="mb-0 fw-bold text-dark text-truncate" title={app.job_title || app.title}>{app.job_title || app.title}</h6>
                            <span className="text-muted small fw-medium">{app.company}</span>
                          </div>
                        </div>
                        <span className={`badge px-2.5 py-1.5 rounded-3 small fw-semibold border-0 ${appStyles.bg}`}>
                          {appStyles.label}
                        </span>
                      </div>

                      {/* Informational Node Meta Parameters */}
                      <div className="bg-light p-2.5 rounded-3 mb-3 text-secondary small border border-light">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Timeline Routed:</span>
                          <strong className="text-dark">{app.applied_at || app.date || "Recent"}</strong>
                        </div>
                        {app.location && (
                          <div className="d-flex justify-content-between">
                            <span>Hub Coordinates:</span>
                            <strong className="text-dark text-truncate" style={{ maxWidth: "140px" }}>{app.location}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Action Links */}
                    <div className="pt-2 border-top d-flex align-items-center justify-content-between text-muted small">
                      <span>Ref ID: #{String(app.id || app._id).substring(0, 5)}</span>
                      <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold p-0" onClick={() => navigate(`/company/${encodeURIComponent(app.company)}`)}>
                        Workspace Overview <i className="bi bi-chevron-right small ms-0.5"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackerPage;
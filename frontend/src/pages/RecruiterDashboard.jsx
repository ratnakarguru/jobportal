import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Dashboard Core State Metrics
  const [companyProfile, setCompanyProfile] = useState(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
  });
  const [recentPostings, setRecentPostings] = useState([]);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchDashboardMetrics();
  }, [userId]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      // Fetches user profile data from your verified authentication endpoints
      const profileRes = await fetch(`http://127.0.0.1:8000/auth/user/${userId}`);
      if (!profileRes.ok) throw new Error("Could not restore workspace identity.");
      const profileData = await profileRes.json();
      setCompanyProfile(profileData);

      // Fetch dynamic stats metrics compiled through job application mapping tables
      const statsRes = await fetch(`http://127.0.0.1:8000/recruiter/dashboard/${userId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          activeJobs: statsData.active_jobs_count || 0,
          totalApplications: statsData.total_applications_received || 0,
          pendingReview: statsData.pending_review_count || 0,
        });
      }

      // Fetch the last 5 active job postings managed by this employer record
      const jobsRes = await fetch(`http://127.0.0.1:8000/jobs/recruiter/${userId}`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setRecentPostings(jobsData.slice(0, 5));
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load active workspace matrices. Refresh page to try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4 px-3 px-md-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container-fluid max-width-xl mx-auto">
        
        {/* Error Notification Alert */}
        {error && (
          <div className="alert alert-danger rounded-3 mb-4 shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {/* ── HEADER BANNER WORKSPACE CONSOLE ── */}
        <div className="card border-0 rounded-4 text-white p-4 p-md-5 mb-4 shadow-sm" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
          <div className="row align-items-center g-4">
            <div className="col-auto" style={{ display: companyProfile?.profile_photo ? "block" : "none" }}>
              <img 
                src={companyProfile?.profile_photo} 
                alt="Brand Logo" 
                className="bg-white p-2 rounded-3 shadow-sm border"
                style={{ width: "80px", height: "80px", objectFit: "contain" }} 
              />
            </div>
            <div className="col">
              <span className="badge bg-primary text-uppercase px-3 py-1.5 rounded-pill mb-2 fw-bold tracking-wider small">Hiring Workspace</span>
              <h1 className="fw-extrabold tracking-tight mb-1">{companyProfile?.name || "Corporate Admin Dashboard"}</h1>
              <p className="text-white-50 mb-0 small"><i className="bi bi-geo-alt me-1"></i> {companyProfile?.location || "Headquarters Node Unassigned"}</p>
            </div>
            <div className="col-md-auto text-md-end">
              <button 
                onClick={() => navigate("/post-job")} 
                className="btn btn-primary btn-lg fw-bold px-4 rounded-3 shadow d-inline-flex align-items-center gap-2 border-0"
                style={{ backgroundColor: "#2563eb" }}
              >
                <i className="bi bi-plus-circle"></i> Post a New Job opening
              </button>
            </div>
          </div>
        </div>

        {/* ── METRIC STATS PACKS OVERVIEW ROW ── */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase small fw-bold text-muted tracking-wider d-block mb-1">Active Listings</span>
                  <h2 className="display-6 fw-black text-dark mb-0">{stats.activeJobs}</h2>
                </div>
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 fs-3"><i className="bi bi-briefcase-fill"></i></div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase small fw-bold text-muted tracking-wider d-block mb-1">Total Proposals</span>
                  <h2 className="display-6 fw-black text-success mb-0">{stats.totalApplications}</h2>
                </div>
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 fs-3"><i className="bi bi-people-fill"></i></div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase small fw-bold text-muted tracking-wider d-block mb-1">Action Items (Unread)</span>
                  <h2 className="display-6 fw-black text-warning mb-0">{stats.pendingReview}</h2>
                </div>
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 fs-3"><i className="bi bi-envelope-open-fill"></i></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RECENT JOB LISTINGS MANAGEMENT CONSOLE ── */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-0">Active Recruitment Pools</h4>
              <p className="text-muted small mb-0">Monitor tracking indexes and applicant pipelines across active role criteria.</p>
            </div>
            <Link to="/manage-jobs" className="btn btn-sm btn-light border fw-semibold px-3 py-2 rounded-3 text-primary text-decoration-none">
              View All Postings
            </Link>
          </div>

          {recentPostings.length === 0 ? (
            <div className="text-center py-5 border rounded-3 bg-light bg-opacity-50">
              <div className="fs-1 text-muted mb-3"><i className="bi bi-folder-plus"></i></div>
              <h5 className="fw-bold text-dark mb-1">No active job indices found</h5>
              <p className="text-muted small mb-3">You haven't distributed any corporate employment parameters onto the live feed yet.</p>
              <button onClick={() => navigate("/post-job")} className="btn btn-sm btn-primary fw-bold px-3 py-2 rounded-3">
                Post First Job Open
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 border-top">
                <thead className="table-light">
                  <tr className="small text-uppercase tracking-wider text-muted">
                    <th className="py-3 border-0">Job Title</th>
                    <th className="py-3 border-0">Location</th>
                    <th className="py-3 border-0">Proposals</th>
                    <th className="py-3 border-0">Status</th>
                    <th className="py-3 border-0 text-end">Pipeline Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPostings.map((job) => (
                    <tr key={job.id} style={{ transition: "background .15s ease" }}>
                      <td className="py-3 fw-bold text-dark">{job.title}</td>
                      <td className="py-3 text-muted small"><i className="bi bi-geo-alt me-1"></i> {job.location || "Remote Node"}</td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark border px-2.5 py-1.5 rounded fw-bold">
                          {job.applicant_count || 0} applications
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`badge px-2.5 py-1.5 rounded-pill small fw-bold text-uppercase ${job.status === "OPEN" ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-secondary"}`}>
                          {job.status || "OPEN"}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <button 
                          onClick={() => navigate(`/job-applicants/${job.id}`)}
                          className="btn btn-sm btn-outline-primary fw-bold px-3 py-1.5 rounded-3 border-2 shadow-none"
                        >
                          Review Talent Pool <i className="bi bi-chevron-right ms-1"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default RecruiterDashboard;
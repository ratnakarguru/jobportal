import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Local profile state including new Company and Education fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    profile_photo: "",
    company_name: "",
    job_title: "",
    education_school: "",
    education_degree: ""
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchProfile(userId);
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/dashboard/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to load profile details.");
        return;
      }

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        profile_photo: data.profile_photo || "",
        company_name: data.company_name || "",
        job_title: data.job_title || "",
        education_school: data.education_school || "",
        education_degree: data.education_degree || ""
      });
    } catch (err) {
      setError("Failed to fetch data from the server.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Profile Completeness Tracker
  const completionPercentage = (() => {
    const fields = [
      formData.name, formData.email, formData.phone, formData.bio, 
      formData.profile_photo, formData.company_name, formData.job_title,
      formData.education_school, formData.education_degree
    ];
    const filledFields = fields.filter(field => field && field.toString().trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  })();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Dedicated prompt handler for changing profile photo directly
  const handlePhotoEdit = () => {
    const newUrl = prompt("Enter new Profile Image URL:", formData.profile_photo);
    if (newUrl !== null) {
      setFormData({ ...formData, profile_photo: newUrl });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    const userId = localStorage.getItem("user_id");

    try {
      const res = await fetch(`http://127.0.0.1:8000/profile/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to update profile.");
      }

      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* 1. Global Navbar Component */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <span className="navbar-brand fw-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
            <i className="bi bi-layers-half me-2"></i>EnterprisePortal
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center gap-2">
              <li className="nav-item">
                <button className="btn btn-sm btn-link nav-link text-white-50" onClick={() => navigate("/dashboard")}>Dashboard</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-danger rounded-pill px-3 text-white" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: "1100px" }}>
        
        {/* Navigation Action */}
        <button className="btn btn-link text-decoration-none text-muted mb-4 p-0" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
        </button>

        <div className="row g-4">
          {/* Card Left: Profile Avatar with Pencil Icon Overlay & Progress Indicator */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 text-center p-4 sticky-lg-top" style={{ top: "90px", zIndex: 10 }}>
              <div className="d-flex justify-content-center mb-3">
                <div className="position-relative">
                  {formData.profile_photo ? (
                    <img 
                      src={formData.profile_photo} 
                      alt="Profile" 
                      className="rounded-circle border img-thumbnail"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                  ) : (
                    <div 
                      className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow"
                      style={{ width: "120px", height: "120px", fontSize: "2.8rem" }}
                    >
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                  {/* Inline Pencil Change Overlay Action */}
                  <button 
                    type="button" 
                    onClick={handlePhotoEdit}
                    className="position-absolute bottom-0 end-0 bg-dark text-white border-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm hover-opacity"
                    style={{ width: "34px", height: "34px", transform: "translate(-5%, -5%)" }}
                    title="Change Profile Picture"
                  >
                    <i className="bi bi-pencil-fill small text-white"></i>
                  </button>
                </div>
              </div>
              <h4 className="fw-bold mb-1">{formData.name || "User Name"}</h4>
              <p className="text-muted small mb-3">{formData.email}</p>

              {/* Progress Tracking Bar UI */}
              <div className="mt-2 text-start">
                <div className="d-flex justify-content-between mb-1 small fw-semibold text-secondary">
                  <span>Profile Completion</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="progress rounded-pill" style={{ height: "8px" }}>
                  <div 
                    className={`progress-bar rounded-pill bg-${completionPercentage === 100 ? "success" : "primary"}`} 
                    role="progressbar" 
                    style={{ width: `${completionPercentage}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card Right: All Editable Form Information */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark m-0">Personal Information</h5>
                {!isEditing && (
                  <button className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold" onClick={() => setIsEditing(true)}>
                    <i className="bi bi-pencil-square me-1"></i> Edit Profile
                  </button>
                )}
              </div>

              {error && <div className="alert alert-danger py-2 fs-6">{error}</div>}
              {successMsg && <div className="alert alert-success py-2 fs-6">{successMsg}</div>}

              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Full Name</label>
                    <input 
                      type="text" name="name" className="form-control rounded-3" 
                      value={formData.name} onChange={handleChange} disabled={!isEditing} required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input 
                      type="email" name="email" className="form-control rounded-3" 
                      value={formData.email} onChange={handleChange} disabled={!isEditing} required 
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <input 
                      type="text" name="phone" className="form-control rounded-3" placeholder="Add mobile number" 
                      value={formData.phone} onChange={handleChange} disabled={!isEditing} 
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-semibold text-muted">Bio / Summary</label>
                    <textarea 
                      name="bio" rows="3" className="form-control rounded-3" placeholder="Tell us about yourself..." 
                      value={formData.bio} onChange={handleChange} disabled={!isEditing} 
                    />
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                {/* Company Block Info */}
                <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-briefcase me-2"></i>Company Details</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Company Name</label>
                    <input 
                      type="text" name="company_name" className="form-control rounded-3" placeholder="e.g. Acme Corp" 
                      value={formData.company_name} onChange={handleChange} disabled={!isEditing} 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Job Title</label>
                    <input 
                      type="text" name="job_title" className="form-control rounded-3" placeholder="e.g. Senior Software Engineer" 
                      value={formData.job_title} onChange={handleChange} disabled={!isEditing} 
                    />
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                {/* Educational Block Info */}
                <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-mortarboard me-2"></i>Educational Details</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">School / University</label>
                    <input 
                      type="text" name="education_school" className="form-control rounded-3" placeholder="e.g. Stanford University" 
                      value={formData.education_school} onChange={handleChange} disabled={!isEditing} 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Degree / Specialization</label>
                    <input 
                      type="text" name="education_degree" className="form-control rounded-3" placeholder="e.g. B.S. Computer Science" 
                      value={formData.education_degree} onChange={handleChange} disabled={!isEditing} 
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button type="button" className="btn btn-light btn-sm px-4 rounded-pill fw-semibold" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm px-4 rounded-pill fw-semibold">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
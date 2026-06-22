import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Skills input helper state
  const [newSkill, setNewSkill] = useState("");
  const [skillsList, setSkillsList] = useState(["React", "Node.js", "Python", "FastAPI", "Bootstrap"]);

  // Local state including comprehensive profile modules
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
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/jobs/dashboard/${userId}`);
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

  const handlePhotoEditClick = () => {
    const urlInput = prompt("Enter online Profile Image URL:", formData.profile_photo);
    if (urlInput !== null) {
      setFormData({ ...formData, profile_photo: urlInput.trim() });
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
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
        body: JSON.stringify({ ...formData, skills: skillsList }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to update profile.");
      }

      setSuccessMsg("Changes saved successfully!");
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify({
        id: userId,
        name: formData.name,
        email: formData.email
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .profile-hero {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .premium-card {
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          background: #ffffff;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05) !important;
        }
        .form-control:disabled, .form-textarea:disabled {
          background-color: #f8fafc !important;
          color: #64748b !important;
          border-color: #e2e8f0 !important;
        }
        .form-control:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
        }
        .section-icon-pill {
          background: rgba(59, 130, 246, 0.08);
          color: #2563eb;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
        .skill-badge {
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        .document-row {
          border: 1px dashed #cbd5e1;
          background: #f8fafc;
          border-radius: 12px;
          transition: background-color 0.2s ease;
        }
        .document-row:hover {
          background: #f1f5f9;
        }
      `}</style>

      {/* Hero Accent Header Box */}
      <div className="profile-hero text-white py-5 mb-4">
        <div className="container">
          <button className="btn btn-link text-decoration-none text-white-50 p-0 mb-3 small d-inline-flex align-items-center" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i> Back to Previous Page
          </button>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h2 className="fw-extrabold tracking-tight mb-1">Account & Settings</h2>
              <p className="text-white-50 small mb-0">Manage your profile visibility, resume attachments, and credentials.</p>
            </div>
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-semibold">
              <i className="bi bi-shield-check me-1"></i> Verified Candidate Profile
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1140px" }}>
        <div className="row g-4">
          
          {/* LEFT SIDE PANEL: Avatar Matrix & Quick Meta Cards */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4 sticky-lg-top" style={{ top: "90px" }}>
              
              {/* Primary Profile Anchor Card */}
              <div className="card premium-card rounded-4 text-center p-4">
                <div className="d-flex justify-content-center mb-4">
                  <div className="position-relative">
                    {formData.profile_photo ? (
                      <img 
                        src={formData.profile_photo} 
                        alt="Profile Avatar" 
                        className="rounded-circle border p-1"
                        style={{ width: "128px", height: "128px", objectFit: "cover" }}
                      />
                    ) : (
                      <div 
                        className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-extrabold shadow-sm"
                        style={{ width: "128px", height: "128px", fontSize: "3rem" }}
                      >
                        {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={handlePhotoEditClick}
                      className="position-absolute bottom-0 end-0 bg-primary text-white border-0 rounded-circle d-flex align-items-center justify-content-center shadow"
                      style={{ width: "36px", height: "36px" }}
                      title="Change Profile Picture"
                    >
                      <i className="bi bi-camera-fill text-white fs-6"></i>
                    </button>
                  </div>
                </div>

                <h4 className="fw-bold text-dark mb-1">{formData.name || "User Identity Node"}</h4>
                <p className="text-muted small mb-3">{formData.job_title || "Tech Professional"}</p>

                <hr className="my-3 opacity-25" />

                <div className="text-start mt-2">
                  <div className="d-flex justify-content-between mb-1.5 small fw-bold text-secondary">
                    <span>Profile Integrity</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <div className="progress rounded-pill bg-light border" style={{ height: "10px" }}>
                    <div 
                      className={`progress-bar rounded-pill transition-all bg-${completionPercentage === 100 ? "success" : "primary"}`} 
                      role="progressbar" 
                      style={{ width: `${completionPercentage}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Realism Addition 1: Quick Platform Quick-Metrics Card */}
              <div className="card premium-card rounded-4 p-4">
                <h6 className="fw-bold text-dark mb-3">Application Pipeline Summary</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light bg-opacity-50">
                    <span className="small text-muted fw-medium"><i className="bi bi-eye me-2 text-primary"></i>Profile Discoveries</span>
                    <strong className="small text-dark">42 views</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light bg-opacity-50">
                    <span className="small text-muted fw-medium"><i className="bi bi-send me-2 text-success"></i>Active Proposals</span>
                    <strong className="small text-dark">12 submitted</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE PANEL: Core Info Sections & Skills/Resume additions */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              
              {/* Module 1: Personal Details Form */}
              <div className="card premium-card rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="section-icon-pill">
                      <i className="bi bi-person-lines-fill fs-5"></i>
                    </div>
                    <h5 className="fw-bold text-dark m-0">Personal Details</h5>
                  </div>
                  {!isEditing && (
                    <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold shadow-sm" onClick={() => setIsEditing(true)}>
                      <i className="bi bi-pencil-square me-1"></i> Edit Profile
                    </button>
                  )}
                </div>

                {error && <div className="alert alert-danger py-2.5 rounded-3 small mb-4">{error}</div>}
                {successMsg && <div className="alert alert-success py-2.5 rounded-3 small mb-4">{successMsg}</div>}

                <form onSubmit={handleSave}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Full Name</label>
                      <input 
                        type="text" name="name" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" 
                        value={formData.name} onChange={handleChange} disabled={!isEditing} required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Email Address</label>
                      <input 
                        type="email" name="email" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" 
                        value={formData.email} onChange={handleChange} disabled={!isEditing} required 
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-secondary">Phone Number</label>
                      <input 
                        type="text" name="phone" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" placeholder="+91 XXXXX XXXXX" 
                        value={formData.phone} onChange={handleChange} disabled={!isEditing} 
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold text-secondary">Professional Pitch Summary</label>
                      <textarea 
                        name="bio" rows="3" className="form-control border-2 rounded-3 fs-6 py-2" placeholder="Tell companies about your engineering methodologies or tech expertise..." 
                        value={formData.bio} onChange={handleChange} disabled={!isEditing} 
                      />
                    </div>
                  </div>

                  <div className="border-top my-4 opacity-50"></div>

                  {/* Company Experience Contextual block */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="section-icon-pill">
                      <i className="bi bi-building-fill fs-5"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-0">Current Corporate Employment</h6>
                  </div>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Company Name</label>
                      <input 
                        type="text" name="company_name" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" placeholder="e.g. Acme Corp" 
                        value={formData.company_name} onChange={handleChange} disabled={!isEditing} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Job Title</label>
                      <input 
                        type="text" name="job_title" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" placeholder="e.g. Infrastructure Engineer" 
                        value={formData.job_title} onChange={handleChange} disabled={!isEditing} 
                      />
                    </div>
                  </div>

                  <div className="border-top my-4 opacity-50"></div>

                  {/* Educational Track block */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="section-icon-pill">
                      <i className="bi bi-mortarboard-fill fs-5"></i>
                    </div>
                    <h6 className="fw-bold text-dark mb-0">Highest Education Details</h6>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">University / Institute</label>
                      <input 
                        type="text" name="education_school" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" placeholder="e.g. Stanford University" 
                        value={formData.education_school} onChange={handleChange} disabled={!isEditing} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Degree Specialization</label>
                      <input 
                        type="text" name="education_degree" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" placeholder="e.g. B.S. Computer Science" 
                        value={formData.education_degree} onChange={handleChange} disabled={!isEditing} 
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                      <button type="button" className="btn btn-light px-4 py-2 rounded-pill fw-bold border" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm">Save Changes</button>
                    </div>
                  )}
                </form>
              </div>

              {/* Realism Addition 2: Core Core Skills Management Stack Module */}
              <div className="card premium-card rounded-4 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="section-icon-pill">
                    <i className="bi bi-tags-fill fs-5"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-0">Verified Tech Stack & Skills</h5>
                </div>
                <p className="text-muted small mb-3">Manage key skill tags used by the system matcher to filter recommended job indexes.</p>
                
                <form onSubmit={handleAddSkill} className="mb-3">
                  <div className="input-group" style={{ maxWidth: "400px" }}>
                    <input 
                      type="text" 
                      className="form-control shadow-none border-2" 
                      placeholder="Add tech stack tag (e.g. Docker, Vue)" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button className="btn btn-primary fw-semibold" type="submit"><i className="bi bi-plus-lg"></i> Add</button>
                  </div>
                </form>

                <div className="d-flex flex-wrap gap-2 mt-2">
                  {skillsList.map((skill, index) => (
                    <div key={index} className="skill-badge">
                      {skill}
                      <i className="bi bi-x-circle-fill text-muted cursor-pointer" style={{ fontSize: "0.9rem" }} onClick={() => handleRemoveSkill(skill)}></i>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realism Addition 3: Dynamic Document Index Attachment Ledger Module */}
              <div className="card premium-card rounded-4 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="section-icon-pill">
                    <i className="bi bi-file-earmark-text-fill fs-5"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-0">Documents Ledger</h5>
                </div>
                <p className="text-muted small mb-4">Your current parsing ledger asset deployed across live tracking pipelines.</p>

                <div className="p-3 d-flex align-items-center justify-content-between document-row flex-wrap gap-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3 me-3">
                      <i className="bi bi-file-earmark-pdf fs-3"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">Primary_Resume_Sync.pdf</h6>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>Uploaded: 2 days ago &bull; 412 KB</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-light border px-3 rounded-pill fw-semibold text-secondary" onClick={() => navigate("/upload-resume")}><i className="bi bi-arrow-repeat me-1"></i> Replace</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Profile;
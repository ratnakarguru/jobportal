import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function RecruiterSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Layout Flow Step Management State: 1 = Company Info, 2 = Brand Logo Upload
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Complete Recruiter Form Object State
  const [formData, setFormData] = useState({
    company_name: "",
    company_website: "",
    company_size: "",
    location: "",
    industry: "",
    bio: ""
  });

  const userId = localStorage.getItem("user_id");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setLogoFile(selectedFile);
      setLogoPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handles moving from Text Fields form into the Drop Zone Logo element
  const handleProceedToLogo = (e) => {
    e.preventDefault();
    if (!formData.company_name.trim() || !formData.industry || !formData.location.trim()) {
      alert("Please fill in all core parameters to initialize your workspace profile.");
      return;
    }
    setCurrentStep(2);
  };

  // Submits the complete company details and file stream payload to FastAPI together
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataPayload = new FormData();
    // Append standard company data attributes
    dataPayload.append("company_name", formData.company_name);
    dataPayload.append("company_website", formData.company_website);
    dataPayload.append("company_size", formData.company_size);
    dataPayload.append("location", formData.location);
    dataPayload.append("industry", formData.industry);
    dataPayload.append("bio", formData.bio);
    
    // Append the logo file asset if uploaded
    if (logoFile) {
      dataPayload.append("logo", logoFile);
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/recruiter/setup/${userId}`, {
        method: "POST",
        body: dataPayload // Sent seamlessly as Multipart Form Data
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Recruiter workspace index successfully deployed!");
        navigate("/recruiter-dashboard");
      } else {
        alert(responseData.detail || "Failed to configure recruiter console parameters.");
      }
    } catch (err) {
      console.error(err);
      alert("Server sync timeout. Please make sure your FastAPI app instance is active.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .setup-card {
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          background: #ffffff;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06) !important;
          border-radius: 16px !important;
        }
        .form-control:focus, .form-select:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
        }
        .step-progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #cbd5e1;
          transition: background-color 0.3s ease;
        }
        .step-progress-dot.active {
          background-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        }
        .drop-zone {
          border: 2px dashed #cbd5e1;
          background-color: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .drop-zone:hover {
          background-color: #f1f5f9;
          border-color: #2563eb;
        }
      `}</style>

      <div className="card setup-card p-4 p-md-5 w-100" style={{ maxWidth: "680px" }}>
        
        {/* Step-by-Step Context Indicator */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold text-uppercase small tracking-wider">
            Step {currentStep} of 2
          </span>
          <div className="d-flex gap-2">
            <div className={`step-progress-dot ${currentStep >= 1 ? "active" : ""}`}></div>
            <div className={`step-progress-dot ${currentStep === 2 ? "active" : ""}`}></div>
          </div>
        </div>

        {/* Dynamic Headers based on step positioning */}
        <div className="text-center mb-5">
          <h2 className="fw-extrabold text-dark tracking-tight mb-2">
            {currentStep === 1 ? "Create Employer Profile" : "Upload Brand Assets"}
          </h2>
          <p className="text-muted small">
            {currentStep === 1 
              ? "Establish your system baseline parameters to begin distributing corporate job opening indices." 
              : "Deploy a high-resolution logo signature to improve applicant discovery metrics across candidates' feeds."}
          </p>
        </div>

        {/* ── PHASE 1: CORE TEXT FIELDS DATA FORM ── */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToLogo}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" name="company_name" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" 
                  placeholder="e.g. Acme Corporation" required value={formData.company_name} onChange={handleChange} 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Corporate Website</label>
                <input 
                  type="url" name="company_website" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" 
                  placeholder="https://acme.org" value={formData.company_website} onChange={handleChange} 
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Industry Sector</label>
                <select 
                  name="industry" className="form-select form-select-lg border-2 rounded-3 fs-6 py-2" 
                  required value={formData.industry} onChange={handleChange}
                >
                  <option value="">Select Domain</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Fintech">Financial Engineering / Fintech</option>
                  <option value="Healthcare">Healthcare & Biotech</option>
                  <option value="E-commerce">Retail & E-commerce</option>
                  <option value="AI / Research">Generative AI & Data Infrastructure</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Company Scale Size</label>
                <select 
                  name="company_size" className="form-select form-select-lg border-2 rounded-3 fs-6 py-2" 
                  value={formData.company_size} onChange={handleChange}
                >
                  <option value="">Select Scale</option>
                  <option value="1-10">1-10 Employees (Early Stage)</option>
                  <option value="11-50">11-50 Employees (Growth Series)</option>
                  <option value="51-200">51-200 Employees (Mid Market)</option>
                  <option value="201+">201+ Employees (Enterprise Segment)</option>
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Headquarters Location</label>
                <input 
                  type="text" name="location" className="form-control form-control-lg border-2 rounded-3 fs-6 py-2" 
                  placeholder="e.g. Bengaluru, India" required value={formData.location} onChange={handleChange} 
                />
              </div>

              <div className="col-md-12">
                <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Company Pitch Overview</label>
                <textarea 
                  name="bio" rows="4" className="form-control border-2 rounded-3 fs-6 py-2" 
                  placeholder="Summarize architectural goals, production engineering strategies, workspace cultures, or talent philosophies..." 
                  value={formData.bio} onChange={handleChange} 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold fs-6 mt-5 shadow-sm">
              Save & Proceed to Logo <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </form>
        )}

        {/* ── PHASE 2: INTERACTIVE MEDIA LOGO DROPZONE ── */}
        {currentStep === 2 && (
          <form onSubmit={handleFinalSubmit}>
            <div 
              className="drop-zone p-5 text-center rounded-4 mb-4 position-relative"
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" ref={fileInputRef} className="d-none" 
                accept=".png,.jpg,.jpeg,.svg" onChange={handleFileChange} 
              />

              {logoPreview ? (
                <div className="py-2">
                  <img 
                    src={logoPreview} alt="Logo Preview" 
                    className="img-thumbnail rounded-3 mb-3 shadow-sm"
                    style={{ maxWidth: "120px", maxHeight: "120px", objectFit: "contain" }} 
                  />
                  <h6 className="fw-bold text-dark mb-1">{logoFile?.name}</h6>
                  <span className="text-muted small">{(logoFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="py-3">
                  <div className="text-primary display-5 mb-3">
                    <i className="bi bi-image-fill"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Upload Corporate Badge Asset</h5>
                  <p className="text-muted small mb-0">Drag and drop file selection or click inside boundary field.<br />Supports SVG, PNG, JPG inside a 2MB sizing envelope.</p>
                </div>
              )}
            </div>

            {/* Step navigation control panel footer panel */}
            <div className="d-flex gap-3 mt-4">
              <button 
                type="button" className="btn btn-light border fw-bold px-4 py-2.5 rounded-pill w-50"
                onClick={() => setCurrentStep(1)} disabled={isLoading}
              >
                Back
              </button>
              <button 
                type="submit" className="btn btn-success fw-bold px-4 py-2.5 rounded-pill w-100 shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Deploying Workspace Node...
                  </>
                ) : (
                  <>✓ Deploy Console Configuration</>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default RecruiterSetup;
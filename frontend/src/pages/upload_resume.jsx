import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function UploadResume() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "candidate";
  
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFinish = () => {
    // Save everything to database here, then go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center py-5">
      <div className="card shadow-lg border-0 p-4 p-md-5 w-100" style={{ maxWidth: "550px", borderRadius: "12px" }}>
        
        <div className="text-center mb-4">
          <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill text-uppercase tracking-wide">
            Final Step
          </span>
          <h3 className="fw-bold text-dark">
            {role === "candidate" ? "Upload your Resume" : "Upload Company Logo"}
          </h3>
          <p className="text-muted">
            {role === "candidate" 
              ? "A complete profile increases your chances of getting hired." 
              : "Help candidates recognize your brand on job postings."}
          </p>
        </div>

        {/* Drag & Drop Upload Area */}
        <div 
          className="position-relative p-5 text-center bg-light rounded-4 mb-4"
          style={{ border: "2px dashed #cbd5e1", transition: "border-color 0.2s" }}
        >
          <input 
            type="file" 
            className="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
            style={{ cursor: "pointer" }}
            onChange={handleFileChange}
            accept={role === "candidate" ? ".pdf,.doc,.docx" : ".jpg,.png,.svg"}
          />
          
          <div className="text-primary mb-3">
            <i className={`bi ${role === "candidate" ? "bi-file-earmark-pdf" : "bi-image"} fs-1`}></i>
          </div>
          
          {file ? (
            <div>
              <h6 className="fw-bold text-dark mb-1">{file.name}</h6>
              <small className="text-success fw-semibold"><i className="bi bi-check-circle-fill me-1"></i> File selected</small>
            </div>
          ) : (
            <div>
              <h6 className="fw-bold text-dark mb-1">Click to upload or drag and drop</h6>
              <small className="text-muted">
                {role === "candidate" ? "PDF, DOC, or DOCX (Max 5MB)" : "SVG, PNG, or JPG (Max 2MB)"}
              </small>
            </div>
          )}
        </div>

        <div className="d-flex gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-light fw-bold w-50">
            Back
          </button>
          <button onClick={handleFinish} className="btn btn-primary fw-bold w-100 shadow-sm">
            Complete Setup
          </button>
        </div>

      </div>
    </div>
  );
}

export default UploadResume;
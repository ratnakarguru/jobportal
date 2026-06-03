import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function UploadResume() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "candidate";

  const [file,       setFile]       = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [uploaded,   setUploaded]   = useState(false);
  const [error,      setError]      = useState("");

  const handleFileChange = (e) => {
    setError("");
    setUploaded(false);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("Session expired. Please log in again.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://127.0.0.1:8000/resume/${userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploaded(true);
      } else {
        setError(data.detail || "Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center py-5">
      <div
        className="card shadow-lg border-0 p-4 p-md-5 w-100"
        style={{ maxWidth: "550px", borderRadius: "12px" }}
      >
        <div className="text-center mb-4">
          <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill text-uppercase">
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

        {/* Drop Zone */}
        <div
          className="position-relative p-5 text-center bg-light rounded-4 mb-3"
          style={{ border: "2px dashed #cbd5e1" }}
        >
          <input
            type="file"
            className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
            style={{ cursor: "pointer" }}
            onChange={handleFileChange}
            accept={role === "candidate" ? ".pdf" : ".jpg,.png,.svg"}
            disabled={uploading}
          />

          <div className="text-primary mb-3" style={{ fontSize: "2.5rem" }}>
            {role === "candidate" ? "📄" : "🖼️"}
          </div>

          {file ? (
            <div>
              <h6 className="fw-bold text-dark mb-1">{file.name}</h6>
              <small className="text-muted">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </small>
            </div>
          ) : (
            <div>
              <h6 className="fw-bold text-dark mb-1">
                Click to upload or drag and drop
              </h6>
              <small className="text-muted">
                {role === "candidate" ? "PDF only · Max 5MB" : "SVG, PNG, JPG · Max 2MB"}
              </small>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "0.85rem" }}>
            ⚠ {error}
          </div>
        )}

        {/* Upload Success Message */}
        {uploaded && (
          <div className="alert alert-success py-2 px-3 mb-3 rounded-3 d-flex align-items-center gap-2" style={{ fontSize: "0.85rem" }}>
            <span>✅</span>
            <span><strong>{file?.name}</strong> uploaded successfully!</span>
          </div>
        )}

        {/* Buttons */}
        <div className="d-flex gap-3 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-light fw-bold w-50"
            disabled={uploading}
          >
            Back
          </button>

          {/* Upload button → swaps to Complete Setup after success */}
          {!uploaded ? (
            <button
              onClick={handleUpload}
              className="btn btn-primary fw-bold w-100 shadow-sm d-flex justify-content-center align-items-center gap-2"
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Uploading...
                </>
              ) : (
                "Upload Resume"
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-success fw-bold w-100 shadow-sm"
            >
              ✓ Complete Setup
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default UploadResume;
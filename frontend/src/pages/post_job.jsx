import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PostJob() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    experience: "",
    qualification: "",
    description: "",
    skills: "",
    responsibilities: "",
    benefits: ""
  });

  const userId = localStorage.getItem("user_id");

  // Fetch the company profile name on mount to anchor the job post row
  useEffect(() => {
    if (!userId) {
      navigate("/recruiter/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/auth/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.company_name) {
          setCompanyName(data.company_name);
        } else {
          alert("Please complete your recruiter workspace setup before posting a job.");
          navigate("/recruiter-setup");
        }
      })
      .catch((err) => console.error("Error fetching recruiter metadata:", err));
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Build payload matching your backend Job schema layout columns
    const payload = {
      title: formData.title,
      company: companyName, // Automatically bound to the logged-in recruiter profile
      location: formData.location,
      salary: formData.salary,
      experience: formData.experience,
      qualification: formData.qualification,
      description: formData.description,
      skills: formData.skills, // Comma-separated string values
      responsibilities: formData.responsibilities, // Comma-separated string values
      benefits: formData.benefits // Comma-separated string values
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/jobs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Job opening successfully published to the live feed!");
        navigate("/recruiter-dashboard");
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to submit job requirements.");
      }
    } catch (err) {
      console.error(err);
      alert("Network communication timeout. Is your FastAPI engine instance running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5 px-3 px-md-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="card shadow-sm border-0 mx-auto p-4 p-md-5 w-100" style={{ maxWidth: "800px", borderRadius: "16px" }}>
        
        <div className="text-center mb-5">
          <span className="badge bg-dark px-3 py-1.5 rounded-pill mb-2 text-uppercase small tracking-wider fw-bold">
            Publish Opportunity
          </span>
          <h2 className="fw-black text-dark mb-1">Create Job Requisition</h2>
          <p className="text-muted small">Distribute an optimization index requirement pool across the Workline candidate search network.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            
            {/* Core Job Meta Info Row */}
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Job Title</label>
              <input type="text" name="title" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. Senior Full Stack Engineer" required value={formData.title} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Location / Workspace Model</label>
              <input type="text" name="location" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. Bengaluru / Remote" required value={formData.location} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Compensation Range</label>
              <input type="text" name="salary" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. 18 - 24 LPA" value={formData.salary} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Experience Bracket</label>
              <input type="text" name="experience" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. 3+ Years" value={formData.experience} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Minimum Qualification</label>
              <input type="text" name="qualification" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. B.Tech / MCA" value={formData.qualification} onChange={handleChange} />
            </div>

            {/* Core Text Body Areas */}
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Job Description</label>
              <textarea name="description" rows="5" className="form-control border-2 rounded-3 fs-6" placeholder="Provide a detailed roadmap explaining project engineering missions, expected architectures, and organizational team operations..." required value={formData.description} onChange={handleChange} />
            </div>

            {/* Matrix Data Sets Array Parsing inputs */}
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Required Technical Skills <span className="text-muted lowercase font-normal">(Comma separated)</span></label>
              <input type="text" name="skills" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. Python, FastAPI, React, PostgreSQL, Docker" required value={formData.skills} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Core Responsibilities <span className="text-muted lowercase font-normal">(Comma separated)</span></label>
              <textarea name="responsibilities" rows="3" className="form-control border-2 rounded-3 fs-6" placeholder="e.g. Maintain production APIs, Architect responsive UI modules, Deploy CI/CD pipelines" value={formData.responsibilities} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider">Benefits & Perks <span className="text-muted lowercase font-normal">(Comma separated)</span></label>
              <input type="text" name="benefits" className="form-control py-2 border-2 rounded-3 fs-6" placeholder="e.g. Remote Flexibility, Medical Coverage, Equity Stocks" value={formData.benefits} onChange={handleChange} />
            </div>

          </div>

          {/* Action Footer Actions Row */}
          <div className="d-flex gap-3 justify-content-end mt-5 border-top pt-4">
            <button type="button" className="btn btn-light border fw-bold px-4 py-2.5 rounded-pill shadow-none" onClick={() => navigate(-1)} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary fw-bold px-5 py-2.5 rounded-pill shadow-sm border-0" style={{ backgroundColor: "#2563eb" }} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Publishing Listing...
                </>
              ) : (
                "Deploy Job Listing"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PostJob;
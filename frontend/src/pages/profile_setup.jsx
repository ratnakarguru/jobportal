import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Optional: Include Bootstrap Icons in your project for the icons to render properly
// import "bootstrap-icons/font/bootstrap-icons.css";

function ProfileSetup() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "candidate";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setIsFetching(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}`);
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        fullName: data.name || "",
      }));
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem("user_id");

    try {
      const response = await fetch(`http://127.0.0.1:8000/profiles/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: formData.skills,
          education: formData.education,
          experience: formData.experience,
          location: formData.location,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/upload-resume", { state: { role } });
      } else {
        alert(data.detail || "Failed to save profile");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center py-5 px-3"
      style={{
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
      }}
    >
      <div
        className="card border-0 shadow-sm w-100 bg-white"
        style={{
          maxWidth: "800px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* Top Progress Bar */}
        <div className="progress" style={{ height: "6px", borderRadius: 0 }}>
          <div
            className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: "66%" }}
            aria-valuenow="66"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <div className="p-4 p-md-5">
          <div className="text-center mb-5">
            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 mb-3 fw-semibold">
              Step 2 of 3
            </span>
            <h2 className="fw-bold text-dark mb-2">Complete Your Profile</h2>
            <p className="text-muted">
              Tell us a bit more about yourself to help us find the best matches.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Personal Details Section */}
              <div className="col-12">
                <h6 className="text-uppercase text-muted fw-bold mb-0" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                  Personal Details
                </h6>
                <hr className="mt-2 mb-0" />
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control bg-light"
                    id="fullName"
                    value={formData.fullName}
                    placeholder="Full Name"
                    readOnly
                  />
                  <label htmlFor="fullName">Full Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />
                  <label htmlFor="phone">Phone Number</label>
                </div>
              </div>

              {/* Professional Details Section */}
              <div className="col-12 mt-4">
                <h6 className="text-uppercase text-muted fw-bold mb-0" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>
                  Professional Details
                </h6>
                <hr className="mt-2 mb-0" />
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="education"
                    className="form-control"
                    id="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Education"
                    required
                  />
                  <label htmlFor="education">Highest Education (e.g., B.Tech)</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="experience"
                    className="form-control"
                    id="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Experience"
                    required
                  />
                  <label htmlFor="experience">Years of Experience</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                  />
                  <label htmlFor="location">Current Location</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="skills"
                    className="form-control"
                    id="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Skills"
                    required
                  />
                  <label htmlFor="skills">Top Skills (Comma separated)</label>
                </div>
              </div>

              <div className="col-12 mt-5">
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Save & Continue"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
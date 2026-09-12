import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaTools,
  FaLinkedin,
  FaGlobe,
  FaBriefcase,
  FaGraduationCap,
  FaFileAlt,
  FaEdit,
  FaArrowLeft,
  FaEnvelope,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_URL } from "../config";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Get user details
      const userResponse = await fetch(
        `${API_URL}/users/${userId}`
      );

      if (!userResponse.ok) {
        throw new Error("Unable to fetch user details");
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Get profile details
      const profileResponse = await fetch(
        `${API_URL}/profiles/${userId}`
      );

      if (!profileResponse.ok) {
        throw new Error("Unable to fetch profile details");
      }

      const profileData = await profileResponse.json();
      setProfile(profileData);

    } catch (err) {
      console.error(err);
      setError("Unable to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate(`/dashboard/${userId}`);
  };

  const editProfile = () => {
    navigate(`/profile-setup/${userId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>

        <button className="btn btn-primary" onClick={goToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Profile information not available.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">

          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={goToDashboard}
          >
            Workline
          </span>

          <button
            className="btn btn-light"
            onClick={goToDashboard}
          >
            <FaArrowLeft className="me-2" />
            Dashboard
          </button>

        </div>
      </nav>

      {/* MAIN */}
      <div className="container py-5">

        {/* PROFILE HEADER */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">

            <div className="row align-items-center">

              <div className="col-md-8">

                <div className="d-flex align-items-center">

                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "32px",
                    }}
                  >
                    <FaUser />
                  </div>

                  <div>
                    <h2 className="fw-bold mb-1">
                      {profile.full_name || user?.name || "User"}
                    </h2>

                    <p className="text-muted mb-1">
                      {profile.designation || "Candidate"}
                    </p>

                    <p className="text-muted mb-0">
                      <FaEnvelope className="me-2" />
                      {user?.email || "Not available"}
                    </p>
                  </div>

                </div>

              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <button
                  className="btn btn-primary px-4"
                  onClick={editProfile}
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">
              <FaUser className="text-primary me-2" />
              Personal Information
            </h5>
          </div>

          <div className="card-body">

            <div className="row">

              <InfoItem
                label="Full Name"
                value={profile.full_name || user?.name}
              />

              <InfoItem
                label="Email"
                value={user?.email}
              />

              <InfoItem
                label="Phone"
                value={profile.phone}
              />

              <InfoItem
                label="Location"
                value={profile.location}
              />

              <InfoItem
                label="Expected CTC"
                value={
                  profile.expected_ctc
                    ? `₹${profile.expected_ctc} LPA`
                    : null
                }
              />

            </div>

          </div>
        </div>

        {/* SKILLS */}
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-white py-3">

            <h5 className="mb-0 fw-bold">
              <FaTools className="text-primary me-2" />
              Skills
            </h5>

          </div>

          <div className="card-body">

            {profile.skills ? (
              <div className="d-flex flex-wrap gap-2">

                {profile.skills
                  .split(",")
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="badge bg-primary px-3 py-2"
                    >
                      {skill.trim()}
                    </span>
                  ))}

              </div>
            ) : (
              <p className="text-muted mb-0">
                No skills added.
              </p>
            )}

          </div>

        </div>

        {/* SOCIAL LINKS */}
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-white py-3">

            <h5 className="mb-0 fw-bold">
              🔗 Professional Links
            </h5>

          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-6 mb-3">

                <div className="border rounded p-3">

                  <FaLinkedin
                    className="text-primary me-2"
                    size={20}
                  />

                  <strong>LinkedIn</strong>

                  <div className="mt-2">

                    {profile.linkedin_url ? (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile.linkedin_url}
                      </a>
                    ) : (
                      <span className="text-muted">
                        Not added
                      </span>
                    )}

                  </div>

                </div>

              </div>

              <div className="col-md-6 mb-3">

                <div className="border rounded p-3">

                  <FaGlobe
                    className="text-success me-2"
                    size={20}
                  />

                  <strong>Portfolio</strong>

                  <div className="mt-2">

                    {profile.portfolio_url ? (
                      <a
                        href={profile.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile.portfolio_url}
                      </a>
                    ) : (
                      <span className="text-muted">
                        Not added
                      </span>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* EMPLOYMENT */}
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-white py-3">

            <h5 className="mb-0 fw-bold">
              <FaBriefcase className="text-primary me-2" />
              Employment Information
            </h5>

          </div>

          <div className="card-body">

            {profile.currently_employed ? (

              <div className="row">

                <InfoItem
                  label="Company"
                  value={profile.company_name}
                />

                <InfoItem
                  label="Designation"
                  value={profile.designation}
                />

                <InfoItem
                  label="Start Date"
                  value={profile.emp_start_date}
                />

                <InfoItem
                  label="End Date"
                  value={
                    profile.emp_is_present
                      ? "Present"
                      : profile.emp_end_date
                  }
                />

                <div className="col-12 mt-3">

                  <strong>About Role</strong>

                  <p className="text-muted mt-2">
                    {profile.about_role || "Not provided"}
                  </p>

                </div>

              </div>

            ) : (

              <div className="alert alert-info mb-0">
                Currently not employed.
              </div>

            )}

          </div>

        </div>

        {/* EDUCATION */}
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-white py-3">

            <h5 className="mb-0 fw-bold">
              <FaGraduationCap className="text-primary me-2" />
              Education
            </h5>

          </div>

          <div className="card-body">

            {profile.education_history &&
            profile.education_history.length > 0 ? (

              profile.education_history.map((education, index) => (

                <div
                  key={education.id || index}
                  className="border rounded p-3 mb-3"
                >

                  <div className="row">

                    <div className="col-md-6">

                      <h6 className="fw-bold">
                        {education.degree || "Degree"}
                      </h6>

                      <p className="mb-1">
                        {education.college_name}
                      </p>

                      <p className="text-muted mb-0">
                        <FaMapMarkerAlt className="me-2" />
                        {education.location}
                      </p>

                    </div>

                    <div className="col-md-6 mt-3 mt-md-0">

                      <p className="mb-1">
                        <strong>Start:</strong>{" "}
                        {education.start_date || "N/A"}
                      </p>

                      <p className="mb-1">
                        <strong>End:</strong>{" "}
                        {education.is_present
                          ? "Present"
                          : education.end_date || "N/A"}
                      </p>

                      <p className="mb-0">
                        <strong>Passout Year:</strong>{" "}
                        {education.passout_year || "N/A"}
                      </p>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <p className="text-muted mb-0">
                No education details added.
              </p>

            )}

          </div>

        </div>

        {/* RESUME */}
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-white py-3">

            <h5 className="mb-0 fw-bold">
              <FaFileAlt className="text-primary me-2" />
              Resume
            </h5>

          </div>

          <div className="card-body">

            {profile.resume_file ? (

              <a
                href={`${API_URL}/${profile.resume_file}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary"
              >
                <FaFileAlt className="me-2" />
                View Resume
              </a>

            ) : (

              <p className="text-muted mb-0">
                Resume not uploaded.
              </p>

            )}

          </div>

        </div>

        {/* ABOUT */}
        {profile.about_role && (
          <div className="card shadow-sm border-0 mb-4">

            <div className="card-header bg-white py-3">

              <h5 className="mb-0 fw-bold">
                About
              </h5>

            </div>

            <div className="card-body">

              <p className="text-muted mb-0">
                {profile.about_role}
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}


/* INFO COMPONENT */

function InfoItem({ label, value }) {

  return (
    <div className="col-md-6 mb-4">

      <div className="border rounded p-3 h-100">

        <small className="text-muted">
          {label}
        </small>

        <div className="fw-semibold mt-1">
          {value || "Not provided"}
        </div>

      </div>

    </div>
  );
}
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SelectRole() {
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/select-role/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role_name: role,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Role saved successfully");

        navigate("/profile-setup");
      } else {
        alert(data.detail || "Failed to save role");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center py-5">
      <div className="container" style={{ maxWidth: "800px" }}>

        <div className="text-center mb-5">
          <h2 className="fw-bold">
            How do you want to use Workline?
          </h2>
          <p className="text-muted fs-5">
            Choose your primary goal to personalize your experience.
          </p>
        </div>

        <div className="row g-4">

          {/* Candidate */}
          <div className="col-md-6">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center"
              style={{
                cursor: "pointer",
                transition: "0.2s"
              }}
              onClick={() =>
                handleRoleSelection("candidate")
              }
            >
              <h4 className="fw-bold">
                I'm a Candidate
              </h4>

              <p className="text-muted">
                Apply for jobs and track applications.
              </p>
            </div>
          </div>

          {/* Recruiter */}
          <div className="col-md-6">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center"
              style={{
                cursor: "pointer",
                transition: "0.2s"
              }}
              onClick={() =>
                handleRoleSelection("recruiter")
              }
            >
              <h4 className="fw-bold">
                I'm a Recruiter
              </h4>

              <p className="text-muted">
                Post jobs and hire candidates.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SelectRole;
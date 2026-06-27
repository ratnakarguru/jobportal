import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SelectRole() {
  const navigate = useNavigate();
  const [checkingRole, setCheckingRole] = useState(true);
  const userId = localStorage.getItem("user_id");

  // ── AUTO-CHECK DATABASE ON COMPONENT LOAD ───────────────────
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const checkExistingRole = async () => {
      try {
        // Hitting your verified onboarding status endpoint
        const response = await fetch(`http://127.0.0.1:8000/onboarding/status/${userId}`);
        if (response.ok) {
          const status = await response.json();

          // If role is completed, immediately forward them appropriately
          if (status.role_completed) {
            // Check their role from the cached user object or hit the user route
            const storedUser = localStorage.getItem("user");
            const userObj = storedUser ? JSON.parse(storedUser) : null;
            
            // Fallback strategy: If role is complete, let the login routing loop take over
            if (userObj?.role === "recruiter") {
              navigate(status.profile_completed ? "/recruiter-dashboard" : "/recruiter-setup");
            } else {
              navigate(status.profile_completed ? "/dashboard" : "/profile-setup");
            }
            return;
          }
        }
      } catch (error) {
        console.error("Error verifying automated role redirection:", error);
      } finally {
        setCheckingRole(false);
      }
    };

    checkExistingRole();
  }, [userId, navigate]);

  const handleRoleSelection = async (role) => {
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

        // Dynamically update your local user object cache with the newly bound role
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.role = role;
          localStorage.setItem("user", JSON.stringify(userObj));
        }

        if (role === "candidate") {
          navigate("/profile-setup", { state: { role } });
        } else if (role === "recruiter") {
          navigate("/recruiter-setup", { state: { role } });
        }
        
      } else {
        alert(data.detail || "Failed to save role");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // Prevent UI flickering while verifying database status record logs
  if (checkingRole) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verifying workspace credentials...</span>
        </div>
      </div>
    );
  }

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

          {/* Candidate Card */}
          <div className="col-md-6">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center role-card"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onClick={() => handleRoleSelection("candidate")}
            >
              <div className="fs-1 text-primary mb-2">👤</div>
              <h4 className="fw-bold text-dark">I'm a Candidate</h4>
              <p className="text-muted small">
                Apply for job postings, match parsing parameters, and track live application statuses.
              </p>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="col-md-6">
            <div
              className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center role-card"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onClick={() => handleRoleSelection("recruiter")}
            >
              <div className="fs-1 text-success mb-2">💼</div>
              <h4 className="fw-bold text-dark">I'm a Recruiter</h4>
              <p className="text-muted small">
                Configure workspaces, distribute job openings, and manage inbound candidate pipelines.
              </p>
            </div>
          </div>

        </div>

      </div>
      
      <style>{`
        .role-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08) !important;
          border: 1px solid rgba(13, 110, 253, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default SelectRole;  
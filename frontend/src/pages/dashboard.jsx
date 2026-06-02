import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Note: If you haven't already, run `npm install bootstrap-icons` 
// and import it: import "bootstrap-icons/font/bootstrap-icons.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any auth-clearing logic here (e.g., localStorage.removeItem('token'))
    navigate("/login");
  };

  return (
    <div className="min-vh-100 bg-light pb-5">
      
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 fw-bold text-primary fs-4">
            <i className="bi bi-briefcase-fill me-2"></i>
            Workline
          </span>
          
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-block text-end">
              <p className="mb-0 fw-semibold fs-6">Happy</p>
              <small className="text-muted">Developer</small>
            </div>
            {/* Dummy Avatar */}
            <div 
              className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" 
              style={{ width: "40px", height: "40px" }}
            >
              H
            </div>
            <div className="vr mx-2"></div>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-danger btn-sm px-3 fw-semibold rounded-pill"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="container mt-5">
        
        {/* Welcome Section */}
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Welcome back, Happy! 👋</h2>
          <p className="text-muted fs-5">
            Your job portal is successfully connected to the FastAPI backend. Here is your overview for today.
          </p>
        </div>

        {/* Stats Row */}
        <div className="row g-4 mb-5">
          
          {/* Card 1: Total Jobs */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3" style={{ transition: "transform 0.2s" }}>
              <div className="card-body d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-4">
                  <i className="bi bi-building text-primary fs-3"></i>
                </div>
                <div>
                  <h6 className="text-muted text-uppercase fw-semibold mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                    Total Jobs
                  </h6>
                  <h2 className="mb-0 fw-bold text-dark">120</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Applications */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
              <div className="card-body d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-4 me-4">
                  <i className="bi bi-file-earmark-text text-success fs-3"></i>
                </div>
                <div>
                  <h6 className="text-muted text-uppercase fw-semibold mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                    Applications
                  </h6>
                  <h2 className="mb-0 fw-bold text-dark">45</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Interviews */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
              <div className="card-body d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-4 me-4">
                  <i className="bi bi-calendar-check text-warning fs-3"></i>
                </div>
                <div>
                  <h6 className="text-muted text-uppercase fw-semibold mb-1" style={{ fontSize: "0.8rem", letterSpacing: "0.5px" }}>
                    Interviews
                  </h6>
                  <h2 className="mb-0 fw-bold text-dark">8</h2>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ user }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    // Close any open backdrops if sidebar is open during logout
    const backdrops = document.querySelectorAll(".offcanvas-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
    
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-b shadow-sm px-3 px-lg-4 py-2 sticky-top">
        <div className="container-fluid">
          {/* Branding */}
          <Link to="/dashboard" className="navbar-brand d-flex align-items-center me-4">
            <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center me-2 shadow-sm" style={{ width: "38px", height: "38px" }}>
              <i className="bi bi-briefcase-fill fs-5"></i>
            </div>
            <span className="fw-bold text-dark tracking-tight fs-4">Workline</span>
          </Link>

          {/* Toggle Button for Mobile view */}
          <button
            className="navbar-toggler border-0 p-2 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Navigation Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2 mt-lg-0 gap-1">
              <li className="nav-item">
                <Link to="/jobs" className="nav-link px-3 py-2 rounded-2 fw-medium text-secondary dynamic-nav-link">
                  Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/companies" className="nav-link px-3 py-2 rounded-2 fw-medium text-secondary dynamic-nav-link">
                  Companies
                </Link>
              </li>
            </ul>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="d-flex me-lg-4 my-3 my-lg-0 col-12 col-lg-4 position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6"></i>
              <input
                type="search"
                placeholder="Search jobs, companies..."
                className="form-control ps-5 bg-light border-0 rounded-pill py-2 shadow-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: "14px" }}
              />
            </form>

            {/* Right Actions: Notifications & Profile */}
            <div className="d-flex align-items-center justify-content-between justify-content-lg-end gap-3 w-100-mobile">
              {/* Notification Bell */}
              <button 
                className="btn btn-light position-relative rounded-circle p-0 d-flex align-items-center justify-content-center border" 
                style={{ width: "40px", height: "40px" }}
                aria-label="Notifications"
              >
                <i className="bi bi-bell text-dark fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle animate-pulse">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </button>

              <div className="vr d-none d-lg-block mx-1" style={{ height: "24px" }} />

              {/* Clickable Profile Dropdown */}
              <div className="dropdown">
                <div
                  className="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center fw-bold border border-primary-subtle shadow-sm"
                  style={{ width: "40px", height: "40px", flexShrink: 0, cursor: "pointer" }}
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {getInitial(user?.name)}
                </div>

                {/* Profile Dropdown Menu Options */}
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2" aria-labelledby="profileDropdown" style={{ minWidth: "230px" }}>
                  <li className="px-3 py-2.5 mb-1 bg-light rounded-2">
                    <p className="mb-0 fw-bold text-dark text-truncate fs-6">{user?.name || "User"}</p>
                    <small className="text-muted text-truncate d-block" style={{ fontSize: "12px" }}>{user?.email || "user@example.com"}</small>
                  </li>
                  <li>
                    {/* Trigger for the Offcanvas Sidebar */}
                    <button 
                      className="dropdown-item py-2 rounded-2 d-flex align-items-center text-secondary fw-medium" 
                      type="button" 
                      data-bs-toggle="offcanvas" 
                      data-bs-target="#profileSidebar" 
                      aria-controls="profileSidebar"
                    >
                      <i className="bi bi-person me-2.5 fs-5 text-muted"></i> My Profile
                    </button>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 rounded-2 d-flex align-items-center text-secondary fw-medium" to="/settings">
                      <i className="bi bi-gear me-2.5 fs-5 text-muted"></i> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger py-2 rounded-2 d-flex align-items-center fw-semibold">
                      <i className="bi bi-box-arrow-right me-2.5 fs-5"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* --- OFFCANVAS SIDEBAR --- */}
      <div className="offcanvas offcanvas-end border-0 shadow" tabIndex="-1" id="profileSidebar" aria-labelledby="profileSidebarLabel" style={{ width: "360px" }}>
        <div className="offcanvas-header border-bottom p-4">
          <h5 className="offcanvas-title fw-bold text-dark" id="profileSidebarLabel">Account Profile</h5>
          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        
        <div className="offcanvas-body p-4 d-flex flex-column justify-content-between">
          <div className="text-center mt-3">
            {/* Big Profile Avatar */}
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold mx-auto shadow-sm mb-3 fs-1" style={{ width: "90px", height: "90px" }}>
              {getInitial(user?.name)}
            </div>
            
            {/* Name & Email Details */}
            <h4 className="fw-bold text-dark mb-1">{user?.name || "User Name"}</h4>
            <p className="text-muted fs-6 mb-4">{user?.email || "user@example.com"}</p>
            
            <hr className="my-4 opacity-20" />

            {/* Quick Actions List */}
            <div className="d-grid gap-2 text-start">
              <Link to="/profile" className="btn btn-outline-primary border-2 py-2.5 px-3 rounded-3 d-flex align-items-center justify-content-center fw-semibold gap-2 mb-2 shadow-sm" data-bs-dismiss="offcanvas">
                <i className="bi bi-eye fs-5"></i> View Profile
              </Link>
              
              <Link to="/profile/edit" className="btn btn-light border py-2.5 px-3 rounded-3 d-flex align-items-center justify-content-center fw-semibold gap-2 shadow-sm" data-bs-dismiss="offcanvas">
                <i className="bi bi-pencil-square fs-5 text-muted"></i> Update Profile
              </Link>
            </div>
          </div>

          {/* Bottom Logout Button */}
          <div className="mt-auto pt-4 border-top">
            <button onClick={handleLogout} className="btn btn-label-danger w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center fw-bold gap-2">
              <i className="bi bi-box-arrow-right fs-5"></i> Logout Account
            </button>
          </div>
        </div>
      </div>

      {/* --- ADD THESE EXTRA STYLES TO YOUR MAIN CSS FILE --- */}
      <style>{`
        .dynamic-nav-link:hover {
          background-color: #f8f9fa;
          color: #0d6efd !important;
        }
        @media (max-width: 991.98px) {
          .w-100-mobile { width: 100%; }
        }
        .btn-label-danger {
          background-color: #fff5f5;
          color: #dc3545;
          border: 1px solid #fee2e2;
        }
        .btn-label-danger:hover {
          background-color: #dc3545;
          color: #ffffff;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1) translate(50%, -50%); opacity: 1; }
          50% { transform: scale(1.4) translate(35%, -35%); opacity: 0.6; }
          100% { transform: scale(1) translate(50%, -50%); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
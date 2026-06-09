import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Logo from "../assets/workilinlogo.png"
import "./navbar.css";
import { FaBell } from "react-icons/fa";

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
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top py-2">
  <div className="container-fluid px-lg-4">

    {/* Logo */}
    <Link
      to="/dashboard"
      className="navbar-brand d-flex align-items-center"
    >
      <img
        src={Logo}
        alt="Workline"
        width="42"
        height="42"
        className="me-2"
      />

      <span
        className="fw-bold"
        style={{
          fontSize: "1.75rem",
          color: "#212529",
          letterSpacing: "-1px",
        }}
      >
        Work
      </span>

      <span
        className="fw-semibold"
        style={{
          fontSize: "1.75rem",
          color: "#0d6efd",
          letterSpacing: "-1px",
        }}
      >
        line
      </span>
    </Link>

    {/* Mobile Toggle */}
    <button
      className="navbar-toggler border-0 shadow-none"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarContent"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Content */}
    <div
      className="collapse navbar-collapse"
      id="navbarContent"
    >

      {/* Navigation */}
      <ul className="navbar-nav ms-lg-4 me-auto gap-lg-2">

        <li className="nav-item">
          <Link
            to="/jobs"
            className="nav-link fw-semibold px-3 rounded"
          >
            <i className="bi bi-briefcase me-2"></i>
            Jobs
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/companies"
            className="nav-link fw-semibold px-3 rounded"
          >
            <i className="bi bi-buildings me-2"></i>
            Companies
          </Link>
        </li>

      </ul>

      {/* Search */}
      <form className="d-flex my-3 my-lg-0 mx-lg-3 w-100" style={{ maxWidth: "450px" }}>
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <i className="bi bi-search"></i>
          </span>

          <input
            type="search"
            className="form-control bg-light border-0 shadow-none"
            placeholder="Search jobs, companies..."
          />
        </div>
      </form>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">

        {/* Notification */}
        <button className="btn btn-light rounded-circle">
  <FaBell size={18} />


        </button>

        {/* Profile */}
        <div className="dropdown">

          <button
            className="btn btn-primary rounded-circle fw-bold border-0"
            style={{
              width: "42px",
              height: "42px",
            }}
            data-bs-toggle="dropdown"
          >
            {getInitial(user?.name)}
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0">

            <li className="px-3 py-2">
              <h6 className="mb-0 fw-bold">
                {user?.name}
              </h6>

              <small className="text-muted">
                {user?.email}
              </small>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li>
              <Link
                className="dropdown-item"
                to="/profile"
              >
                <i className="bi bi-person me-2"></i>
                Profile
              </Link>
            </li>

            <li>
              <Link
                className="dropdown-item"
                to="/settings"
              >
                <i className="bi bi-gear me-2"></i>
                Settings
              </Link>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li>
              <button
                onClick={handleLogout}
                className="dropdown-item text-danger"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
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
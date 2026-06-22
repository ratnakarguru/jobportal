import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Logo from "../assets/workilinlogo.png";
import "./navbar.css";
import { FaBell } from "react-icons/fa";

function Navbar({ user: propUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [user, setUser] = useState(() => {
    if (propUser) return propUser;
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [propUser]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const currentUrlQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(currentUrlQuery);

  useEffect(() => {
    setSearchQuery(currentUrlQuery);
  }, [currentUrlQuery]);

  // CRITICAL CLEANUP HELPER: Force dismisses all active Bootstrap panels and backdrops
  const closeSidebarAndNavigate = (targetPath) => {
    // 1. Remove stuck dark backdrop overlays
    const backdrops = document.querySelectorAll(".offcanvas-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());

    // 2. Restore normal scrolling to the page body
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.body.removeAttribute("data-bs-padding-right");

    // 3. Programmatically navigate via React Router
    navigate(targetPath);
  };

  const handleLogout = () => {
    const backdrops = document.querySelectorAll(".offcanvas-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.style.overflow = "";
    
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");
  
  const userId = user?.id || localStorage.getItem("user_id");

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top py-2">
        <div className="container-fluid px-lg-4">

          {/* Logo */}
          <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
            <img src={Logo} alt="Workline" width="42" height="42" className="me-2" />
            <span className="fw-bold" style={{ fontSize: "1.75rem", color: "#212529", letterSpacing: "-1px" }}>Work</span>
            <span className="fw-semibold" style={{ fontSize: "1.75rem", color: "#0d6efd", letterSpacing: "-1px" }}>line</span>
          </Link>

          {/* Mobile Toggle */}
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Content Wrapper */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-lg-4 me-auto gap-lg-1">
              <li className="nav-item">
                <Link to="/jobs" className="nav-link dynamic-nav-link text-dark fw-semibold px-3 py-2 rounded">
                  <i className="bi bi-briefcase me-2"></i>Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/companies" className="nav-link dynamic-nav-link text-dark fw-semibold px-3 py-2 rounded">
                  <i className="bi bi-buildings me-2"></i>Companies
                </Link>
              </li>
            </ul>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearch} className="d-flex my-3 my-lg-0 mx-lg-3 w-100" style={{ maxWidth: "450px" }}>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 text-muted"><i className="bi bi-search"></i></span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Search jobs, companies..."
                />
              </div>
            </form>

            {/* Right Side Control Panel */}
            <div className="d-flex align-items-center gap-3 justify-content-between w-100-mobile">
              <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center position-relative" style={{ width: "42px", height: "42px" }}>
                <FaBell size={18} className="text-secondary" />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle animate-pulse">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </button>

              <button
                className="btn btn-primary rounded-circle fw-bold border-0 shadow-sm p-0 d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#profileSidebar"
                aria-controls="profileSidebar"
              >
                {getInitial(user?.name)}
              </button>
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
            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold mx-auto shadow-sm mb-3 fs-1" style={{ width: "90px", height: "90px" }}>
              {getInitial(user?.name)}
            </div>
            
            <h4 className="fw-bold text-dark mb-1">{user?.name || "User Name"}</h4>
            <p className="text-muted fs-6 mb-4">{user?.email || "user@example.com"}</p>
            
            <hr className="my-4 opacity-25" />

            {/* Quick Actions List */}
            <div className="d-grid gap-2 text-start">
              {/* FIXED LINK INTERCEPTION ROUTE CHANNELS */}
              <button 
                onClick={() => closeSidebarAndNavigate("/profile")} 
                className="btn btn-outline-primary border-2 py-2 px-3 rounded-3 d-flex align-items-center justify-content-center fw-semibold gap-2 mb-2 shadow-sm"
              >
                <i className="bi bi-person fs-5"></i> View Profile
              </button>
              
              <button 
                onClick={() => closeSidebarAndNavigate("/settings")} 
                className="btn btn-light border py-2 px-3 rounded-3 d-flex align-items-center justify-content-center fw-semibold gap-2 shadow-sm"
              >
                <i className="bi bi-gear fs-5 text-muted"></i> Account Settings
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-top">
            <button onClick={handleLogout} className="btn btn-label-danger w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center fw-bold gap-2">
              <i className="bi bi-box-arrow-right fs-5"></i> Logout Account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dynamic-nav-link { transition: all 0.2s ease; }
        .dynamic-nav-link:hover { background-color: #f8f9fa; color: #0d6efd !important; }
        @media (max-width: 991.98px) { .w-100-mobile { width: 100%; margin-top: 10px; } }
        .btn-label-danger { background-color: #fff5f5; color: #dc3545; border: 1px solid #fee2e2; transition: all 0.2s ease; }
        .btn-label-danger:hover { background-color: #dc3545; color: #ffffff; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </>
  );
}

export default Navbar;
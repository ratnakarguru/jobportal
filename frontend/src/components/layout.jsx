import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import { AuthContext } from "../context/AuthContext";

function Layout() {
  const { userData, authLoading } = useContext(AuthContext);

  // Optional: Add a simple loader while checking auth profile status
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar reads the context-driven dynamic userData profile directly */}
      <Navbar user={userData} />
      
      {/* Renders your sub-page tracks below it smoothly */}
      <Outlet />
    </>
  );
}

export default Layout;
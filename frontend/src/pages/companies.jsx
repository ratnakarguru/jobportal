import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:8000/companies")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch companies");
        return res.json();
      })
      .then((data) => {
        setCompanies(Array.isArray(data) ? data : data.companies || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Visual Styles Injection */}
      <style>{`
        .premium-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        .workspace-card {
          border: 1px solid rgba(0, 0, 0, 0.04) !important;
          background: #ffffff;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .workspace-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.15) !important;
        }
        .cta-arrow {
          transition: transform 0.2s ease;
        }
        .workspace-card:hover .cta-arrow {
          transform: translateX(4px);
        }
        .logo-pill {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.03) 100%);
          border: 1px solid rgba(13, 110, 253, 0.15);
        }
      `}</style>

      {/* Dark Modern Split Header Banner */}
      <div className="premium-bg text-white py-5 mb-5 shadow-sm">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-inline-flex align-items-center bg-white bg-opacity-10 text-primary-light px-3 py-1 rounded-pill mb-3 small fw-semibold border border-white border-opacity-10 tracking-wide text-uppercase" style={{ fontSize: '0.75rem', color: '#60a5fa' }}>
                <i className="bi bi-patch-check-fill me-1.5"></i> Ecosystem Directory
              </div>
              <h1 className="display-5 fw-extrabold text-white tracking-tight mb-2">
                Discover Your Next <span style={{ color: '#3b82f6', fontWeight: 800 }}>Workspace</span>
              </h1>
              <p className="text-white-50 fs-5 mb-0 max-width-md">
                Skip the agencies. Connect directly with product engineering teams globally.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              {!isLoading && (
                <div className="bg-white bg-opacity-5 p-4 rounded-4 border border-white border-opacity-10 d-inline-block text-start shadow-sm backdrop-blur">
                  <span className="text-dark small d-block mb-1 text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.65rem' }}>Global Status</span>
                  <div className="d-flex align-items-baseline gap-2">
                    <span className="h2 fw-bold mb-0 text-white">{companies.length}</span>
                    <span className="text-success small fw-medium"><i className="bi bi-arrow-up-right me-0.5"></i>Live Hubs</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Companies Layout Grid */}
      <div className="container pb-5">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
              <span className="visually-hidden">Parsing nodes...</span>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-5">
            <div className="p-5 bg-white rounded-4 border d-inline-block shadow-sm" style={{ maxWidth: "450px" }}>
              <i className="bi bi-grid-3x3-gap text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
              <h5 className="fw-bold text-dark">No Hubs Indexed</h5>
              <p className="text-muted small mb-0">The application system endpoint returned zero matching nodes.</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {companies.map((company) => {
              const name = company.name || "Anonymous Vendor";
              const initials = company.logoText || name.substring(0, 2).toUpperCase();
              const openPositions = company.jobCount || Math.floor(Math.random() * 8) + 2;

              return (
                <div className="col-md-6 col-lg-4" key={name}>
                  {/* Modern Asymmetric Link Card */}
                  <Link 
                    to={`/company/${encodeURIComponent(name)}`}
                    className="card h-100 workspace-card p-4 rounded-4 text-decoration-none shadow-sm d-flex flex-column justify-content-between"
                  >
                    <div>
                      {/* Top Header Row Layout */}
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="logo-pill text-primary rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: "52px", height: "52px" }}>
                          {initials}
                        </div>
                        <span className="badge bg-light text-dark border px-2.5 py-1.5 rounded-pill small fw-semibold tracking-tight shadow-sm">
                          {openPositions} Active Openings
                        </span>
                      </div>

                      {/* Corporate Identity Branding */}
                      <h4 className="fw-bold text-dark tracking-tight mb-2 text-truncate">{name}</h4>
                      
                      <div className="d-flex align-items-center text-muted small mb-3">
                        <i className="bi bi-geo-alt-fill me-1 text-primary opacity-75"></i>
                        <span className="fw-medium">{company.location ? company.location.split(',')[0] : "India"}</span>
                      </div>

                      <p className="text-secondary small mb-4 line-clamp" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                        {company.about || `Explore engineering tracks, infrastructure stack methodologies, and career scaling tracks deployed within the workspace at ${name}.`}
                      </p>
                    </div>

                    {/* Bottom CTA Interaction Layout */}
                    <div className="pt-3 border-top border-light d-flex align-items-center justify-content-between text-primary fw-bold small">
                      <span>Explore Open Roles</span>
                      <i className="bi bi-arrow-right cta-arrow fs-6"></i>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies;
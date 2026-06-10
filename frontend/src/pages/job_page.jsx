import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";

// 1. Import the Faker library instance
import { faker, fakerEN_IN } from "@faker-js/faker";

// 2. Build the generation pipeline using official Faker modules
const generateFakerJobs = (count = 20) => {
  const specializedTitles = [
    "Frontend Engineer", "Full Stack Developer", "UI/UX Designer", 
    "DevOps Specialist", "Data Scientist", "Product Manager", 
    "Backend Architect", "QA Automation Engineer", "Mobile App Developer"
  ];

  return Array.from({ length: count }, (_, i) => {
    const title = faker.helpers.arrayElement(specializedTitles);
    const company = faker.company.name();

    return {
      id: faker.string.uuid(),
      title,
      company,
      location: `${fakerEN_IN.location.city()}, India`,
      type: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract", "Remote"]),
      salary: `₹${faker.number.int({ min: 3, max: 18 })} LPA`,
      experience: faker.helpers.arrayElement(["Fresher", "1-2 Years", "2-4 Years", "5+ Years"]),
      qualification: faker.helpers.arrayElement(["B.E / B.Tech", "MCA", "BCA", "Any Graduate"]),
      responsibilities: [
        "Develop and maintain highly responsive web applications",
        "Collaborate with cross-functional teams to ship clean features",
        "Write clean, scalable, and fully documented source code",
        "Participate actively in structural peer code reviews"
      ],
      benefits: ["Health Insurance Coverage", "Remote Work Frameworks", "Flexible Hours", "Personal Learning Budget"],
      description: "We are looking for a passionate developer who values clean code architecture to join our growing team.",
      companyAbout: "Workline top-tier tech partner constructing elite digital market solutions across scaling landscapes.",
      posted: `${faker.number.int({ min: 1, max: 7 })} days ago`,
      skills: faker.helpers.arrayElements(
        ["React", "Java", "Python", "SQL", "FastAPI", "TypeScript", "Node.js"],
        { min: 3, max: 5 }
      ),
      logoText: company.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
    };
  });
};

function JobsPage({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const rawFakerDatabase = generateFakerJobs(30);
    setJobs(rawFakerDatabase);
    setFilteredJobs(rawFakerDatabase);
  }, []);

  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    let result = [...jobs];

    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (selectedType !== "All") {
      result = result.filter((job) => job.type === selectedType);
    }

    if (sortBy === "salary") {
      result.sort((a, b) => {
        const valA = parseInt(a.salary.replace(/[^0-9]/g, ""));
        const valB = parseInt(b.salary.replace(/[^0-9]/g, ""));
        return valB - valA;
      });
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedType, sortBy, jobs]);

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} />

      {/* Hero Search Area Banner */}
      <div className="bg-dark text-white py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h1 className="fw-bold tracking-tight mb-2">Explore Openings</h1>
              <p className="text-muted fs-5 mb-0" style={{ color: "#a0aec0 !important" }}>
                Find your dream job matching your technical stack instantly.
              </p>
            </div>
            <div className="col-md-5 mt-3 mt-md-0">
              <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden border-0">
                <span className="input-group-text bg-white border-0 text-muted ps-3">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 ps-2 fs-6 shadow-none"
                  placeholder="Filter listings dynamically..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchParams({ search: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Framework Feed Layout */}
      <div className="container pb-5">
        <div className="row g-4">
          
          {/* Side Control Filters */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm p-4 rounded-4 position-sticky" style={{ top: "90px" }}>
              <h5 className="fw-bold text-dark mb-4">Refine Parameters</h5>
              
              <div className="mb-4">
                <label className="form-label small text-muted text-uppercase fw-bold mb-2">Employment Type</label>
                <select 
                  className="form-select border-2 bg-light shadow-none py-2 rounded-3"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Formats</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted text-uppercase fw-bold mb-2">Order By</label>
                <select 
                  className="form-select border-2 bg-light shadow-none py-2 rounded-3"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest Openings</option>
                  <option value="salary">Highest Income (LPA)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Display Grid Panel */}
          <div className="col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <p className="text-muted mb-0 fw-medium">
                Showing <span className="text-dark fw-bold">{filteredJobs.length}</span> positions match your criteria
              </p>
              {filteredJobs.length > 0 && <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold">Faker Engine Active</span>}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="card border-0 shadow-sm text-center p-5 rounded-4 bg-white">
                <i className="bi bi-folder-x text-muted mb-3 d-block" style={{ fontSize: "3.5rem" }}></i>
                <h4 className="fw-bold text-dark">No Positions Found</h4>
                <p className="text-muted mb-4">Try adjusting your parameters or search terms.</p>
                <button className="btn btn-outline-primary rounded-3 px-4" onClick={() => { setSearchTerm(""); setSelectedType("All"); setSearchParams({}); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredJobs.map((job) => (
                  <div className="col-md-6" key={job.id}>
                    <div className="card border-0 shadow-sm h-100 rounded-4 card-hover p-2 bg-white">
                      <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex align-items-start justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "48px", height: "48px" }}>
                                {job.logoText}
                              </div>
                              <div>
                                <h6 className="mb-0 fw-bold text-dark fs-6 text-truncate" style={{ maxWidth: "160px" }}>{job.title}</h6>
                                <span className="text-muted small fw-medium">{job.company}</span>
                              </div>
                            </div>
                            <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-3 small">
                              {job.type}
                            </span>
                          </div>

                          <div className="d-flex gap-2 text-muted small mb-3 flex-wrap">
                            <span className="bg-light px-2 py-1 rounded d-flex align-items-center"><i className="bi bi-geo-alt me-1 text-primary"></i> {job.location.split(',')[0]}</span>
                            <span className="bg-light px-2 py-1 rounded d-flex align-items-center"><i className="bi bi-cash-stack me-1 text-success"></i> {job.salary}</span>
                            <span className="bg-light px-2 py-1 rounded d-flex align-items-center"><i className="bi bi-briefcase me-1 text-warning"></i> {job.experience}</span>
                          </div>

                          <div className="d-flex flex-wrap gap-1 mb-4">
                            {job.skills.map((skill) => (
                              <span key={skill} className="badge bg-light text-dark fw-normal px-2.5 py-1.5 rounded-2 border">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                          <span className="text-muted small fw-medium"><i className="bi bi-clock me-1"></i> {job.posted}</span>
                          <button
                            className="btn btn-primary btn-sm px-3 rounded-3 fw-bold"
                            onClick={() => setSelectedJob(job)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modern Detail View Modal Backdrop Overlay */}
      {selectedJob && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              
              {/* Header area block layout */}
              <div className="modal-header bg-dark text-white p-4 align-items-start border-0 position-relative">
                <div className="d-flex align-items-center mt-2">
                  <div className="bg-white bg-opacity-15 text-white rounded-3 d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "60px", height: "60px", fontSize: "1.25rem" }}>
                    {selectedJob.logoText}
                  </div>
                  <div>
                    <h4 className="modal-title fw-bold mb-0 tracking-tight">{selectedJob.title}</h4>
                    <p className="mb-0 text-white-50 small fw-medium">{selectedJob.company} &bull; {selectedJob.location}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute shadow-none"
                  style={{ top: "24px", right: "24px" }}
                  onClick={() => setSelectedJob(null)}
                />
              </div>

              {/* Main Structural Description Content Panels */}
              <div className="modal-body p-4 bg-light bg-opacity-50">
                <div className="row g-3 mb-4">
                  <div className="col-sm-6 col-md-3">
                    <div className="bg-white p-3 rounded-3 border border-light text-center shadow-sm">
                      <i className="bi bi-cash-stack text-success fs-4 d-block mb-1"></i>
                      <span className="text-muted small d-block uppercase fw-bold tracking-wider" style={{ fontSize: "0.7rem" }}>Annual Salary</span>
                      <strong className="text-dark small">{selectedJob.salary}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="bg-white p-3 rounded-3 border border-light text-center shadow-sm">
                      <i className="bi bi-star text-warning fs-4 d-block mb-1"></i>
                      <span className="text-muted small d-block uppercase fw-bold tracking-wider" style={{ fontSize: "0.7rem" }}>Experience Needed</span>
                      <strong className="text-dark small">{selectedJob.experience}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="bg-white p-3 rounded-3 border border-light text-center shadow-sm">
                      <i className="bi bi-mortarboard text-primary fs-4 d-block mb-1"></i>
                      <span className="text-muted small d-block uppercase fw-bold tracking-wider" style={{ fontSize: "0.7rem" }}>Qualification</span>
                      <strong className="text-dark small">{selectedJob.qualification}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="bg-white p-3 rounded-3 border border-light text-center shadow-sm">
                      <i className="bi bi-clock text-info fs-4 d-block mb-1"></i>
                      <span className="text-muted small d-block uppercase fw-bold tracking-wider" style={{ fontSize: "0.7rem" }}>Job Format</span>
                      <strong className="text-dark small">{selectedJob.type}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-4 shadow-sm border border-light mb-4">
                  <h6 className="fw-bold text-dark border-start border-primary border-3 ps-2 mb-3">Role Summary</h6>
                  <p className="text-secondary small lh-relaxed">{selectedJob.description}</p>
                </div>

                <div className="bg-white p-4 rounded-4 shadow-sm border border-light mb-4">
                  <h6 className="fw-bold text-dark border-start border-primary border-3 ps-2 mb-3">Core Responsibilities</h6>
                  <ul className="text-secondary small ps-3 mb-0">
                    {selectedJob.responsibilities.map((r, idx) => (
                      <li key={idx} className="mb-2 lh-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-4 shadow-sm border border-light mb-4">
                  <h6 className="fw-bold text-dark border-start border-primary border-3 ps-2 mb-3">Required Stack Competencies</h6>
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {selectedJob.skills.map((skill) => (
                      <span key={skill} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-2 fw-medium small">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-4 shadow-sm border border-light mb-4">
                  <h6 className="fw-bold text-dark border-start border-primary border-3 ps-2 mb-3">Perks & Benefits</h6>
                  <div className="row g-2 mt-1">
                    {selectedJob.benefits.map((b, idx) => (
                      <div className="col-sm-6" key={idx}>
                        <div className="d-flex align-items-center text-secondary small">
                          <i className="bi bi-check-circle-fill text-success me-2"></i> {b}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 border">
                  <h6 className="fw-bold text-dark small mb-1">About {selectedJob.company}</h6>
                  <p className="text-muted small mb-0 lh-relaxed">{selectedJob.companyAbout}</p>
                </div>
              </div>

              {/* Action Operations Area Box Bar Footer */}
              <div className="modal-footer bg-white p-3 border-top d-flex justify-content-between align-items-center">
                <span className="text-muted small ps-2"><i className="bi bi-calendar3 me-1"></i> Listed {selectedJob.posted}</span>
                <div className="gap-2 d-flex">
                  <button type="button" className="btn btn-light px-4 rounded-3 fw-semibold text-secondary" onClick={() => setSelectedJob(null)}>
                    Dismiss
                  </button>
                  <button type="button" className="btn btn-success px-4 rounded-3 fw-bold shadow-sm" onClick={() => { alert("Application sent successfully!"); setSelectedJob(null); }}>
                    Submit Application <i className="bi bi-send ms-1"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobsPage;
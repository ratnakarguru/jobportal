import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";

// 1. Import the Faker library instance
import { faker } from "@faker-js/faker";

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
    
    // Dynamic compensation range generation
    const salaryMin = faker.number.int({ min: 70, max: 120 });
    const salaryMax = salaryMin + faker.number.int({ min: 20, max: 60 });

    return {
      id: faker.string.uuid(), // Unique alpha-numeric ID string
      title: title,
      company: company,
      location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      type: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract", "Remote"]),
      salary: `$${salaryMin}k - $${salaryMax}k`,
      posted: `${faker.number.int({ min: 1, max: 7 })} days ago`,
      skills: faker.helpers.arrayElements(
        ["React", "TypeScript", "Node.js", "Bootstrap", "AWS", "Figma", "Docker", "Python", "GraphQL"], 
        { min: 2, max: 4 } // Pick between 2 and 4 random skills
      ),
      // Extracts first letters of company name as a dummy initials placeholder icon
      logoText: company.split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase()
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

  // Load the generated Faker items on initialization
  useEffect(() => {
    const rawFakerDatabase = generateFakerJobs(30); // Instantly produces 30 rich random job objects
    setJobs(rawFakerDatabase);
    setFilteredJobs(rawFakerDatabase);
  }, []);

  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  // Combined Filtering Pipeline
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
        const valA = parseInt(a.salary.replace(/[^0-9]/g, "").substring(0, 3));
        const valB = parseInt(b.salary.replace(/[^0-9]/g, "").substring(0, 3));
        return valB - valA;
      });
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedType, sortBy, jobs]);

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} />

      {/* Page Header Hero Layout */}
      <div className="bg-dark text-white py-5 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h1 className="fw-bold tracking-tight mb-2">Explore Openings</h1>
              <p className="text-muted fs-5 mb-0" style={{ color: "#a0aec0 !important" }}>
                Faker simulation data generation engine activated.
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
                  <option value="salary">Highest Compensation</option>
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
              {filteredJobs.length > 0 && <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold">Faker Data Active</span>}
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
                                <h6 className="mb-0 fw-bold text-dark fs-6 text-truncate" style={{ maxWidth: "180px" }}>{job.title}</h6>
                                <span className="text-muted small fw-medium">{job.company}</span>
                              </div>
                            </div>
                            <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-3 small">
                              {job.type}
                            </span>
                          </div>

                          <div className="d-flex gap-3 text-muted small mb-3 flex-wrap">
                            <span className="d-flex align-items-center"><i className="bi bi-geo-alt me-1 text-primary"></i> {job.location}</span>
                            <span className="d-flex align-items-center"><i className="bi bi-cash-stack me-1 text-success"></i> {job.salary}</span>
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
                          <button className="btn btn-outline-primary btn-sm px-3 py-1.5 fw-semibold rounded-3">
                            Apply Now
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
    </div>
  );
}

export default JobsPage;
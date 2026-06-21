import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Companies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Top Companies</h2>

      <div className="row">
        {companies.map((company) => (
          <div className="col-md-4 mb-3" key={company.name}>
            <div className="card p-3 shadow-sm">
              <h5>{company.name}</h5>

              <Link
                to={`/company/${company.name}`}
                className="btn btn-primary"
              >
                View Jobs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Companies;
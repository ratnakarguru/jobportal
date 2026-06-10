import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/navbar";

function TipsPage({ user }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const tipCategories = [
    { id: "all", label: "All Guidance", icon: "bi-grid-fill" },
    { id: "resume", label: "Resume Strategy", icon: "bi-file-earmark-person-fill" },
    { id: "interview", label: "Interview Mastery", icon: "bi-chat-left-heart-fill" },
    { id: "networking", label: "Hidden Market", icon: "bi-people-fill" },
  ];

  const careerTips = [
    {
      id: "tip-1",
      category: "resume",
      title: "Optimizing for AI Resume Matchers & ATS Systems",
      summary: "How to format your document so parsing algorithms score you above 80%.",
      detail: "Modern platforms (including Workline's Live AI Matcher) break down your PDF layout into basic text strings to find overlapping keywords. To stay at the top of recruiter pipelines: spell out technical metrics exactly as they appear in job listings (e.g., use 'React' instead of 'Frontend Web Building Frameworks'), avoid complex multi-column grids or graphics that distort text reading order, and clearly list your stack competencies in an explicit 'Skills' section."
    },
    {
      id: "tip-2",
      category: "resume",
      title: "The XYZ Resume Framework",
      summary: "Transform bullet points from boring descriptions into impactful achievements.",
      detail: "Google popularised the XYZ pattern: Accomplished [X] as measured by [Y], by doing [Z]. Instead of writing 'Responsible for handling frontend tasks,' rewrite it dynamically: 'Accelerated core app processing cycles by 24% [Y] across 12 dashboard nodes [X] through strategic implementation of code splitting and custom React hook models [Z].'"
    },
    {
      id: "tip-3",
      category: "interview",
      title: "Mastering Behavioral Loops with the STAR Technique",
      summary: "Structure your narrative answers cleanly when responding to situational engineering prompts.",
      detail: "When an interviewer says 'Tell me about a time you ran into a bug close to launch,' structure your response step-by-step: Situation (context), Task (your exact responsibility), Action (the specific code paths or debugging tactics you executed), and Result (quantifiable recovery, e.g., 'saved the rollout deadline'). Spend 70% of your time talking about the Action and Result layers."
    },
    {
      id: "tip-4",
      category: "interview",
      title: "Reverse Interviewing: What to Ask at the End",
      summary: "Stand out immediately by evaluating the company as thoroughly as they evaluate you.",
      detail: "When the table turns, avoid basic logistical questions. Ask discovery questions that show leadership potential: 'What does success look like for this position during the first 90 days?' or 'How does your team handle technical debt allocation while keeping velocity targets stable?'"
    },
    {
      id: "tip-5",
      category: "networking",
      title: "Cracking the Hidden Tech Job Market",
      summary: "Up to 70% of modern job openings are filled through references before ever hit listing feeds.",
      detail: "Instead of clicking 'Apply' on 50 blind postings daily, spend half your strategy cultivating professional loops. Track down engineering managers or staff leads on professional forums who operate within your chosen framework domain. Reach out with high-context inquiries: 'Loved your team's breakdown post on transitioning to micro-frontends. Are you facing scaling challenges where a React optimization specialist could add immediate value?'"
    }
  ];

  // Pipeline filter execution
  const filteredTips = activeCategory === "all" 
    ? careerTips 
    : careerTips.filter(tip => tip.category === activeCategory);

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar user={user} />

      {/* Hero Header Presentation */}
      <div 
        className="text-white py-5 mb-5 shadow-sm"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
      >
        <div className="container py-3">
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-2 rounded-pill fw-semibold text-uppercase tracking-wider">
            Workline Academy 💡
          </span>
          <h1 className="display-5 fw-bold mb-2">Job Hunting Guide</h1>
          <p className="fs-5 opacity-75 mb-0" style={{ maxWidth: "600px" }}>
            Actionable blueprints and technical frameworks to streamline your applications and conquer technical interviews.
          </p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          
          {/* Left Sticky Sidebar: Navigation Category Pills */}
          <div className="col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm p-3 rounded-4 position-sticky" style={{ top: "90px" }}>
              <h6 className="text-muted text-uppercase fw-bold mb-3 px-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                Filter Playbooks
              </h6>
              <div className="nav flex-column nav-pills gap-1">
                {tipCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`nav-link text-start py-2.5 px-3 rounded-3 d-flex align-items-center fw-semibold transition-all border-0 ${
                      activeCategory === cat.id 
                        ? "bg-primary text-white shadow-sm" 
                        : "bg-transparent text-secondary hover-bg-light"
                    }`}
                  >
                    <i className={`bi ${cat.icon} me-3 fs-5`}></i>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Panel: Accordion Tip Feed Accordion Grid */}
          <div className="col-md-8 col-lg-9">
            <div className="accordion d-flex flex-column gap-3" id="careerTipsAccordion">
              {filteredTips.map((tip, index) => (
                <div 
                  className="accordion-item border-0 shadow-sm rounded-4 overflow-hidden bg-white" 
                  key={tip.id}
                >
                  <h2 className="accordion-header" id={`heading-${tip.id}`}>
                    <button
                      className="accordion-button collapsed bg-white p-4 d-flex align-items-center shadow-none border-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${tip.id}`}
                      aria-expanded="false"
                      aria-controls={`collapse-${tip.id}`}
                    >
                      <div className="d-flex align-items-start text-start w-100 me-3">
                        {/* Category Visual Badge Label */}
                        <div className={`badge bg-primary bg-opacity-10 text-primary me-3 p-3 rounded-3 d-none d-sm-block`}>
                          <i className={`bi ${
                            tip.category === "resume" ? "bi-file-earmark-text" : 
                            tip.category === "interview" ? "bi-chat-square-quote" : "bi-diagram-3"
                          } fs-4`}></i>
                        </div>
                        <div>
                          <span className="text-primary text-uppercase fw-bold font-monospace small mb-1 d-block" style={{ fontSize: "0.7rem" }}>
                            {tip.category === "resume" ? "Resume Strategy" : tip.category === "interview" ? "Interview Preparation" : "Networking Node"}
                          </span>
                          <h5 className="fw-bold text-dark mb-1 tracking-tight">{tip.title}</h5>
                          <p className="text-muted small mb-0 fw-normal">{tip.summary}</p>
                        </div>
                      </div>
                    </button>
                  </h2>
                  
                  {/* Expanded Body Panel Content container */}
                  <div
                    id={`collapse-${tip.id}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${tip.id}`}
                    data-bs-parent="#careerTipsAccordion"
                  >
                    <div className="accordion-body px-4 pb-4 pt-0 border-top border-light border-2 text-secondary lh-lg" style={{ fontSize: "0.95rem" }}>
                      <div className="p-3 bg-light rounded-3 mt-3 border-start border-4 border-primary">
                        {tip.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* In-Console Support Box Panel Callout */}
            <div className="card border-0 shadow-sm bg-dark text-white rounded-4 p-4 mt-5 d-flex flex-sm-row align-items-center justify-content-between gap-3">
              <div>
                <h5 className="fw-bold mb-1">Ready to apply these blueprints?</h5>
                <p className="text-muted small mb-0" style={{ color: "#a0aec0 !important" }}>
                  Put your layout formatting rules to the test immediately in the job module feed.
                </p>
              </div>
              <a href="/jobs" className="btn btn-light rounded-3 fw-bold px-4 py-2 text-nowrap text-decoration-none">
                Browse Jobs Feed <i className="bi bi-arrow-right ms-2"></i>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* --- LOCAL UTILITY SCOPE STYLES --- */}
      <style>{`
        .hover-bg-light:hover {
          background-color: #f1f5f9 !important;
          color: #0d6efd !important;
        }
        .accordion-button:not(.collapsed) {
          color: inherit;
          background-color: #ffffff;
        }
        .accordion-button::after {
          background-size: 1.1rem;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}

export default TipsPage;
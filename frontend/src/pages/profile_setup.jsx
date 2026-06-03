import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ── Generate year range for Passout Year dropdown ──
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear + 4 - 1980 + 1 }, (_, i) => currentYear + 4 - i);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  .ps-root *, .ps-root *::before, .ps-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ps-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f7;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 32px 16px 60px;
    --primary: #3b5bdb;
    --primary-light: #eef1ff;
    --primary-mid: #748ffc;
    --accent: #22c55e;
    --accent-light: #f0fdf4;
    --text: #1a1d27;
    --sub: #6b7280;
    --border: #e5e8f0;
    --input-bg: #f8f9fc;
    --danger: #ef4444;
    --danger-light: #fef2f2;
    --radius: 14px;
    --radius-sm: 8px;
  }
  .ps-wrap { width: 100%; max-width: 820px; }

  .ps-progress-header {
    background: #fff;
    border-radius: 14px 14px 0 0;
    padding: 20px 36px 0;
    border-bottom: 1px solid #e5e8f0;
  }
  .ps-step-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .ps-step-badge {
    font-family: 'Sora', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--primary); background: var(--primary-light); padding: 4px 12px; border-radius: 999px;
  }
  .ps-step-fraction { font-size: 0.8rem; color: var(--sub); font-weight: 500; }
  .ps-progress-track { height: 4px; background: #e5e8f0; border-radius: 999px; overflow: hidden; margin-bottom: -1px; }
  .ps-progress-fill {
    height: 100%; width: 66%;
    background: linear-gradient(90deg, #3b5bdb, #748ffc);
    border-radius: 999px;
  }

  .ps-card {
    background: #fff;
    border-radius: 0 0 14px 14px;
    box-shadow: 0 8px 40px rgba(59,91,219,.10), 0 1px 6px rgba(0,0,0,.05);
    padding: 36px 36px 48px;
  }
  .ps-card-header { text-align: center; margin-bottom: 40px; }
  .ps-card-header h2 {
    font-family: 'Sora', sans-serif; font-size: 1.65rem; font-weight: 700;
    color: #1a1d27; margin-bottom: 6px;
  }
  .ps-card-header p { font-size: 0.92rem; color: #6b7280; }

  .ps-section { display: flex; align-items: center; gap: 12px; margin: 36px 0 20px; }
  .ps-section-label {
    font-family: 'Sora', sans-serif; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af; white-space: nowrap;
  }
  .ps-section-line { flex: 1; height: 1px; background: #e5e8f0; }

  .ps-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ps-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .ps-col-span-2 { grid-column: span 2; }

  .ps-field { display: flex; flex-direction: column; }
  .ps-field label { font-size: 0.72rem; font-weight: 600; color: #6b7280; margin-bottom: 6px; letter-spacing: 0.02em; }
  .ps-field input, .ps-field select, .ps-field textarea {
    width: 100%; background: #f8f9fc; border: 1.5px solid #e5e8f0;
    border-radius: 8px; padding: 10px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #1a1d27;
    outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
    appearance: none;
  }
  .ps-field input:focus, .ps-field select:focus, .ps-field textarea:focus {
    border-color: #3b5bdb; background: #fff;
    box-shadow: 0 0 0 3px rgba(59,91,219,.12);
  }
  .ps-field input[readonly] { background: #f1f3f9; color: #6b7280; cursor: not-allowed; }
  .ps-field textarea { resize: vertical; min-height: 88px; }
  .ps-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239ca3af' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px; cursor: pointer;
  }

  .ps-edu-block {
    background: #f8f9fc; border: 1.5px solid #e5e8f0;
    border-radius: 14px; padding: 20px; margin-bottom: 12px;
    transition: border-color .2s;
  }
  .ps-edu-block-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .ps-edu-tag {
    font-family: 'Sora', sans-serif; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #3b5bdb; background: #eef1ff; padding: 3px 10px; border-radius: 999px;
  }
  .ps-btn-remove {
    font-size: 0.78rem; color: #ef4444; background: #fef2f2;
    border: none; padding: 3px 10px; border-radius: 999px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
  }
  .ps-btn-remove:hover { background: #fee2e2; }
  .ps-add-edu-btn {
    width: 100%; border: 1.5px dashed #748ffc; background: #eef1ff;
    color: #3b5bdb; font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 600;
    padding: 11px; border-radius: 8px; cursor: pointer; letter-spacing: 0.04em;
    transition: background .2s, border-color .2s; margin-top: 4px;
  }
  .ps-add-edu-btn:hover { background: #e0e8ff; border-color: #3b5bdb; }

  .ps-toggle-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; background: #f8f9fc; border: 1.5px solid #e5e8f0;
    border-radius: 8px; cursor: pointer; user-select: none; transition: border-color .2s;
    width: 100%;
  }
  .ps-toggle-row:hover { border-color: #748ffc; }
  .ps-toggle-row.active { border-color: #3b5bdb; background: #eef1ff; }
  .ps-toggle-switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
  .ps-toggle-slider {
    position: absolute; inset: 0; background: #d1d5db; border-radius: 999px; transition: background .25s;
  }
  .ps-toggle-slider::before {
    content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px;
    background: #fff; border-radius: 50%; transition: transform .25s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
  }
  .ps-toggle-on .ps-toggle-slider { background: #3b5bdb; }
  .ps-toggle-on .ps-toggle-slider::before { transform: translateX(18px); }
  .ps-toggle-label { font-size: 0.88rem; font-weight: 500; color: #1a1d27; }
  .ps-toggle-label span { font-size: 0.78rem; color: #6b7280; display: block; }

  .ps-present-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1.5px solid #86efac;
    color: #16a34a; font-size: 0.82rem; font-weight: 600;
    padding: 9px 14px; border-radius: 8px; font-family: 'Sora', sans-serif;
  }
  .ps-present-dot {
    width: 7px; height: 7px; background: #22c55e; border-radius: 50%;
    animation: ps-pulse 1.6s infinite;
  }
  @keyframes ps-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .5; transform: scale(1.3); }
  }

  .ps-present-check-row {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    padding: 8px 0;
  }
  .ps-present-check-row input[type=checkbox] { accent-color: #3b5bdb; width: 15px; height: 15px; cursor: pointer; }
  .ps-present-check-row span { font-size: 0.82rem; color: #6b7280; font-weight: 500; }

  .ps-emp-box {
    background: linear-gradient(135deg, #eef2ff 0%, #f5f7ff 100%);
    border: 1.5px solid rgba(59,91,219,.2); border-radius: 14px; padding: 20px; margin-top: 4px;
    animation: ps-slideDown .25s ease;
  }
  @keyframes ps-slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ps-submit-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #3b5bdb 0%, #4c6ef5 100%);
    color: #fff; border: none; border-radius: 999px;
    font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 600; letter-spacing: 0.04em;
    cursor: pointer; margin-top: 36px;
    box-shadow: 0 6px 20px rgba(59,91,219,.35);
    transition: transform .15s, box-shadow .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .ps-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(59,91,219,.4); }
  .ps-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  @media (max-width: 600px) {
    .ps-grid-2, .ps-grid-3 { grid-template-columns: 1fr; }
    .ps-col-span-2 { grid-column: span 1; }
    .ps-card { padding: 24px 16px 36px; }
    .ps-progress-header { padding: 16px 16px 0; }
  }
`;

const defaultEdu = () => ({
  collegeName: "", location: "", startDate: "", endDate: "",
  passoutYear: "", degree: "", isPresent: false,
});

function ProfileSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "candidate";

  const [formData, setFormData] = useState({
    fullName: "", phone: "", skills: "", location: "",
    linkedinUrl: "", portfolioUrl: "", expectedCtc: "",
    currentlyEmployed: false,
    companyName: "", designation: "", empStartDate: "",
    empEndDate: "", empIsPresent: false, aboutRole: "",
  });

  const [educationList, setEducationList] = useState([defaultEdu()]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Inject styles once
  useEffect(() => {
    const id = "ps-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = styles;
      document.head.appendChild(tag);
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) { setIsFetching(false); return; }
    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${userId}`);
      const data = await res.json();
      setFormData(prev => ({ ...prev, fullName: data.name || "" }));
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEduChange = (index, field, value) => {
    setEducationList(prev => prev.map((edu, i) => i === index ? { ...edu, [field]: value } : edu));
  };

  const toggleEduPresent = (index) => {
    setEducationList(prev => prev.map((edu, i) =>
      i === index ? { ...edu, isPresent: !edu.isPresent, endDate: !edu.isPresent ? "" : edu.endDate } : edu
    ));
  };

  const addEducation = () => setEducationList(prev => [...prev, defaultEdu()]);
  const removeEducation = (index) => {
    if (educationList.length > 1) setEducationList(prev => prev.filter((_, i) => i !== index));
  };

  const toggleEmpPresent = () => {
    setFormData(prev => ({ ...prev, empIsPresent: !prev.empIsPresent, empEndDate: !prev.empIsPresent ? "" : prev.empEndDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem("user_id");
    const payload = {
      phone: formData.phone,
      skills: formData.skills,
      location: formData.location,
      linkedin_url: formData.linkedinUrl,
      portfolio_url: formData.portfolioUrl,
      expected_ctc: formData.expectedCtc ? parseFloat(formData.expectedCtc) : null,
      currently_employed: formData.currentlyEmployed,
      company_name: formData.currentlyEmployed ? formData.companyName : null,
      designation: formData.currentlyEmployed ? formData.designation : null,
      emp_start_date: formData.currentlyEmployed ? formData.empStartDate : null,
      emp_end_date: formData.currentlyEmployed && !formData.empIsPresent ? formData.empEndDate : null,
      emp_is_present: formData.currentlyEmployed ? formData.empIsPresent : false,
      about_role: formData.currentlyEmployed ? formData.aboutRole : null,
      education_history: educationList.map(edu => ({
        college_name: edu.collegeName,
        location: edu.location,
        start_date: edu.startDate,
        end_date: edu.isPresent ? null : edu.endDate,
        is_present: edu.isPresent,
        passout_year: edu.passoutYear ? parseInt(edu.passoutYear) : null,
        degree: edu.degree,
      })),
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/profiles/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) navigate(`/upload-resume/${userId}`, { state: { role } });
      else alert(data.detail || "Failed to save profile");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f7" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #eef1ff", borderTop: "3px solid #3b5bdb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div className="ps-root">
      <div className="ps-wrap">
        {/* Progress Header */}
        <div className="ps-progress-header">
          <div className="ps-step-meta">
            <span className="ps-step-badge">Profile Setup</span>
            <span className="ps-step-fraction">Step 2 of 3</span>
          </div>
          <div className="ps-progress-track"><div className="ps-progress-fill" /></div>
        </div>

        {/* Card */}
        <div className="ps-card">
          <div className="ps-card-header">
            <h2>Complete Your Profile</h2>
            <p>Fill in your details to get matched with the right opportunities.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── 1. Personal Details ── */}
            <div className="ps-section">
              <span className="ps-section-label">Personal Details</span>
              <div className="ps-section-line" />
            </div>
            <div className="ps-grid-2">
              <div className="ps-field">
                <label>Full Name</label>
                <input type="text" value={formData.fullName} readOnly />
              </div>
              <div className="ps-field">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" required />
              </div>
              <div className="ps-field">
                <label>Current Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Bangalore, Karnataka" required />
              </div>
              <div className="ps-field">
                <label>Top Skills (Comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Python, React, FastAPI…" required />
              </div>
            </div>

            {/* ── 2. Education History ── */}
            <div className="ps-section">
              <span className="ps-section-label">Education History</span>
              <div className="ps-section-line" />
            </div>

            {educationList.map((edu, idx) => (
              <div className="ps-edu-block" key={idx}>
                <div className="ps-edu-block-header">
                  <span className="ps-edu-tag">Institution #{idx + 1}</span>
                  {educationList.length > 1 && (
                    <button type="button" className="ps-btn-remove" onClick={() => removeEducation(idx)}>Remove</button>
                  )}
                </div>
                <div className="ps-grid-2" style={{ gap: 14 }}>
                  <div className="ps-field">
                    <label>College / School Name</label>
                    <input type="text" value={edu.collegeName} onChange={e => handleEduChange(idx, "collegeName", e.target.value)} placeholder="Enter Your College name" required />
                  </div>
                  <div className="ps-field">
                    <label>Location</label>
                    <input type="text" value={edu.location} onChange={e => handleEduChange(idx, "location", e.target.value)} placeholder="Location" required />
                  </div>
                  <div className="ps-field">
                    <label>Start Date</label>
                    <input type="date" value={edu.startDate} onChange={e => handleEduChange(idx, "startDate", e.target.value)} required />
                  </div>
                  <div className="ps-field">
                    <label>End Date</label>
                    {edu.isPresent
                      ? <div className="ps-present-badge"><div className="ps-present-dot" /> Present</div>
                      : <input type="date" value={edu.endDate} onChange={e => handleEduChange(idx, "endDate", e.target.value)} required={!edu.isPresent} />
                    }
                  </div>
                  <div className="ps-col-span-2">
                    <label className="ps-present-check-row" onClick={() => toggleEduPresent(idx)}>
                      <input type="checkbox" checked={edu.isPresent} onChange={() => {}} />
                      <span>I am currently studying here (Mark as Present)</span>
                    </label>
                  </div>
                  <div className="ps-field">
                    <label>Passout Year</label>
                    <select value={edu.passoutYear} onChange={e => handleEduChange(idx, "passoutYear", e.target.value)}>
                      <option value="">Select Year</option>
                      {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="ps-field">
                    <label>Degree / Stream (Optional)</label>
                    <input type="text" value={edu.degree} onChange={e => handleEduChange(idx, "degree", e.target.value)} placeholder="B.Tech Computer Science" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="ps-add-edu-btn" onClick={addEducation}>＋ Add Another Institution</button>

            {/* ── 3. Professional Details ── */}
            <div className="ps-section">
              <span className="ps-section-label">Professional Details</span>
              <div className="ps-section-line" />
            </div>
            <div className="ps-grid-2" style={{ marginBottom: 16 }}>
              <div className="ps-field">
                <label>Expected CTC (LPA)</label>
                <input type="number" name="expectedCtc" value={formData.expectedCtc} onChange={handleChange} placeholder="e.g. 6.5" min="0" step="0.5" />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div
                  className={`ps-toggle-row ${formData.currentlyEmployed ? "active" : ""}`}
                  onClick={() => setFormData(prev => ({ ...prev, currentlyEmployed: !prev.currentlyEmployed }))}
                >
                  <div className={`ps-toggle-switch ${formData.currentlyEmployed ? "ps-toggle-on" : ""}`}>
                    <div className="ps-toggle-slider" />
                  </div>
                  <div className="ps-toggle-label">
                    Currently Employed
                    <span>Toggle if you're working right now</span>
                  </div>
                </div>
              </div>
            </div>

            {formData.currentlyEmployed && (
              <div className="ps-emp-box">
                <div className="ps-grid-2" style={{ gap: 14 }}>
                  <div className="ps-field">
                    <label>Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Infosys" required />
                  </div>
                  <div className="ps-field">
                    <label>Designation</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Junior Developer" required />
                  </div>
                  <div className="ps-field">
                    <label>Start Date</label>
                    <input type="date" name="empStartDate" value={formData.empStartDate} onChange={handleChange} required />
                  </div>
                  <div className="ps-field">
                    <label>End Date</label>
                    {formData.empIsPresent
                      ? <div className="ps-present-badge"><div className="ps-present-dot" /> Present</div>
                      : <input type="date" name="empEndDate" value={formData.empEndDate} onChange={handleChange} required={!formData.empIsPresent} />
                    }
                  </div>
                  <div className="ps-col-span-2">
                    <label className="ps-present-check-row" onClick={toggleEmpPresent}>
                      <input type="checkbox" checked={formData.empIsPresent} onChange={() => {}} />
                      <span>I currently work here (Mark as Present)</span>
                    </label>
                  </div>
                  <div className="ps-col-span-2 ps-field">
                    <label>About Your Role (Optional)</label>
                    <textarea name="aboutRole" value={formData.aboutRole} onChange={handleChange} placeholder="Brief description of your responsibilities…" />
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. Professional Links ── */}
            <div className="ps-section">
              <span className="ps-section-label">Professional Links</span>
              <div className="ps-section-line" />
            </div>
            <div className="ps-grid-2">
              <div className="ps-field">
                <label>LinkedIn Profile URL</label>
                <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="linkedin.com/in/xyz" />
              </div>
              <div className="ps-field">
                <label>Portfolio or GitHub URL</label>
                <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="github.com/xyz" />
              </div>
            </div>

            <button type="submit" className="ps-submit-btn" disabled={isLoading}>
              {isLoading
                ? <><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Saving…</>
                : <>Save & Continue <span>→</span></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
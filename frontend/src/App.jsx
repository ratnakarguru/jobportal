import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./pages/register";
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import SelectRole from './pages/select_role';
import ProfileSetup from './pages/profile_setup';
import UploadResume from './pages/upload_resume';
import Profile from './pages/profile_page';
import JobsPage from './pages/job_page';
import TipsPage from './pages/tips';
import Companies from './pages/companies';
import TrackerPage from './pages/job_track';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout'; 
import RecruiterSetup from './pages/RecruiterSetup';
import RecruiterDashboard from './pages/RecruiterDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recruiter_setup" element={<RecruiterSetup />} />
          <Route path="/recruiter_dashboard" element={<RecruiterDashboard />} />

          {/* Cleaned Global Nav Layout Wrapper (No more /:userId clutter!) */}
          <Route path="/select-role" element={<SelectRole />} />
            <Route path='/profile-setup' element={<ProfileSetup/>} />
            <Route path='/upload-resume' element={<UploadResume/>} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path='/profile' element={<Profile/>} />
            <Route path='/tips' element={<TipsPage/>} />
            <Route path='/jobs' element={<JobsPage/>} />
            <Route path='/companies' element={<Companies/>} />
            <Route path='/job_track' element={<TrackerPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
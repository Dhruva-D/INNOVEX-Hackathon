import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import DonorDashboard from './pages/dashboard/DonorDashboard';
import SeekerDashboard from './pages/dashboard/SeekerDashboard';
import VolunteerDashboard from './pages/dashboard/VolunteerDashboard';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  return (
    <Router>
      <div className="app-wrapper transition-colors duration-300">
        {/* We only need the particles in the app root for pages that don't explicitly include it */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard/donor" 
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/seeker" 
            element={
              <ProtectedRoute requiredRole="seeker">
                <SeekerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/volunteer" 
            element={
              <ProtectedRoute requiredRole="volunteer">
                <VolunteerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
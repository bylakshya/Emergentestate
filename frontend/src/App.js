import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import BrokerDashboard from "./components/Dashboard/BrokerDashboard";
import BuilderDashboard from "./components/Dashboard/BuilderDashboard";
import { Toaster } from "./components/ui/toaster";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const userData = JSON.parse(user);
  
  if (allowedRole && userData.role !== allowedRole) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/broker-dashboard" 
            element={
              <ProtectedRoute allowedRole="broker">
                <BrokerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder-dashboard" 
            element={
              <ProtectedRoute allowedRole="builder">
                <BuilderDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
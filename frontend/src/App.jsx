import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CustomerPortal from './pages/Customer/CustomerPortal';
import Information from './pages/Customer/Information';
import QRDetails from './pages/QRDetails/QRDetails';
import Collections from './pages/Collections/Collections';
import Settings from './pages/Settings/Settings';
import Batches from './pages/Batches/Batches';
import TestBatches from './pages/TestBatches';
import TestLabDashboard from './pages/TestLabDashboard';
import LabTest from './pages/LabTest/LabTest';
import SeeItem from './pages/SeeItem/SeeItem';
import BatchDetails from './pages/Lab/BatchDetails';
import AddProcessingAdvanced from './pages/Processing/AddProcessingAdvanced';
import VerificationReport from './pages/VerificationReport/VerificationReport';
import ViewProduct from './pages/ViewProduct/ViewProduct';
import Toast from './components/UI/Toast';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { WalletProvider } from './contexts/WalletContext';
import { CollectionsProvider } from './contexts/CollectionsContext';

function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ayurherb_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('ayurherb_user', JSON.stringify(userData));
    showToast('Login successful!', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ayurherb_user');
    showToast('Logged out successfully', 'info');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };


  return (
    <ErrorBoundary>
      <CollectionsProvider>
        <WalletProvider>
          <Router>
          <div className="min-h-screen bg-dark-900 text-white">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} showToast={showToast} />
            } 
          />
          
          {/* Dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <Dashboard user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          
          <Route 
            path="/collections" 
            element={
              user ? (
                user.role === 'Collector' ? (
                  <Layout user={user} onLogout={handleLogout}>
                    <Collections user={user} showToast={showToast} />
                  </Layout>
                ) : (
                  <Navigate to="/dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <Settings user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/verification-report" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <VerificationReport user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/batches" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <Batches user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/see-item" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <SeeItem user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/lab-test" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <LabTest user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/batch/:batchId" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <BatchDetails user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/add-processing/:batchId?" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <AddProcessingAdvanced user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/view-product" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <ViewProduct user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/information" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <Information user={user} showToast={showToast} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* QR Details - Public route for scanning */}
          <Route 
            path="/qr-details" 
            element={<QRDetails />} 
          />
          
          {/* Test routes - no auth required */}
          <Route 
            path="/test-batches" 
            element={<TestBatches />} 
          />
          <Route 
            path="/test-lab" 
            element={<TestLabDashboard />} 
          />
          <Route 
            path="/test-lab-test" 
            element={<LabTest user={{name: 'Dr. Sarah Wilson', role: 'Lab Tester'}} showToast={console.log} />} 
          />
          
          {/* Public customer portal route */}
          <Route 
            path="/scan/:batchId" 
            element={<CustomerPortal showToast={showToast} />} 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } 
          />
        </Routes>
        
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
            </div>
          </Router>
        </WalletProvider>
      </CollectionsProvider>
    </ErrorBoundary>
  );
}

export default App;

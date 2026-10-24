import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Verifying your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Role mismatch
    return (
      <div className="main-content">
        <div className="container-narrow" style={{ marginTop: '3rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--status-cancelled-bg)', color: '#dc2626', marginBottom: '1rem' }}>
              <ShieldAlert size={48} />
            </div>
            <h2>Access Restricted</h2>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Your account role (<strong>{user?.role}</strong>) does not have permission to view this section.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard'} className="btn btn-primary">
                <ArrowLeft size={16} /> Return to Your Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="main-content">
      <div className="container-narrow" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-waiting-bg)',
              color: 'var(--status-waiting-text)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={36} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '0.25rem' }}>404</h1>
          <h2 style={{ marginBottom: '0.5rem' }}>Page Not Found</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto 1.75rem' }}>
            The queue page or resource you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

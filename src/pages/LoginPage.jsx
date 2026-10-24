import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import Alert from '../components/Alert';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(email, password);
      // Navigate according to role or return path
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="main-content">
      <div className="container-narrow" style={{ marginTop: '2rem' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                color: 'var(--teal-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <LogIn size={22} />
            </div>
            <h2>Sign In to QueueLess</h2>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Access your digital queue tokens and account
            </p>
          </div>

          {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Autofill Buttons */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--slate-100)',
            }}
          >
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--slate-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Sparkles size={14} color="var(--teal-500)" /> Fill Demo Credentials:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('customer@queueless.com', 'Customer123!')}
                className="btn btn-outline btn-sm"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('staff1@queueless.com', 'Staff123!')}
                className="btn btn-outline btn-sm"
              >
                Staff (Passport)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@queueless.com', 'Admin123!')}
                className="btn btn-outline btn-sm"
              >
                Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--slate-500)' }}>Don't have an account? </span>
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

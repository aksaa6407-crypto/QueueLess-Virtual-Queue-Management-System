import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';
import Alert from '../components/Alert';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ name, email, password, phone });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Registration failed. Please check your information.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <UserPlus size={22} />
            </div>
            <h2>Create Your Account</h2>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Register to join queues and track token status digitally
            </p>
          </div>

          {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number (Optional for SMS/Call alerts)
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="+1 (555) 012-3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <div className="form-helper">Must be 6 characters or longer.</div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Customer Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--slate-500)' }}>Already have an account? </span>
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  LogOut,
  User as UserIcon,
  Search,
  Ticket,
  Clock,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: 'var(--navy-900)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-400) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--white)',
              boxShadow: '0 4px 12px var(--teal-glow)',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--white)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Queue<span style={{ color: 'var(--teal-300)' }}>Less</span>
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--slate-400)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Virtual Queue System
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/services"
            style={{
              color: isActive('/services') ? 'var(--teal-300)' : 'var(--slate-300)',
              fontWeight: 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Search size={16} /> Services
          </Link>

          <Link
            to="/track"
            style={{
              color: isActive('/track') ? 'var(--teal-300)' : 'var(--slate-300)',
              fontWeight: 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Ticket size={16} /> Track Token
          </Link>

          {isAuthenticated && user?.role === 'customer' && (
            <>
              <Link
                to="/dashboard"
                style={{
                  color: isActive('/dashboard') ? 'var(--teal-300)' : 'var(--slate-300)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <LayoutDashboard size={16} /> My Queues
              </Link>
              <Link
                to="/history"
                style={{
                  color: isActive('/history') ? 'var(--teal-300)' : 'var(--slate-300)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Clock size={16} /> History
              </Link>
            </>
          )}

          {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin') && (
            <Link
              to="/staff"
              style={{
                color: isActive('/staff') ? 'var(--teal-300)' : 'var(--slate-300)',
                fontWeight: 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <LayoutDashboard size={16} /> Staff Desk
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              style={{
                color: isActive('/admin') ? 'var(--teal-300)' : 'var(--slate-300)',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(13, 148, 136, 0.15)',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(45, 212, 191, 0.3)',
              }}
            >
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          )}
        </nav>

        {/* User Status / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <UserIcon size={16} color="var(--teal-300)" />
                <span
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: 'var(--white)',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.675rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    backgroundColor: user?.role === 'admin' ? '#ef4444' : user?.role === 'staff' ? 'var(--teal-500)' : 'var(--navy-700)',
                    color: 'var(--white)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  {user?.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.825rem',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--slate-300)',
                }}
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.85rem',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'var(--white)',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              cursor: 'pointer',
              display: 'none',
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--navy-950)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--slate-200)', padding: '0.4rem 0' }}
          >
            Services
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--slate-200)', padding: '0.4rem 0' }}
          >
            Track Token
          </Link>
          {isAuthenticated && user?.role === 'customer' && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--slate-200)', padding: '0.4rem 0' }}
              >
                My Queues
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--slate-200)', padding: '0.4rem 0' }}
              >
                History
              </Link>
            </>
          )}
          {isAuthenticated && (user?.role === 'staff' || user?.role === 'admin') && (
            <Link
              to="/staff"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--slate-200)', padding: '0.4rem 0' }}
            >
              Staff Desk
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--teal-300)', padding: '0.4rem 0', fontWeight: 600 }}
            >
              Admin Panel
            </Link>
          )}
        </div>
      )}

      {/* CSS helper for responsive display */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

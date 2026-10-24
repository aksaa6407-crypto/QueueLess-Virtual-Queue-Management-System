import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviceApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Users,
  Shield,
  ArrowRight,
  Smartphone,
  CheckCircle,
  Sparkles,
  Ticket,
  ChevronRight,
  Building,
} from 'lucide-react';

export const LandingPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceApi.getAll();
        if (res.data.success) {
          setServices(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.warn('Could not fetch initial services:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleQuickLogin = async (email, password, redirectPath) => {
    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--navy-950) 0%, var(--navy-900) 100%)',
          color: 'var(--white)',
          padding: '4.5rem 1.5rem 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(13, 148, 136, 0.15)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              color: 'var(--teal-300)',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} /> Intelligent Virtual Queue Management
          </div>

          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--white)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            Say Goodbye to Standing in Lines.{' '}
            <span style={{ color: 'var(--teal-300)' }}>Join Queues Digitally.</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--slate-300)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
            }}
          >
            QueueLess empowers citizens and customers to obtain instant digital tokens, track their position in real-time on mobile or desktop, and arrive right on time when their token is called.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <Link to="/services" className="btn btn-primary btn-lg">
              Browse Services & Join <ArrowRight size={18} />
            </Link>
            <Link
              to="/track"
              className="btn btn-outline"
              style={{
                color: 'var(--white)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Ticket size={18} /> Track Your Token
            </Link>
          </div>

          {/* Quick Demo Credential Box for Academic Evaluation */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'left',
              maxWidth: '780px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--teal-300)',
                }}
              >
                Instant Academic Demo Access
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                Click any role to test instantly
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <button
                onClick={() => handleQuickLogin('customer@queueless.com', 'Customer123!', '/dashboard')}
                className="btn btn-outline"
                style={{
                  color: 'var(--white)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  justifyContent: 'flex-start',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--teal-300)' }}>👤 Customer Portal</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>customer@queueless.com</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickLogin('staff1@queueless.com', 'Staff123!', '/staff')}
                className="btn btn-outline"
                style={{
                  color: 'var(--white)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  justifyContent: 'flex-start',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--teal-300)' }}>👨‍💼 Staff Counter</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>staff1@queueless.com</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickLogin('admin@queueless.com', 'Admin123!', '/admin')}
                className="btn btn-outline"
                style={{
                  color: 'var(--white)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  justifyContent: 'flex-start',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#f87171' }}>👑 Admin Dashboard</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>admin@queueless.com</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="main-content" style={{ padding: '4rem 1.5rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Designed for Seamless Service Flow</h2>
          <p>Eliminate chaos and provide a transparent, comfortable queuing experience.</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
        >
          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                color: 'var(--teal-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Smartphone size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Digital Token Allocation</h3>
            <p style={{ fontSize: '0.925rem' }}>
              Customers receive a verified, sequential token instantly without physical paper tickets or kiosk crowding.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                color: 'var(--teal-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Clock size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Live Position & Wait Times</h3>
            <p style={{ fontSize: '0.925rem' }}>
              Real-time calculation computes exact waiting counts ahead and dynamic minutes remaining based on service speed.
            </p>
          </div>

          <div className="card">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--teal-50)',
                color: 'var(--teal-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Shield size={24} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Staff & Admin Controls</h3>
            <p style={{ fontSize: '0.925rem' }}>
              Dedicated counters for operators to call, serve, skip, and complete tickets, paired with administrative location management.
            </p>
          </div>
        </div>
      </section>

      {/* Available Services Preview */}
      <section style={{ backgroundColor: 'var(--slate-100)', padding: '3.5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2>Popular Active Services</h2>
              <p>Join an active queue or check today's waiting status</p>
            </div>
            <Link to="/services" className="btn btn-outline-teal">
              View All Services <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {services.map((srv) => (
              <div key={srv._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--teal-600)',
                      backgroundColor: 'var(--teal-50)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    CODE: {srv.code}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Building size={14} /> {srv.locationId?.name || 'Main Center'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{srv.name}</h3>
                <p style={{ fontSize: '0.85rem', flex: 1, marginBottom: '1.25rem' }}>
                  {srv.description || 'Standard public queue service.'}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--slate-100)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Estimated Wait</div>
                    <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>
                      ~{srv.liveStats?.estimatedWaitMinutes || srv.avgWaitMinutes || 10} mins
                    </div>
                  </div>

                  <Link to="/services" className="btn btn-primary btn-sm">
                    Join Queue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

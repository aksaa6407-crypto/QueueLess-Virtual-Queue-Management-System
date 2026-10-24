import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { serviceApi, locationApi, queueApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Building,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ChevronRight,
  Filter,
  PlusCircle,
} from 'lucide-react';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Join modal state
  const [selectedService, setSelectedService] = useState(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinedToken, setJoinedToken] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [srvRes, locRes] = await Promise.all([
        serviceApi.getAll(),
        locationApi.getAll(),
      ]);

      if (srvRes.data.success) {
        setServices(srvRes.data.data);
      }
      if (locRes.data.success) {
        setLocations(locRes.data.data);
      }
    } catch (err) {
      setErrorMessage('Failed to load services. Please check server connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll for updated queue counts every 20 seconds
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenJoinModal = (service) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/services' } } });
      return;
    }
    setSelectedService(service);
    setPhone(user?.phone || '');
    setNotes('');
    setErrorMessage('');
    setJoinedToken(null);
  };

  const handleConfirmJoin = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsJoining(true);
    setErrorMessage('');

    try {
      const res = await queueApi.join({
        serviceId: selectedService._id,
        customerPhone: phone,
        notes,
      });

      if (res.data.success) {
        setJoinedToken(res.data.data);
        // Refresh service counts
        loadData();
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to join queue. You may already have an active ticket.'
      );
    } finally {
      setIsJoining(false);
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesLocation =
      selectedLocation === 'all' ||
      srv.locationId?._id === selectedLocation ||
      srv.locationId === selectedLocation;

    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLocation && matchesSearch;
  });

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Browse Available Services</h1>
            <p>Select a department, check current waiting times, and claim your digital token.</p>
          </div>
          {isAuthenticated && user?.role === 'customer' && (
            <Link to="/dashboard" className="btn btn-outline-teal">
              <Ticket size={16} /> View My Active Tokens
            </Link>
          )}
        </div>
      </div>

      {/* Global alert messages */}
      {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      {/* Search and Filters */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-400)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search service name or code (e.g. Passport, PASS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ minWidth: '200px' }}>
          <select
            className="form-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="all">🏢 All Service Locations</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name} ({loc.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--slate-500)' }}>Loading available queues...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="empty-state">
          <Ticket className="empty-state-icon" />
          <h3>No services found</h3>
          <p style={{ marginTop: '0.25rem' }}>Try adjusting your search criteria or filter location.</p>
        </div>
      ) : (
        /* Services Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredServices.map((srv) => {
            const waitingCount = srv.liveStats?.waitingCount || 0;
            const currentToken = srv.liveStats?.currentToken;
            const estWait = srv.liveStats?.estimatedWaitMinutes || 0;
            const isOpen = srv.isOpen !== false;

            return (
              <div
                key={srv._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: isOpen ? '4px solid var(--teal-500)' : '4px solid var(--slate-300)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--teal-600)',
                      backgroundColor: 'var(--teal-50)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    CODE: {srv.code}
                  </span>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isOpen ? '#065f46' : '#991b1b',
                      backgroundColor: isOpen ? '#ecfdf5' : '#fef2f2',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                    }}
                  >
                    {isOpen ? '● Queue Open' : '○ Closed'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>{srv.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
                  <Building size={14} />
                  <span>{srv.locationId?.name || 'Main Civic Hub'}</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--navy-600)', flex: 1, marginBottom: '1.25rem' }}>
                  {srv.description || 'Standard public customer service.'}
                </p>

                {/* Queue Metrics Strip */}
                <div
                  style={{
                    backgroundColor: 'var(--slate-50)',
                    border: '1px solid var(--slate-200)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    textAlign: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Waiting</div>
                    <div style={{ fontWeight: 800, color: 'var(--navy-900)', fontSize: '1.1rem' }}>
                      {waitingCount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Serving</div>
                    <div style={{ fontWeight: 800, color: currentToken ? 'var(--teal-600)' : 'var(--slate-400)', fontSize: '0.95rem' }}>
                      {currentToken || 'None'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Est. Wait</div>
                    <div style={{ fontWeight: 800, color: 'var(--navy-900)', fontSize: '1.1rem' }}>
                      ~{estWait}m
                    </div>
                  </div>
                </div>

                {/* Join CTA */}
                <button
                  onClick={() => handleOpenJoinModal(srv)}
                  disabled={!isOpen}
                  className={isOpen ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ width: '100%' }}
                >
                  {isOpen ? (
                    <>
                      <Ticket size={16} /> Join Virtual Queue
                    </>
                  ) : (
                    'Queue Currently Closed'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Join Queue Modal */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => {
          setSelectedService(null);
          setJoinedToken(null);
        }}
        title={joinedToken ? 'Queue Token Allocated!' : `Join Queue: ${selectedService?.name}`}
      >
        {joinedToken ? (
          /* Confirmation Success View */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-serving-bg)',
                color: 'var(--teal-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ marginBottom: '0.25rem' }}>You're in the queue!</h3>
            <p style={{ fontSize: '0.875rem' }}>Your digital token has been registered in the system.</p>

            <div
              style={{
                backgroundColor: 'var(--navy-900)',
                color: 'var(--white)',
                padding: '1.5rem',
                borderRadius: '12px',
                margin: '1.25rem 0',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--teal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Assigned Token
              </div>
              <div className="token-big" style={{ fontSize: '3rem', margin: '0.25rem 0' }}>
                {joinedToken.tokenNumber}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>
                Position: <strong>#{joinedToken.queuePosition}</strong> in line &bull; Est. wait:{' '}
                <strong>~{joinedToken.estimatedWaitMinutes} mins</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to={`/track/${joinedToken.tokenNumber}`} className="btn btn-primary">
                Track Live Position <ChevronRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn btn-navy">
                My Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Input Form View */
          <form onSubmit={handleConfirmJoin}>
            <div
              style={{
                backgroundColor: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                borderRadius: '8px',
                padding: '0.85rem',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
              }}
            >
              <div><strong>Service:</strong> {selectedService?.name}</div>
              <div><strong>Location:</strong> {selectedService?.locationId?.name}</div>
              <div><strong>Current wait estimate:</strong> ~{selectedService?.liveStats?.estimatedWaitMinutes || selectedService?.avgWaitMinutes || 10} minutes</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Contact Phone (For SMS/Call Notifications)
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="form-helper">Optional. We use this to notify you when your turn arrives.</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Specific Request / Notes (Optional)
              </label>
              <textarea
                id="notes"
                className="form-textarea"
                rows={2}
                placeholder="e.g. Urgent passport renewal, student course add..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedService(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isJoining}
              >
                {isJoining ? 'Allocating Token...' : 'Confirm & Claim Token'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ServicesPage;

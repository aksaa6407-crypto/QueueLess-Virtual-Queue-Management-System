import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { queueApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Search,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Building,
  RotateCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';

export const QueueTrackPage = () => {
  const { identifier } = useParams();
  const [searchToken, setSearchToken] = useState(identifier || '');
  const [entryData, setEntryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTokenDetails = async (tokenToFetch, silent = false) => {
    if (!tokenToFetch.trim()) return;

    if (silent) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await queueApi.track(tokenToFetch.trim());
      if (res.data.success) {
        setEntryData(res.data.data);
      }
    } catch (err) {
      setEntryData(null);
      setErrorMessage(
        err.response?.data?.message || `Token '${tokenToFetch}' not found for today's queue.`
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (identifier) {
      setSearchToken(identifier);
      fetchTokenDetails(identifier);
    }
  }, [identifier]);

  // Polling for live standing if an active token is loaded
  useEffect(() => {
    if (!entryData || (entryData.status !== 'waiting' && entryData.status !== 'serving')) {
      return;
    }

    const interval = setInterval(() => {
      fetchTokenDetails(entryData.tokenNumber, true);
    }, 10000);

    return () => clearInterval(interval);
  }, [entryData?.tokenNumber, entryData?.status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchToken.trim()) return;
    navigate(`/track/${searchToken.trim()}`);
    fetchTokenDetails(searchToken.trim());
  };

  const isOwner = user && entryData && user.id === entryData.userId;
  const isServing = entryData?.status === 'serving';
  const isCompleted = entryData?.status === 'completed';
  const isCancelled = entryData?.status === 'cancelled';
  const isSkipped = entryData?.status === 'skipped';

  return (
    <div className="main-content">
      <div className="container-narrow">
        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Live Queue Tracker</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Enter your token number to view your real-time position and estimated wait time.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter token number (e.g. PASS-003, VEH-001)..."
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value.toUpperCase())}
              style={{ fontWeight: 600, letterSpacing: '0.05em' }}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <Search size={16} /> Track
            </button>
          </form>
        </div>

        {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--slate-500)' }}>Looking up queue position...</p>
          </div>
        )}

        {/* Loaded Token View */}
        {!isLoading && entryData && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header Hero */}
            <div
              style={{
                background: isServing
                  ? 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)'
                  : isCompleted
                  ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
                  : isCancelled
                  ? 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-850) 100%)',
                color: 'var(--white)',
                padding: '2.5rem 2rem',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <StatusBadge status={entryData.status} />
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--teal-200)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {entryData.serviceId?.name}
              </div>

              <div className="token-big">{entryData.tokenNumber}</div>

              <div style={{ fontSize: '0.9rem', color: 'var(--slate-200)' }}>
                Issued for <strong>{entryData.customerName}</strong> &bull; {entryData.serviceId?.locationId?.name}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
                <button
                  onClick={() => fetchTokenDetails(entryData.tokenNumber, true)}
                  className="btn btn-outline btn-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    color: 'var(--white)',
                  }}
                  disabled={isRefreshing}
                >
                  <RotateCw size={14} className={isRefreshing ? 'spinner' : ''} style={{ margin: 0 }} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Live Standing (Auto-updated)'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                borderBottom: '1px solid var(--slate-200)',
                textAlign: 'center',
                backgroundColor: 'var(--slate-50)',
              }}
            >
              <div style={{ padding: '1.25rem', borderRight: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Position in Line</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.2rem' }}>
                  {isServing ? 'Now Serving' : isCompleted ? 'Completed' : `#${entryData.queuePosition || 1}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                  {entryData.aheadCount || 0} ahead of you
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRight: '1px solid var(--slate-200)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Current Serving</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--teal-600)', marginTop: '0.2rem' }}>
                  {entryData.currentToken || 'None'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Active desk ticket</div>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Est. Waiting Time</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.2rem' }}>
                  {isServing ? '0 min' : `~${entryData.estimatedWaitMinutes || 0}m`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Based on flow speed</div>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div style={{ padding: '1.75rem' }}>
              <h4 style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>Queue Lifecycle Progress</h4>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  margin: '1rem 0 1.5rem',
                }}
              >
                {/* Connecting Line */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '40px',
                    right: '40px',
                    height: '3px',
                    backgroundColor: 'var(--slate-200)',
                    zIndex: 1,
                  }}
                />

                {/* Step 1: Joined */}
                <div style={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--teal-500)',
                      color: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>1. Token Claimed</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                    {new Date(entryData.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Step 2: Serving */}
                <div style={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isServing || isCompleted ? 'var(--teal-500)' : 'var(--slate-200)',
                      color: isServing || isCompleted ? 'var(--white)' : 'var(--slate-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    2
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>2. Called to Counter</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                    {isServing ? 'Serving Now' : isCompleted ? 'Served' : 'Pending'}
                  </div>
                </div>

                {/* Step 3: Completed */}
                <div style={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--teal-500)' : 'var(--slate-200)',
                      color: isCompleted ? 'var(--white)' : 'var(--slate-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    3
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>3. Service Complete</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                    {isCompleted ? 'Finished' : 'Upcoming'}
                  </div>
                </div>
              </div>

              {/* Status explanation alert */}
              {isServing && (
                <div className="alert alert-success" style={{ marginBottom: 0 }}>
                  <Play size={20} />
                  <div>
                    <strong>Your token is being called right now!</strong> Please step up to the service counter immediately.
                  </div>
                </div>
              )}

              {entryData.status === 'waiting' && (
                <div className="alert alert-info" style={{ marginBottom: 0 }}>
                  <Clock size={20} />
                  <div>
                    You are in the digital queue. You can keep this page open; your estimated arrival time will adjust in real-time as tickets progress.
                  </div>
                </div>
              )}
            </div>

            {/* Back action */}
            <div
              style={{
                backgroundColor: 'var(--slate-50)',
                padding: '1rem 1.75rem',
                borderTop: '1px solid var(--slate-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Link to="/services" className="btn btn-outline btn-sm">
                Join Another Queue
              </Link>
              {user && (
                <Link to="/dashboard" className="btn btn-primary btn-sm">
                  Go to My Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueTrackPage;

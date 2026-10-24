import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queueApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Clock,
  Play,
  RotateCw,
  XCircle,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  Building,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export const CustomerDashboard = () => {
  const [activeEntries, setActiveEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cancel modal state
  const [cancellingEntry, setCancellingEntry] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const { user } = useAuth();

  const fetchActiveEntries = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage('');

    try {
      const res = await queueApi.getMyActive();
      if (res.data.success) {
        setActiveEntries(res.data.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to fetch active queue tickets.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActiveEntries(true);
    // Auto-poll active tickets every 12 seconds
    const interval = setInterval(() => {
      fetchActiveEntries(false);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!cancellingEntry) return;

    setIsCancelling(true);
    try {
      const res = await queueApi.cancel(cancellingEntry._id, cancelReason);
      if (res.data.success) {
        setSuccessMessage(`Ticket ${cancellingEntry.tokenNumber} has been successfully cancelled.`);
        setCancellingEntry(null);
        setCancelReason('');
        fetchActiveEntries(false);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to cancel queue ticket.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p>Here are your active digital queue tokens and live standing.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => fetchActiveEntries(false)}
            className="btn btn-outline"
            disabled={isRefreshing}
            title="Refresh queue standing"
          >
            <RotateCw size={16} className={isRefreshing ? 'spinner' : ''} style={{ margin: 0 }} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
          <Link to="/services" className="btn btn-primary">
            <PlusCircle size={16} /> Join a Service Queue
          </Link>
        </div>
      </div>

      {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      {/* Loading state */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--slate-500)' }}>Fetching your live tickets...</p>
        </div>
      ) : activeEntries.length === 0 ? (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--teal-50)',
              color: 'var(--teal-600)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Ticket size={32} />
          </div>
          <h2>No Active Queue Tickets</h2>
          <p style={{ maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
            You do not currently have any tokens in queue. Browse our available services to join a virtual queue from anywhere.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/services" className="btn btn-primary">
              Browse Available Services
            </Link>
            <Link to="/history" className="btn btn-outline">
              View Past Queue History
            </Link>
          </div>
        </div>
      ) : (
        /* Active Tickets List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {activeEntries.map((entry) => {
            const isServing = entry.status === 'serving';
            const locationName = entry.serviceId?.locationId?.name || 'Central Office';
            const locationAddress = entry.serviceId?.locationId?.address || '';

            return (
              <div
                key={entry._id}
                style={{
                  background: isServing
                    ? 'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)'
                    : 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-850) 100%)',
                  borderRadius: 'var(--radius-xl)',
                  color: 'var(--white)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-xl)',
                  border: isServing ? '2px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Top Info Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    paddingBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--teal-300)',
                        fontWeight: 700,
                      }}
                    >
                      {entry.serviceId?.name}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                      <Building size={14} /> {locationName} {locationAddress ? `(${locationAddress})` : ''}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <StatusBadge status={entry.status} />
                    <Link
                      to={`/track/${entry.tokenNumber}`}
                      className="btn btn-outline-teal btn-sm"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--white)',
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                      }}
                    >
                      <ExternalLink size={14} /> Full View
                    </Link>
                  </div>
                </div>

                {/* Hero Token & Position Display */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    alignItems: 'center',
                    margin: '1.75rem 0',
                    textAlign: 'center',
                  }}
                >
                  {/* Token Box */}
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem 1rem',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--teal-200)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Your Token Number
                    </div>
                    <div className="token-big" style={{ fontSize: '3.25rem', margin: '0.25rem 0' }}>
                      {entry.tokenNumber}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--slate-300)' }}>
                      Joined at {new Date(entry.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Standing / Position Box */}
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem 1rem',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--teal-200)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Queue Position
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--white)', margin: '0.25rem 0' }}>
                      {isServing ? 'NOW SERVING' : `#${entry.queuePosition || 1}`}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--slate-300)' }}>
                      {isServing
                        ? 'Please proceed directly to the counter desk!'
                        : `${entry.aheadCount || 0} person(s) ahead of you`}
                    </div>
                  </div>

                  {/* Estimated Wait Box */}
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem 1rem',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--teal-200)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Estimated Wait
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--teal-300)', margin: '0.25rem 0' }}>
                      {isServing ? '0 min' : `~${entry.estimatedWaitMinutes || 0}m`}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--slate-300)' }}>
                      Currently serving: <strong>{entry.currentToken || 'None'}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer notes & Cancellation action */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    paddingTop: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)' }}>
                    {entry.notes ? (
                      <span><strong>Note:</strong> {entry.notes}</span>
                    ) : (
                      <span>Status updates automatically in real-time.</span>
                    )}
                  </div>

                  {entry.status === 'waiting' && (
                    <button
                      onClick={() => setCancellingEntry(entry)}
                      className="btn btn-outline btn-sm"
                      style={{
                        color: '#fca5a5',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      }}
                    >
                      <XCircle size={15} /> Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingEntry}
        onClose={() => setCancellingEntry(null)}
        title="Cancel Queue Ticket?"
      >
        <form onSubmit={handleConfirmCancel}>
          <p style={{ marginBottom: '1.25rem' }}>
            Are you sure you want to cancel your queue ticket <strong>{cancellingEntry?.tokenNumber}</strong> for{' '}
            <strong>{cancellingEntry?.serviceId?.name}</strong>? You will lose your position in line.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="cancelReason">
              Reason for Cancellation (Optional)
            </label>
            <input
              id="cancelReason"
              type="text"
              className="form-input"
              placeholder="e.g. Rescheduled, solved elsewhere, personal emergency"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setCancellingEntry(null)}
            >
              Keep My Ticket
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;

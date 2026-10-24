import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queueApi } from '../services/api';
import { Clock, Ticket, ExternalLink, Building, RotateCw } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';

export const CustomerHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadHistory = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await queueApi.getMyHistory();
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to load your queue history.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>My Queue History</h1>
          <p>Review all your previously claimed digital tokens and service records.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadHistory} className="btn btn-outline" title="Refresh history">
            <RotateCw size={16} /> Refresh
          </button>
          <Link to="/services" className="btn btn-primary">
            Join New Queue
          </Link>
        </div>
      </div>

      {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--slate-500)' }}>Loading history records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <Clock className="empty-state-icon" />
          <h3>No Previous Queue Records</h3>
          <p style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            You haven't joined any virtual queues yet.
          </p>
          <Link to="/services" className="btn btn-primary">
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Service & Location</th>
                <th>Date</th>
                <th>Joined At</th>
                <th>Status</th>
                <th>Notes / Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span
                      style={{
                        fontWeight: 800,
                        color: 'var(--navy-900)',
                        backgroundColor: 'var(--slate-100)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.tokenNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy-800)' }}>
                      {item.serviceId?.name || 'Service'}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Building size={12} /> {item.serviceId?.locationId?.name || 'Main Location'}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{item.date}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--slate-600)', maxWidth: '240px' }}>
                    {item.cancelReason
                      ? `Cancelled: ${item.cancelReason}`
                      : item.notes
                      ? item.notes
                      : '—'}
                  </td>
                  <td>
                    <Link
                      to={`/track/${item.tokenNumber}`}
                      className="btn btn-outline btn-sm"
                      title="View tracking details"
                    >
                      <ExternalLink size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerHistoryPage;

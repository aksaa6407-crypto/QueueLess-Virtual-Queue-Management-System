import React, { useState, useEffect } from 'react';
import { serviceApi, queueApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Play,
  CheckCircle2,
  SkipForward,
  RotateCw,
  Clock,
  Phone,
  User,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Building,
  Check,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [queueData, setQueueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Skip modal state
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [skipNotes, setSkipNotes] = useState('');

  // Complete modal state
  const [completeNotes, setCompleteNotes] = useState('');

  // 1. Load services list
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceApi.getAll();
        if (res.data.success) {
          setServices(res.data.data);
          // Default to assigned service if present, else first available
          const assigned = user?.assignedService?._id || user?.assignedService;
          const defaultId = assigned || (res.data.data[0]?._id ?? '');
          setSelectedServiceId(defaultId);
        }
      } catch (err) {
        setErrorMessage('Failed to load services list.');
      }
    };

    fetchServices();
  }, [user]);

  // 2. Load service queue whenever selectedServiceId changes
  const loadQueue = async (silent = false) => {
    if (!selectedServiceId) return;

    if (silent) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await queueApi.getServiceQueue(selectedServiceId);
      if (res.data.success) {
        setQueueData(res.data.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to load queue for this service.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedServiceId) {
      loadQueue();
      // Auto-poll every 8 seconds
      const interval = setInterval(() => {
        loadQueue(true);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [selectedServiceId]);

  // Action: Call Next
  const handleCallNext = async () => {
    if (!selectedServiceId) return;
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await queueApi.callNext(selectedServiceId);
      if (res.data.success) {
        setSuccessMessage(`Now calling token ${res.data.data.tokenNumber} (${res.data.data.customerName})!`);
        loadQueue(true);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Could not call next customer.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Complete Serving
  const handleCompleteCurrent = async () => {
    if (!queueData?.currentServing?._id) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await queueApi.updateStatus(
        queueData.currentServing._id,
        'completed',
        completeNotes
      );
      if (res.data.success) {
        setSuccessMessage(`Token ${queueData.currentServing.tokenNumber} marked as Completed.`);
        setCompleteNotes('');
        loadQueue(true);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to complete ticket.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Skip Token
  const handleConfirmSkip = async () => {
    if (!queueData?.currentServing?._id) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await queueApi.updateStatus(
        queueData.currentServing._id,
        'skipped',
        skipNotes || 'Customer did not show up'
      );
      if (res.data.success) {
        setSuccessMessage(`Token ${queueData.currentServing.tokenNumber} has been skipped.`);
        setSkipModalOpen(false);
        setSkipNotes('');
        loadQueue(true);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to skip ticket.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Toggle Open / Close Queue
  const handleToggleQueueOpen = async () => {
    if (!queueData?.service?._id) return;
    try {
      const newStatus = !queueData.service.isOpen;
      const res = await serviceApi.update(queueData.service._id, { isOpen: newStatus });
      if (res.data.success) {
        setSuccessMessage(`Queue intake is now ${newStatus ? 'OPEN' : 'CLOSED'}.`);
        loadQueue(true);
      }
    } catch (err) {
      setErrorMessage('Failed to update service queue open status.');
    }
  };

  const currentServing = queueData?.currentServing;
  const waitingList = queueData?.waitingList || [];
  const metrics = queueData?.metrics || { totalWaiting: 0, totalServed: 0, totalToday: 0 };
  const currentService = queueData?.service;

  return (
    <div className="main-content">
      {/* Top Header & Service Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1>Staff Service Counter Desk</h1>
          <p>Manage real-time customer flow, call next tokens, and update queue standing.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            className="form-select"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            style={{ fontWeight: 600, minWidth: '240px' }}
          >
            {services.map((srv) => (
              <option key={srv._id} value={srv._id}>
                {srv.name} ({srv.code})
              </option>
            ))}
          </select>

          <button
            onClick={() => loadQueue(false)}
            className="btn btn-outline"
            disabled={isRefreshing}
            title="Refresh queue"
          >
            <RotateCw size={16} className={isRefreshing ? 'spinner' : ''} style={{ margin: 0 }} />
          </button>
        </div>
      </div>

      {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      {/* Metrics Row */}
      <div className="stat-grid">
        <StatCard
          icon={Users}
          label="Currently Waiting"
          value={metrics.totalWaiting}
          subtext="In line right now"
        />
        <StatCard
          icon={Play}
          label="Serving Desk"
          value={currentServing ? currentServing.tokenNumber : 'Idle'}
          subtext={currentServing ? currentServing.customerName : 'Counter ready'}
          color="navy"
        />
        <StatCard
          icon={CheckCircle2}
          label="Served Today"
          value={metrics.totalServed}
          subtext="Successfully completed"
        />
        <StatCard
          icon={Clock}
          label="Total Intake Today"
          value={metrics.totalToday}
          subtext={`Avg speed: ~${currentService?.avgWaitMinutes || 10}m`}
        />
      </div>

      {/* Main Counter Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Active Serving Station */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Serving Card */}
          <div
            className="card"
            style={{
              border: currentServing ? '2px solid var(--teal-500)' : '1px solid var(--slate-200)',
              backgroundColor: currentServing ? 'var(--white)' : 'var(--slate-50)',
            }}
          >
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Play size={18} color="var(--teal-600)" /> Current Customer at Counter
              </h3>
              {currentServing && <StatusBadge status="serving" />}
            </div>

            {currentServing ? (
              <div>
                <div
                  style={{
                    backgroundColor: 'var(--navy-900)',
                    color: 'var(--white)',
                    padding: '1.75rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Token in Service
                  </div>
                  <div className="token-big" style={{ fontSize: '3.5rem', margin: '0.25rem 0' }}>
                    {currentServing.tokenNumber}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {currentServing.customerName}
                  </div>
                  {currentServing.customerPhone && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)', marginTop: '0.25rem' }}>
                      <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {currentServing.customerPhone}
                    </div>
                  )}
                </div>

                {currentServing.notes && (
                  <div
                    style={{
                      backgroundColor: 'var(--slate-100)',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <strong>Customer Notes:</strong> {currentServing.notes}
                  </div>
                )}

                {/* Operator Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleCompleteCurrent}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={isProcessing}
                  >
                    <CheckCircle2 size={16} /> Mark Completed
                  </button>
                  <button
                    onClick={() => setSkipModalOpen(true)}
                    className="btn btn-outline"
                    style={{ color: 'var(--slate-700)' }}
                    disabled={isProcessing}
                  >
                    <SkipForward size={16} /> Skip Token
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <Clock size={40} color="var(--slate-400)" style={{ marginBottom: '0.75rem' }} />
                <h3>Counter is Free</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  There is currently no customer being served at this counter.
                </p>
                <button
                  onClick={handleCallNext}
                  className="btn btn-primary btn-lg"
                  disabled={isProcessing || waitingList.length === 0}
                >
                  <Play size={18} /> Call Next Customer ({waitingList.length} Waiting)
                </button>
              </div>
            )}
          </div>

          {/* Queue Intake Controls */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ marginBottom: '0.2rem' }}>Queue Intake Status</h4>
                <p style={{ fontSize: '0.85rem' }}>
                  {currentService?.isOpen ? 'Currently accepting new customers' : 'Intake is paused/closed'}
                </p>
              </div>
              <button
                onClick={handleToggleQueueOpen}
                className={currentService?.isOpen ? 'btn btn-outline-teal btn-sm' : 'btn btn-primary btn-sm'}
              >
                {currentService?.isOpen ? 'Pause / Close Intake' : 'Reopen Intake'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Waiting List Queue */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Waiting Queue ({waitingList.length})</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Sequential order</span>
          </div>

          {waitingList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <CheckCircle2 size={40} color="var(--teal-500)" style={{ marginBottom: '0.75rem' }} />
              <h4>Queue is clear!</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                No customers are currently waiting for this service.
              </p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Token</th>
                    <th>Customer Name</th>
                    <th>Joined</th>
                    <th>Est. Wait</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingList.map((item, index) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 700, color: 'var(--slate-500)' }}>
                        #{index + 1}
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            backgroundColor: 'var(--slate-100)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            color: 'var(--navy-900)',
                          }}
                        >
                          {item.tokenNumber}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.customerName}</div>
                        {item.customerPhone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{item.customerPhone}</div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--teal-600)' }}>
                        ~{item.estimatedWaitMinutes}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Skip Confirmation Modal */}
      <Modal
        isOpen={skipModalOpen}
        onClose={() => setSkipModalOpen(false)}
        title="Skip Current Customer?"
      >
        <p style={{ marginBottom: '1rem' }}>
          Mark token <strong>{currentServing?.tokenNumber}</strong> ({currentServing?.customerName}) as skipped?
          Use this if the customer did not step up to the counter when called.
        </p>

        <div className="form-group">
          <label className="form-label">Skip Reason / Note</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. No show after 3 calls, absent from waiting area"
            value={skipNotes}
            onChange={(e) => setSkipNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setSkipModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmSkip}
            disabled={isProcessing}
          >
            {isProcessing ? 'Skipping...' : 'Confirm Skip'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StaffDashboard;

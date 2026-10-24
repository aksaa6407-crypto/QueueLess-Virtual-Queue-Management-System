import React, { useState, useEffect } from 'react';
import { adminApi, locationApi, serviceApi } from '../services/api';
import {
  ShieldCheck,
  Building,
  Layers,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  RotateCw,
  Search,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'locations' | 'services' | 'staff'
  const [stats, setStats] = useState(null);
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals state
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationForm, setLocationForm] = useState({ name: '', code: '', address: '', city: '', contactPhone: '' });

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', code: '', description: '', locationId: '', avgWaitMinutes: 10, dailyCapacity: 100 });

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'staff', phone: '', assignedService: '' });

  const loadAllAdminData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [statsRes, locRes, srvRes, staffRes] = await Promise.all([
        adminApi.getStats(),
        locationApi.getAll(true),
        serviceApi.getAll(null, true),
        adminApi.getStaff(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (locRes.data.success) setLocations(locRes.data.data);
      if (srvRes.data.success) setServices(srvRes.data.data);
      if (staffRes.data.success) setStaffList(staffRes.data.data);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to fetch administrative data.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Location Handlers
  const handleCreateLocation = async (e) => {
    e.preventDefault();
    try {
      const res = await locationApi.create(locationForm);
      if (res.data.success) {
        setSuccessMessage('Location created successfully.');
        setLocationModalOpen(false);
        setLocationForm({ name: '', code: '', address: '', city: '', contactPhone: '' });
        loadAllAdminData();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create location.');
    }
  };

  const handleToggleLocation = async (loc) => {
    try {
      await locationApi.update(loc._id, { isActive: !loc.isActive });
      loadAllAdminData();
    } catch (err) {
      setErrorMessage('Failed to update location.');
    }
  };

  // Service Handlers
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const res = await serviceApi.create(serviceForm);
      if (res.data.success) {
        setSuccessMessage('Service created successfully.');
        setServiceModalOpen(false);
        setServiceForm({ name: '', code: '', description: '', locationId: '', avgWaitMinutes: 10, dailyCapacity: 100 });
        loadAllAdminData();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create service.');
    }
  };

  const handleToggleService = async (srv) => {
    try {
      await serviceApi.update(srv._id, { isOpen: !srv.isOpen });
      loadAllAdminData();
    } catch (err) {
      setErrorMessage('Failed to toggle service.');
    }
  };

  // Staff Handlers
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createStaff(staffForm);
      if (res.data.success) {
        setSuccessMessage('Staff account created successfully.');
        setStaffModalOpen(false);
        setStaffForm({ name: '', email: '', password: '', role: 'staff', phone: '', assignedService: '' });
        loadAllAdminData();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create staff account.');
    }
  };

  const handleToggleStaffActive = async (staffMember) => {
    try {
      await adminApi.updateStaff(staffMember._id, { isActive: !staffMember.isActive });
      loadAllAdminData();
    } catch (err) {
      setErrorMessage('Failed to toggle staff active state.');
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>System Administration</h1>
          <p>Manage branch locations, services, staff operators, and queue performance metrics.</p>
        </div>
        <button onClick={loadAllAdminData} className="btn btn-outline" title="Refresh all data">
          <RotateCw size={16} /> Refresh
        </button>
      </div>

      {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      {/* Admin Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid var(--slate-200)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          className="btn"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0',
            borderBottom: activeTab === 'overview' ? '3px solid var(--teal-500)' : '3px solid transparent',
            color: activeTab === 'overview' ? 'var(--teal-600)' : 'var(--navy-600)',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            padding: '0.75rem 1.25rem',
          }}
        >
          <ShieldCheck size={16} /> System Overview
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className="btn"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0',
            borderBottom: activeTab === 'locations' ? '3px solid var(--teal-500)' : '3px solid transparent',
            color: activeTab === 'locations' ? 'var(--teal-600)' : 'var(--navy-600)',
            fontWeight: activeTab === 'locations' ? 700 : 500,
            padding: '0.75rem 1.25rem',
          }}
        >
          <Building size={16} /> Locations ({locations.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className="btn"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0',
            borderBottom: activeTab === 'services' ? '3px solid var(--teal-500)' : '3px solid transparent',
            color: activeTab === 'services' ? 'var(--teal-600)' : 'var(--navy-600)',
            fontWeight: activeTab === 'services' ? 700 : 500,
            padding: '0.75rem 1.25rem',
          }}
        >
          <Layers size={16} /> Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className="btn"
          style={{
            backgroundColor: 'transparent',
            borderRadius: '0',
            borderBottom: activeTab === 'staff' ? '3px solid var(--teal-500)' : '3px solid transparent',
            color: activeTab === 'staff' ? 'var(--teal-600)' : 'var(--navy-600)',
            fontWeight: activeTab === 'staff' ? 700 : 500,
            padding: '0.75rem 1.25rem',
          }}
        >
          <Users size={16} /> Staff Accounts ({staffList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div className="stat-grid">
            <StatCard
              icon={Users}
              label="Registered Customers"
              value={stats?.counts?.totalCustomers || 0}
              subtext="Public users"
            />
            <StatCard
              icon={ShieldCheck}
              label="Staff & Operators"
              value={stats?.counts?.totalStaff || 0}
              subtext="Assigned counters"
            />
            <StatCard
              icon={Building}
              label="Active Locations"
              value={stats?.counts?.totalLocations || 0}
              subtext="Civic branches"
            />
            <StatCard
              icon={Layers}
              label="Active Services"
              value={stats?.counts?.totalServices || 0}
              subtext="Configured queues"
            />
          </div>

          {/* Today's Queue Summary Banner */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Today's Queue Performance Summary</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Total Tokens Issued</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {stats?.today?.totalTokens || 0}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--status-waiting-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-waiting-text)' }}>Currently Waiting</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-waiting-text)' }}>
                  {stats?.today?.waiting || 0}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--status-serving-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-serving-text)' }}>Now Serving</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-serving-text)' }}>
                  {stats?.today?.serving || 0}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--status-completed-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-completed-text)' }}>Completed</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-completed-text)' }}>
                  {stats?.today?.completed || 0}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--status-cancelled-bg)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--status-cancelled-text)' }}>Cancelled / Skipped</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-cancelled-text)' }}>
                  {(stats?.today?.cancelled || 0) + (stats?.today?.skipped || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Service-wise Breakdown Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--slate-100)' }}>
              <h3>Service Breakdown for Today</h3>
            </div>
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Service Code</th>
                    <th>Service Name</th>
                    <th>Waiting</th>
                    <th>Served Today</th>
                    <th>Total Intake</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.serviceBreakdown?.map((srv) => (
                    <tr key={srv.id}>
                      <td style={{ fontWeight: 800 }}>{srv.code}</td>
                      <td style={{ fontWeight: 600 }}>{srv.name}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: srv.waiting > 0 ? '#b45309' : 'var(--slate-500)' }}>
                          {srv.waiting}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--teal-600)' }}>{srv.served}</span>
                      </td>
                      <td style={{ fontWeight: 800 }}>{srv.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOCATIONS */}
      {activeTab === 'locations' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Branch Locations</h3>
            <button onClick={() => setLocationModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Add Location
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Location Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc._id}>
                    <td style={{ fontWeight: 800 }}>{loc.code}</td>
                    <td style={{ fontWeight: 600 }}>{loc.name}</td>
                    <td>{loc.address}</td>
                    <td>{loc.city || '—'}</td>
                    <td>{loc.contactPhone || '—'}</td>
                    <td>
                      <span className={`status-badge ${loc.isActive ? 'serving' : 'cancelled'}`}>
                        {loc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleLocation(loc)}
                        className="btn btn-outline btn-sm"
                      >
                        {loc.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES */}
      {activeTab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Services & Queues</h3>
            <button
              onClick={() => {
                if (locations.length > 0) {
                  setServiceForm((prev) => ({ ...prev, locationId: locations[0]._id }));
                }
                setServiceModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} /> Add New Service
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Service Name</th>
                  <th>Location</th>
                  <th>Avg Wait Time</th>
                  <th>Daily Cap</th>
                  <th>Intake Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((srv) => (
                  <tr key={srv._id}>
                    <td style={{ fontWeight: 800 }}>{srv.code}</td>
                    <td style={{ fontWeight: 600 }}>{srv.name}</td>
                    <td>{srv.locationId?.name || '—'}</td>
                    <td>{srv.avgWaitMinutes} mins / person</td>
                    <td>{srv.dailyCapacity} max</td>
                    <td>
                      <span className={`status-badge ${srv.isOpen ? 'serving' : 'cancelled'}`}>
                        {srv.isOpen ? 'Intake Open' : 'Intake Closed'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleService(srv)}
                        className="btn btn-outline btn-sm"
                      >
                        {srv.isOpen ? 'Close Intake' : 'Open Intake'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STAFF */}
      {activeTab === 'staff' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Staff & Admin Accounts</h3>
            <button onClick={() => setStaffModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create Staff Account
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assigned Service</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((member) => (
                  <tr key={member._id}>
                    <td style={{ fontWeight: 600 }}>{member.name}</td>
                    <td>{member.email}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: member.role === 'admin' ? '#fee2e2' : 'var(--teal-50)',
                          color: member.role === 'admin' ? '#991b1b' : 'var(--teal-600)',
                        }}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td>{member.assignedService?.name || 'Flexible / All'}</td>
                    <td>
                      <span className={`status-badge ${member.isActive ? 'serving' : 'cancelled'}`}>
                        {member.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStaffActive(member)}
                        className="btn btn-outline btn-sm"
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE LOCATION */}
      <Modal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        title="Add New Service Location"
      >
        <form onSubmit={handleCreateLocation}>
          <div className="form-group">
            <label className="form-label">Location Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Westside Public Service Center"
              value={locationForm.name}
              onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location Code *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. WEST"
              value={locationForm.code}
              onChange={(e) => setLocationForm({ ...locationForm, code: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Full Address *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 500 West Avenue, Hall C"
              value={locationForm.address}
              onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Metropolis"
              value={locationForm.city}
              onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={locationForm.contactPhone}
              onChange={(e) => setLocationForm({ ...locationForm, contactPhone: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setLocationModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Location
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREATE SERVICE */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title="Add New Service Queue"
      >
        <form onSubmit={handleCreateService}>
          <div className="form-group">
            <label className="form-label">Service Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Driver License Renewal"
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Service Prefix Code *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. DLR"
              value={serviceForm.code}
              onChange={(e) => setServiceForm({ ...serviceForm, code: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Branch Location *</label>
            <select
              className="form-select"
              value={serviceForm.locationId}
              onChange={(e) => setServiceForm({ ...serviceForm, locationId: e.target.value })}
              required
            >
              <option value="">Select location...</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Average Wait (Minutes per person) *</label>
            <input
              type="number"
              className="form-input"
              min="1"
              value={serviceForm.avgWaitMinutes}
              onChange={(e) => setServiceForm({ ...serviceForm, avgWaitMinutes: Number(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Token Capacity</label>
            <input
              type="number"
              className="form-input"
              min="1"
              value={serviceForm.dailyCapacity}
              onChange={(e) => setServiceForm({ ...serviceForm, dailyCapacity: Number(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Description of the service and requirements..."
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setServiceModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Service
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREATE STAFF */}
      <Modal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        title="Create Staff Operator Account"
      >
        <form onSubmit={handleCreateStaff}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Officer Jane Smith"
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="jane.smith@queueless.com"
              value={staffForm.email}
              onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password * (Min 6 chars)</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={staffForm.password}
              onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={staffForm.role}
              onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
            >
              <option value="staff">Staff Operator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Assigned Service (Optional)</label>
            <select
              className="form-select"
              value={staffForm.assignedService}
              onChange={(e) => setStaffForm({ ...staffForm, assignedService: e.target.value })}
            >
              <option value="">Flexible / Not restricted to one service</option>
              {services.map((srv) => (
                <option key={srv._id} value={srv._id}>
                  {srv.name} ({srv.code})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setStaffModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

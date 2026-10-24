import React from 'react';

export const StatCard = ({ icon: Icon, label, value, subtext, color = 'teal' }) => {
  return (
    <div className="stat-card">
      {Icon && (
        <div className="stat-icon" style={color === 'navy' ? { backgroundColor: 'var(--slate-100)', color: 'var(--navy-900)' } : {}}>
          <Icon size={24} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtext && (
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

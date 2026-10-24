import React from 'react';
import { Layers, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--navy-950)',
        color: 'var(--slate-400)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 1.5rem 1.75rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--white)', marginBottom: '0.75rem' }}>
            <Layers size={20} color="var(--teal-400)" />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>QueueLess</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.6 }}>
            A modern, digital queue management system designed to eliminate physical waiting lines, reduce crowded waiting rooms, and provide transparent live wait times.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Core Modules</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Digital Token Generation</li>
            <li>Real-time Position Tracking</li>
            <li>Staff Counter Desk Management</li>
            <li>Multi-location & Service Administration</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Academic Details</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.6 }}>
            <strong>Project:</strong> QueueLess — Virtual Queue Management System<br />
            <strong>Stack:</strong> React, Node.js, Express, MongoDB<br />
            <strong>Author:</strong> [Academic Student Name / Details]
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '1.25rem auto 0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--slate-500)',
          gap: '1rem',
        }}
      >
        <div>
          &copy; {new Date().getFullYear()} QueueLess. Academic Capstone Project.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>MERN Architecture</span>
          <span>Role-Based Access Control</span>
          <span>RESTful API</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

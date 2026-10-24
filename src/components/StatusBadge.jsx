import React from 'react';
import { Clock, Play, CheckCircle2, XCircle, SkipForward } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'waiting').toLowerCase();

  const config = {
    waiting: {
      label: 'Waiting in Queue',
      icon: Clock,
      className: 'waiting',
    },
    serving: {
      label: 'Currently Serving',
      icon: Play,
      className: 'serving',
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      className: 'completed',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'cancelled',
    },
    skipped: {
      label: 'Skipped',
      icon: SkipForward,
      className: 'skipped',
    },
  };

  const current = config[normalized] || config.waiting;
  const IconComponent = current.icon;

  return (
    <span className={`status-badge ${current.className}`}>
      <IconComponent size={13} />
      <span>{current.label}</span>
    </span>
  );
};

export default StatusBadge;

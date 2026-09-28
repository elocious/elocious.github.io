import React from 'react';

export default function StatCard({ icon: Icon, label, value, accent = 'blue' }) {
  const accentClass = `stat-card stat-${accent}`;
  return (
    <div className={accentClass}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}

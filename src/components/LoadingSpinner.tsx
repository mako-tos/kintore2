import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string; className?: string }> = ({ label = '読み込み中…', className }) => {
  return (
    <div className={className} role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="20" height="20" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#999" strokeWidth="5" strokeLinecap="round"
          strokeDasharray="31.415, 31.415" transform="rotate(90 25 25)">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;

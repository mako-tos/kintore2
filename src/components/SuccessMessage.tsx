import React from 'react';

export const SuccessMessage: React.FC<{ message: string; className?: string }> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div role="status" aria-live="polite" className={className ?? 'pure-alert success'} style={{ color: '#0c7c59', marginTop: '0.5rem' }}>
      {message}
    </div>
  );
};

export default SuccessMessage;

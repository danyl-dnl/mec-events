import React from 'react';

const D = { fontFamily: "'Space Grotesk', sans-serif" };

export default function SectionHead({ eyebrow, title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      paddingBottom: '20px',
      borderBottom: '2px solid var(--border)',
    }}>
      <div>
        <p style={{ ...D, fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
          {eyebrow}
        </p>
        <h2 style={{ ...D, fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function ProfileBanner({ onOpenProfile }) {
  const { user, profile } = useAuth();

  // Only render if user is logged in but profile is not complete
  if (!user || (profile && profile.is_complete)) return null;

  return (
    <div style={{
      background: '#FEF08A',
      border: '2.5px solid var(--border)',
      borderRadius: '6px',
      boxShadow: '4px 4px 0 var(--border)',
      padding: '12px 20px',
      marginBottom: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px',
          background: 'rgba(0,0,0,0.06)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <AlertTriangle size={15} color="#111" strokeWidth={2.5} />
        </div>
        <p style={{ ...B, fontSize: '13px', fontWeight: 500, color: '#111', margin: 0, lineHeight: 1.4 }}>
          <strong>Complete your profile:</strong> Add your semester, branch, and roll number to enable <strong>one-click registrations</strong> and secure your passes!
        </p>
      </div>

      <button
        onClick={onOpenProfile}
        style={{
          ...D, fontSize: '12px', fontWeight: 700,
          padding: '8px 16px',
          background: 'var(--text)', color: 'var(--text-light)',
          border: '2px solid var(--border)', borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'all 0.12s ease',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.15)',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
      >
        Complete Profile
        <ArrowRight size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}

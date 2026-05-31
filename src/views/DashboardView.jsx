import React from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import Ticket from '../components/Ticket';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function DashboardView({ registered, handleDownload, setView, pageAnim }) {
  return (
    <motion.div key="dashboard" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHead eyebrow="Your Registrations" title="My Passes" />

      {registered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {registered.map(tkt => (
            <Ticket key={tkt.id} ticket={tkt} onDownload={handleDownload} />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)', border: '2.5px solid var(--border)', borderRadius: '4px',
          boxShadow: 'var(--shadow-md)', padding: '80px 40px', textAlign: 'center',
        }}>
          <TicketIcon size={40} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--text-muted)' }} />
          <h3 style={{ ...D, fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>No passes yet</h3>
          <p style={{ ...B, fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Register for an event and your pass will appear here instantly.
          </p>
          <button
            onClick={() => setView('events')}
            style={{
              ...D, fontSize: '13px', fontWeight: 700,
              padding: '12px 24px',
              background: 'var(--text)', color: 'var(--text-light)',
              border: '2.5px solid var(--border)', borderRadius: '4px', cursor: 'pointer',
              transition: 'opacity 0.12s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Browse Events →
          </button>
        </div>
      )}
    </motion.div>
  );
}

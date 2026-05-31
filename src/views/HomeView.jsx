import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Award } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import EventCard from '../components/EventCard';
import { MEC_EVENTS } from '../data/mockDatabase';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function HomeView({ setView, registered, setActiveEvent, pageAnim }) {
  const stats = [
    { Icon: Calendar, value: '8+',   label: 'Active Events',    sub: 'Registration open',  bg: '#FEF08A' },
    { Icon: Users,    value: '1,200+',label: 'Campus Makers',   sub: 'Across all chapters', bg: '#BBF7D0' },
    { Icon: Award,    value: '8',     label: 'Student Clubs',   sub: 'Official chapters',   bg: '#BAE6FD' },
  ];

  return (
    <motion.div key="home" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>

      {/* HERO */}
      <section style={{ maxWidth: '720px' }}>
        <h1 style={{
          ...D,
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 700,
          lineHeight: 1.0,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          Events &<br />
          <span style={{ color: 'var(--text-muted)' }}>Experiences</span><br />
          at MEC.
        </h1>

        <p style={{
          ...B,
          fontSize: '16px', fontWeight: 400,
          color: 'var(--text-sub)', lineHeight: 1.7,
          maxWidth: '520px',
          marginBottom: '32px',
        }}>
          The official event portal for Government Model Engineering College, Thrikkakara.
          Discover events, explore clubs, and register — all in one place.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            id="cta-browse-events"
            onClick={() => setView('events')}
            style={{
              ...D,
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', fontWeight: 700,
              padding: '13px 28px',
              background: 'var(--text)', color: 'var(--text-light)',
              border: '2.5px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Browse Events →
          </button>
          <button
            id="cta-view-clubs"
            onClick={() => setView('clubs')}
            style={{
              ...D,
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', fontWeight: 700,
              padding: '13px 28px',
              background: 'transparent', color: 'var(--text)',
              border: '2.5px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-ghost)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Explore Clubs
          </button>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="stats-grid">
        {stats.map(({ Icon, value, label, sub, bg }) => (
          <div key={label} style={{
            background: 'var(--bg-card)',
            border: '2.5px solid var(--border)',
            borderRadius: '4px',
            boxShadow: 'var(--shadow-md)',
            padding: '28px 24px',
            display: 'flex', flexDirection: 'column', gap: '16px',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}>
            {/* Stat Accent Badge (keeps its custom flat brand color for high impact!) */}
            <div style={{
              width: '40px', height: '40px',
              background: bg,
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid #111',
            }}>
              <Icon size={20} color="#111" strokeWidth={2} />
            </div>
            <div>
              <span style={{ ...D, fontSize: '36px', fontWeight: 700, color: 'var(--text)', display: 'block', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {value}
              </span>
              <span style={{ ...D, fontSize: '13px', fontWeight: 600, color: 'var(--text)', display: 'block', marginTop: '6px' }}>
                {label}
              </span>
              <span style={{ ...B, fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                {sub}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* FLAGSHIP EVENTS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <SectionHead
          eyebrow="Featured"
          title="Flagship Events"
          action={
            <button
              onClick={() => setView('events')}
              style={{
                ...B, fontSize: '13px', fontWeight: 600, color: 'var(--text-sub)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              View all events →
            </button>
          }
        />
        <div className="bento-grid">
          {MEC_EVENTS.filter(e => e.flagship).map(evt => (
            <EventCard
              key={evt.id} event={evt}
              onRegister={setActiveEvent}
              isRegistered={registered.some(r => r.eventId === evt.id)}
            />
          ))}
        </div>
      </section>

    </motion.div>
  );
}

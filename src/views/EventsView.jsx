import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import EventCard from '../components/EventCard';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const CATEGORIES = ['All', 'Tech', 'Coding', 'Electronics', 'Quizzing', 'Entrepreneurship', 'Arts'];

export default function EventsView({
  search, setSearch,
  category, setCategory,
  filtered,
  registered,
  setActiveEvent,
  pageAnim
}) {
  return (
    <motion.div key="events" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <SectionHead
        eyebrow="MEC Campus"
        title="All Events"
        action={
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              id="event-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              className="field"
              style={{ paddingLeft: '38px', width: '240px' }}
            />
          </div>
        }
      />

      {/* Category filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {CATEGORIES.map(cat => {
          const active = category === cat;
          return (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              onClick={() => setCategory(cat)}
              style={{
                ...D,
                fontSize: '12px', fontWeight: 700,
                padding: '7px 16px',
                background: active ? 'var(--text)' : 'var(--bg-card)',
                color:      active ? 'var(--text-light)' : 'var(--text)',
                border:     '2.5px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
                letterSpacing: '0.01em',
                boxShadow: active ? '2px 2px 0 var(--border)' : 'none',
                transform: active ? 'translate(-1px, -1px)' : 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--hover-ghost)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="bento-grid">
          {filtered.map(evt => (
            <EventCard
              key={evt.id} event={evt}
              onRegister={setActiveEvent}
              isRegistered={registered.some(r => r.eventId === evt.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)', border: '2.5px solid var(--border)', borderRadius: '4px',
          boxShadow: 'var(--shadow-md)', padding: '80px 40px', textAlign: 'center',
        }}>
          <ShieldCheck size={40} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--text-muted)' }} />
          <h3 style={{ ...D, fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>No events found</h3>
          <p style={{ ...B, fontSize: '14px', color: 'var(--text-muted)' }}>Try a different category or clear your search.</p>
        </div>
      )}
    </motion.div>
  );
}

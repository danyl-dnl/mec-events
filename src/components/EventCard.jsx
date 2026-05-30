import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, Sparkles, Check, Users } from 'lucide-react';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const CAT_COLOR = {
  coding:           '#BAE6FD',
  tech:             '#FEF08A',
  electronics:      '#FBCFE8',
  quizzing:         '#DDD6FE',
  entrepreneurship: '#BBF7D0',
  arts:             '#FED7AA',
  robotics:         '#FED7AA',
};

function catColor(cat) {
  return CAT_COLOR[cat.toLowerCase()] || '#E5E7EB';
}

function fmtDate(ds) {
  return new Date(ds).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function EventCard({ event, onRegister, isRegistered }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
      className="bento-card-small"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        border: '2.5px solid #111',
        borderRadius: '4px',
        padding: '24px',
        minHeight: '360px',
        overflow: 'hidden',
        transform: hovered ? 'translate(-3px, -3px)' : 'none',
        boxShadow: hovered ? '9px 9px 0 #111' : '5px 5px 0 #111',
        transition: 'transform 0.16s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.16s ease',
      }}
    >
      {/* Flagship accent stripe */}
      {event.flagship && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: '#F5C518',
        }} />
      )}

      {/* ── ROW 1: Category tag + Flagship badge ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '8px',
        marginBottom: '16px',
        marginTop: event.flagship ? '8px' : '0',
      }}>
        <span style={{
          ...D,
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          padding: '4px 10px',
          background: catColor(event.category),
          border: '1.5px solid #111',
          borderRadius: '3px',
          color: '#111',
        }}>
          <Tag size={9} strokeWidth={2.5} />
          {event.category}
        </span>

        {event.flagship && (
          <span style={{
            ...D,
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            padding: '4px 10px',
            background: '#0F0F0F', color: '#F5C518',
            border: '1.5px solid #111',
            borderRadius: '3px',
          }}>
            <Sparkles size={9} />
            FLAGSHIP
          </span>
        )}
      </div>

      {/* ── ROW 2: Title ── */}
      <h3 style={{
        ...D,
        fontSize: event.title.length > 22 ? '18px' : '21px',
        fontWeight: 700,
        lineHeight: 1.15,
        color: '#111',
        marginBottom: '6px',
        letterSpacing: '-0.01em',
      }}>
        {event.title}
      </h3>

      {/* ── ROW 3: Host club ── */}
      <p style={{
        ...B,
        fontSize: '12px',
        fontWeight: 600,
        color: '#888',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {event.clubName}
      </p>

      {/* ── ROW 4: Description ── */}
      <p style={{
        ...B,
        fontSize: '14px',
        fontWeight: 400,
        color: '#444',
        lineHeight: 1.65,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {event.description}
      </p>

      {/* ── FOOTER ── */}
      <div style={{
        borderTop: '1.5px solid #EBEBEB',
        marginTop: '18px',
        paddingTop: '16px',
      }}>
        {/* Date / Time / Venue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: '#555' }}>
              <Calendar size={12} color="#999" strokeWidth={2} />
              {fmtDate(event.date)}
            </span>
            <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: '#555' }}>
              <Clock size={12} color="#999" strokeWidth={2} />
              {event.time}
            </span>
          </div>
          <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500, color: '#555' }}>
            <MapPin size={12} color="#999" strokeWidth={2} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.venue}
            </span>
          </span>
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{
            ...D,
            fontSize: '16px', fontWeight: 700,
            padding: '4px 12px',
            background: event.price === 'Free' ? '#BBF7D0' : '#FEF08A',
            border: '2px solid #111',
            borderRadius: '4px',
            color: '#111',
          }}>
            {event.price === 'Free' ? 'FREE' : event.price}
          </span>

          {isRegistered ? (
            <button disabled style={{
              ...D,
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', fontWeight: 700,
              padding: '9px 16px',
              background: '#F0FDF4',
              border: '2px solid #86EFAC',
              borderRadius: '4px',
              color: '#166534',
              cursor: 'default',
            }}>
              <Check size={13} strokeWidth={3} /> Registered
            </button>
          ) : (
            <button
              id={`btn-register-${event.id}`}
              onClick={() => onRegister(event)}
              style={{
                ...D,
                fontSize: '12px', fontWeight: 700,
                padding: '9px 20px',
                background: '#111',
                color: '#FFF',
                border: '2px solid #111',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.12s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#111'}
            >
              Register →
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

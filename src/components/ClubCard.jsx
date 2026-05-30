import React, { useState } from 'react';
import { ArrowUpRight, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

// Each club gets a left-border accent color
const CLUB_ACCENTS = {
  fossmec:    '#EF4444',
  macs:       '#3B82F6',
  ieee:       '#8B5CF6',
  iedc:       '#10B981',
  illuminati: '#F59E0B',
  signals:    '#EC4899',
  cyborg:     '#F97316',
  thirdeye:   '#06B6D4',
};

function accentColor(id) {
  return CLUB_ACCENTS[id.toLowerCase()] || '#111111';
}

export default function ClubCard({ club, onExploreEvents }) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor(club.id);

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
        borderLeft: `5px solid ${accent}`,
        padding: '24px',
        minHeight: '300px',
        overflow: 'hidden',
        transform: hovered ? 'translate(-3px, -3px)' : 'none',
        boxShadow: hovered ? '9px 9px 0 #111' : '5px 5px 0 #111',
        transition: 'transform 0.16s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.16s ease',
      }}
    >
      {/* ── TOP ROW: Initial badge + Explore button ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
        {/* Club initial */}
        <div style={{
          width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: accent,
          borderRadius: '8px',
          flexShrink: 0,
        }}>
          <span style={{
            ...D,
            fontSize: '20px', fontWeight: 700,
            color: '#FFF',
            lineHeight: 1,
          }}>
            {club.name[0]}
          </span>
        </div>

        {/* Explore button */}
        <button
          onClick={() => onExploreEvents(club.id)}
          title={`See ${club.name} events`}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 12px',
            ...D, fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.03em',
            color: '#111',
            background: 'transparent',
            border: '2px solid #111',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.12s ease, color 0.12s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#FFF'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
        >
          Events <ArrowUpRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── CLUB NAME ── */}
      <h3 style={{
        ...D,
        fontSize: '20px', fontWeight: 700,
        color: '#111', lineHeight: 1.1,
        letterSpacing: '-0.01em',
        marginBottom: '4px',
      }}>
        {club.name}
      </h3>

      {/* ── FULL NAME ── */}
      <p style={{
        ...B,
        fontSize: '11px', fontWeight: 600,
        color: accent,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '10px',
      }}>
        {club.fullName}
      </p>

      {/* ── DESCRIPTION ── */}
      <p style={{
        ...B,
        fontSize: '13.5px', fontWeight: 400,
        color: '#555',
        lineHeight: 1.6,
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {club.description}
      </p>

      {/* ── FOOTER ── */}
      <div style={{
        borderTop: '1.5px solid #EBEBEB',
        marginTop: '16px',
        paddingTop: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {club.tags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{
              ...B,
              fontSize: '10px', fontWeight: 600,
              color: '#555',
              padding: '2px 8px',
              background: '#F5F5F3',
              border: '1px solid #DDDDD9',
              borderRadius: '3px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#333' }}>
            <Users size={12} color="#888" />
            {club.stats.members} members
          </span>
          <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#333' }}>
            <Layers size={12} color="#888" />
            {club.stats.projects} projects
          </span>
        </div>
      </div>
    </motion.article>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';
import ClubCard from '../components/ClubCard';
import { MEC_CLUBS } from '../data/mockDatabase';

export default function ClubsView({ setCategory, setView, pageAnim }) {
  const [layoutMode, setLayoutMode] = useState('deck'); // 'deck' | 'grid'
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prevIdx) => (prevIdx + 1) % MEC_CLUBS.length);
  };

  const prev = () => {
    setActiveIndex((prevIdx) => (prevIdx - 1 + MEC_CLUBS.length) % MEC_CLUBS.length);
  };

  // Computes premium 3D layered stacking positions for each card relative to active index
  const getCardStyle = (index) => {
    const diff = index - activeIndex;

    // Active Centered Card
    if (diff === 0) {
      return {
        zIndex: 10,
        scale: 1.0,
        x: 0,
        opacity: 1,
        rotateY: 0,
        filter: 'blur(0px)',
      };
    }

    // Card shifted to the Right (Next item)
    if (diff === 1 || (activeIndex === MEC_CLUBS.length - 1 && index === 0)) {
      return {
        zIndex: 5,
        scale: 0.82,
        x: '64%',
        opacity: 0.55,
        rotateY: -28,
        filter: 'blur(1.5px)',
      };
    }

    // Card shifted to the Left (Previous item)
    if (diff === -1 || (activeIndex === 0 && index === MEC_CLUBS.length - 1)) {
      return {
        zIndex: 5,
        scale: 0.82,
        x: '-64%',
        opacity: 0.55,
        rotateY: 28,
        filter: 'blur(1.5px)',
      };
    }

    // Hidden cards
    return {
      zIndex: 0,
      scale: 0.68,
      x: 0,
      opacity: 0,
      rotateY: 0,
      pointerEvents: 'none',
      filter: 'blur(3px)',
    };
  };

  return (
    <motion.div key="clubs" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <SectionHead
        eyebrow="Active Chapters"
        title="Student Clubs"
        action={
          /* Neo-brutalist Layout Toggle Switch */
          <div style={{
            display: 'flex',
            background: 'var(--hover-ghost)',
            border: '2.5px solid var(--border)',
            borderRadius: '4px',
            padding: '3px',
          }}>
            <button
              onClick={() => setLayoutMode('deck')}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700,
                padding: '6px 14px', border: 'none', borderRadius: '3px', cursor: 'pointer',
                background: layoutMode === 'deck' ? 'var(--text)' : 'transparent',
                color: layoutMode === 'deck' ? 'var(--text-light)' : 'var(--text-sub)',
                transition: 'all 0.12s ease',
              }}
            >
              3D Deck
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700,
                padding: '6px 14px', border: 'none', borderRadius: '3px', cursor: 'pointer',
                background: layoutMode === 'grid' ? 'var(--text)' : 'transparent',
                color: layoutMode === 'grid' ? 'var(--text-light)' : 'var(--text-sub)',
                transition: 'all 0.12s ease',
              }}
            >
              Grid View
            </button>
          </div>
        }
      />

      {layoutMode === 'deck' ? (
        /* ════════════════ 3D DECK CAROUSEL ════════════════ */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{
            position: 'relative',
            height: '430px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1200px',
            overflow: 'hidden',
            marginTop: '10px',
          }}>
            {MEC_CLUBS.map((club, idx) => {
              const animStyle = getCardStyle(idx);
              return (
                <motion.div
                  key={club.id}
                  animate={animStyle}
                  transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                  style={{
                    position: 'absolute',
                    width: '360px',
                    maxWidth: '85vw',
                    transformStyle: 'preserve-3d',
                    pointerEvents: idx === activeIndex ? 'auto' : 'none',
                  }}
                >
                  <ClubCard
                    club={club}
                    onExploreEvents={clubId => { setCategory(clubId); setView('events'); }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button
              onClick={prev}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700,
                padding: '10px 24px', background: 'var(--bg-card)', color: 'var(--text)',
                border: '2px solid var(--border)', borderRadius: '4px', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.1s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              ← Previous
            </button>
            <button
              onClick={next}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700,
                padding: '10px 24px', background: 'var(--bg-card)', color: 'var(--text)',
                border: '2px solid var(--border)', borderRadius: '4px', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.1s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              Next →
            </button>
          </div>
          
        </div>
      ) : (
        /* ════════════════ DIRECTORY GRID VIEW ════════════════ */
        <div className="bento-grid fade-up">
          {MEC_CLUBS.map(club => (
            <ClubCard
              key={club.id} club={club}
              onExploreEvents={clubId => { setCategory(clubId); setView('events'); }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

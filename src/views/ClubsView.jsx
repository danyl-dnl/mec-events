import React from 'react';
import { motion } from 'framer-motion';
import SectionHead from '../components/SectionHead';
import ClubCard from '../components/ClubCard';
import { MEC_CLUBS } from '../data/mockDatabase';

export default function ClubsView({ setCategory, setView, pageAnim }) {
  return (
    <motion.div key="clubs" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHead eyebrow="Active Chapters" title="Student Clubs" />
      <div className="bento-grid">
        {MEC_CLUBS.map(club => (
          <ClubCard
            key={club.id} club={club}
            onExploreEvents={clubId => { setCategory(clubId); setView('events'); }}
          />
        ))}
      </div>
    </motion.div>
  );
}

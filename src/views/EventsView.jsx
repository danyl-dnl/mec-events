import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck } from 'lucide-react';
import SectionHead from '../components/SectionHead';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const CATEGORIES = ['All', 'Tech', 'Coding', 'Electronics', 'Quizzing', 'Entrepreneurship', 'Arts'];

export default function EventsView({
  search, setSearch,
  category, setCategory,
  filtered,
  registered,
  setActiveEvent,
  pageAnim,
  onAddEvent
}) {
  const { user } = useAuth();
  
  const isSuperAdmin = user?.email === 'danyldt07@gmail.com';
  const isClubManager = user?.email === 'danylphotos@gmail.com';
  const isAdmin = isSuperAdmin || isClubManager;

  // Event Creator states
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Tech');
  const [clubName, setClubName] = useState(isClubManager ? 'Third Eye' : 'FOSSMEC');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('Free');
  const [flagship, setFlagship] = useState(false);
  const [glowColor, setGlowColor] = useState('#00F2FE');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const CLUB_MAP = {
    'FOSSMEC': 'fossmec',
    'MACS': 'macs',
    'IEEE SB MEC': 'ieee',
    'IEDC MEC': 'iedc',
    'The Quizzing Fraternity (The Illuminati)': 'illuminati',
    'Mixed Signals': 'signals',
    'Cyborg': 'cyborg',
    'Third Eye': 'thirdeye',
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursFormatted = hours < 10 ? `0${hours}` : hours;
    return `${hoursFormatted}:${minutesStr} ${ampm}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time || !venue || !price || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const hostClubId = CLUB_MAP[clubName] || 'ieee';
    const formattedTime = formatTime12Hour(time);

    const newEvent = {
      id: `custom-evt-${Math.random().toString(36).substr(2, 9)}`,
      title,
      clubId: hostClubId,
      clubName,
      date,
      time: formattedTime,
      venue,
      category: formCategory,
      description,
      status: 'active',
      flagship,
      registrationCount: 0,
      price,
      glowColor,
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    // Reset Form
    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setPrice('Free');
    setFlagship(false);
    setSuccessMsg('Event successfully created! It is now live across the portal.');
    setTimeout(() => setSuccessMsg(''), 5000);
    setFormOpen(false);
  };
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

      {/* Dynamic Success Notification */}
      {successMsg && (
        <div style={{
          ...D,
          fontSize: '13px',
          fontWeight: 700,
          background: '#BBF7D0',
          color: '#15803D',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          padding: '12px 20px',
          boxShadow: '3px 3px 0 var(--border)',
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          {successMsg}
        </div>
      )}

      {/* Create New Event Collapsible Panel (Only visible to Admins) */}
      {isAdmin && (
        <div style={{
          background: 'var(--bg-card)',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          boxShadow: '4px 4px 0 var(--border)',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          {/* Accordion Trigger Header */}
          <button
            onClick={() => setFormOpen(!formOpen)}
            style={{
              ...D,
              fontSize: '15px',
              fontWeight: 700,
              textTransform: 'uppercase',
              width: '100%',
              background: '#FCD34D', // Amber pop
              color: '#111',
              border: 'none',
              borderBottom: formOpen ? '2.5px solid var(--border)' : 'none',
              padding: '16px 24px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'left'
            }}
          >
            <span>Create New Campus Event</span>
            <span style={{ fontSize: '18px' }}>{formOpen ? '−' : '+'}</span>
          </button>

          <AnimatePresence>
            {formOpen && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: 'var(--bg-card)',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                }}>
                  {/* Field 1: Event Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CodeStorm Hackathon"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={{
                        ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                      }}
                    />
                  </div>

                  {/* Field 2: Category */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      style={{
                        ...D, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                      }}
                    >
                      <option value="Tech">Tech</option>
                      <option value="Coding">Coding</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Quizzing">Quizzing</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Arts">Arts</option>
                      <option value="Robotics">Robotics</option>
                    </select>
                  </div>

                  {/* Field 3: Host Club */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Host Club / Cell
                    </label>
                    <select
                      disabled={isClubManager}
                      value={clubName}
                      onChange={e => setClubName(e.target.value)}
                      style={{
                        ...D, padding: '10px 12px', fontSize: '13px', background: isClubManager ? 'var(--hover-ghost)' : 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: isClubManager ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isClubManager ? (
                        <option value="Third Eye">Third Eye (Photography & Media Cell)</option>
                      ) : (
                        <>
                          <option value="FOSSMEC">FOSSMEC (Open Source)</option>
                          <option value="MACS">MACS (Computer Science)</option>
                          <option value="IEEE SB MEC">IEEE SB MEC (Professional Tech)</option>
                          <option value="IEDC MEC">IEDC MEC (Entrepreneurship)</option>
                          <option value="The Quizzing Fraternity (The Illuminati)">The Quizzing Fraternity (The Illuminati)</option>
                          <option value="Mixed Signals">Mixed Signals (ECE Association)</option>
                          <option value="Cyborg">Cyborg (Robotics Lab)</option>
                          <option value="Third Eye">Third Eye (Photography & Media)</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Field 4: Price */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Ticket Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Free or ₹150"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      style={{
                        ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                      }}
                    />
                  </div>

                  {/* Field 5: Date */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      style={{
                        ...D, padding: '9px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Field 6: Time */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      style={{
                        ...D, padding: '9px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Field 7: Venue */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Venue *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. College Seminar Hall"
                      value={venue}
                      onChange={e => setVenue(e.target.value)}
                      style={{
                        ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                      }}
                    />
                  </div>

                  {/* Field 8: Color theme */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                      Banner Glow / Accent Color
                    </label>
                    <select
                      value={glowColor}
                      onChange={e => setGlowColor(e.target.value)}
                      style={{
                        ...D, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                        border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                      }}
                    >
                      <option value="#00F2FE">Neon Cyan (MACS/FOSS)</option>
                      <option value="#FF512F">Vibrant Red (FOSSMEC)</option>
                      <option value="#38ef7d">Emerald Green (IEDC)</option>
                      <option value="#8E2DE2">Quizzing Purple (Illuminati)</option>
                      <option value="#F35588">Mixed ECE Pink (Mixed Signals)</option>
                      <option value="#f12711">Robotics Crimson (Cyborg)</option>
                      <option value="#70e1f5">Third Eye Sky (Photography)</option>
                    </select>
                  </div>
                </div>

                {/* Field 9: Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Event Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a detailed, compelling summary of the event highlights, timelines, and requirements..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{
                      ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>

                {/* Checkbox: Flagship */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="events-flagship-check"
                    checked={flagship}
                    onChange={e => setFlagship(e.target.checked)}
                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <label htmlFor="events-flagship-check" style={{ ...D, fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text)' }}>
                    Mark as Flagship Event (Featured at the top of the portal home page)
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    ...D,
                    fontSize: '13px',
                    fontWeight: 700,
                    alignSelf: 'flex-start',
                    padding: '12px 24px',
                    background: 'var(--text)',
                    color: 'var(--text-light)',
                    border: '2.5px solid var(--border)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.1s ease',
                    marginTop: '8px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  Publish Event →
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}

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

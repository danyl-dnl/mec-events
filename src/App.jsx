import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Award, ShieldCheck,
  Ticket as TicketIcon, Search, Zap
} from 'lucide-react';

import Header    from './components/Header';
import Footer    from './components/Footer';
import EventCard from './components/EventCard';
import ClubCard  from './components/ClubCard';
import RegisterModal from './components/RegisterModal';
import Ticket    from './components/Ticket';

import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ProfileBanner from './components/ProfileBanner';
import { useAuth } from './context/AuthContext';

import { MEC_CLUBS, MEC_EVENTS } from './data/mockDatabase';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const CATEGORIES = ['All', 'Tech', 'Coding', 'Electronics', 'Quizzing', 'Entrepreneurship', 'Arts'];

const CAT_COLORS = {
  All:              '#FEF08A',
  Tech:             '#FEF08A',
  Coding:           '#BAE6FD',
  Electronics:      '#FBCFE8',
  Quizzing:         '#DDD6FE',
  Entrepreneurship: '#BBF7D0',
  Arts:             '#FED7AA',
};

const pageAnim = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/* ── Section heading ── */
function SectionHead({ eyebrow, title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      paddingBottom: '20px',
      borderBottom: '2px solid #111',
    }}>
      <div>
        <p style={{ ...D, fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>
          {eyebrow}
        </p>
        <h2 style={{ ...D, fontSize: '28px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export default function App() {
  const { user, profile, registrations, loading } = useAuth();

  const [view,         setView]         = useState('home');
  const [theme,        setTheme]        = useState('light');
  const [localRegistrations, setLocalRegistrations] = useState([]);
  const [activeEvent,  setActiveEvent]  = useState(null);
  const [category,     setCategory]     = useState('All');
  const [installPrompt,setInstallPrompt]= useState(null);
  const [search,       setSearch]       = useState('');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const registered = user ? registrations : localRegistrations;

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(r => { if (r.outcome === 'accepted') setInstallPrompt(null); });
  };

  const handleSuccess = (ticket) => {
    if (!user) {
      setLocalRegistrations(prev => [ticket, ...prev]);
    }
    setActiveEvent(null);
    setView('dashboard');
  };

  const handleDownload = (tkt) => {
    const uri  = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tkt, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `MEC_Pass_${tkt.eventTitle.replace(/\s+/g,'_')}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filtered = MEC_EVENTS.filter(evt => {
    const catMatch = category === 'All'
      || evt.category.toLowerCase() === category.toLowerCase()
      || evt.clubId === category;
    const searchMatch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.description.toLowerCase().includes(search.toLowerCase()) ||
      evt.clubName.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const stats = [
    { Icon: Calendar, value: '8+',   label: 'Active Events',    sub: 'Registration open',  bg: '#FEF08A' },
    { Icon: Users,    value: '1,200+',label: 'Campus Makers',   sub: 'Across all chapters', bg: '#BBF7D0' },
    { Icon: Award,    value: '8',     label: 'Student Clubs',   sub: 'Official chapters',   bg: '#BAE6FD' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F7F4' }}>

      <Header
        currentView={view}
        setCurrentView={setView}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...MEC_EVENTS, ...MEC_EVENTS].map((evt, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot">●</span>
              {evt.title} — {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — Registration Open
            </span>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '52px 24px 80px', width: '100%', flex: 1 }}>
        
        <ProfileBanner onOpenProfile={() => setProfileModalOpen(true)} />

        <AnimatePresence mode="wait">

          {/* ════════════════ HOME ════════════════ */}
          {view === 'home' && (
            <motion.div key="home" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>

              {/* HERO */}
              <section style={{ maxWidth: '720px' }}>

                <h1 style={{
                  ...D,
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  color: '#111',
                  letterSpacing: '-0.03em',
                  marginBottom: '20px',
                }}>
                  Events &<br />
                  <span style={{ color: '#888' }}>Experiences</span><br />
                  at MEC.
                </h1>

                <p style={{
                  ...B,
                  fontSize: '16px', fontWeight: 400,
                  color: '#555', lineHeight: 1.7,
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
                      background: '#111', color: '#FFF',
                      border: '2.5px solid #111',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#111'}
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
                      background: 'transparent', color: '#111',
                      border: '2.5px solid #111',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(17,17,17,0.05)'}
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
                    background: bg,
                    border: '2.5px solid #111',
                    borderRadius: '4px',
                    boxShadow: '5px 5px 0 #111',
                    padding: '28px 24px',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                  }}>
                    <div style={{
                      width: '40px', height: '40px',
                      background: 'rgba(0,0,0,0.08)',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={20} color="#111" strokeWidth={2} />
                    </div>
                    <div>
                      <span style={{ ...D, fontSize: '36px', fontWeight: 700, color: '#111', display: 'block', lineHeight: 1, letterSpacing: '-0.02em' }}>
                        {value}
                      </span>
                      <span style={{ ...D, fontSize: '13px', fontWeight: 600, color: '#111', display: 'block', marginTop: '6px' }}>
                        {label}
                      </span>
                      <span style={{ ...B, fontSize: '11px', fontWeight: 400, color: 'rgba(17,17,17,0.55)', display: 'block', marginTop: '2px' }}>
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
                        ...B, fontSize: '13px', fontWeight: 600, color: '#555',
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
          )}

          {/* ════════════════ EVENTS ════════════════ */}
          {view === 'events' && (
            <motion.div key="events" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <SectionHead
                eyebrow="MEC Campus"
                title="All Events"
                action={
                  <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
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
                        background: active ? '#111' : '#FFF',
                        color:      active ? '#FFF' : '#111',
                        border:     '2px solid #111',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                        letterSpacing: '0.01em',
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
                  background: '#FFF', border: '2.5px solid #111', borderRadius: '4px',
                  boxShadow: '5px 5px 0 #111', padding: '80px 40px', textAlign: 'center',
                }}>
                  <ShieldCheck size={40} style={{ margin: '0 auto 16px', display: 'block', color: '#888' }} />
                  <h3 style={{ ...D, fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No events found</h3>
                  <p style={{ ...B, fontSize: '14px', color: '#888' }}>Try a different category or clear your search.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ════════════════ CLUBS ════════════════ */}
          {view === 'clubs' && (
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
          )}

          {/* ════════════════ DASHBOARD ════════════════ */}
          {view === 'dashboard' && (
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
                  background: '#FFF', border: '2.5px solid #111', borderRadius: '4px',
                  boxShadow: '5px 5px 0 #111', padding: '80px 40px', textAlign: 'center',
                }}>
                  <TicketIcon size={40} style={{ margin: '0 auto 16px', display: 'block', color: '#888' }} />
                  <h3 style={{ ...D, fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No passes yet</h3>
                  <p style={{ ...B, fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                    Register for an event and your pass will appear here instantly.
                  </p>
                  <button
                    onClick={() => setView('events')}
                    style={{
                      ...D, fontSize: '13px', fontWeight: 700,
                      padding: '10px 24px',
                      background: '#111', color: '#FFF',
                      border: '2.5px solid #111', borderRadius: '4px', cursor: 'pointer',
                    }}
                  >
                    Browse Events →
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <RegisterModal
        isOpen={!!activeEvent}
        onClose={() => setActiveEvent(null)}
        event={activeEvent}
        onSuccess={handleSuccess}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <Footer installPrompt={!!installPrompt} onInstall={handleInstall} />

      <style>{`
        @media (max-width: 640px)  { .stats-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) and (min-width: 641px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}

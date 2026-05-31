import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Header    from './components/Header';
import Footer    from './components/Footer';
import RegisterModal from './components/RegisterModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ProfileBanner from './components/ProfileBanner';
import { useAuth } from './context/AuthContext';

import { MEC_EVENTS } from './data/mockDatabase';

// Import Views
import HomeView from './views/HomeView';
import EventsView from './views/EventsView';
import ClubsView from './views/ClubsView';
import DashboardView from './views/DashboardView';
import CoordinatorView from './views/CoordinatorView';

const pageAnim = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function App() {
  const { user, registrations } = useAuth();

  const [view,         setView]         = useState('home');
  const [localRegistrations, setLocalRegistrations] = useState([]);
  
  // Dynamic Events state
  const [eventsList, setEventsList] = useState(() => {
    try {
      const cached = localStorage.getItem('mec_custom_events');
      const parsed = cached ? JSON.parse(cached) : [];
      return [...parsed, ...MEC_EVENTS];
    } catch (e) {
      return MEC_EVENTS;
    }
  });

  const handleAddEvent = (newEvent) => {
    setEventsList(prev => {
      // Keep only custom events to avoid caching mock database repeatedly
      const onlyCustom = [newEvent, ...prev.filter(e => !MEC_EVENTS.some(m => m.id === e.id))];
      localStorage.setItem('mec_custom_events', JSON.stringify(onlyCustom));
      return [newEvent, ...prev];
    });
  };
  const [activeEvent,  setActiveEvent]  = useState(null);
  const [category,     setCategory]     = useState('All');
  const [installPrompt,setInstallPrompt]= useState(null);
  const [search,       setSearch]       = useState('');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);

  // Sync network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registered = user ? registrations : localRegistrations;

  // Sync PWA installer trigger
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

  const filtered = eventsList.filter(evt => {
    const catMatch = category === 'All'
      || evt.category.toLowerCase() === category.toLowerCase()
      || evt.clubId === category;
    const searchMatch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.description.toLowerCase().includes(search.toLowerCase()) ||
      evt.clubName.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      color: 'var(--text)',
      transition: 'background 0.2s ease, color 0.2s ease',
    }}>

      {!isOnline && (
        <div style={{
          background: '#EF4444',
          color: '#FFF',
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 700,
          borderBottom: '2.5px solid #111',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.05em',
          zIndex: 1001,
        }}>
          ⚡ OFFLINE MODE: Displaying cached entry passes. QR Codes remain fully active.
        </div>
      )}

      <Header
        currentView={view}
        setCurrentView={setView}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...eventsList, ...eventsList].map((evt, i) => (
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

          {view === 'home' && (
            <HomeView
              setView={setView}
              registered={registered}
              setActiveEvent={setActiveEvent}
              pageAnim={pageAnim}
              eventsList={eventsList}
            />
          )}

          {view === 'events' && (
            <EventsView
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              filtered={filtered}
              registered={registered}
              setActiveEvent={setActiveEvent}
              pageAnim={pageAnim}
            />
          )}

          {view === 'clubs' && (
            <ClubsView
              setCategory={setCategory}
              setView={setView}
              pageAnim={pageAnim}
            />
          )}

          {view === 'dashboard' && (
            <DashboardView
              registered={registered}
              handleDownload={handleDownload}
              setView={setView}
              pageAnim={pageAnim}
            />
          )}

          {view === 'coordinator' && (
            <CoordinatorView
              setView={setView}
              pageAnim={pageAnim}
              eventsList={eventsList}
              onAddEvent={handleAddEvent}
            />
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

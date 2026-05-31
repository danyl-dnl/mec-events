import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, Ticket as TicketIcon, LayoutGrid, Zap, User as UserIcon, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const NAV = [
  { id: 'home',      label: 'Home' },
  { id: 'events',   label: 'Events' },
  { id: 'clubs',    label: 'Clubs' },
  { id: 'dashboard',label: 'My Passes', Icon: TicketIcon },
];

export default function Header({ currentView, setCurrentView, theme, toggleTheme, onOpenAuth, onOpenProfile }) {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#0F0F0F',
      borderBottom: '2.5px solid #111',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 24px',
        height: '66px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px',
      }}>

        {/* ── LOGO ── */}
        <button
          onClick={() => setCurrentView('home')}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
          aria-label="Home"
        >
          {/* Icon mark */}
          <div style={{
            width: '36px', height: '36px',
            background: '#F5C518',
            border: '2.5px solid #F5C518',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="#111" strokeWidth={2.5} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px' }}>
            <span style={{
              ...D, fontSize: '16px', fontWeight: 700,
              color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1,
            }}>
              MEC Events
            </span>
            <span style={{
              ...B, fontSize: '10px', fontWeight: 500,
              color: '#888888', letterSpacing: '0.02em', lineHeight: 1,
            }}>
              Thrikkakara, Kochi
            </span>
          </div>
        </button>

        {/* ── DESKTOP NAV ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hide-on-mobile">
          {NAV.map(({ id, label, Icon }) => {
            const active = currentView === id;
            return (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px',
                  ...D, fontSize: '13px', fontWeight: 600,
                  color: active ? '#111' : '#AAAAAA',
                  background: active ? '#F5C518' : 'transparent',
                  border: active ? '2px solid #F5C518' : '2px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#AAAAAA'; }}
              >
                {Icon && <Icon size={13} />}
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── DESKTOP ACTIONS ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hide-on-mobile">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px',
              background: 'transparent',
              border: '2.5px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#FFFFFF',
              transition: 'all 0.12s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#333'; }}
          >
            {theme === 'dark' ? <Sun size={15} color="#F5C518" strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
          </button>

          <a
            href="https://www.mec.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              ...D, fontSize: '12px', fontWeight: 600, letterSpacing: '0.01em',
              color: '#FFFFFF',
              background: 'transparent',
              border: '2.5px solid #333',
              borderRadius: '6px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#333'; }}
          >
            <Globe size={13} />
            MEC Website
          </a>

          {!user ? (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 20px',
                ...D, fontSize: '12px', fontWeight: 700, letterSpacing: '0.01em',
                color: '#111',
                background: '#F5C518',
                border: '2.5px solid #F5C518',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.12s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E5B413'}
              onMouseLeave={e => e.currentTarget.style.background = '#F5C518'}
            >
              Sign In
            </button>
          ) : (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  outline: 'none',
                }}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    style={{
                      width: '36px', height: '36px',
                      borderRadius: '50%', border: '2px solid #F5C518',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%', background: '#F5C518',
                    border: '2px solid #F5C518',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...D, fontSize: '13px', fontWeight: 700, color: '#111',
                  }}>
                    {getInitials()}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      position: 'absolute', right: 0, top: '48px',
                      width: '240px', background: '#FFFFFF',
                      border: '2.5px solid #111', borderRadius: '6px',
                      boxShadow: '6px 6px 0 #111',
                      padding: '16px', zIndex: 110,
                      display: 'flex', flexDirection: 'column', gap: '12px',
                    }}
                  >
                    {/* User Info */}
                    <div style={{ borderBottom: '1.5px solid #E5E5E3', paddingBottom: '12px' }}>
                      <p style={{ ...D, fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>
                        {profile?.full_name || 'MECian'}
                      </p>
                      <p style={{ ...B, fontSize: '11px', color: '#666', margin: 0, wordBreak: 'break-all' }}>
                        {user.email}
                      </p>
                      {profile?.semester && profile?.branch && (
                        <span style={{
                          display: 'inline-block',
                          ...D, fontSize: '9px', fontWeight: 700,
                          background: '#EAEAEA', color: '#111',
                          padding: '2px 6px', borderRadius: '3px',
                          marginTop: '6px',
                        }}>
                          {profile.semester} · {profile.branch}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        onClick={() => { onOpenProfile(); setDropdownOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px', background: 'none', border: 'none',
                          borderRadius: '4px', cursor: 'pointer',
                          ...D, fontSize: '12px', fontWeight: 600, color: '#111',
                          textAlign: 'left', width: '100%',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5F5F3'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <Settings size={14} />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => { signOut(); setDropdownOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px', background: 'none', border: 'none',
                          borderRadius: '4px', cursor: 'pointer',
                          ...D, fontSize: '12px', fontWeight: 600, color: '#EF4444',
                          textAlign: 'left', width: '100%',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Navigation menu"
          className="show-on-mobile"
          style={{
            width: '38px', height: '38px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
            border: '2px solid #333',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#FFFFFF',
          }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            style={{ background: '#0F0F0F', borderTop: '1px solid #222', overflow: 'hidden' }}
          >
            <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              
              {user && (
                <div style={{
                  padding: '12px 16px', background: '#1A1A1A',
                  border: '1.5px solid #333', borderRadius: '6px',
                  marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: '#F5C518', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      ...D, fontSize: '12px', fontWeight: 700, color: '#111'
                    }}>
                      {getInitials()}
                    </div>
                  )}
                  <div>
                    <p style={{ ...D, fontSize: '13px', fontWeight: 700, color: '#FFF', margin: 0 }}>
                      {profile?.full_name || 'MECian'}
                    </p>
                    <p style={{ ...B, fontSize: '10px', color: '#888', margin: 0 }}>
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              {NAV.map(({ id, label, Icon }) => {
                const active = currentView === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setCurrentView(id); setOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px',
                      ...D, fontSize: '14px', fontWeight: 600,
                      color: active ? '#111' : '#CCCCCC',
                      background: active ? '#F5C518' : 'transparent',
                      border: 'none', borderRadius: '6px', cursor: 'pointer',
                      textAlign: 'left', width: '100%',
                    }}
                  >
                    {Icon ? <Icon size={15} /> : <LayoutGrid size={15} />}
                    {label}
                  </button>
                );
              })}

              {user && (
                <button
                  onClick={() => { onOpenProfile(); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 16px',
                    ...D, fontSize: '14px', fontWeight: 600,
                    color: '#CCCCCC', background: 'transparent',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    textAlign: 'left', width: '100%',
                  }}
                >
                  <Settings size={15} style={{ color: '#888' }} />
                  Edit Profile
                </button>
              )}

              <button
                onClick={toggleTheme}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', marginTop: '8px',
                  ...D, fontSize: '13px', fontWeight: 600,
                  color: '#CCCCCC', background: 'transparent',
                  border: '1.5px dashed #333', borderRadius: '6px', cursor: 'pointer',
                  width: '100%',
                }}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={14} color="#F5C518" strokeWidth={2.5} /> Light Theme
                  </>
                ) : (
                  <>
                    <Moon size={14} color="#888" strokeWidth={2.5} /> Dark Theme
                  </>
                )}
              </button>

              <a
                href="https://www.mec.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', marginTop: '8px',
                  ...D, fontSize: '13px', fontWeight: 600,
                  color: '#111', textDecoration: 'none',
                  background: '#FFFFFF', borderRadius: '6px',
                }}
              >
                <Globe size={14} /> MEC College Website
              </a>

              {!user ? (
                <button
                  onClick={() => { onOpenAuth(); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', marginTop: '12px',
                    ...D, fontSize: '13px', fontWeight: 700,
                    color: '#111', background: '#F5C518',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                  }}
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px', marginTop: '12px',
                    ...D, fontSize: '13px', fontWeight: 700,
                    color: '#FFF', background: '#EF4444',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) { .show-on-mobile { display: none !important; } }
        @media (max-width: 767px) { .hide-on-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}

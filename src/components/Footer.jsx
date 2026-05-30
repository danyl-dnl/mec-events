import React from 'react';
import { Smartphone, Zap, MapPin, Mail } from 'lucide-react';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function Footer({ installPrompt, onInstall }) {
  const socials = [
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: 'https://github.com',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      ),
    },
  ];

  return (
    <footer style={{ background: '#0F0F0F', borderTop: '2.5px solid #111', marginTop: '40px' }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '56px 24px 40px',
      }}>
        {/* Top row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid #2A2A2A',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px',
                background: '#F5C518', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={16} color="#111" strokeWidth={2.5} />
              </div>
              <span style={{ ...D, fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
                MEC Events
              </span>
            </div>
            <p style={{ ...B, fontSize: '13px', color: '#888', lineHeight: 1.65 }}>
              The official event portal for Government Model Engineering College, Thrikkakara.
              Built for students, by students.
            </p>
            {installPrompt && (
              <button
                id="btn-install-pwa"
                onClick={onInstall}
                style={{
                  ...D,
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#111', background: '#F5C518',
                  border: '2px solid #F5C518',
                  borderRadius: '6px', cursor: 'pointer',
                  alignSelf: 'flex-start',
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Smartphone size={14} />
                Install App
              </button>
            )}
          </div>

          {/* College info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ ...D, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>
              College
            </p>
            <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: '#CCC' }}>
              Govt. Model Engineering College
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={13} color="#555" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ ...B, fontSize: '13px', color: '#888', lineHeight: 1.5 }}>
                Thrikkakara P.O,<br />Kochi, Kerala 682021
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={13} color="#555" />
              <a
                href="https://www.mec.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...B, fontSize: '13px', color: '#888', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
                onMouseLeave={e => e.currentTarget.style.color = '#888'}
              >
                www.mec.ac.in
              </a>
            </div>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ ...D, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>
              Follow Us
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '38px', height: '38px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#888',
                    background: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '6px',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#222'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.background = '#1A1A1A'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          paddingTop: '24px',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ ...B, fontSize: '12px', color: '#555' }}>
            © {new Date().getFullYear()} MEC Events Portal. All rights reserved.
          </p>
          <p style={{ ...B, fontSize: '12px', color: '#555' }}>
            Managed by IHRD, Government of Kerala
          </p>
        </div>
      </div>
    </footer>
  );
}

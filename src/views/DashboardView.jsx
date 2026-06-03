import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket as TicketIcon, 
  GraduationCap, 
  FileText, 
  Award, 
  Layers, 
  User, 
  ArrowRight,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';
import SectionHead from '../components/SectionHead';
import Ticket from '../components/Ticket';
import { useAuth } from '../context/AuthContext';
import { calculateKtuSummary } from '../lib/ktuPoints';
import { generateKtuDossierPdf } from '../lib/ktuDossierPdf';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const M = { fontFamily: "'JetBrains Mono', monospace" };

export default function DashboardView({ registered, handleDownload, setView, pageAnim }) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('passes');

  // Compute KTU stats from registered tickets
  const ktuSummary = calculateKtuSummary(registered);

  const handleExportPdf = () => {
    if (!profile) return;
    generateKtuDossierPdf(profile, ktuSummary);
  };

  const studentProfile = profile || {
    full_name: 'Guest User',
    branch: 'N/A',
    semester: 'N/A',
    student_id: 'N/A',
    email: 'N/A'
  };

  return (
    <motion.div key="dashboard" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <SectionHead 
          eyebrow={activeTab === 'passes' ? "Your Registrations" : "Graduation Credits Tracker"} 
          title={activeTab === 'passes' ? "My Passes" : "KTU Portfolio"} 
        />

        {/* Tab Switcher */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--bg-card)', 
          border: '2.5px solid var(--border)', 
          borderRadius: '6px',
          padding: '4px',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <button
            onClick={() => setActiveTab('passes')}
            style={{
              ...D, fontSize: '12px', fontWeight: 700,
              padding: '8px 16px',
              background: activeTab === 'passes' ? 'var(--text)' : 'transparent',
              color: activeTab === 'passes' ? 'var(--text-light)' : 'var(--text)',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
              transition: 'all 0.12s ease',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <TicketIcon size={13} />
            Passes ({registered.length})
          </button>
          
          <button
            onClick={() => setActiveTab('ktu')}
            style={{
              ...D, fontSize: '12px', fontWeight: 700,
              padding: '8px 16px',
              background: activeTab === 'ktu' ? 'var(--text)' : 'transparent',
              color: activeTab === 'ktu' ? 'var(--text-light)' : 'var(--text)',
              border: 'none', borderRadius: '4px', cursor: 'pointer',
              transition: 'all 0.12s ease',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <GraduationCap size={14} />
            KTU Tracker
          </button>
        </div>
      </div>

      {activeTab === 'passes' ? (
        /* ==================== PASSES VIEW ==================== */
        registered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {registered.map(tkt => (
              <Ticket key={tkt.id} ticket={tkt} onDownload={handleDownload} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)', border: '2.5px solid var(--border)', borderRadius: '4px',
            boxShadow: 'var(--shadow-md)', padding: '80px 40px', textAlign: 'center',
          }}>
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotateY: [0, 20, 0],
                rotateX: [0, 8, 0],
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: 'inline-block', margin: '0 auto 20px', perspective: '600px' }}
            >
              <TicketIcon size={40} style={{ color: 'var(--text-muted)' }} />
            </motion.div>
            <h3 style={{ ...D, fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>No passes yet</h3>
            <p style={{ ...B, fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Register for an event and your entry pass will appear here instantly.
            </p>
            <button
              onClick={() => setView('events')}
              style={{
                ...D, fontSize: '13px', fontWeight: 700,
                padding: '12px 24px',
                background: 'var(--text)', color: 'var(--text-light)',
                border: '2.5px solid var(--border)', borderRadius: '4px', cursor: 'pointer',
                transition: 'opacity 0.12s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Browse Events →
            </button>
          </div>
        )
      ) : (
        /* ==================== KTU PORTFOLIO VIEW ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Main Bento Grid */}
          <div className="bento-grid">
            
            {/* Student Profile & Summary Card */}
            <div className="card bento-card-small" style={{ height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'var(--accent-pop)',
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  padding: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <User size={18} color="var(--text)" />
                </div>
                <div>
                  <h4 style={{ ...D, fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student Profile</h4>
                  <p style={{ ...B, fontSize: '12px', color: 'var(--text-sub)' }}>Estimated KTU Dossier</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg)', border: '2.5px solid var(--border)', borderRadius: '4px', padding: '14px' }}>
                <div>
                  <span style={{ ...D, fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Full Name</span>
                  <p style={{ ...D, fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{studentProfile.full_name}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                  <div>
                    <span style={{ ...D, fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Branch</span>
                    <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{studentProfile.branch || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ ...D, fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Semester</span>
                    <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{studentProfile.semester || 'N/A'}</p>
                  </div>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ ...D, fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>KTU ID / Roll No</span>
                  <p style={{ ...M, fontSize: '11px', fontWeight: 600, color: 'var(--text)' }}>{studentProfile.student_id || 'N/A'}</p>
                </div>
              </div>

              <button
                onClick={handleExportPdf}
                disabled={registered.length === 0}
                style={{
                  ...D,
                  fontSize: '12px',
                  fontWeight: 700,
                  width: '100%',
                  padding: '12px',
                  background: registered.length === 0 ? 'var(--bg)' : 'var(--text)',
                  color: registered.length === 0 ? 'var(--text-muted)' : 'var(--text-light)',
                  border: '2.5px solid var(--border)',
                  borderRadius: '4px',
                  boxShadow: registered.length === 0 ? 'none' : 'var(--shadow-sm)',
                  cursor: registered.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={e => { if (registered.length > 0) { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } }}
                onMouseLeave={e => { if (registered.length > 0) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } }}
              >
                <Download size={14} />
                Export PDF Dossier
              </button>
            </div>

            {/* KTU Points Score Card */}
            <div className="card bento-card-large" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Grand Total Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid var(--border)', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ ...D, fontSize: '20px', fontWeight: 700 }}>KTU Point Progress</h3>
                  <p style={{ ...B, fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Estimate based on verified registrations (Cap: 40 pts/group)</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    ...D, fontSize: '24px', fontWeight: 700,
                    background: 'var(--accent-pop)', color: '#111',
                    padding: '6px 14px', border: '2.5px solid var(--border)',
                    boxShadow: 'var(--shadow-xs)', borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {ktuSummary.totalEstimated} / 120
                  </span>
                  <p style={{ ...D, fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)', marginTop: '6px', textTransform: 'uppercase' }}>Target B.Tech degree</p>
                </div>
              </div>

              {/* Groups Distribution Meters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Group 1 Card */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ ...D, fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      Group I: Co-curricular Activities
                    </span>
                    <span style={{ ...M, fontSize: '12px', fontWeight: 600 }}>
                      {Math.min(ktuSummary.groups.GROUP_I.points, 40)} / 40 PTS {ktuSummary.groups.GROUP_I.points > 40 && <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>({ktuSummary.groups.GROUP_I.points} raw)</span>}
                    </span>
                  </div>
                  <div style={{ height: '14px', background: 'var(--bg)', border: '2px solid var(--border)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${Math.min((ktuSummary.groups.GROUP_I.points / 40) * 100, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #DDD6FE 0%, #A78BFA 100%)', // Muted violet
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <p style={{ ...B, fontSize: '10px', color: 'var(--text-sub)', marginTop: '4px' }}>
                    Earned from Illuminati Quizzes, Third Eye photography walks, and arts challenges.
                  </p>
                </div>

                {/* Group 2 Card */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ ...D, fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      Group II: Professional Development
                    </span>
                    <span style={{ ...M, fontSize: '12px', fontWeight: 600 }}>
                      {Math.min(ktuSummary.groups.GROUP_II.points, 40)} / 40 PTS {ktuSummary.groups.GROUP_II.points > 40 && <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>({ktuSummary.groups.GROUP_II.points} raw)</span>}
                    </span>
                  </div>
                  <div style={{ height: '14px', background: 'var(--bg)', border: '2px solid var(--border)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${Math.min((ktuSummary.groups.GROUP_II.points / 40) * 100, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #BAE6FD 0%, #38BDF8 100%)', // Muted blue
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <p style={{ ...B, fontSize: '10px', color: 'var(--text-sub)', marginTop: '4px' }}>
                    Earned from FOSSMEC DevSprint Hackathons, IEEE workshops, MACS coding tasks, and ECE Mixed Signals labs.
                  </p>
                </div>

                {/* Group 3 Card */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ ...D, fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      Group III: Innovation & Entrepreneurship
                    </span>
                    <span style={{ ...M, fontSize: '12px', fontWeight: 600 }}>
                      {Math.min(ktuSummary.groups.GROUP_III.points, 40)} / 40 PTS {ktuSummary.groups.GROUP_III.points > 40 && <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>({ktuSummary.groups.GROUP_III.points} raw)</span>}
                    </span>
                  </div>
                  <div style={{ height: '14px', background: 'var(--bg)', border: '2px solid var(--border)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${Math.min((ktuSummary.groups.GROUP_III.points / 40) * 100, 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #BBF7D0 0%, #4ADE80 100%)', // Muted green
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <p style={{ ...B, fontSize: '10px', color: 'var(--text-sub)', marginTop: '4px' }}>
                    Earned from IEDC Incubator ideation/summits (Technopreneur) and Cyborg robotics contests (Robowars).
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Activity Ledger Table */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Layers size={18} color="var(--text)" />
              <h3 style={{ ...D, fontSize: '18px', fontWeight: 700 }}>Activity Ledger Log</h3>
            </div>

            {ktuSummary.activities.length > 0 ? (
              <div style={{ overflowX: 'auto', margin: '0 -24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderTop: '2px solid var(--border)', borderBottom: '2.5px solid var(--border)' }}>
                      <th style={{ ...D, fontSize: '11px', fontWeight: 700, padding: '12px 24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Event & Organizer</th>
                      <th style={{ ...D, fontSize: '11px', fontWeight: 700, padding: '12px 16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Verification Code</th>
                      <th style={{ ...D, fontSize: '11px', fontWeight: 700, padding: '12px 16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>KTU Category</th>
                      <th style={{ ...D, fontSize: '11px', fontWeight: 700, padding: '12px 24px', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'right' }}>Est. Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ktuSummary.activities.map((act, i) => (
                      <tr key={act.id} style={{ 
                        borderBottom: i === ktuSummary.activities.length - 1 ? 'none' : '1.5px solid rgba(17,17,17,0.1)',
                        transition: 'background 0.1s ease',
                      }}
                      className="table-row-hover"
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ ...D, fontSize: '14px', fontWeight: 700, display: 'block', color: 'var(--text)' }}>
                            {act.eventTitle}
                          </span>
                          <span style={{ ...B, fontSize: '11px', color: 'var(--text-sub)' }}>
                            {act.clubName}
                          </span>
                        </td>
                        <td style={{ padding: '16px 16px' }}>
                          <code style={{ ...M, fontSize: '11px', background: 'var(--bg)', padding: '4px 8px', border: '1.5px solid var(--border)', borderRadius: '3px', color: 'var(--text)' }}>
                            {act.ticketId}
                          </code>
                        </td>
                        <td style={{ padding: '16px 16px' }}>
                          <span style={{
                            ...D, fontSize: '9px', fontWeight: 700,
                            padding: '4px 8px',
                            border: '1.5px solid var(--border)',
                            borderRadius: '3px',
                            background: act.ktuGroup === 'GROUP_I' ? '#DDD6FE' : act.ktuGroup === 'GROUP_II' ? '#BAE6FD' : '#BBF7D0',
                            color: '#111',
                          }}>
                            {act.ktuGroup === 'GROUP_I' ? 'G1: Co-curricular' : act.ktuGroup === 'GROUP_II' ? 'G2: Prof. Dev' : 'G3: Innovation'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right', ...M, fontSize: '13px', fontWeight: 600 }}>
                          +{act.points} PTS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg)', borderRadius: '4px', border: '2px dashed var(--border)' }}>
                <AlertCircle size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                <h4 style={{ ...D, fontSize: '14px', fontWeight: 700 }}>No points recorded yet</h4>
                <p style={{ ...B, fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>
                  Register for college events to populate your KTU Activity Points portfolio tracker.
                </p>
              </div>
            )}

            <style>{`
              .table-row-hover:hover {
                background: rgba(17,17,17,0.02) !important;
              }
            `}</style>
          </div>

        </div>
      )}
    </motion.div>
  );
}

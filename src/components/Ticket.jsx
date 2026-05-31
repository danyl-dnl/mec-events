import React, { useRef, useState, useEffect } from 'react';
import { Download, Calendar, MapPin, CheckCircle2, FileText, Image as ImageIcon, FileCode, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const M = { fontFamily: "'JetBrains Mono', monospace" };

function fmtDate(ds) {
  return new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function MockQR({ id }) {
  const SIZE = 14;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);

  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const corner = (r < 4 && c < 4) || (r < 4 && c >= SIZE - 4) || (r >= SIZE - 4 && c < 4);
      if (!corner && Math.abs((hash ^ (r * 31 + c * 71)) % 100) > 42) cells.push({ r, c });
    }
  }

  const pad = 10, grid = 100 - pad * 2, cell = grid / SIZE;

  return (
    <svg viewBox="0 0 100 100" style={{ width: '76px', height: '76px' }}>
      <rect width="100" height="100" fill="#FFF" />
      {[[8,8],[68,8],[8,68]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="24" height="24" rx="2" fill="none" stroke="#111" strokeWidth="3.5"/>
          <rect x={x+6} y={y+6} width="12" height="12" rx="1" fill="#111"/>
        </g>
      ))}
      {cells.map((b, i) => (
        <rect key={i} x={pad + b.c * cell + 0.5} y={pad + b.r * cell + 0.5}
          width={cell - 1} height={cell - 1} rx="0.5" fill="#111"/>
      ))}
    </svg>
  );
}

export default function Ticket({ ticket, onDownload }) {
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hov, setHov]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onMove = (e) => {
    if (!ref.current || hov === false) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: -((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * 6,
      y:  ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 6,
    });
  };

  const downloadAsImage = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      // Generate canvas using html2canvas
      const canvas = await html2canvas(ref.current, {
        scale: 3, // High resolution (3x) for crisp text/QR
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `MEC_Pass_${ticket.eventTitle.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export ticket as image:', err);
    } finally {
      setExporting(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dynamic PDF dimensions based on the exact component width/height
      const cardWidth = ref.current.offsetWidth;
      const cardHeight = ref.current.offsetHeight;
      
      const pdf = new jsPDF({
        orientation: cardWidth > cardHeight ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [cardWidth, cardHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, cardWidth, cardHeight);
      pdf.save(`MEC_Pass_${ticket.eventTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Failed to export ticket as PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Success note */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '8px 14px',
        background: '#F0FDF4',
        border: '1.5px solid #86EFAC',
        borderRadius: '6px',
        alignSelf: 'flex-start',
      }}>
        <CheckCircle2 size={14} color="#22C55E" />
        <span style={{ ...D, fontSize: '12px', fontWeight: 700, color: '#166534' }}>
          Registration Confirmed
        </span>
      </div>

      {/* Ticket card */}
      <div style={{ perspective: '1000px' }}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
          animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hov ? 1.01 : 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 200, mass: 0.4 }}
          style={{
            background: 'var(--bg-card)',
            border: '2.5px solid var(--border)',
            borderRadius: '6px',
            boxShadow: hov ? '8px 8px 0 var(--border)' : '5px 5px 0 var(--border)',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Yellow header bar */}
          <div style={{ background: 'var(--accent-pop)', padding: '16px 24px', borderBottom: '2.5px solid var(--border)' }}>
            <p style={{ ...D, fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', marginBottom: '4px' }}>
              MEC Campus Entry Pass
            </p>
            <h3 style={{ ...D, fontSize: '20px', fontWeight: 700, color: '#111', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {ticket.eventTitle}
            </h3>
            <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: 'rgba(17,17,17,0.6)', marginTop: '4px' }}>
              {ticket.clubName}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>

            {/* Left: details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <div>
                <p style={{ ...D, fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Participant
                </p>
                <p style={{ ...D, fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  {ticket.fullName}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ ...D, fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>Branch</p>
                  <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{ticket.branch} · {ticket.semester}</p>
                </div>
                <div>
                  <p style={{ ...D, fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>Roll No.</p>
                  <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{ticket.studentId}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--text-sub)' }}>
                  <Calendar size={12} color="var(--text-muted)" /> {fmtDate(ticket.eventDate)} · {ticket.eventTime}
                </span>
                <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: 'var(--text-sub)' }}>
                  <MapPin size={12} color="var(--text-muted)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    {ticket.eventVenue}
                  </span>
                </span>
              </div>
            </div>

            {/* Right: QR */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ padding: '6px', border: '2px solid var(--border)', borderRadius: '4px', background: '#FFF' }}>
                <MockQR id={ticket.id} />
              </div>
              <p style={{ ...M, fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {ticket.id.slice(0, 12)}
              </p>
            </div>
          </div>

          {/* Perforation */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 -1px', borderTop: '2px dashed var(--border)', borderBottom: '2px dashed var(--border)', padding: '6px 0', position: 'relative' }}>
            <div style={{ width: '16px', height: '24px', borderRadius: '0 12px 12px 0', background: 'var(--bg)', border: '2px solid var(--border)', borderLeft: 'none', flexShrink: 0 }} />
            <div style={{ flex: 1 }} />
            <div style={{ width: '16px', height: '24px', borderRadius: '12px 0 0 12px', background: 'var(--bg)', border: '2px solid var(--border)', borderRight: 'none', flexShrink: 0 }} />
          </div>

          {/* Footer strip */}
          <div style={{
            padding: '12px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FileText size={11} color="var(--text-muted)" />
              <span style={{ ...M, fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                REG: {new Date(ticket.registeredAt).toLocaleDateString()}
              </span>
            </div>
            <span style={{
              ...D,
              fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '3px 10px',
              background: 'var(--text)', color: 'var(--accent-pop)',
              borderRadius: '3px',
              border: '1.5px solid var(--border)',
            }}>
              VERIFIED
            </span>
          </div>
        </motion.div>
      </div>

      {/* Download Action Dropup */}
      <div style={{ position: 'relative', alignSelf: 'flex-start' }} ref={buttonRef}>
        <button
          id="btn-download-ticket"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={exporting}
          style={{
            ...D,
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            fontSize: '12px', fontWeight: 700,
            color: dropdownOpen ? '#111' : 'var(--text)',
            background: dropdownOpen ? 'var(--accent-pop)' : 'transparent',
            border: '2px solid var(--border)',
            borderRadius: '4px', cursor: 'pointer',
            transition: 'all 0.12s ease',
            boxShadow: dropdownOpen ? '3px 3px 0 var(--border)' : 'none',
            transform: dropdownOpen ? 'translate(-2px, -2px)' : 'none',
            opacity: exporting ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!dropdownOpen) e.currentTarget.style.background = 'var(--hover-ghost)'; }}
          onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = 'transparent'; }}
        >
          <Download size={13} />
          {exporting ? 'Generating file...' : 'Download Receipt'}
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute', left: 0, bottom: '46px', // Opens upward to be visible above bottom overlays
                width: '210px', background: 'var(--bg-card)',
                border: '2.5px solid var(--border)', borderRadius: '6px',
                boxShadow: '5px 5px 0 var(--border)',
                padding: '8px', zIndex: 50,
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}
            >
              <button
                onClick={async () => { setDropdownOpen(false); await downloadAsImage(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', background: 'none', border: 'none',
                  borderRadius: '4px', cursor: 'pointer',
                  ...D, fontSize: '12px', fontWeight: 600, color: 'var(--text)',
                  textAlign: 'left', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-ghost)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <ImageIcon size={14} color="var(--text-muted)" />
                Save as Image (PNG)
              </button>
              
              <button
                onClick={async () => { setDropdownOpen(false); await downloadAsPDF(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', background: 'none', border: 'none',
                  borderRadius: '4px', cursor: 'pointer',
                  ...D, fontSize: '12px', fontWeight: 600, color: 'var(--text)',
                  textAlign: 'left', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-ghost)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Printer size={14} color="var(--text-muted)" />
                Save as PDF Document
              </button>

              <div style={{ height: '1.5px', background: 'var(--border)', opacity: 0.2, margin: '4px 0' }} />

              <button
                onClick={() => { setDropdownOpen(false); onDownload(ticket); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', background: 'none', border: 'none',
                  borderRadius: '4px', cursor: 'pointer',
                  ...D, fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)',
                  textAlign: 'left', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-ghost)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <FileCode size={13} color="var(--text-muted)" />
                Export Raw Data (JSON)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

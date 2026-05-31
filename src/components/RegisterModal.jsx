import React, { useState, useEffect } from 'react';
import { X, User, Mail, CreditCard, Layers, GraduationCap, AlertCircle, ShieldAlert, CheckCircle2, Calendar, Clock, MapPin, Tag, Sparkles, Check, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const border = '2.5px solid var(--border)';

const inputStyle = (focused, error) => ({
  width: '100%',
  padding: '11px 14px 11px 38px',
  ...B, fontSize: '14px', fontWeight: 500,
  color: 'var(--text)',
  background: focused ? 'var(--bg-card)' : 'var(--bg)',
  border: error ? '2px solid #EF4444' : border,
  borderRadius: '4px',
  outline: 'none',
  transition: 'all 0.12s ease',
  boxShadow: focused ? '3px 3px 0 var(--border)' : 'none',
});

const labelStyle = {
  ...D, fontSize: '11px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--text)', display: 'block', marginBottom: '6px',
};

const iconStyle = {
  position: 'absolute', left: '12px', top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)', pointerEvents: 'none',
};

export default function RegisterModal({ isOpen, onClose, event, onSuccess, onOpenAuth, isRegistered, setView }) {
  const { user, profile, registerForEvent } = useAuth();
  
  const [form, setForm] = useState({ fullName: '', email: '', semester: '', branch: '', studentId: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState('details'); // 'details' or 'form'

  // Sync profile details when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        fullName: profile?.full_name || '',
        email: user?.email || '',
        semester: profile?.semester || '',
        branch: profile?.branch || '',
        studentId: profile?.student_id || '',
      });
      setErrors({});
      setSubmitError('');
      setIsEditing(false);
      setMode('details');
    }
  }, [isOpen, profile, user]);

  if (!isOpen || !event) return null;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.semester)         e.semester  = 'Required';
    if (!form.branch)           e.branch    = 'Required';
    if (!form.studentId.trim()) e.studentId = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      if (user) {
        // Register directly in Supabase
        const ticket = await registerForEvent(event, {
          fullName: form.fullName,
          email: form.email,
          semester: form.semester,
          branch: form.branch,
          studentId: form.studentId
        });
        onSuccess(ticket);
      } else {
        // Guest mode fallback (original in-memory registration)
        const id = `TKT-${Math.random().toString(36).substr(2,9).toUpperCase()}`;
        onSuccess({
          id,
          eventId:    event.id,
          eventTitle: event.title,
          eventDate:  event.date,
          eventTime:  event.time,
          eventVenue: event.venue,
          clubName:   event.clubName,
          fullName:   form.fullName,
          email:      form.email,
          semester:   form.semester,
          branch:     form.branch,
          studentId:  form.studentId,
          registeredAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const isProfileComplete = profile && profile.is_complete && !isEditing;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        perspective: '1000px',
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: -8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          style={{
            position: 'relative', zIndex: 10,
            transformStyle: 'preserve-3d',
            width: '100%', maxWidth: '480px',
            background: 'var(--bg-card)',
            border: border,
            borderRadius: '6px',
            boxShadow: '10px 10px 0 var(--border)',
            padding: '32px',
            maxHeight: '92vh', overflowY: 'auto',
          }}
        >
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--border)', borderRadius: '6px 6px 0 0' }} />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--hover-ghost)',
              border: '2px solid var(--border)',
              borderRadius: '6px', cursor: 'pointer',
              color: 'var(--text-sub)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--text)'; e.currentTarget.style.color = 'var(--text-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--hover-ghost)'; e.currentTarget.style.color = 'var(--text-sub)'; }}
          >
            <X size={15} />
          </button>

          {/* Conditional rendering based on mode */}
          {mode === 'details' ? (
            /* ── DETAILS MODE (Clear enlarged version of the card) ── */
            <div>
              {/* Category tag + Flagship badge */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '8px',
                marginBottom: '20px',
              }}>
                <span style={{
                  ...D,
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  padding: '4px 10px',
                  background: (() => {
                    const colors = { coding: '#BAE6FD', tech: '#FEF08A', electronics: '#FBCFE8', quizzing: '#DDD6FE', entrepreneurship: '#BBF7D0', arts: '#FED7AA', robotics: '#FED7AA' };
                    return colors[event.category.toLowerCase()] || '#E5E7EB';
                  })(),
                  border: '1.5px solid var(--border)',
                  borderRadius: '3px',
                  color: '#111',
                }}>
                  <Tag size={9} strokeWidth={2.5} />
                  {event.category}
                </span>

                {event.flagship && (
                  <span style={{
                    ...D,
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    padding: '4px 10px',
                    background: 'var(--text)', color: 'var(--text-light)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '3px',
                  }}>
                    <Sparkles size={9} />
                    FLAGSHIP
                  </span>
                )}
              </div>

              {/* Event Title & Host Club */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  ...D,
                  fontSize: '26px',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: 'var(--text)',
                  marginBottom: '6px',
                  letterSpacing: '-0.02em',
                }}>
                  {event.title}
                </h3>
                <p style={{
                  ...B,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {event.clubName}
                </p>
              </div>

              {/* Full Description (Untruncated) */}
              <div style={{
                background: 'var(--bg)',
                border: border,
                borderRadius: '6px',
                padding: '16px 20px',
                marginBottom: '20px',
              }}>
                <span style={{ ...D, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  About the Event
                </span>
                <p style={{
                  ...B,
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--text-sub)',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {event.description}
                </p>
              </div>

              {/* Schedule & Venue Bento Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '20px',
              }}>
                {/* Time Card */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <span style={{ ...D, fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Schedule</span>
                  <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>
                    <Calendar size={12} color="var(--text-muted)" />
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>
                    <Clock size={12} color="var(--text-muted)" />
                    {event.time}
                  </span>
                </div>

                {/* Venue Card */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <span style={{ ...D, fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Venue</span>
                  <span style={{ ...B, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>
                    <MapPin size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
                  </span>
                  <span style={{
                    ...D,
                    fontSize: '10px', fontWeight: 700,
                    padding: '2px 8px',
                    background: event.price === 'Free' ? '#BBF7D0' : '#FEF08A',
                    border: '1.5px solid var(--border)',
                    borderRadius: '4px',
                    color: '#111',
                    width: 'fit-content',
                    marginTop: '2px',
                  }}>
                    {event.price === 'Free' ? 'FREE' : event.price}
                  </span>
                </div>
              </div>

              {/* Seats capacity progress bar */}
              <div style={{
                background: 'var(--bg)',
                border: border,
                borderRadius: '6px',
                padding: '16px 20px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ ...D, fontSize: '10px', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Registration Progress
                  </span>
                  <span style={{ ...D, fontSize: '10px', fontWeight: 700, color: seatsLeft <= 5 ? '#EF4444' : 'var(--text)' }}>
                    {seatsLeft <= 5 ? `ONLY ${seatsLeft} SEATS LEFT` : `${currentCount} / ${maxCapacity} filled`}
                  </span>
                </div>
                
                {/* Progress Bar Container */}
                <div style={{
                  width: '100%', height: '8px',
                  background: 'var(--hover-ghost)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div style={{
                    width: `${Math.min(fillPct, 100)}%`,
                    height: '100%',
                    background: seatsLeft <= 5 ? '#EF4444' : 'var(--accent-pop)',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              {/* Action Buttons */}
              {isRegistered ? (
                <button
                  type="button"
                  onClick={() => { onClose(); setView('dashboard'); }}
                  style={{
                    ...D, width: '100%',
                    padding: '13px',
                    fontSize: '13px', fontWeight: 700,
                    background: '#BBF7D0',
                    color: '#15803D',
                    border: '2.5px solid #15803D',
                    borderRadius: '4px',
                    boxShadow: '4px 4px 0 #15803D',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #15803D'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #15803D'; }}
                >
                  Already Registered (View Pass) →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('form')}
                  style={{
                    ...D, width: '100%',
                    padding: '13px',
                    fontSize: '13px', fontWeight: 700,
                    background: 'var(--text)',
                    color: 'var(--text-light)',
                    border: border,
                    borderRadius: '4px',
                    boxShadow: '4px 4px 0 var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--border)'; }}
                >
                  Register for Event →
                </button>
              )}
            </div>
          ) : (
            /* ── REGISTRATION FORM MODE ── */
            <>
              {/* Back to details trigger */}
              <button
                type="button"
                onClick={() => setMode('details')}
                style={{
                  ...D, alignSelf: 'flex-start',
                  fontSize: '11px', fontWeight: 700,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-sub)',
                  textDecoration: 'underline', textUnderlineOffset: '2px',
                  marginBottom: '16px',
                  padding: 0,
                  display: 'block',
                }}
              >
                ← Back to Event Details
              </button>

              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ ...D, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Registration
                </p>
                <h2 style={{ ...D, fontSize: '24px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: '8px' }}>
                  {event.title}
                </h2>
                <p style={{ ...B, fontSize: '13px', color: '#888', fontWeight: 500 }}>
                  Hosted by <strong style={{ color: '#111' }}>{event.clubName}</strong>
                </p>
              </div>

              {/* Registration Error */}
              {submitError && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  padding: '12px 14px', background: '#FEF2F2',
                  border: '2px solid #EF4444', borderRadius: '4px',
                  marginBottom: '20px',
                }}>
                  <ShieldAlert size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: '#991B1B', margin: 0 }}>
                    {submitError}
                  </p>
                </div>
              )}

              {/* Guest Note */}
              {!user && (
                <div style={{
                  background: '#F8FAF5',
                  border: '1.5px dashed #111',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}>
                  <p style={{ ...B, fontSize: '11px', color: '#555', margin: 0, lineHeight: 1.4 }}>
                    <strong>Pro Tip:</strong> Sign in with Google to pre-fill details and secure your passes permanently!
                  </p>
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenAuth(); }}
                    style={{
                      ...D, fontSize: '10px', fontWeight: 700,
                      padding: '6px 12px', background: '#111', color: '#FFF',
                      border: 'none', borderRadius: '4px', cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* 1-Click Success Badge */}
              {isProfileComplete && (
                <div style={{
                  background: '#ECFDF5',
                  border: '2px solid #10B981',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: '#065F46', margin: 0 }}>
                    You have active 1-click registration! Details pre-filled.
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {isProfileComplete ? (
                  /* ONE-CLICK PROFILE DISPLAY */
                  <div style={{
                    background: 'var(--bg)',
                    border: border,
                    borderRadius: '6px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border)', paddingBottom: '8px' }}>
                      <span style={{ ...D, fontSize: '11px', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Verified Student Details
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        style={{ 
                          ...D, fontSize: '11px', fontWeight: 700, color: 'var(--text)', 
                          background: 'none', border: 'none', cursor: 'pointer', 
                          textDecoration: 'underline', textUnderlineOffset: '2px'
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    <div>
                      <p style={{ ...B, fontSize: '15px', fontWeight: 700, color: 'var(--text)', margin: '0 0 2px' }}>
                        {profile.full_name}
                      </p>
                      <p style={{ ...B, fontSize: '12px', color: 'var(--text-sub)', margin: 0 }}>
                        {user.email}
                      </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={{ ...D, fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Semester / Branch</span>
                        <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{profile.semester} · {profile.branch}</p>
                      </div>
                      <div>
                        <span style={{ ...D, fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Roll Number</span>
                        <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{profile.student_id}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STANDARD MANUAL FORM */
                  <>
                    {/* Full Name */}
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={15} style={iconStyle} />
                        <input
                          name="fullName" id="field-fullname" type="text"
                          value={form.fullName} onChange={onChange} placeholder="Your full name"
                          onFocus={() => setFocused('fullName')} onBlur={() => setFocused(null)}
                          style={inputStyle(focused === 'fullName', errors.fullName)}
                        />
                      </div>
                      {errors.fullName && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={iconStyle} />
                        <input
                          name="email" id="field-email" type="email"
                          value={form.email} onChange={onChange} placeholder="student@mec.ac.in"
                          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                          style={inputStyle(focused === 'email', errors.email)}
                        />
                      </div>
                      {errors.email && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.email}</p>}
                    </div>

                    {/* Semester + Branch */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>Semester</label>
                        <div style={{ position: 'relative' }}>
                          <GraduationCap size={15} style={iconStyle} />
                          <select
                            name="semester" id="field-semester"
                            value={form.semester} onChange={onChange}
                            onFocus={() => setFocused('semester')} onBlur={() => setFocused(null)}
                            style={{ ...inputStyle(focused === 'semester', errors.semester), appearance: 'none', cursor: 'pointer' }}
                          >
                            <option value="">Select Semester</option>
                            {['S1','S2','S3','S4','S5','S6','S7','S8'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        {errors.semester && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.semester}</p>}
                      </div>
                      <div>
                        <label style={labelStyle}>Branch</label>
                        <div style={{ position: 'relative' }}>
                          <Layers size={15} style={iconStyle} />
                          <select
                            name="branch" id="field-branch"
                            value={form.branch} onChange={onChange}
                            onFocus={() => setFocused('branch')} onBlur={() => setFocused(null)}
                            style={{ ...inputStyle(focused === 'branch', errors.branch), appearance: 'none', cursor: 'pointer' }}
                          >
                            <option value="">Select Branch</option>
                            {['CSE','ECE','EEE','ME','BME','CS-BS'].map(b => <option key={b}>{b}</option>)}
                          </select>
                        </div>
                        {errors.branch && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.branch}</p>}
                      </div>
                    </div>

                    {/* Student ID */}
                    <div>
                      <label style={labelStyle}>Roll Number / Student ID</label>
                      <div style={{ position: 'relative' }}>
                        <CreditCard size={15} style={iconStyle} />
                        <input
                          name="studentId" id="field-studentid" type="text"
                          value={form.studentId} onChange={onChange} placeholder="e.g. MEC24CS052"
                          onFocus={() => setFocused('studentId')} onBlur={() => setFocused(null)}
                          style={inputStyle(focused === 'studentId', errors.studentId)}
                        />
                      </div>
                      {errors.studentId && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.studentId}</p>}
                    </div>
                  </>
                )}

                {/* Price summary */}
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: '4px',
                }}>
                  <div>
                    <p style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                      Entry fee
                    </p>
                    <p style={{ ...B, fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginTop: '2px' }}>
                      Confirmed on registration
                    </p>
                  </div>
                  <span style={{
                    ...D, fontSize: '20px', fontWeight: 700, color: '#111',
                    padding: '6px 16px',
                    background: event.price === 'Free' ? '#BBF7D0' : '#FEF08A',
                    border: '2px solid var(--border)',
                    borderRadius: '4px',
                  }}>
                    {event.price === 'Free' ? 'FREE' : event.price}
                  </span>
                </div>

                {/* Submit */}
                <button
                  id="btn-confirm-registration"
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...D, width: '100%',
                    padding: '14px',
                    fontSize: '14px', fontWeight: 700,
                    background: isProfileComplete ? '#10B981' : 'var(--accent-pop)',
                    border: border,
                    borderRadius: '4px',
                    boxShadow: '4px 4px 0 var(--border)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.75 : 1,
                    transition: 'all 0.1s ease',
                    marginTop: '4px',
                    letterSpacing: '0.01em',
                    color: isProfileComplete ? '#FFF' : '#111',
                    borderColor: isProfileComplete ? '#10B981' : 'var(--border)',
                  }}
                  onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--border)'; } }}
                  onMouseLeave={e => { if (!submitting) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--border)'; } }}
                >
                  {submitting 
                    ? 'Processing...' 
                    : isProfileComplete 
                      ? 'Confirm Registration (1-Click)' 
                      : 'Confirm Registration & Get Pass'
                  }
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState, useEffect } from 'react';
import { X, User, Mail, CreditCard, Layers, GraduationCap, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const border = '2.5px solid #111';

const inputStyle = (focused, error) => ({
  width: '100%',
  padding: '11px 14px 11px 38px',
  ...B, fontSize: '14px', fontWeight: 500,
  color: '#111',
  background: focused ? '#FFFFF8' : '#FAFAF8',
  border: error ? '2px solid #EF4444' : border,
  borderRadius: '4px',
  outline: 'none',
  transition: 'all 0.12s ease',
  boxShadow: focused ? '3px 3px 0 #111' : 'none',
});

const labelStyle = {
  ...D, fontSize: '11px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: '#333', display: 'block', marginBottom: '6px',
};

const iconStyle = {
  position: 'absolute', left: '12px', top: '50%',
  transform: 'translateY(-50%)',
  color: '#888', pointerEvents: 'none',
};

export default function RegisterModal({ isOpen, onClose, event, onSuccess, onOpenAuth }) {
  const { user, profile, registerForEvent } = useAuth();
  
  const [form, setForm] = useState({ fullName: '', email: '', semester: '', branch: '', studentId: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 24 }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: '480px',
            background: '#FFF',
            border: border,
            borderRadius: '6px',
            boxShadow: '10px 10px 0 #111',
            padding: '32px',
            maxHeight: '92vh', overflowY: 'auto',
          }}
        >
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#111', borderRadius: '6px 6px 0 0' }} />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#F5F5F3',
              border: '2px solid #E5E5E5',
              borderRadius: '6px', cursor: 'pointer',
              color: '#555',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#FFF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F5F5F3'; e.currentTarget.style.color = '#555'; }}
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ ...D, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>
              Registration
            </p>
            <h2 style={{ ...D, fontSize: '24px', fontWeight: 700, color: '#111', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: '8px' }}>
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
                background: '#FAFAF8',
                border: border,
                borderRadius: '6px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #E5E5E3', paddingBottom: '8px' }}>
                  <span style={{ ...D, fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Verified Student Details
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    style={{ 
                      ...D, fontSize: '11px', fontWeight: 700, color: '#111', 
                      background: 'none', border: 'none', cursor: 'pointer', 
                      textDecoration: 'underline', textUnderlineOffset: '2px'
                    }}
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <p style={{ ...B, fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>
                    {profile.full_name}
                  </p>
                  <p style={{ ...B, fontSize: '12px', color: '#666', margin: 0 }}>
                    {user.email}
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ ...D, fontSize: '9px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Semester / Branch</span>
                    <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: '#111', margin: 0 }}>{profile.semester} · {profile.branch}</p>
                  </div>
                  <div>
                    <span style={{ ...D, fontSize: '9px', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Roll Number</span>
                    <p style={{ ...B, fontSize: '13px', fontWeight: 600, color: '#111', margin: 0 }}>{profile.student_id}</p>
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
              background: '#F7F7F4',
              border: '1.5px solid #E5E5E3',
              borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '4px',
            }}>
              <div>
                <p style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>
                  Entry fee
                </p>
                <p style={{ ...B, fontSize: '12px', fontWeight: 400, color: '#888', marginTop: '2px' }}>
                  Confirmed on registration
                </p>
              </div>
              <span style={{
                ...D, fontSize: '20px', fontWeight: 700, color: '#111',
                padding: '6px 16px',
                background: event.price === 'Free' ? '#BBF7D0' : '#FEF08A',
                border: '2px solid #111',
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
                color: '#111',
                background: isProfileComplete ? '#10B981' : '#F5C518',
                border: border,
                borderRadius: '4px',
                boxShadow: '4px 4px 0 #111',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.75 : 1,
                transition: 'all 0.1s ease',
                marginTop: '4px',
                letterSpacing: '0.01em',
                color: isProfileComplete ? '#FFF' : '#111',
                borderColor: isProfileComplete ? '#10B981' : '#111',
              }}
              onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #111'; } }}
              onMouseLeave={e => { if (!submitting) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; } }}
            >
              {submitting 
                ? 'Processing...' 
                : isProfileComplete 
                  ? 'Confirm Registration (1-Click)' 
                  : 'Confirm Registration & Get Pass'
              }
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

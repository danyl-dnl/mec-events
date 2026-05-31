import React, { useState } from 'react';
import { X, User, Mail, Lock, AlertCircle } from 'lucide-react';
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

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithEmail, signUp, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (tab === 'signup' && !form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Invalid email';
    }
    if (!form.password.trim()) {
      e.password = 'Password is required';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (tab === 'login') {
        await signInWithEmail(form.email, form.password);
      } else {
        await signUp(form.email, form.password, form.fullName);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
      // Supabase OAuth redirects away, so loading is fine
    } catch (err) {
      console.error(err);
      setAuthError(err.message || 'Google Sign-In failed.');
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (authError) setAuthError('');
  };

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

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: '420px',
            background: 'var(--bg-card)',
            border: border,
            borderRadius: '6px',
            boxShadow: '10px 10px 0 var(--border)',
            padding: '32px',
            maxHeight: '92vh', overflowY: 'auto',
          }}
        >
          {/* Accent strip */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-pop)', borderRadius: '6px 6px 0 0' }} />

          {/* Close button */}
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

          {/* Title */}
          <div style={{ marginBottom: '24px', marginTop: '8px' }}>
            <h2 style={{ ...D, fontSize: '24px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Welcome to MEC Events
            </h2>
            <p style={{ ...B, fontSize: '13px', color: 'var(--text-sub)' }}>
              Sign in to manage registrations and passes.
            </p>
          </div>

          {/* Auth Error Notification */}
          {authError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              padding: '12px 14px', background: '#FEF2F2',
              border: '2px solid #EF4444', borderRadius: '4px',
              marginBottom: '20px',
            }}>
              <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: '#991B1B', lineHeight: 1.4 }}>
                {authError}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg)', border: border, borderRadius: '4px',
            padding: '4px', marginBottom: '20px',
          }}>
            <button
              onClick={() => { setTab('login'); setErrors({}); setAuthError(''); }}
              style={{
                padding: '8px 0', border: 'none', borderRadius: '3px',
                cursor: 'pointer', ...D, fontSize: '13px', fontWeight: 700,
                background: tab === 'login' ? 'var(--text)' : 'transparent',
                color: tab === 'login' ? 'var(--text-light)' : 'var(--text-sub)',
                transition: 'all 0.12s ease',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrors({}); setAuthError(''); }}
              style={{
                padding: '8px 0', border: 'none', borderRadius: '3px',
                cursor: 'pointer', ...D, fontSize: '13px', fontWeight: 700,
                background: tab === 'signup' ? 'var(--text)' : 'transparent',
                color: tab === 'signup' ? 'var(--text-light)' : 'var(--text-sub)',
                transition: 'all 0.12s ease',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '12px',
              background: 'var(--bg-card)',
              border: border,
              borderRadius: '4px',
              boxShadow: '4px 4px 0 var(--border)',
              cursor: 'pointer',
              ...D, fontSize: '14px', fontWeight: 700, color: 'var(--text)',
              marginBottom: '20px',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--border)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--border)'; }}
          >
            {/* Google Icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1.5px', background: '#E5E5E3' }} />
            <span style={{ ...B, fontSize: '11px', fontWeight: 600, color: '#888', padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or use email
            </span>
            <div style={{ flex: 1, height: '1.5px', background: '#E5E5E3' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Full Name (Sign Up only) */}
            {tab === 'signup' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={iconStyle} />
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={onChange}
                    placeholder="Your full name"
                    onFocus={() => setFocused('fullName')}
                    onBlur={() => setFocused(null)}
                    style={inputStyle(focused === 'fullName', errors.fullName)}
                  />
                </div>
                {errors.fullName && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.fullName}</p>}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="name@domain.com"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle(focused === 'email', errors.email)}
                />
              </div>
              {errors.email && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle(focused === 'password', errors.password)}
                />
              </div>
              {errors.password && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...D, width: '100%',
                padding: '13px',
                fontSize: '14px', fontWeight: 700,
                color: '#111',
                background: '#F5C518',
                border: border,
                borderRadius: '4px',
                boxShadow: '4px 4px 0 #111',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                marginTop: '8px',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #111'; } }}
              onMouseLeave={e => { if (!submitting) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; } }}
            >
              {submitting ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState, useEffect } from 'react';
import { X, User, CreditCard, Layers, GraduationCap, AlertCircle, Save } from 'lucide-react';
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

export default function ProfileModal({ isOpen, onClose }) {
  const { user, profile, updateProfile } = useAuth();
  const [form, setForm] = useState({ fullName: '', semester: '', branch: '', studentId: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        fullName: profile.full_name || '',
        semester: profile.semester || '',
        branch: profile.branch || '',
        studentId: profile.student_id || '',
      });
      setErrors({});
      setSaveError('');
    }
  }, [isOpen, profile]);

  if (!isOpen || !user) return null;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full Name is required';
    if (!form.semester) e.semester = 'Semester is required';
    if (!form.branch) e.branch = 'Branch is required';
    if (!form.studentId.trim()) e.studentId = 'Roll Number / Student ID is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    if (!validate()) return;

    setSaving(true);
    try {
      await updateProfile({
        full_name: form.fullName,
        semester: form.semester,
        branch: form.branch,
        student_id: form.studentId,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (saveError) setSaveError('');
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

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: '440px',
            background: '#FFF',
            border: '2.5px solid #111',
            borderRadius: '6px',
            boxShadow: '10px 10px 0 #111',
            padding: '32px',
            maxHeight: '92vh', overflowY: 'auto',
          }}
        >
          {/* Top accent strip */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#F5C518', borderRadius: '6px 6px 0 0' }} />

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
          <div style={{ marginBottom: '24px', marginTop: '8px' }}>
            <p style={{ ...D, fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>
              User Profile
            </p>
            <h2 style={{ ...D, fontSize: '24px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Complete Your Profile
            </h2>
            <p style={{ ...B, fontSize: '13px', color: '#666' }}>
              Fill this in once to enable 1-click registration for all future events.
            </p>
          </div>

          {/* Error Alert */}
          {saveError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              padding: '12px 14px', background: '#FEF2F2',
              border: '2px solid #EF4444', borderRadius: '4px',
              marginBottom: '20px',
            }}>
              <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ ...B, fontSize: '12px', fontWeight: 600, color: '#991B1B', lineHeight: 1.4 }}>
                {saveError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Full Name */}
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

            {/* Semester + Branch */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Semester</label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={15} style={iconStyle} />
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={onChange}
                    onFocus={() => setFocused('semester')}
                    onBlur={() => setFocused(null)}
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
                    name="branch"
                    value={form.branch}
                    onChange={onChange}
                    onFocus={() => setFocused('branch')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(focused === 'branch', errors.branch), appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Select Branch</option>
                    {['CSE','ECE','EEE','ME','BME','CS-BS'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                {errors.branch && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.branch}</p>}
              </div>
            </div>

            {/* Student ID / Roll Number */}
            <div>
              <label style={labelStyle}>Roll Number / Student ID</label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={15} style={iconStyle} />
                <input
                  name="studentId"
                  type="text"
                  value={form.studentId}
                  onChange={onChange}
                  placeholder="e.g. MEC24CS052"
                  onFocus={() => setFocused('studentId')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle(focused === 'studentId', errors.studentId)}
                />
              </div>
              {errors.studentId && <p style={{ ...B, fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} />{errors.studentId}</p>}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              style={{
                ...D, width: '100%',
                padding: '13px',
                fontSize: '14px', fontWeight: 700,
                color: '#111',
                background: '#F5C518',
                border: border,
                borderRadius: '4px',
                boxShadow: '4px 4px 0 #111',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                marginTop: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #111'; } }}
              onMouseLeave={e => { if (!saving) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #111'; } }}
            >
              <Save size={15} />
              {saving ? 'Saving Details...' : 'Save & Enable One-Click'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

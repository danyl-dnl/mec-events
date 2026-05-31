import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  IndianRupee, 
  Award, 
  Network, 
  Search, 
  Download, 
  FilterX, 
  Calendar, 
  Ticket,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MEC_EVENTS } from '../data/mockDatabase';

const D = { fontFamily: "'Space Grotesk', sans-serif" };
const B = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

// High-quality mock registrations for preview and demonstration purposes
const MOCK_COORDINATOR_REGS = [
  {
    id: "TKT-EX9283A",
    eventId: "excel-2026",
    eventTitle: "Excel 2026 Tech Fest",
    fullName: "Aravind K.S.",
    email: "aravind.ks@mec.ac.in",
    branch: "Computer Science",
    semester: "S6",
    studentId: "MEC23CS01",
    registeredAt: "2026-05-18T10:30:00.000Z",
  },
  {
    id: "TKT-DS1082B",
    eventId: "devsprint-26",
    eventTitle: "DevSprint '26",
    fullName: "Fathima R.",
    email: "fathima.r@mec.ac.in",
    branch: "Computer Science",
    semester: "S4",
    studentId: "MEC24CS15",
    registeredAt: "2026-05-20T14:15:00.000Z",
  },
  {
    id: "TKT-TP4829C",
    eventId: "technopreneur-26",
    eventTitle: "Technopreneur '26",
    fullName: "Devanand M. Prabhu",
    email: "devanand.prabhu@gmail.com",
    branch: "Electronics & Communication",
    semester: "S8",
    studentId: "MEC22EC42",
    registeredAt: "2026-05-19T09:00:00.000Z",
  },
  {
    id: "TKT-SQ3819D",
    eventId: "sandeeph-quiz",
    eventTitle: "Sandeep Menon Memorial Quiz",
    fullName: "Neha Susan",
    email: "nehasusan@mec.ac.in",
    branch: "Artificial Intelligence & Data Science",
    semester: "S2",
    studentId: "MEC25AI12",
    registeredAt: "2026-05-22T16:45:00.000Z",
  },
  {
    id: "TKT-IB1029E",
    eventId: "iot-bootcamp",
    eventTitle: "IoT Circuit Design Lab",
    fullName: "Gowri Shankar",
    email: "gowrishankar@gmail.com",
    branch: "Electrical & Electronics",
    semester: "S6",
    studentId: "MEC23EE08",
    registeredAt: "2026-05-21T11:20:00.000Z",
  },
  {
    id: "TKT-RW2819F",
    eventId: "robowars-26",
    eventTitle: "Cyborg Robowars",
    fullName: "Rahul Nambiar",
    email: "rahulnambiar@mec.ac.in",
    branch: "Mechanical Engineering",
    semester: "S6",
    studentId: "MEC23ME55",
    registeredAt: "2026-05-20T10:10:00.000Z",
  },
  {
    id: "TKT-LW9381G",
    eventId: "lens-walk-26",
    eventTitle: "Framed '26 - Photo Walk",
    fullName: "Sneha Joseph",
    email: "snehajoseph@gmail.com",
    branch: "Electronics & Communication",
    semester: "S4",
    studentId: "MEC24EC18",
    registeredAt: "2026-05-24T08:00:00.000Z",
  },
  {
    id: "TKT-AR8392H",
    eventId: "algo-rush-26",
    eventTitle: "AlgoRush Hack Challenge",
    fullName: "Aditya Sunil",
    email: "aditya.sunil@mec.ac.in",
    branch: "Computer Science",
    semester: "S2",
    studentId: "MEC25CS04",
    registeredAt: "2026-05-23T21:00:00.000Z",
  },
  {
    id: "TKT-EX9928I",
    eventId: "excel-2026",
    eventTitle: "Excel 2026 Tech Fest",
    fullName: "Anjali Krishna",
    email: "anjalikrishna@mec.ac.in",
    branch: "Computer Science",
    semester: "S8",
    studentId: "MEC22CS11",
    registeredAt: "2026-05-18T12:00:00.000Z",
  },
  {
    id: "TKT-RW2019J",
    eventId: "robowars-26",
    eventTitle: "Cyborg Robowars",
    fullName: "Midhun P.S.",
    email: "midhunps@gmail.com",
    branch: "Electrical & Electronics",
    semester: "S4",
    studentId: "MEC24EE23",
    registeredAt: "2026-05-21T13:40:00.000Z",
  },
  {
    id: "TKT-TP4822K",
    eventId: "technopreneur-26",
    eventTitle: "Technopreneur '26",
    fullName: "Aisha Hassan",
    email: "aishahassan@mec.ac.in",
    branch: "Artificial Intelligence & Data Science",
    semester: "S6",
    studentId: "MEC23AI08",
    registeredAt: "2026-05-19T15:30:00.000Z",
  },
  {
    id: "TKT-IB1928L",
    eventId: "iot-bootcamp",
    eventTitle: "IoT Circuit Design Lab",
    fullName: "Rohan Verma",
    email: "rohanverma@gmail.com",
    branch: "Electronics & Communication",
    semester: "S6",
    studentId: "MEC23EC50",
    registeredAt: "2026-05-21T16:15:00.000Z",
  },
  {
    id: "TKT-LW9383M",
    eventId: "lens-walk-26",
    eventTitle: "Framed '26 - Photo Walk",
    fullName: "Karthik Nair",
    email: "karthiknair@mec.ac.in",
    branch: "Computer Science",
    semester: "S6",
    studentId: "MEC23CS44",
    registeredAt: "2026-05-25T11:00:00.000Z",
  },
  {
    id: "TKT-AR8399N",
    eventId: "algo-rush-26",
    eventTitle: "AlgoRush Hack Challenge",
    fullName: "Saira Banu",
    email: "sairabanu@gmail.com",
    branch: "Computer Science",
    semester: "S4",
    studentId: "MEC24CS72",
    registeredAt: "2026-05-23T22:30:00.000Z",
  },
  {
    id: "TKT-EX9999O",
    eventId: "excel-2026",
    eventTitle: "Excel 2026 Tech Fest",
    fullName: "Gautham S. Kumar",
    email: "gauthamkumar@mec.ac.in",
    branch: "Electrical & Electronics",
    semester: "S8",
    studentId: "MEC22EE15",
    registeredAt: "2026-05-18T14:45:00.000Z",
  }
];

export default function CoordinatorView({ setView, pageAnim, eventsList, onAddEvent }) {
  const { user } = useAuth();

  const isSuperAdmin = !user || user.email === 'danyldt07@gmail.com';
  const isClubManager = user?.email === 'danylphotos@gmail.com';
  const managedClubId = isClubManager ? 'thirdeye' : null;
  const managedClubName = isClubManager ? 'Third Eye' : null;

  const [registrations, setRegistrations] = useState([]);
  
  // Event Creator states
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech');
  const [clubName, setClubName] = useState(isClubManager ? 'Third Eye' : 'FOSSMEC');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('Free');
  const [flagship, setFlagship] = useState(false);
  const [glowColor, setGlowColor] = useState('#00F2FE');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const CLUB_MAP = {
    'FOSSMEC': 'fossmec',
    'MACS': 'macs',
    'IEEE SB MEC': 'ieee',
    'IEDC MEC': 'iedc',
    'The Quizzing Fraternity (The Illuminati)': 'illuminati',
    'Mixed Signals': 'signals',
    'Cyborg': 'cyborg',
    'Third Eye': 'thirdeye',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time || !venue || !price || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const hostClubId = CLUB_MAP[clubName] || 'ieee';

    const newEvent = {
      id: `custom-evt-${Math.random().toString(36).substr(2, 9)}`,
      title,
      clubId: hostClubId,
      clubName,
      date,
      time,
      venue,
      category,
      description,
      status: 'active',
      flagship,
      registrationCount: 0,
      price,
      glowColor,
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    // Reset Form
    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setPrice('Free');
    setFlagship(false);
    setDescription('');
    
    setSuccessMsg('🎉 Event successfully created! It is now live across the portal.');
    setTimeout(() => setSuccessMsg(''), 5000);
    setFormOpen(false);
  };
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Load from Supabase and merge with Mock data
  useEffect(() => {
    const loadRegistrations = async () => {
      setLoading(true);
      try {
        // Fallback immediately if credentials are placeholders to prevent request hangs
        const isPlaceholder = !supabase || !supabase.supabaseUrl || supabase.supabaseUrl.includes('placeholder');
        if (isPlaceholder) {
          throw new Error('Supabase URL/Key is unconfigured');
        }

        // Establish a 2-second timeout race to intercept network hanging issues
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase request timed out')), 2000)
        );

        const fetchPromise = supabase
          .from('registrations')
          .select('*')
          .order('registered_at', { ascending: false });

        const result = await Promise.race([fetchPromise, timeoutPromise]);
        
        const data = result.data;
        const error = result.error;

        if (error) {
          console.warn('RLS or Supabase query failed, falling back to mock dataset:', error);
          setRegistrations(MOCK_COORDINATOR_REGS);
        } else {
          const dbMapped = (data || []).map(r => ({
            id: r.ticket_id || `TKT-${r.id.substr(0,8).toUpperCase()}`,
            eventId: r.event_id,
            eventTitle: r.event_title,
            fullName: r.full_name,
            email: r.email,
            branch: r.branch,
            semester: r.semester,
            studentId: r.student_id,
            registeredAt: r.registered_at,
          }));

          // Merge mock and DB entries, removing potential duplicates on email + eventId
          const uniqueMap = new Map();
          
          // Load mocks first
          MOCK_COORDINATOR_REGS.forEach(item => {
            uniqueMap.set(`${item.email.toLowerCase()}_${item.eventId}`, item);
          });

          // Overwrite/insert with real entries
          dbMapped.forEach(item => {
            uniqueMap.set(`${item.email.toLowerCase()}_${item.eventId}`, item);
          });

          setRegistrations(Array.from(uniqueMap.values()));
        }
      } catch (err) {
        console.warn('Error fetching registrations or request timed out, loading mock preview:', err.message);
        setRegistrations(MOCK_COORDINATOR_REGS);
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  // Lookup helper for pricing and details
  const getEventPrice = (eventId) => {
    const ev = MEC_EVENTS.find(e => e.id === eventId);
    if (!ev) return 0;
    if (ev.price === 'Free') return 0;
    const num = parseInt(ev.price.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Resolve club specific items
  const clubEventIds = MEC_EVENTS.filter(e => e.clubId === managedClubId).map(e => e.id);
  const clubFilteredRegistrations = isClubManager
    ? registrations.filter(r => r.eventId === 'lens-walk-26' || clubEventIds.includes(r.eventId))
    : registrations;

  // Unique event titles and branches for dropdown filters
  const uniqueEvents = isClubManager
    ? ['Framed \'26 - Photo Walk']
    : ['All', ...new Set(clubFilteredRegistrations.map(r => r.eventTitle))];
    
  const uniqueBranches = ['All', ...new Set(clubFilteredRegistrations.map(r => r.branch).filter(Boolean))];

  // Filtering registrations logic
  const filteredRegs = clubFilteredRegistrations.filter(r => {
    const searchMatch = 
      (r.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.studentId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const eventMatch = selectedEvent === 'All' || selectedEvent === 'Framed \'26 - Photo Walk' || r.eventTitle === selectedEvent;
    const branchMatch = selectedBranch === 'All' || r.branch === selectedBranch;

    return searchMatch && eventMatch && branchMatch;
  });

  // Calculate dynamic dashboard stats
  const totalRegistrations = filteredRegs.length;
  
  const revenueGenerated = filteredRegs.reduce((sum, r) => {
    return sum + getEventPrice(r.eventId);
  }, 0);

  // Compute top event based on filtered dataset
  const eventCounts = filteredRegs.reduce((acc, r) => {
    acc[r.eventTitle] = (acc[r.eventTitle] || 0) + 1;
    return acc;
  }, {});
  let topEventName = 'N/A';
  let maxCount = 0;
  Object.entries(eventCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topEventName = name;
    }
  });

  const activeBranchesCount = new Set(filteredRegs.map(r => r.branch).filter(Boolean)).size;

  // Export filtered registrations to CSV file
  const handleExportCSV = () => {
    if (filteredRegs.length === 0) return;

    const headers = 'Ticket ID,Full Name,Email,Branch,Semester,Student ID,Event Title,Registered Date,Price\n';
    
    const rows = filteredRegs.map(r => {
      const esc = (val) => `"${(val || '').replace(/"/g, '""')}"`;
      const priceVal = getEventPrice(r.eventId) > 0 ? `₹${getEventPrice(r.eventId)}` : 'Free';
      const formattedDate = new Date(r.registeredAt).toLocaleDateString();
      
      return `${esc(r.id)},${esc(r.fullName)},${esc(r.email)},${esc(r.branch)},${esc(r.semester)},${esc(r.studentId)},${esc(r.eventTitle)},${esc(formattedDate)},${esc(priceVal)}`;
    });

    const csvContent = 'EFBBBF' + headers + rows.join('\n'); // Add UTF-8 BOM
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MEC_Coordinator_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEvent('All');
    setSelectedBranch('All');
  };

  return (
    <motion.div key="coordinator" {...pageAnim} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Back button */}
      <div>
        <button
          onClick={() => setView('home')}
          style={{
            ...D,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 700,
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '2.5px solid var(--border)',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Back to Portal
        </button>
      </div>

      {/* Hero Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{
          ...D,
          fontSize: '10px',
          fontWeight: 700,
          color: '#111',
          background: isClubManager ? '#BAE6FD' : '#FEF08A',
          border: '1.5px solid var(--border)',
          borderRadius: '3px',
          padding: '3px 8px',
          textTransform: 'uppercase',
          width: 'fit-content',
          letterSpacing: '0.07em'
        }}>
          {isClubManager ? '⚡ CLUB MANAGER DESK — Third Eye Cell' : '⚡ SUPER ADMIN DESK'}
        </span>
        <h1 style={{
          ...D,
          fontSize: '36px',
          fontWeight: 800,
          lineHeight: 1.1,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          {isClubManager ? 'Third Eye Desk' : 'Coordinator View'}
        </h1>
        <p style={{
          ...B,
          fontSize: '15px',
          color: 'var(--text-sub)',
          maxWidth: '680px',
          lineHeight: 1.6
        }}>
          {isClubManager
            ? 'Monitor student registrations, view participant statistics, and export CSV spreadsheets strictly for the Third Eye photography club events.'
            : 'Monitor student registration statistics, manage student entries across departmental chapters, and export audited CSV spreadsheets.'
          }
        </p>
      </div>

      {/* KPI Statistic Widgets */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        width: '100%',
      }}>
        {/* Metric 1 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '4px 4px 0 var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...D, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Total Audited
            </span>
            <div style={{ background: '#BAE6FD', padding: '6px', borderRadius: '4px', border: '1.5px solid var(--border)' }}>
              <Users size={18} color="#0369A1" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h2 style={{ ...D, fontSize: '32px', fontWeight: 800, color: 'var(--text)', margin: '10px 0 0' }}>
              {loading ? '...' : totalRegistrations}
            </h2>
            <p style={{ ...B, fontSize: '11px', color: 'var(--text-sub)', margin: 0 }}>
              Registered students filtered
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '4px 4px 0 var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...D, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Projected Revenue
            </span>
            <div style={{ background: '#BBF7D0', padding: '6px', borderRadius: '4px', border: '1.5px solid var(--border)' }}>
              <IndianRupee size={18} color="#15803D" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h2 style={{ ...D, fontSize: '32px', fontWeight: 800, color: 'var(--text)', margin: '10px 0 0', display: 'flex', alignItems: 'center' }}>
              {loading ? '...' : `₹${revenueGenerated}`}
            </h2>
            <p style={{ ...B, fontSize: '11px', color: 'var(--text-sub)', margin: 0 }}>
              Calculated from ticket costs
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '4px 4px 0 var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...D, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Top Event
            </span>
            <div style={{ background: '#FED7AA', padding: '6px', borderRadius: '4px', border: '1.5px solid var(--border)' }}>
              <Award size={18} color="#C2410C" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h2 style={{ 
              ...D, 
              fontSize: topEventName.length > 18 ? '16px' : '20px', 
              fontWeight: 800, 
              color: 'var(--text)', 
              margin: '10px 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {loading ? '...' : topEventName}
            </h2>
            <p style={{ ...B, fontSize: '11px', color: 'var(--text-sub)', margin: 0 }}>
              {maxCount > 0 ? `${maxCount} target registrations` : 'No registrations logged'}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{
          background: 'var(--bg-card)',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          padding: '20px',
          boxShadow: '4px 4px 0 var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ ...D, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Active Branches
            </span>
            <div style={{ background: '#DDD6FE', padding: '6px', borderRadius: '4px', border: '1.5px solid var(--border)' }}>
              <Network size={18} color="#6D28D9" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h2 style={{ ...D, fontSize: '32px', fontWeight: 800, color: 'var(--text)', margin: '10px 0 0' }}>
              {loading ? '...' : activeBranchesCount}
            </h2>
            <p style={{ ...B, fontSize: '11px', color: 'var(--text-sub)', margin: 0 }}>
              Represented academic streams
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Success Notification */}
      {successMsg && (
        <div style={{
          ...D,
          fontSize: '13px',
          fontWeight: 700,
          background: '#BBF7D0',
          color: '#15803D',
          border: '2.5px solid var(--border)',
          borderRadius: '4px',
          padding: '12px 20px',
          boxShadow: '3px 3px 0 var(--border)',
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          {successMsg}
        </div>
      )}

      {/* ⚡ Create New Event Collapsible Panel */}
      <div style={{
        background: 'var(--bg-card)',
        border: '2.5px solid var(--border)',
        borderRadius: '4px',
        boxShadow: '4px 4px 0 var(--border)',
        overflow: 'hidden'
      }}>
        {/* Accordion Trigger Header */}
        <button
          onClick={() => setFormOpen(!formOpen)}
          style={{
            ...D,
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            width: '100%',
            background: '#FCD34D', // Amber pop
            color: '#111',
            border: 'none',
            borderBottom: formOpen ? '2.5px solid var(--border)' : 'none',
            padding: '16px 24px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left'
          }}
        >
          <span>⚡ Create New Campus Event</span>
          <span style={{ fontSize: '18px' }}>{formOpen ? '−' : '+'}</span>
        </button>

        <AnimatePresence>
          {formOpen && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: 'var(--bg-card)',
                overflow: 'hidden'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}>
                {/* Field 1: Event Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CodeStorm Hackathon"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                      ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 2: Category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      ...D, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="Tech">Tech</option>
                    <option value="Coding">Coding</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Quizzing">Quizzing</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Arts">Arts</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>

                {/* Field 3: Host Club */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Host Club / Cell
                  </label>
                  <select
                    disabled={isClubManager}
                    value={clubName}
                    onChange={e => setClubName(e.target.value)}
                    style={{
                      ...D, padding: '10px 12px', fontSize: '13px', background: isClubManager ? 'var(--hover-ghost)' : 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: isClubManager ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isClubManager ? (
                      <option value="Third Eye">Third Eye (Photography & Media Cell)</option>
                    ) : (
                      <>
                        <option value="FOSSMEC">FOSSMEC (Open Source)</option>
                        <option value="MACS">MACS (Computer Science)</option>
                        <option value="IEEE SB MEC">IEEE SB MEC (Professional Tech)</option>
                        <option value="IEDC MEC">IEDC MEC (Entrepreneurship)</option>
                        <option value="The Quizzing Fraternity (The Illuminati)">The Quizzing Fraternity (The Illuminati)</option>
                        <option value="Mixed Signals">Mixed Signals (ECE Association)</option>
                        <option value="Cyborg">Cyborg (Robotics Lab)</option>
                        <option value="Third Eye">Third Eye (Photography & Media)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Field 4: Price */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Ticket Price *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free or ₹150"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    style={{
                      ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 5: Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{
                      ...D, padding: '9px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Field 6: Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM or 02:30 PM"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    style={{
                      ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 7: Venue */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. College Seminar Hall"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    style={{
                      ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 8: Color theme */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                    Banner Glow / Accent Color
                  </label>
                  <select
                    value={glowColor}
                    onChange={e => setGlowColor(e.target.value)}
                    style={{
                      ...D, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                      border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', cursor: 'pointer'
                    }}
                  >
                    <option value="#00F2FE">Neon Cyan (MACS/FOSS)</option>
                    <option value="#FF512F">Vibrant Red (FOSSMEC)</option>
                    <option value="#38ef7d">Emerald Green (IEDC)</option>
                    <option value="#8E2DE2">Quizzing Purple (Illuminati)</option>
                    <option value="#F35588">Mixed ECE Pink (Mixed Signals)</option>
                    <option value="#f12711">Robotics Crimson (Cyborg)</option>
                    <option value="#70e1f5">Third Eye Sky (Photography)</option>
                  </select>
                </div>
              </div>

              {/* Field 9: Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ ...D, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                  Event Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a detailed, compelling summary of the event highlights, timelines, and requirements..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{
                    ...B, padding: '10px 12px', fontSize: '13px', background: 'var(--bg)',
                    border: '2px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              {/* Checkbox: Flagship */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="flagship-check"
                  checked={flagship}
                  onChange={e => setFlagship(e.target.checked)}
                  style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                />
                <label htmlFor="flagship-check" style={{ ...D, fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text)' }}>
                  Mark as Flagship Event (Featured at the top of the portal home page)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  ...D,
                  fontSize: '13px',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                  padding: '12px 24px',
                  background: 'var(--text)',
                  color: 'var(--text-light)',
                  border: '2.5px solid var(--border)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.1s ease',
                  marginTop: '8px'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                Publish Event →
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Table Management Console */}
      <div style={{
        background: 'var(--bg-card)',
        border: '2.5px solid var(--border)',
        borderRadius: '4px',
        padding: '24px',
        boxShadow: '5px 5px 0 var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Controls Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg)',
            border: '2px solid var(--border)',
            borderRadius: '4px',
            padding: '8px 12px',
            minWidth: '280px',
            flex: 1,
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search by Name, Roll No., Ticket..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                ...B,
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                width: '100%',
                outline: 'none',
                fontSize: '13px',
                fontWeight: 500
              }}
            />
          </div>

          {/* Filters dropdowns */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px'
          }}>
            
            {/* Event Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
                style={{
                  ...D,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '9px 12px',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  border: '2px solid var(--border)',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Events</option>
                {uniqueEvents.filter(e => e !== 'All').map(e => (
                  <option key={e} value={e}>{e.length > 28 ? e.substr(0,25)+'...' : e}</option>
                ))}
              </select>
            </div>

            {/* Branch Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                style={{
                  ...D,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '9px 12px',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  border: '2px solid var(--border)',
                  borderRadius: '4px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Branches</option>
                {uniqueBranches.filter(b => b !== 'All').map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            {(searchQuery || selectedEvent !== 'All' || selectedBranch !== 'All') && (
              <button
                onClick={handleResetFilters}
                style={{
                  ...D,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: '#FCA5A5',
                  color: '#7F1D1D',
                  border: '2px solid var(--border)',
                  borderRadius: '4px',
                  padding: '9px 14px',
                  cursor: 'pointer',
                }}
              >
                <FilterX size={14} />
                Reset
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={filteredRegs.length === 0}
              style={{
                ...D,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                background: filteredRegs.length === 0 ? 'var(--hover-ghost)' : 'var(--text)',
                color: filteredRegs.length === 0 ? 'var(--text-muted)' : 'var(--text-light)',
                border: '2px solid var(--border)',
                borderRadius: '4px',
                padding: '9px 16px',
                cursor: filteredRegs.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.1s ease',
              }}
              onMouseEnter={e => { if (filteredRegs.length > 0) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <Download size={14} />
              Export CSV
            </button>

          </div>

        </div>

        {/* Tabular Student Registry */}
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', ...D, fontWeight: 700 }}>
            ⚡ Querying active database logs...
          </div>
        ) : filteredRegs.length === 0 ? (
          <div style={{ 
            padding: '50px 0', 
            textAlign: 'center', 
            border: '2px dashed var(--border)',
            borderRadius: '4px',
            background: 'var(--hover-ghost)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Ticket size={32} color="var(--text-muted)" />
            <div style={{ ...D, fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              No Registrations Logged
            </div>
            <div style={{ ...B, fontSize: '13px', color: 'var(--text-muted)' }}>
              No students fit the specified query criteria. Try clearing some filters.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13px',
              ...B
            }}>
              <thead>
                <tr style={{
                  background: 'var(--text)',
                  color: 'var(--text-light)',
                  border: '2px solid var(--border)',
                }}>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Ticket ID</th>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Participant</th>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Branch/Sem</th>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Roll Number</th>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Event Name</th>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Price</th>
                  <th style={{ ...D, padding: '12px 16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Date Registered</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegs.map((reg, idx) => {
                  const evPrice = getEventPrice(reg.eventId);
                  return (
                    <tr 
                      key={reg.id || idx} 
                      style={{
                        borderBottom: '2px solid var(--border)',
                        borderLeft: '2px solid var(--border)',
                        borderRight: '2px solid var(--border)',
                        background: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-ghost)'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)'}
                    >
                      {/* Ticket Code */}
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text)' }}>
                        <span style={{ 
                          fontFamily: "'Space Grotesk', monospace", 
                          fontSize: '11px',
                          background: 'var(--hover-ghost)',
                          border: '1.5px solid var(--border)',
                          borderRadius: '3px',
                          padding: '3px 8px'
                        }}>
                          {reg.id}
                        </span>
                      </td>

                      {/* Participant Details */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{reg.fullName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{reg.email}</div>
                      </td>

                      {/* Branch and Semester */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-sub)' }}>{reg.branch || 'N/A'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{reg.semester ? `Semester ${reg.semester.replace(/[^0-9]/g, '')}` : 'N/A'}</div>
                      </td>

                      {/* Student ID */}
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-sub)' }}>
                        {reg.studentId || 'N/A'}
                      </td>

                      {/* Event Name */}
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text)' }}>
                        {reg.eventTitle}
                      </td>

                      {/* Price tag */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          ...D,
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          background: evPrice > 0 ? '#FEF08A' : '#BBF7D0',
                          border: '1.5px solid var(--border)',
                          borderRadius: '3px',
                          color: '#111'
                        }}>
                          {evPrice > 0 ? `₹${evPrice}` : 'FREE'}
                        </span>
                      </td>

                      {/* Date registered */}
                      <td style={{ padding: '14px 16px', color: 'var(--text-sub)', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={12} color="var(--text-muted)" />
                          {new Date(reg.registeredAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </motion.div>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';

// ═══════════════════════════════════════════════════════════
// CONSTANTS & UTILITIES
// ═══════════════════════════════════════════════════════════

const PASSWORD = 'doitallbrothers2026';
const STORE_KEY = 'dab_tracker_v1';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const todayStr = () => new Date().toISOString().slice(0, 10);

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d.length === 10 ? d + 'T12:00:00' : d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const fmtDateShort = (d) => {
  if (!d) return '—';
  return new Date(d.length === 10 ? d + 'T12:00:00' : d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
};

const fmtTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const fmtMoney = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

const fmtMoneyFull = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

const clsx = (...a) => a.filter(Boolean).join(' ');

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ═══════════════════════════════════════════════════════════
// DATA MODEL
// ═══════════════════════════════════════════════════════════

const DEFAULT_DATA = {
  clients: [],
  bookings: [],
  contacts: [],
  tasks: [],
  revenues: [],
  notes: [],
  requests: [],
};

const REQUEST_STATUSES = {
  unaddressed: { label: 'Unaddressed', color: '#EF4444' },
  contacted:   { label: 'Contacted',   color: '#F59E0B' },
  confirmed:   { label: 'Confirmed',   color: '#10B981' },
};

const loadData = () => {
  try {
    const s = localStorage.getItem(STORE_KEY);
    if (!s) return DEFAULT_DATA;
    return { ...DEFAULT_DATA, ...JSON.parse(s) };
  } catch { return DEFAULT_DATA; }
};

const saveData = (d) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {}
};

// ═══════════════════════════════════════════════════════════
// STATIC CONFIG
// ═══════════════════════════════════════════════════════════

const BOOKING_STATUSES = {
  pending:      { label: 'Pending',     color: '#F59E0B' },
  confirmed:    { label: 'Confirmed',   color: '#3B82F6' },
  'in-progress':{ label: 'In Progress', color: '#A78BFA' },
  completed:    { label: 'Completed',   color: '#10B981' },
  cancelled:    { label: 'Cancelled',   color: '#EF4444' },
};

const PRIORITY = {
  urgent: { label: 'Urgent', color: '#EF4444' },
  high:   { label: 'High',   color: '#F59E0B' },
  medium: { label: 'Medium', color: '#3B82F6' },
  low:    { label: 'Low',    color: '#64748B' },
};

const SERVICE_CATS = [
  'Recurring Cleaning','Landscaping & Outdoor','Home Maintenance & Care',
  'Moving, Organization & Junk Removal','Tech Help & Smart Home',
  'Pet & Outdoor Care','Small Business & Office','Emergency & Same-Day','Other',
];

const PAY_METHODS = ['Cash','Venmo','Zelle','Check','Stripe/Card','Other'];
const CLIENT_TAGS = ['VIP','Regular','New','Inactive','Referred'];
const NOTE_COLORS = ['#1E293B','#1e3a5f','#1a2e1a','#2d1a0e','#2d0f2d','#1a1a2e'];

// ═══════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════

const Ic = {
  grid:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  inbox:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  cal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clip:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
  dollar:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  note:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  book:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  edit:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  chL:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chR:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chD:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  phone:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 11 19.79 19.79 0 011.61 2.37 2 2 0 013.59.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>,
  mail:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  pin:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-4l-2-9H7l-2 9v4z"/></svg>,
  dl:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  alert:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  copy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  tag:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  globe:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  menu:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  logout:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  trending:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ═══════════════════════════════════════════════════════════
// REUSABLE UI COMPONENTS
// ═══════════════════════════════════════════════════════════

function Modal({ title, onClose, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box modal-${size}`} dir="ltr" style={{direction:'ltr', textAlign:'left'}}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="icon-btn" onClick={onClose}>{Ic.x}</button>
        </div>
        <div className="modal-body" style={{overflowX:'hidden'}}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

function Badge({ label, color, bg }) {
  return (
    <span className="badge" style={{ color, background: bg || color + '22', borderColor: color + '44' }}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = BOOKING_STATUSES[status] || { label: status, color: '#94A3B8' };
  return <Badge label={cfg.label} color={cfg.color} />;
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY[priority] || { label: priority, color: '#94A3B8' };
  return <Badge label={cfg.label} color={cfg.color} />;
}

function EmptyState({ icon, text, sub, action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p className="empty-text">{text}</p>
      {sub && <p className="empty-sub">{sub}</p>}
      {action && <button className="btn btn-primary" onClick={action}>{actionLabel}</button>}
    </div>
  );
}

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm" onClose={onCancel} size="sm">
      <p style={{ marginBottom: 24, color: '#CBD5E1' }}>{message}</p>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

function FormRow({ label, children, required }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="req">*</span>}</label>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      onLogin();
    } else {
      setErr('Incorrect password');
      setPw('');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="login-screen">
      <div className={clsx('login-card', shake && 'shake')}>
        <div className="login-logo">
          <div className="login-logo-icon">{Ic.trending}</div>
        </div>
        <h1 className="login-title">DoItAllBros</h1>
        <p className="login-sub">Business Tracker</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(''); }}
            autoFocus
            className={clsx('login-input', err && 'input-error')}
          />
          {err && <p className="login-error">{err}</p>}
          <button type="submit" className="btn btn-primary login-btn">Enter Dashboard</button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════

const NAV = [
  { id: 'dashboard', label: 'Dashboard',   icon: 'grid'   },
  { id: 'inbox',     label: 'Inbox',        icon: 'inbox'  },
  { id: 'clients',   label: 'Clients',      icon: 'users'  },
  { id: 'bookings',  label: 'Bookings',     icon: 'book'   },
  { id: 'calendar',  label: 'Calendar',     icon: 'cal'    },
  { id: 'tasks',     label: 'Tasks',        icon: 'clip'   },
  { id: 'revenue',   label: 'Revenue',      icon: 'dollar' },
  { id: 'notes',     label: 'Notes',        icon: 'note'   },
];

function Sidebar({ view, onChange, inboxCount, onLogout }) {
  const now = new Date();
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo-icon">{Ic.trending}</span>
        <div>
          <div className="sidebar-brand">DoItAllBros</div>
          <div className="sidebar-sub">Business Tracker</div>
        </div>
      </div>
      <div className="sidebar-nav">
        {NAV.map(({ id, label, icon }) => (
          <button
            key={id}
            className={clsx('nav-item', view === id && 'nav-active')}
            onClick={() => onChange(id)}
          >
            <span className="nav-icon">{Ic[icon]}</span>
            <span className="nav-label">{label}</span>
            {id === 'inbox' && inboxCount > 0 && (
              <span className="nav-badge">{inboxCount}</span>
            )}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-date">
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        <button className="nav-item nav-logout" onClick={onLogout}>
          <span className="nav-icon">{Ic.logout}</span>
          <span className="nav-label">Lock</span>
        </button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════

function Dashboard({ data, update, setView }) {
  const today = todayStr();
  const thisMonth = today.slice(0, 7);

  const todayBookings = useMemo(() =>
    data.bookings.filter(b => b.date === today && b.status !== 'cancelled')
      .sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [data.bookings, today]
  );

  const monthRevenue = useMemo(() =>
    data.revenues.filter(r => r.date?.startsWith(thisMonth)).reduce((s, r) => s + (r.amount || 0), 0),
    [data.revenues, thisMonth]
  );

  const openTasks = useMemo(() =>
    data.tasks.filter(t => t.status !== 'completed'),
    [data.tasks]
  );

  const overdueTasks = useMemo(() =>
    openTasks.filter(t => t.dueDate && t.dueDate < today),
    [openTasks, today]
  );

  const newInbox = useMemo(() =>
    [...data.contacts.filter(c => c.status === 'new'),
     ...data.bookings.filter(b => b.source === 'website' && b.status === 'pending')]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [data.contacts, data.bookings]
  );

  const upcomingTasks = useMemo(() =>
    openTasks
      .filter(t => !t.dueDate || t.dueDate >= today)
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }).slice(0, 5),
    [openTasks, today]
  );

  const inactiveClients = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 60);
    return data.clients.filter(c => {
      const last = data.bookings
        .filter(b => b.clientId === c.id && b.status === 'completed')
        .sort((a, b) => b.date?.localeCompare(a.date || '') || 0)[0];
      return last && new Date(last.date) < cutoff;
    });
  }, [data.clients, data.bookings]);

  const totalRevenue = useMemo(() =>
    data.revenues.reduce((s, r) => s + (r.amount || 0), 0),
    [data.revenues]
  );

  const completeTask = (id) => {
    update('tasks', data.tasks.map(t => t.id === id
      ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
      : t
    ));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setView('bookings')}>
            {Ic.plus} New Booking
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard icon={Ic.cal}     label="Today's Jobs"      value={todayBookings.length}   color="#3B82F6" onClick={() => setView('calendar')} />
        <StatCard icon={Ic.dollar}  label="Month Revenue"     value={fmtMoney(monthRevenue)} color="#10B981" onClick={() => setView('revenue')} />
        <StatCard icon={Ic.clip}    label="Open Tasks"        value={openTasks.length}       color="#F59E0B" onClick={() => setView('tasks')} />
        <StatCard icon={Ic.users}   label="Total Clients"     value={data.clients.length}    color="#A78BFA" onClick={() => setView('clients')} />
      </div>

      {/* Alerts */}
      {(overdueTasks.length > 0 || inactiveClients.length > 0) && (
        <div className="alerts-row">
          {overdueTasks.length > 0 && (
            <div className="alert-card alert-warning" onClick={() => setView('tasks')}>
              <span className="alert-icon">{Ic.alert}</span>
              <span>{overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''} — click to review</span>
            </div>
          )}
          {inactiveClients.length > 0 && (
            <div className="alert-card alert-info" onClick={() => setView('clients')}>
              <span className="alert-icon">{Ic.users}</span>
              <span>{inactiveClients.length} client{inactiveClients.length !== 1 ? 's' : ''} haven't booked in 60+ days</span>
            </div>
          )}
        </div>
      )}

      <div className="dash-grid">
        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h3>Today's Schedule</h3>
            <button className="link-btn" onClick={() => setView('calendar')}>View Calendar</button>
          </div>
          {todayBookings.length === 0 ? (
            <p className="card-empty">No jobs scheduled for today</p>
          ) : (
            <div className="schedule-list">
              {todayBookings.map(b => (
                <div key={b.id} className="schedule-item">
                  <div className="schedule-time">{fmtTime(b.time) || 'TBD'}</div>
                  <div className="schedule-info">
                    <div className="schedule-name">{b.clientName}</div>
                    <div className="schedule-service">{b.service}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Inbox Items */}
        <div className="card">
          <div className="card-header">
            <h3>New Inbox</h3>
            <button className="link-btn" onClick={() => setView('inbox')}>View All</button>
          </div>
          {newInbox.length === 0 ? (
            <p className="card-empty">No new submissions</p>
          ) : (
            <div className="inbox-preview-list">
              {newInbox.map(item => {
                const isContact = 'message' in item;
                return (
                  <div key={item.id} className="inbox-preview-item">
                    <span className={clsx('type-dot', isContact ? 'dot-contact' : 'dot-booking')} />
                    <div className="inbox-preview-info">
                      <div className="inbox-preview-name">{item.clientName || item.name}</div>
                      <div className="inbox-preview-meta">
                        {isContact ? item.message?.slice(0, 50) + '…' : item.service}
                      </div>
                    </div>
                    <div className="inbox-preview-date">{fmtDateShort(item.createdAt?.slice(0,10))}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="card-header">
            <h3>Upcoming Tasks</h3>
            <button className="link-btn" onClick={() => setView('tasks')}>View All</button>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="card-empty">No pending tasks</p>
          ) : (
            <div className="task-preview-list">
              {upcomingTasks.map(t => (
                <div key={t.id} className="task-preview-item">
                  <button
                    className="task-check-btn"
                    onClick={() => completeTask(t.id)}
                    title="Mark complete"
                  >
                    {Ic.check}
                  </button>
                  <div className="task-preview-info">
                    <div className="task-preview-title">{t.title}</div>
                    {t.dueDate && (
                      <div className={clsx('task-preview-due', t.dueDate < today && 'due-overdue')}>
                        Due {fmtDateShort(t.dueDate)}
                      </div>
                    )}
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Revenue Stats */}
        <div className="card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
            <button className="link-btn" onClick={() => setView('revenue')}>Full Report</button>
          </div>
          <div className="rev-mini-stats">
            <div className="rev-mini-item">
              <div className="rev-mini-label">This Month</div>
              <div className="rev-mini-value">{fmtMoney(monthRevenue)}</div>
            </div>
            <div className="rev-mini-item">
              <div className="rev-mini-label">All Time</div>
              <div className="rev-mini-value">{fmtMoney(totalRevenue)}</div>
            </div>
            <div className="rev-mini-item">
              <div className="rev-mini-label">Total Jobs</div>
              <div className="rev-mini-value">{data.bookings.filter(b => b.status === 'completed').length}</div>
            </div>
            <div className="rev-mini-item">
              <div className="rev-mini-label">Avg Job</div>
              <div className="rev-mini-value">
                {data.revenues.length
                  ? fmtMoney(totalRevenue / data.revenues.length)
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, onClick }) {
  return (
    <div className="stat-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="stat-icon" style={{ background: color + '22', color }}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// INBOX
// ═══════════════════════════════════════════════════════════

function InboxView({ data, update }) {
  const [filter, setFilter] = useState('new');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQ, setSearchQ] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(() => selectedId ? data.contacts.find(c => c.id === selectedId) || null : null, [selectedId, data.contacts]);
  // Processing form state
  const [dateOption, setDateOption] = useState('preferred');
  const [altDate, setAltDate] = useState('');
  const [altTime, setAltTime] = useState('');
  const [quotedPrices, setQuotedPrices] = useState({});
  const [unable, setUnable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ownerResponse, setOwnerResponse] = useState('');
  const [responseMode, setResponseMode] = useState('ai'); // 'ai' | 'custom'
  const finalResponse = responseMode === 'ai' ? (selected?.aiSuggestedResponse || '') : ownerResponse;

  const itemHasQuotes = (item) => {
    if (!item) return false;
    if (item._type === 'custom_request') return true;
    return (item.cartItems || []).some(s => s.isQuote);
  };

  const allItems = useMemo(() =>
    data.contacts
      .map(c => ({ ...c, _type: c._type || (c.subtype === 'custom_request' ? 'custom_request' : 'contact') }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [data.contacts]
  );

  const unprocessedCount = allItems.filter(i => !i.processedStatus && i._type !== 'contact').length
    + allItems.filter(i => i._type === 'contact' && i.status === 'new').length;

  const filtered = useMemo(() => {
    let items = allItems;
    if (filter === 'new') items = items.filter(i =>
      (i._type === 'contact' && i.status === 'new') ||
      (i._type !== 'contact' && !i.processedStatus)
    );
    else if (filter === 'contacts') items = items.filter(i => i._type === 'contact');
    else if (filter === 'bookings') items = items.filter(i => i._type === 'booking');
    else if (filter === 'quotes') items = items.filter(i => itemHasQuotes(i));
    else if (filter === 'requests') items = items.filter(i => i._type === 'custom_request');
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      items = items.filter(i =>
        (i.name || i.clientName || '').toLowerCase().includes(q) ||
        (i.email || i.clientEmail || '').toLowerCase().includes(q) ||
        (i.phone || i.clientPhone || '').replace(/\D/g,'').includes(q.replace(/\D/g,'')) ||
        (i.service_list || i.service || i.description || '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'oldest') return [...items].reverse();
    if (sortBy === 'name') return [...items].sort((a,b) => (a.name||a.clientName||'').localeCompare(b.name||b.clientName||''));
    return items;
  }, [allItems, filter, searchQ, sortBy]);

  const openItem = (item) => {
    setSelectedId(item.id);
    // Default date option: if preferred has availability signal, use it; else prefer 'preferred'
    const prefAvail = item.dateAvailability?.preferred;
    const backAvail = item.dateAvailability?.backup;
    if (prefAvail === 'available') setDateOption('preferred');
    else if (backAvail === 'available') setDateOption('backup');
    else if ((item.dateAvailability?.alternatives || []).length > 0) setDateOption('alt_0');
    else setDateOption('preferred');
    setAltDate('');
    setAltTime('');
    setQuotedPrices({});
    setUnable(false);
    setOwnerResponse('');
    setResponseMode('ai');
    // Mark contact-type items as read
    if (item._type === 'contact' && item.status === 'new') {
      update('contacts', data.contacts.map(c => c.id === item.id ? { ...c, status: 'read' } : c));
    }
  };

  const closeModal = () => setSelectedId(null);

  const ensureClient = (item) => {
    const email = item.email || item.clientEmail || '';
    const phone = item.phone || item.clientPhone || '';
    const existing = data.clients.find(c =>
      (email && c.email === email) || (phone && c.phone === phone)
    );
    if (existing) return { clientId: existing.id, newClients: data.clients };
    const nc = {
      id: genId(),
      name: item.name || item.clientName || '',
      email, phone,
      address: item.address || item.clientAddress || '',
      notes: '', tags: ['New'],
      createdAt: new Date().toISOString(),
    };
    return { clientId: nc.id, newClients: [...data.clients, nc] };
  };

  const processItem = async (action) => {
    if (!selected || submitting) return;
    setSubmitting(true);
    const item = selected;
    const isAlt = dateOption === 'alternative' || dateOption.startsWith('alt_');
    const isCustom = item._type === 'custom_request';
    const cartItems = item.cartItems || [];
    const altIdx = dateOption.startsWith('alt_') ? parseInt(dateOption.slice(4)) : -1;
    const altEntry = altIdx >= 0 ? (item.dateAvailability?.alternatives?.[altIdx] || null) : null;

    const scheduledDate = dateOption === 'preferred'
      ? (item.preferredDate || item.date || '')
      : dateOption === 'backup'
      ? (item.backupDate || item.backup_date || '')
      : altEntry ? altEntry.date
      : altDate;
    const scheduledTime = dateOption === 'preferred'
      ? (item.preferredTime || item.time || '')
      : dateOption === 'backup'
      ? (item.backupTime || item.backup_time || '')
      : altEntry ? altEntry.time
      : altTime;

    const fixedServices = cartItems.filter(s => !s.isQuote).map(s => ({
      name: s.serviceName,
      size: s.sizeLabel || null,
      price: s.fixedPrice || 0,
      powerWashAreas: s.powerWashAreas || null,
      isRecurring: s.isRecurring || false,
      recurringLabel: s.recurringLabel || null,
    }));
    const quotedServicesList = cartItems
      .map((s, i) => s.isQuote ? { name: s.serviceName, quotedPrice: parseFloat(quotedPrices[i]) || null } : null)
      .filter(Boolean);
    const totalFixed = fixedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    const totalQuoted = quotedServicesList.reduce((sum, s) => sum + (s.quotedPrice || 0), 0);
    const fullSubtotal = totalFixed + totalQuoted;

    // Recompute fees based on CONFIRMED date/time + full subtotal (fixed + quoted)
    const confirmedDateObj = scheduledDate ? new Date(`${scheduledDate}T12:00:00`) : null;
    const confirmedDow = confirmedDateObj ? confirmedDateObj.getDay() : -1;
    const confirmedIsWeekend = confirmedDow === 0 || confirmedDow === 6;
    const confirmedHour = parseInt((scheduledTime || '00:00').split(':')[0], 10);
    const confirmedIsAfter5pm = confirmedHour >= 17;
    const todayStr = new Date().toISOString().split('T')[0];
    const confirmedIsSameDay = scheduledDate === todayStr;
    const needsMaterials = (item.materials_needed || 'No') !== 'No';

    const computedFees = [];
    let feesTotal = 0;
    if (confirmedIsWeekend) {
      const amt = Math.round(fullSubtotal * 0.10 * 100) / 100;
      computedFees.push({ label: 'Weekend (10%)', amount: amt });
      feesTotal += amt;
    }
    if (confirmedIsAfter5pm) {
      const amt = Math.round(fullSubtotal * 0.20 * 100) / 100;
      computedFees.push({ label: 'After 5pm (20%)', amount: amt });
      feesTotal += amt;
    }
    if (confirmedIsSameDay) {
      const amt = Math.round(fullSubtotal * 0.30 * 100) / 100;
      computedFees.push({ label: 'Same-Day (30%)', amount: amt });
      feesTotal += amt;
    }
    if (needsMaterials) {
      computedFees.push({ label: 'Material Procurement', amount: 45 });
      feesTotal += 45;
    }

    // Recompute discounts on full subtotal
    let discountTotal = 0;
    if (cartItems.length >= 3) {
      discountTotal += Math.round(fullSubtotal * 0.10 * 100) / 100;
    }
    const referralRate = parseFloat(item.referral_discount_rate) || 0;
    if (referralRate > 0) {
      discountTotal += Math.round((fullSubtotal + feesTotal) * (referralRate / 100) * 100) / 100;
    }
    const finalTotal = Math.round((fullSubtotal + feesTotal - discountTotal) * 100) / 100;

    const isConfirmed = action === 'confirm' && !isAlt && !isCustom && !itemHasQuotes(item);
    const hasQuote = quotedServicesList.length > 0;

    let payloadType;
    if (action === 'decline') payloadType = 'declined';
    else if (isCustom) payloadType = 'custom_request';
    else payloadType = 'main';

    const payload = isCustom ? {
      type: payloadType,
      alternate_date: isAlt,
      quote: !!(parseFloat(quotedPrices[0])),
      submissionId: item.bookingId || item.webhookId || null,
      client: {
        name: item.name || item.clientName || '',
        email: item.email || item.clientEmail || '',
        phone: item.phone || item.clientPhone || '',
        address: item.address || item.clientAddress || '',
      },
      scheduling: {
        scheduledDate,
        scheduledTime,
        originalPreferredDate: item.preferredDate || item.date || '',
        originalPreferredTime: item.preferredTime || item.time || '',
        originalBackupDate: item.backupDate || item.backup_date || null,
        originalBackupTime: item.backupTime || item.backup_time || null,
        alternativeDates: dateOption.startsWith('alt_') ? (item.dateAvailability?.alternatives || []) : [],
      },
      description: item.description || '',
      materialsNeeded: item.materialsNeeded || '',
      notes: item.otherNotes || item.notes || item.extra_notes || '',
      quotedPrice: parseFloat(quotedPrices[0]) || null,
      paymentMethod: item.paymentMethod || '',
      submittedAt: item.createdAt,
      processedAt: new Date().toISOString(),
    } : {
      type: payloadType,
      alternate_date: isAlt,
      quote: hasQuote,
      submissionId: item.bookingId || item.webhookId || null,
      client: {
        name: item.name || item.clientName || '',
        email: item.email || item.clientEmail || '',
        phone: item.phone || item.clientPhone || '',
        address: item.address || item.clientAddress || '',
      },
      scheduling: {
        scheduledDate,
        scheduledTime,
        originalPreferredDate: item.preferredDate || item.date || '',
        originalPreferredTime: item.preferredTime || item.time || '',
        originalBackupDate: item.backupDate || item.backup_date || null,
        originalBackupTime: item.backupTime || item.backup_time || null,
        alternativeDates: dateOption.startsWith('alt_') ? (item.dateAvailability?.alternatives || []) : [],
      },
      services: {
        fixedServices,
        quotedServices: quotedServicesList,
        totalFixed,
        totalQuoted,
        totalCombined: finalTotal,
        fees: feesTotal,
        feeBreakdown: computedFees,
        discount: discountTotal,
        paymentMethod: item.paymentMethod || item.payment_method || 'Cash',
        materialsNeeded: item.materials_needed || 'No',
      },
      notes: item.notes || item.extra_notes || '',
      submittedAt: item.createdAt,
      processedAt: new Date().toISOString(),
    };

    try {
      await fetch(`${import.meta.env.BASE_URL}api/forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) { console.warn('Forward to n8n failed:', err); }

    if (isConfirmed) {
      const { clientId, newClients } = ensureClient(item);
      const svcName = cartItems.length > 0
        ? cartItems.map(s => s.serviceName).join(', ')
        : (item.service_list || item.service || '');
      const newBooking = {
        id: genId(), webhookId: item.webhookId, bookingId: item.bookingId || null, clientId,
        clientName: item.name || item.clientName || '',
        clientEmail: item.email || item.clientEmail || '',
        clientPhone: item.phone || item.clientPhone || '',
        clientAddress: item.address || item.clientAddress || '',
        service: svcName, date: scheduledDate, time: scheduledTime,
        price: finalTotal, status: 'confirmed', source: 'website',
        paymentMethod: item.payment_method || item.paymentMethod || 'Cash',
        notes: item.notes || item.extra_notes || '',
        isPaid: false, createdAt: new Date().toISOString(),
      };
      update('bookings', [...data.bookings, newBooking]);
      update('clients', newClients);
      update('contacts', data.contacts.filter(c => c.id !== item.id));
    } else if (action === 'decline') {
      update('contacts', data.contacts.filter(c => c.id !== item.id));
    } else {
      const ps = isAlt ? 'alternative_date' : 'quote_submitted';
      update('contacts', data.contacts.map(c =>
        c.id === item.id
          ? { ...c, processedStatus: ps, savedQuotedPrices: quotedPrices, scheduledDate, scheduledTime }
          : c
      ));

      // Create a pending booking so it appears in the Bookings > Pending tab
      const { clientId, newClients } = ensureClient(item);
      const svcName = cartItems.length > 0
        ? cartItems.map(s => s.serviceName).join(', ')
        : (item.service_list || item.service || '');
      const pendingBooking = {
        id: genId(), webhookId: item.webhookId, bookingId: item.bookingId || null, clientId,
        clientName: item.name || item.clientName || '',
        clientEmail: item.email || item.clientEmail || '',
        clientPhone: item.phone || item.clientPhone || '',
        clientAddress: item.address || item.clientAddress || '',
        service: svcName, date: scheduledDate, time: scheduledTime,
        price: finalTotal, status: 'pending', source: 'website',
        paymentMethod: item.payment_method || item.paymentMethod || 'Cash',
        notes: item.notes || item.extra_notes || '',
        isPaid: false, createdAt: new Date().toISOString(),
        inboxContactId: item.id,
      };
      update('bookings', [...data.bookings, pendingBooking]);
      update('clients', newClients);
    }
    setSubmitting(false);
    setSelectedId(null);
  };

  const archiveItem = (item) => {
    update('contacts', data.contacts.filter(c => c.id !== item.id));
    setSelectedId(null);
  };

  const FILTERS = [
    { id: 'new',      label: 'New'             },
    { id: 'all',      label: 'All'             },
    { id: 'bookings', label: 'Bookings'        },
    { id: 'quotes',   label: 'Quotes'          },
    { id: 'contacts', label: 'Contacts'        },
    { id: 'requests', label: 'Custom Requests' },
  ];

  const availBadge = (status) => {
    if (!status) return null;
    const isAvail = status === 'available';
    return (
      <span className={isAvail ? 'avail-badge avail-yes' : 'avail-badge avail-no'}>
        {isAvail ? '✓ Available' : '✗ Unavailable'}
      </span>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inbox</h1>
          <p className="page-sub">Incoming submissions from your website</p>
        </div>
      </div>

      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button key={f.id} className={clsx('filter-tab', filter === f.id && 'filter-active')} onClick={() => setFilter(f.id)}>
            {f.label}
            {f.id === 'new' && unprocessedCount > 0 && <span className="tab-count">{unprocessedCount}</span>}
          </button>
        ))}
      </div>

      <div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px', flexWrap:'wrap'}}>
        <input
          type="text"
          placeholder="Search name, email, phone, service…"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          style={{flex:'1', minWidth:'180px', padding:'8px 12px', background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:'8px', color:'var(--text1)', fontSize:'13px'}}
        />
        <div style={{display:'flex', gap:'4px'}}>
          {[['newest','Newest'],['oldest','Oldest'],['name','A–Z']].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val)} style={{padding:'7px 11px', borderRadius:'6px', border:'1.5px solid var(--border)', background: sortBy === val ? 'var(--accent)' : 'transparent', color: sortBy === val ? '#fff' : 'var(--text3)', fontSize:'12px', fontWeight:600, cursor:'pointer'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Ic.inbox} text="No items here" sub="New bookings and contact forms from your website will appear here." />
      ) : (
        <div className="inbox-list">
          {filtered.map(item => {
            const isNew = (item._type === 'contact' && item.status === 'new') || (item._type !== 'contact' && !item.processedStatus);
            const hasAvail = item.dateAvailability?.preferred || item.dateAvailability?.backup;
            return (
              <div key={item.id} className={clsx('inbox-item', isNew && 'inbox-item-new')} onClick={() => openItem(item)}>
                <div className="inbox-item-left">
                  <span className={clsx('type-badge', item._type === 'custom_request' ? 'type-request' : item._type === 'contact' ? 'type-contact' : 'type-booking')}>
                    {item._type === 'custom_request' ? 'Custom' : item._type === 'contact' ? 'Contact' : itemHasQuotes(item) ? 'Quote' : 'Booking'}
                  </span>
                  {isNew && <span className="new-dot" />}
                </div>
                <div className="inbox-item-body">
                  <div className="inbox-item-name">{item.name || item.clientName}</div>
                  <div className="inbox-item-preview">
                    {item._type === 'custom_request'
                      ? (item.description?.slice(0, 80) || 'Custom service request')
                      : item._type === 'contact'
                      ? (item.message?.slice(0, 80) || '')
                      : (item.service_list || item.service || 'Service request')}
                  </div>
                  {(item.preferredDate || item.date) && (
                    <div style={{fontSize:'12px', color:'var(--text3)', marginTop:'3px'}}>
                      📅 {fmtDate(item.preferredDate || item.date)}{(item.preferredTime || item.time) ? ` at ${fmtTime(item.preferredTime || item.time)}` : ''}
                    </div>
                  )}
                  <div className="inbox-item-tags">
                    {item.processedStatus === 'quote_submitted' && <span className="proc-badge proc-quote">Price Submitted</span>}
                    {item.processedStatus === 'alternative_date' && <span className="proc-badge proc-alt">Alt. Date Suggested</span>}
                    {item.customerConfirmed && <span className="proc-badge" style={{background:'rgba(16,185,129,.12)',color:'#059669'}}>✓ Customer Confirmed</span>}
                    {(item.dateAvailability?.alternatives || []).length > 0 && <span className="proc-badge" style={{background:'rgba(16,185,129,.1)',color:'#10B981'}}>3 Dates Available</span>}
                    {hasAvail && !((item.dateAvailability?.alternatives || []).length > 0) && (
                      <>
                        {item.dateAvailability?.preferred && availBadge(item.dateAvailability.preferred)}
                        {item.dateAvailability?.backup && availBadge(item.dateAvailability.backup)}
                      </>
                    )}
                  </div>
                </div>
                <div className="inbox-item-right">
                  <div className="inbox-item-date">{fmtDateShort(item.createdAt?.slice(0,10))}</div>
                  {item._type === 'booking' || item._type === 'custom_request'
                    ? <Badge label={item.processedStatus || 'pending'} color={item.processedStatus ? '#10B981' : '#3B82F6'} />
                    : <Badge label={item.status || 'new'} color={item.status === 'new' ? '#3B82F6' : '#64748B'} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <Modal
          title={selected._type === 'custom_request' ? 'Custom Service Request' : selected._type === 'contact' ? 'Contact Submission' : 'Booking Request'}
          onClose={closeModal}
          size="lg"
        >
          {/* ── Client info table ── */}
          {(() => {
            const S = { lbl: {width:'90px', paddingBottom:'10px', paddingRight:'16px', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--text3)', verticalAlign:'top', whiteSpace:'nowrap'}, val: {paddingBottom:'10px', fontSize:'14px', color:'var(--text1)', wordBreak:'break-word'} };
            const rows = [
              ['Name', selected.name || selected.clientName],
              ['Email', selected.email || selected.clientEmail],
              ['Phone', selected.phone || selected.clientPhone],
              ['Address', selected.address || selected.clientAddress],
              ['Received', fmtDate(selected.createdAt?.slice(0,10))],
              ...(selected.bookingId ? [['Submission ID', selected.bookingId]] : []),
              ...(selected.customerConfirmed ? [['Customer Confirmed', `✓ ${selected.customerConfirmedAt ? new Date(selected.customerConfirmedAt).toLocaleString() : 'Yes'}`]] : []),
              ...((selected.notes || selected.extra_notes) ? [['Notes', selected.notes || selected.extra_notes]] : []),
              ...(selected.referralCode ? [['Ref Code', selected.referralCode]] : []),
              ...(selected.usedReferralCode ? [['Used Code', selected.usedReferralCode + ' (10% discount applied)']] : []),
              ...(selected.referralCode ? [['Referrals', `${selected.referralCount || 0} completed · ${selected.referralCreditsEarned || 0} credit(s) earned`]] : []),
            ];
            return (
              <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
                <tbody>
                  {rows.map(([lbl, val]) => (
                    <tr key={lbl}><td style={S.lbl}>{lbl}</td><td style={S.val}>{val || '—'}</td></tr>
                  ))}
                </tbody>
              </table>
            );
          })()}

          {/* ── Contact message ── */}
          {selected._type === 'contact' && (
            <div style={{marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'10px'}}>Message</div>
              <p style={{color:'var(--text2)', lineHeight:1.6, margin:0}}>{selected.message || '—'}</p>
            </div>
          )}

          {/* ── AI Suggested Response ── */}
          {/* ── Response section (contact + custom request) ── */}
          {(selected._type === 'contact' || selected._type === 'custom_request') && selected.processedStatus !== 'replied' && (
            <div style={{marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'10px'}}>Reply</div>

              {/* Mode toggle */}
              <div style={{display:'flex', gap:'8px', marginBottom:'14px'}}>
                <button
                  type="button"
                  onClick={() => { setResponseMode('ai'); setOwnerResponse(selected.aiSuggestedResponse || ''); }}
                  style={{flex:1, padding:'8px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer', transition:'all .15s',
                    border: responseMode === 'ai' ? '2px solid #6366F1' : '2px solid var(--border)',
                    background: responseMode === 'ai' ? 'rgba(99,102,241,.1)' : 'var(--bg2)',
                    color: responseMode === 'ai' ? '#6366F1' : 'var(--text3)'}}
                >
                  ✦ Use AI Response
                </button>
                <button
                  type="button"
                  onClick={() => { setResponseMode('custom'); setOwnerResponse(''); }}
                  style={{flex:1, padding:'8px 12px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer', transition:'all .15s',
                    border: responseMode === 'custom' ? '2px solid #6366F1' : '2px solid var(--border)',
                    background: responseMode === 'custom' ? 'rgba(99,102,241,.1)' : 'var(--bg2)',
                    color: responseMode === 'custom' ? '#6366F1' : 'var(--text3)'}}
                >
                  ✏ Write My Own
                </button>
              </div>

              {/* AI mode */}
              {responseMode === 'ai' && (
                selected.aiSuggestedResponse ? (
                  <div style={{background:'rgba(99,102,241,.06)', border:'1.5px solid rgba(99,102,241,.2)', borderRadius:'10px', padding:'14px 16px'}}>
                    <p style={{color:'var(--text1)', lineHeight:1.7, margin:0, fontSize:'14px', whiteSpace:'pre-wrap'}}>{selected.aiSuggestedResponse}</p>
                  </div>
                ) : (
                  <div style={{color:'var(--text3)', fontSize:'13px', fontStyle:'italic', padding:'10px 0'}}>AI response is still generating — check back in a moment.</div>
                )
              )}

              {/* Custom mode */}
              {responseMode === 'custom' && (
                <textarea
                  rows={6}
                  value={ownerResponse}
                  onChange={e => setOwnerResponse(e.target.value)}
                  placeholder="Type your response to the customer..."
                  style={{width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1.5px solid var(--border)', background:'var(--bg2)', color:'var(--text1)', fontSize:'14px', lineHeight:1.6, resize:'vertical', fontFamily:'inherit', boxSizing:'border-box'}}
                />
              )}
            </div>
          )}

          {selected._type === 'contact' && selected.processedStatus === 'replied' && (
            <div style={{marginBottom:'20px', padding:'12px 16px', background:'rgba(16,185,129,.08)', border:'1.5px solid rgba(16,185,129,.3)', borderRadius:'8px'}}>
              <div style={{fontSize:'13px', color:'#10B981', fontWeight:600}}>✓ Response sent</div>
            </div>
          )}

          {/* ── Custom request description ── */}
          {selected._type === 'custom_request' && (
            <div style={{marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'10px'}}>Request Description</div>
              <p style={{color:'var(--text2)', lineHeight:1.6, margin:0}}>{selected.description || '—'}</p>
              {selected.materialsNeeded && <p style={{color:'var(--text3)', fontSize:13, marginTop:8, marginBottom:0}}>Materials: {selected.materialsNeeded}</p>}
              {selected.otherNotes && <p style={{color:'var(--text3)', fontSize:13, marginTop:4, marginBottom:0}}>Notes: {selected.otherNotes}</p>}
            </div>
          )}

          {/* ── Booking services + quote inputs ── */}
          {selected._type === 'booking' && (
            <div style={{marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'10px'}}>Services</div>
              <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                {(selected.cartItems?.length > 0 ? selected.cartItems : [{serviceName: selected.service_list || selected.service || 'Services requested', isQuote: selected.has_quoted_services, fixedPrice: null, sizeLabel: null, isRecurring: false, powerWashAreas: [], _fallback: true}]).map((svc, i) => (
                  <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', padding:'10px 14px', background: svc.isQuote ? 'rgba(59,130,246,.07)' : 'var(--bg3)', border: `1px solid ${svc.isQuote ? '#3B82F6' : 'var(--border)'}`, borderRadius:'8px'}}>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:'13px', fontWeight:600, color:'var(--text1)'}}>{svc.serviceName}</div>
                      {svc.sizeLabel && <div style={{fontSize:'11px', color:'var(--text3)'}}>{svc.sizeLabel}</div>}
                      {svc.isRecurring && <div style={{fontSize:'11px', color:'var(--text3)'}}>{svc.recurringLabel}</div>}
                      {svc.powerWashAreas?.length > 0 && <div style={{fontSize:'11px', color:'var(--text3)'}}>Areas: {svc.powerWashAreas.join(', ')}</div>}
                      {svc.serviceDetails && (() => {
                        const d = svc.serviceDetails;
                        const lines = [];
                        if (d.area) lines.push(d.area);
                        if (d.areas?.length) lines.push('Where: ' + d.areas.join(', '));
                        if (d.size) lines.push('Size: ' + d.size);
                        if (d.mulchType) lines.push('Mulch: ' + d.mulchType);
                        if (d.stories) lines.push(d.stories);
                        if (d.downspout) lines.push('Downspout clearing included');
                        if (d.condition) lines.push('Condition: ' + d.condition);
                        if (d.windowCount) lines.push(d.windowCount);
                        if (d.loadSize) lines.push(d.loadSize);
                        if (d.description) lines.push(d.description);
                        if (d.installType) lines.push(d.installType);
                        if (d.bedCount) lines.push(d.bedCount);
                        if (d.addons?.length) lines.push('Add-ons: ' + d.addons.join(', '));
                        if (d.furnitureItems?.length) lines.push(d.furnitureItems.map(f => `${f.qty}x ${f.type}`).join(', '));
                        if (d.otherDesc) lines.push(d.otherDesc);
                        if (d.orgAreas?.length) lines.push('Areas: ' + d.orgAreas.map(a => a.qty ? `${a.type} (×${a.qty})` : a.type).join(', '));
                        if (d.orgType?.length) lines.push('Org type: ' + (Array.isArray(d.orgType) ? d.orgType.join(', ') : d.orgType));
                        if (d.glowupServices?.length) lines.push('Services: ' + d.glowupServices.join(', '));
                        if (d.glowupPWAreas?.length) lines.push('PW Areas: ' + d.glowupPWAreas.join(', '));
                        if (d.ojServices?.length) lines.push('Services: ' + d.ojServices.join(', '));
                        if (d.movingSize) lines.push('Moving: ' + d.movingSize);
                        if (d.movingDesc) lines.push(d.movingDesc);
                        if (d.junkSize) lines.push('Junk: ' + d.junkSize);
                        if (d.junkDesc) lines.push(d.junkDesc);
                        if (d.other) lines.push(d.other);
                        if (!lines.length) return null;
                        return lines.map((line, idx) => <div key={idx} style={{fontSize:'11px', color:'var(--text3)', marginTop:2}}>{line}</div>);
                      })()}
                      {svc.isQuote && <div style={{display:'inline-block', marginTop:4, fontSize:'10px', fontWeight:700, color:'#3B82F6', background:'rgba(59,130,246,.15)', padding:'2px 7px', borderRadius:'10px'}}>Needs Quote</div>}
                    </div>
                    <div style={{flexShrink:0}}>
                      {svc.isQuote ? (
                        <input
                          type="number"
                          placeholder="$ Enter quote"
                          value={quotedPrices[svc._fallback ? 0 : i] || ''}
                          onChange={e => setQuotedPrices(p => ({ ...p, [svc._fallback ? 0 : i]: e.target.value }))}
                          style={{padding:'8px 12px', background:'var(--bg2)', border:'1.5px solid #3B82F6', borderRadius:'8px', color:'var(--text1)', fontSize:'14px', width:'140px'}}
                        />
                      ) : (
                        <span style={{fontSize:'14px', fontWeight:700, color:'var(--success)'}}>{fmtMoneyFull(svc.fixedPrice)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {selected.cartItems?.length > 0 && (() => {
                const totalFixed = selected.cartItems.reduce((sum, s) => sum + (!s.isQuote ? (s.fixedPrice || 0) : 0), 0);
                const totalQuoted = selected.cartItems.reduce((sum, s, i) => sum + (s.isQuote ? (parseFloat(quotedPrices[i]) || 0) : 0), 0);
                const hasQuotes = selected.cartItems.some(s => s.isQuote);
                if (!totalFixed && !hasQuotes) return null;
                return (
                  <div style={{marginTop:'10px', paddingTop:'10px', borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'4px'}}>
                    {totalFixed > 0 && <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:'var(--text2)'}}><span>Fixed Total</span><span>{fmtMoneyFull(totalFixed)}</span></div>}
                    {hasQuotes && <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:600, color:'#3B82F6'}}><span>Quoted Total</span><span>{totalQuoted > 0 ? fmtMoneyFull(totalQuoted) : 'TBD'}</span></div>}
                    {totalFixed > 0 && hasQuotes && totalQuoted > 0 && <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', fontWeight:700, color:'var(--text1)'}}><span>Combined Total</span><span>{fmtMoneyFull(totalFixed + totalQuoted)}</span></div>}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── Custom request: quote or unable ── */}
          {selected._type === 'custom_request' && (
            <div style={{marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
              {unable ? (
                <div style={{background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#EF4444', borderRadius:'8px', padding:'12px 14px', fontSize:'14px'}}>
                  Marking as unable to accommodate — a decline notice will be sent.
                </div>
              ) : (
                <>
                  <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'10px'}}>Your Quoted Price</div>
                  <input
                    type="number"
                    placeholder="$ Enter quote for this job"
                    value={quotedPrices[0] || ''}
                    onChange={e => setQuotedPrices({ 0: e.target.value })}
                    style={{padding:'10px 14px', background:'var(--bg2)', border:'1.5px solid #3B82F6', borderRadius:'8px', color:'var(--text1)', fontSize:'16px', width:'220px'}}
                  />
                </>
              )}
            </div>
          )}

          {/* ── Date selection ── */}
          {selected._type !== 'contact' && (
            <div style={{marginBottom:'20px'}}>
              <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--text3)', marginBottom:'10px'}}>Select Date to Send Customer</div>
              <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                {/* Customer-requested dates */}
                {[
                  ...(selected.preferredDate || selected.date ? [{key:'preferred', label:'Customer Preferred', date: fmtDate(selected.preferredDate || selected.date), time: fmtTime(selected.preferredTime || selected.time), avail: selected.dateAvailability?.preferred}] : []),
                  ...(selected.backupDate || selected.backup_date ? [{key:'backup', label:'Customer Backup', date: fmtDate(selected.backupDate || selected.backup_date), time: fmtTime(selected.backupTime || selected.backup_time), avail: selected.dateAvailability?.backup}] : []),
                ].map(opt => {
                  const active = dateOption === opt.key;
                  return (
                    <div key={opt.key} onClick={() => setDateOption(opt.key)} style={{padding:'12px 14px', background: active ? 'rgba(59,130,246,.07)' : 'var(--bg3)', border:`1.5px solid ${active ? '#3B82F6' : 'var(--border)'}`, borderRadius:'10px', cursor:'pointer'}}>
                      <div style={{marginBottom:'4px'}}>
                        <input type="radio" name="dopt" value={opt.key} checked={active} onChange={() => setDateOption(opt.key)} onClick={e => e.stopPropagation()} style={{marginRight:'8px', verticalAlign:'middle', accentColor:'#3B82F6'}} />
                        <span style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color: active ? '#3B82F6' : 'var(--text3)', verticalAlign:'middle'}}>{opt.label}</span>
                        {(opt.avail || (selected.dateAvailability?.alternatives || []).length > 0) && <span style={{verticalAlign:'middle', marginLeft:'8px'}}>{availBadge(opt.avail || 'unavailable')}</span>}
                      </div>
                      <div style={{fontSize:'14px', fontWeight:600, color:'var(--text1)', paddingLeft:'22px'}}>{opt.date} {opt.time}</div>
                    </div>
                  );
                })}

                {/* n8n AI-suggested alternatives */}
                {(selected.dateAvailability?.alternatives || []).length > 0 && (
                  <>
                    <div style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#10B981', marginTop:'4px', paddingLeft:'2px'}}>AI-Suggested Available Dates</div>
                    {selected.dateAvailability.alternatives.map((alt, i) => {
                      const key = `alt_${i}`;
                      const active = dateOption === key;
                      return (
                        <div key={key} onClick={() => setDateOption(key)} style={{padding:'12px 14px', background: active ? 'rgba(16,185,129,.07)' : 'var(--bg3)', border:`1.5px solid ${active ? '#10B981' : 'var(--border)'}`, borderRadius:'10px', cursor:'pointer'}}>
                          <div style={{marginBottom:'4px'}}>
                            <input type="radio" name="dopt" value={key} checked={active} onChange={() => setDateOption(key)} onClick={e => e.stopPropagation()} style={{marginRight:'8px', verticalAlign:'middle', accentColor:'#10B981'}} />
                            <span style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color: active ? '#10B981' : 'var(--text3)', verticalAlign:'middle'}}>Option {i + 1}</span>
                            <span style={{verticalAlign:'middle', marginLeft:'8px'}}><span className="avail-badge avail-yes">✓ Available</span></span>
                          </div>
                          <div style={{fontSize:'14px', fontWeight:600, color:'var(--text1)', paddingLeft:'22px'}}>{alt.label || `${fmtDate(alt.date)} at ${fmtTime(alt.time)}`}</div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Manual date entry */}
                {(() => {
                  const active = dateOption === 'alternative';
                  return (
                    <div onClick={() => setDateOption('alternative')} style={{padding:'12px 14px', background: active ? 'rgba(59,130,246,.07)' : 'var(--bg3)', border:`1.5px solid ${active ? '#3B82F6' : 'var(--border)'}`, borderRadius:'10px', cursor:'pointer'}}>
                      <div>
                        <input type="radio" name="dopt" value="alternative" checked={active} onChange={() => setDateOption('alternative')} onClick={e => e.stopPropagation()} style={{marginRight:'8px', verticalAlign:'middle', accentColor:'#3B82F6'}} />
                        <span style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color: active ? '#3B82F6' : 'var(--text3)', verticalAlign:'middle'}}>Enter Different Date</span>
                      </div>
                      {active && (
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', gap:'8px', flexWrap:'wrap', marginTop:'8px', paddingLeft:'22px'}}>
                          <input type="date" value={altDate} onChange={e => setAltDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{padding:'7px 10px', background:'var(--bg2)', border:'1.5px solid var(--border2)', borderRadius:'8px', color:'var(--text1)', fontSize:'13px'}} />
                          <select value={altTime} onChange={e => setAltTime(e.target.value)} style={{padding:'7px 10px', background:'var(--bg2)', border:'1.5px solid var(--border2)', borderRadius:'8px', color:'var(--text1)', fontSize:'13px'}}>
                            <option value="">Select time</option>
                            {['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'].map(t => (
                              <option key={t} value={t}>{fmtTime(t)}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="modal-footer">
            <button className="btn btn-ghost btn-danger-ghost" onClick={() => archiveItem(selected)}>{Ic.trash} Remove</button>
            {selected.usedReferralCode && selected.processedStatus !== 'referral_complete' && (
              <button
                className="btn btn-ghost"
                style={{color:'#F59E0B', borderColor:'#F59E0B'}}
                onClick={async () => {
                  try {
                    await fetch('https://doitallbros.com/api/referral-complete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ bookingId: selected.bookingId }),
                    });
                    update('contacts', data.contacts.map(c => c.id === selected.id ? { ...c, processedStatus: 'referral_complete' } : c));
                  } catch (e) {
                    console.error('Referral complete error:', e);
                  }
                }}
              >
                ⭐ Mark Referral Complete
              </button>
            )}
            {selected.usedReferralCode && selected.processedStatus === 'referral_complete' && (
              <span style={{fontSize:'12px', color:'#10B981', fontWeight:600}}>✓ Referral credited</span>
            )}

            {selected._type === 'contact' ? (
              selected.processedStatus === 'replied' ? (
                <button className="btn btn-ghost" onClick={closeModal}>Close</button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={submitting || !finalResponse.trim()}
                  onClick={async () => {
                    setSubmitting(true);
                    try {
                      await fetch(`${import.meta.env.BASE_URL}api/contact-reply`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contactId: selected.contactId,
                          clientName: selected.name || '',
                          clientEmail: selected.email || '',
                          clientPhone: selected.phone || '',
                          message: selected.message || '',
                          ownerResponse: finalResponse,
                        }),
                      });
                      update('contacts', data.contacts.map(c => c.id === selected.id ? { ...c, processedStatus: 'replied', status: 'read' } : c));
                      closeModal();
                    } catch (e) { console.error('Send reply error:', e); }
                    setSubmitting(false);
                  }}
                >
                  {submitting ? 'Sending…' : 'Send Response'}
                </button>
              )
            ) : selected._type === 'custom_request' ? (
              <>
                <button className="btn btn-ghost" disabled={submitting} onClick={() => setUnable(u => !u)}>
                  {unable ? '↩ Back to Quote' : '✗ Unable to Accommodate'}
                </button>
                {finalResponse.trim() && (
                  <button
                    className="btn btn-ghost"
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true);
                      try {
                        await fetch(`${import.meta.env.BASE_URL}api/contact-reply`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            contactId: selected.contactId,
                            clientName: selected.name || '',
                            clientEmail: selected.email || '',
                            clientPhone: selected.phone || '',
                            message: selected.description || '',
                            ownerResponse: finalResponse,
                          }),
                        });
                        update('contacts', data.contacts.map(c => c.id === selected.id ? { ...c, processedStatus: 'replied', status: 'read' } : c));
                        closeModal();
                      } catch (e) { console.error('Send reply error:', e); }
                      setSubmitting(false);
                    }}
                    style={{color:'#6366F1', borderColor:'#6366F1'}}
                  >
                    Send Response
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  disabled={submitting || (!unable && dateOption === 'alternative' && (!altDate || !altTime))}
                  onClick={() => processItem(unable ? 'decline' : 'confirm')}
                >
                  {submitting ? 'Sending…' : unable ? 'Send Decline' : dateOption === 'alternative' ? 'Submit Quote & Suggest Date' : 'Submit Quote'}
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                disabled={submitting || (dateOption === 'alternative' && (!altDate || !altTime))}
                onClick={() => processItem('confirm')}
              >
                {submitting
                  ? 'Sending…'
                  : itemHasQuotes(selected)
                    ? dateOption === 'alternative' ? 'Submit Quote & Suggest Date' : 'Submit Quote & Confirm Date'
                    : dateOption === 'alternative' ? 'Submit & Suggest Date' : 'Submit Info'}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════════════════════

const BLANK_CLIENT = { name: '', email: '', phone: '', address: '', notes: '', tags: ['New'] };

function ClientsView({ data, update }) {
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_CLIENT);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const clientRevenue = (id) =>
    data.revenues.filter(r => r.clientId === id).reduce((s, r) => s + (r.amount || 0), 0);

  const clientBookings = (id) =>
    data.bookings.filter(b => b.clientId === id).sort((a, b) => b.date?.localeCompare(a.date || '') || 0);

  const lastService = (id) => clientBookings(id)[0]?.date;

  const filtered = useMemo(() => {
    return data.clients.filter(c => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchTag = tagFilter === 'All' || (c.tags || []).includes(tagFilter);
      return matchSearch && matchTag;
    });
  }, [data.clients, search, tagFilter]);

  const openAdd = () => { setForm(BLANK_CLIENT); setEditing(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditing(c.id); setShowForm(true); };

  const saveClient = () => {
    if (!form.name.trim()) return;
    if (editing) {
      update('clients', data.clients.map(c => c.id === editing ? { ...c, ...form } : c));
    } else {
      update('clients', [...data.clients, { ...form, id: genId(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setSelected(null);
  };

  const deleteClient = (id) => {
    update('clients', data.clients.filter(c => c.id !== id));
    setSelected(null);
    setConfirm(null);
  };

  const toggleTag = (tag) => {
    const tags = form.tags || [];
    setForm({ ...form, tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag] });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-sub">{data.clients.length} total clients</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{Ic.plus} Add Client</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">{Ic.search}</span>
          <input
            placeholder="Search clients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['All', ...CLIENT_TAGS].map(t => (
            <button
              key={t}
              className={clsx('filter-tab', tagFilter === t && 'filter-active')}
              onClick={() => setTagFilter(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Ic.users} text="No clients found" action={openAdd} actionLabel="Add First Client" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Tags</th>
                <th>Revenue</th>
                <th>Last Service</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="table-row" onClick={() => setSelected(c)}>
                  <td className="td-name">{c.name}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>
                    <div className="tag-row">
                      {(c.tags || []).map(t => (
                        <span key={t} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td>{fmtMoney(clientRevenue(c.id))}</td>
                  <td>{fmtDateShort(lastService(c.id))}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="icon-btn" onClick={() => openEdit(c)}>{Ic.edit}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Client Detail Panel */}
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)} size="lg">
          <div className="client-detail">
            <div className="client-detail-top">
              <div className="client-avatar">{selected.name[0]?.toUpperCase()}</div>
              <div className="client-meta">
                <div className="client-tags">
                  {(selected.tags || []).map(t => <span key={t} className="tag-chip">{t}</span>)}
                </div>
                <div className="client-contact-row">{Ic.phone} {selected.phone || '—'}</div>
                <div className="client-contact-row">{Ic.mail} {selected.email || '—'}</div>
                {selected.address && <div className="client-contact-row">{Ic.globe} {selected.address}</div>}
              </div>
              <div className="client-stats">
                <div className="client-stat">
                  <div className="client-stat-val">{fmtMoney(clientRevenue(selected.id))}</div>
                  <div className="client-stat-lbl">Total Revenue</div>
                </div>
                <div className="client-stat">
                  <div className="client-stat-val">{clientBookings(selected.id).length}</div>
                  <div className="client-stat-lbl">Bookings</div>
                </div>
              </div>
            </div>

            {selected.notes && (
              <div className="client-notes">
                <strong>Notes:</strong>
                <p>{selected.notes}</p>
              </div>
            )}

            <h4 className="section-title">Service History</h4>
            {clientBookings(selected.id).length === 0 ? (
              <p className="card-empty">No bookings yet</p>
            ) : (
              <div className="history-list">
                {clientBookings(selected.id).map(b => (
                  <div key={b.id} className="history-item">
                    <div>
                      <div className="history-name">{b.service || 'Service'}</div>
                      <div className="history-date">{fmtDate(b.date)}</div>
                    </div>
                    <div className="history-right">
                      <StatusBadge status={b.status} />
                      {b.price > 0 && <span className="history-price">{fmtMoney(b.price)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost btn-danger-ghost" onClick={() => setConfirm(selected.id)}>
              {Ic.trash} Delete
            </button>
            <button className="btn btn-secondary" onClick={() => { setSelected(null); openEdit(selected); }}>
              {Ic.edit} Edit
            </button>
          </div>
        </Modal>
      )}

      {/* Add/Edit Client Form */}
      {showForm && (
        <Modal title={editing ? 'Edit Client' : 'New Client'} onClose={() => setShowForm(false)} size="md">
          <div className="form-grid">
            <FormRow label="Name" required>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </FormRow>
            <FormRow label="Phone">
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(502) 000-0000" />
            </FormRow>
            <FormRow label="Email">
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </FormRow>
            <FormRow label="Address">
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street address" />
            </FormRow>
            <FormRow label="Tags">
              <div className="tag-toggle-row">
                {CLIENT_TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={clsx('tag-toggle', (form.tags || []).includes(t) && 'tag-toggle-on')}
                    onClick={() => toggleTag(t)}
                  >{t}</button>
                ))}
              </div>
            </FormRow>
            <FormRow label="Notes">
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Internal notes about this client…"
                rows={3}
              />
            </FormRow>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveClient}>Save Client</button>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message="Delete this client? Their booking history will be kept."
          onConfirm={() => deleteClient(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════

const BLANK_BOOKING = {
  clientId: '', clientName: '', clientEmail: '', clientPhone: '', clientAddress: '',
  service: '', category: '', date: '', time: '', price: '', notes: '',
  status: 'pending', source: 'manual', isPaid: false, paymentMethod: 'Cash',
};

function BookingsView({ data, update }) {
  const [viewMode, setViewMode] = useState('kanban');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_BOOKING);
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirm, setConfirm] = useState(null);

  const openAdd = () => { setForm({ ...BLANK_BOOKING, date: todayStr() }); setEditing(null); setShowForm(true); };
  const openEdit = (b) => { setForm({ ...b }); setEditing(b.id); setShowForm(true); };

  const saveBooking = () => {
    if (!form.clientName.trim()) return;
    const price = parseFloat(form.price) || 0;
    if (editing) {
      update('bookings', data.bookings.map(b => b.id === editing ? { ...b, ...form, price } : b));
    } else {
      const newBooking = { ...form, price, id: genId(), createdAt: new Date().toISOString() };
      update('bookings', [...data.bookings, newBooking]);
    }
    setShowForm(false);
  };

  const changeStatus = async (id, status) => {
    update('bookings', data.bookings.map(b => b.id === id ? { ...b, status } : b));
    if (status === 'completed') {
      const booking = data.bookings.find(b => b.id === id);
      if (booking) {
        // Referral credit
        if (booking.bookingId) {
          fetch('https://doitallbros.com/api/referral-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: booking.bookingId }),
          }).catch(() => {});
        }
        // Create Stripe payment link for any non-cash payment (n8n decides whether to use it)
        let paymentLink = null;
        const pm = (booking.paymentMethod || '').toLowerCase();
        if (!pm.includes('cash') && !pm.includes('venmo') && !pm.includes('zelle') && !pm.includes('check')) {
          try {
            const resp = await fetch('https://www.doitallbros.com/api/create-payment-link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: booking.price || 0,
                service: booking.service || 'Service',
                clientName: booking.clientName || '',
                clientEmail: booking.clientEmail || '',
                bookingId: booking.id,
              }),
            });
            const linkData = await resp.json();
            paymentLink = linkData.url || null;
          } catch (_) {}
        }
        // Completion webhook
        fetch(`${import.meta.env.BASE_URL}api/forward`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'completion',
            client: {
              name: booking.clientName || '',
              email: booking.clientEmail || '',
              phone: booking.clientPhone || '',
              address: booking.clientAddress || '',
            },
            booking: {
              service: booking.service || '',
              date: booking.date || '',
              time: booking.time || '',
              price: booking.price || 0,
              paymentMethod: booking.paymentMethod || '',
              paymentLink: paymentLink,
            },
            completedAt: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
    }
  };

  const deleteBooking = (id) => {
    update('bookings', data.bookings.filter(b => b.id !== id));
    setConfirm(null);
  };

  const markPaid = (id) => {
    update('bookings', data.bookings.map(b => b.id === id ? { ...b, isPaid: true } : b));
  };

  const logRevenue = (booking) => {
    const entry = {
      id: genId(),
      bookingId: booking.id,
      clientId: booking.clientId || null,
      amount: booking.price || 0,
      service: booking.service,
      date: booking.date || todayStr(),
      paymentMethod: booking.paymentMethod || 'Cash',
      notes: `Auto-logged from booking`,
    };
    update('revenues', [...data.revenues, entry]);
    changeStatus(booking.id, 'completed');
  };

  const clientForBooking = (b) => data.clients.find(c => c.id === b.clientId);

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return data.bookings;
    return data.bookings.filter(b => b.status === statusFilter);
  }, [data.bookings, statusFilter]);

  const byStatus = (status) =>
    data.bookings.filter(b => b.status === status)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-sub">{data.bookings.filter(b => b.status !== 'cancelled').length} active bookings</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button className={clsx('view-btn', viewMode === 'kanban' && 'view-btn-active')} onClick={() => setViewMode('kanban')}>
              Kanban
            </button>
            <button className={clsx('view-btn', viewMode === 'list' && 'view-btn-active')} onClick={() => setViewMode('list')}>
              List
            </button>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>{Ic.plus} New Booking</button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="kanban">
          {Object.entries(BOOKING_STATUSES).map(([status, cfg]) => (
            <div key={status} className="kanban-col">
              <div className="kanban-col-header" style={{ borderColor: cfg.color }}>
                <span>{cfg.label}</span>
                <span className="kanban-count">{byStatus(status).length}</span>
              </div>
              <div className="kanban-cards">
                {byStatus(status).map(b => (
                  <KanbanCard
                    key={b.id}
                    booking={b}
                    client={clientForBooking(b)}
                    onEdit={openEdit}
                    onStatus={changeStatus}
                    onPaid={markPaid}
                    onLogRevenue={logRevenue}
                    onDelete={() => setConfirm(b.id)}
                    revenues={data.revenues}
                  />
                ))}
                {byStatus(status).length === 0 && (
                  <div className="kanban-empty">No {cfg.label.toLowerCase()} bookings</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="filter-tabs" style={{ marginBottom: 16 }}>
            <button className={clsx('filter-tab', statusFilter === 'all' && 'filter-active')} onClick={() => setStatusFilter('all')}>All</button>
            {Object.entries(BOOKING_STATUSES).map(([s, cfg]) => (
              <button key={s} className={clsx('filter-tab', statusFilter === s && 'filter-active')} onClick={() => setStatusFilter(s)}>
                {cfg.label}
              </button>
            ))}
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Client</th><th>Service</th><th>Date</th><th>Price</th><th>Status</th><th>Paid</th><th></th></tr>
              </thead>
              <tbody>
                {filteredBookings.sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(b => (
                  <tr key={b.id} className="table-row">
                    <td className="td-name">{b.clientName}</td>
                    <td>{b.service || '—'}</td>
                    <td>{fmtDateShort(b.date)} {fmtTime(b.time)}</td>
                    <td>{fmtMoney(b.price)}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <span style={{ color: b.isPaid ? '#10B981' : '#64748B' }}>
                        {b.isPaid ? '✓ Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn" onClick={() => openEdit(b)}>{Ic.edit}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Booking' : 'New Booking'} onClose={() => setShowForm(false)} size="lg">
          <div className="form-grid">
            <FormRow label="Client Name" required>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })}
                  placeholder="Client name"
                  list="clients-list"
                />
                <datalist id="clients-list">
                  {data.clients.map(c => <option key={c.id} value={c.name} />)}
                </datalist>
              </div>
            </FormRow>
            <FormRow label="Phone">
              <input value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} placeholder="(502) 000-0000" />
            </FormRow>
            <FormRow label="Email">
              <input value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} placeholder="email@example.com" />
            </FormRow>
            <FormRow label="Address">
              <input value={form.clientAddress} onChange={e => setForm({ ...form, clientAddress: e.target.value })} placeholder="Service address" />
            </FormRow>
            <FormRow label="Service">
              <input value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} placeholder="e.g. Lawn Mowing" />
            </FormRow>
            <FormRow label="Category">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category…</option>
                {SERVICE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormRow>
            <FormRow label="Date">
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </FormRow>
            <FormRow label="Time">
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </FormRow>
            <FormRow label="Price ($)">
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" min="0" step="0.01" />
            </FormRow>
            <FormRow label="Payment Method">
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormRow>
            <FormRow label="Status">
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {Object.entries(BOOKING_STATUSES).map(([s, cfg]) => (
                  <option key={s} value={s}>{cfg.label}</option>
                ))}
              </select>
            </FormRow>
            <FormRow label="Paid">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.isPaid} onChange={e => setForm({ ...form, isPaid: e.target.checked })} />
                Mark as paid
              </label>
            </FormRow>
            <FormRow label="Notes">
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Additional notes…" />
            </FormRow>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            {editing && <button className="btn btn-ghost btn-danger-ghost" onClick={() => { setShowForm(false); setConfirm(editing); }}>{Ic.trash}</button>}
            <button className="btn btn-primary" onClick={saveBooking}>Save Booking</button>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message="Delete this booking permanently?"
          onConfirm={() => deleteBooking(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

function KanbanCard({ booking: b, client, onEdit, onStatus, onPaid, onLogRevenue, onDelete, revenues }) {
  const [open, setOpen] = useState(false);
  const alreadyLogged = revenues.some(r => r.bookingId === b.id);

  return (
    <div className="kanban-card" onClick={() => setOpen(true)}>
      <div className="kc-top">
        <div className="kc-name">{b.clientName}</div>
        {b.source === 'website' && <span className="kc-web-badge">{Ic.globe}</span>}
      </div>
      <div className="kc-service">{b.service || 'No service specified'}</div>
      <div className="kc-meta">
        {b.date && <span>{fmtDateShort(b.date)}{b.time && ` ${fmtTime(b.time)}`}</span>}
        {b.price > 0 && <span className="kc-price">{fmtMoney(b.price)}</span>}
      </div>
      {b.isPaid && <span className="kc-paid">✓ Paid</span>}

      {open && (
        <Modal title={`Booking — ${b.clientName}`} onClose={() => setOpen(false)} size="lg">
            <div className="detail-grid">
              <div className="detail-row"><span className="detail-label">Service</span><span className="detail-value">{b.service || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Status</span><span className="detail-value" style={{textTransform:'capitalize'}}>{b.status || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Date</span><span className="detail-value">{b.date ? `${fmtDate(b.date)}${b.time ? ` at ${fmtTime(b.time)}` : ''}` : '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{b.clientPhone || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{b.clientEmail || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{b.clientAddress || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Price</span><span className="detail-value">{b.price > 0 ? fmtMoneyFull(b.price) : '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Payment</span><span className="detail-value">{b.paymentMethod || '—'}</span></div>
              <div className="detail-row"><span className="detail-label">Paid</span><span className="detail-value">{b.isPaid ? '✓ Yes' : 'No'}</span></div>
              <div className="detail-row"><span className="detail-label">Source</span><span className="detail-value" style={{textTransform:'capitalize'}}>{b.source || 'Manual'}</span></div>
              {b.bookingId && <div className="detail-row"><span className="detail-label">Submission ID</span><span className="detail-value" style={{fontSize:'12px',color:'var(--text3)'}}>{b.bookingId}</span></div>}
              <div className="detail-row"><span className="detail-label">Created</span><span className="detail-value">{b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}</span></div>
              {b.notes && <div className="detail-row detail-row-full"><span className="detail-label">Notes</span><span className="detail-value">{b.notes}</span></div>}
            </div>
            <div className="kc-status-row">
              <span className="detail-label">Move to:</span>
              {Object.entries(BOOKING_STATUSES).filter(([s]) => s !== b.status).map(([s, cfg]) => (
                <button key={s} className="btn btn-ghost btn-xs" style={{ color: cfg.color, borderColor: cfg.color + '44' }}
                  onClick={() => { onStatus(b.id, s); setOpen(false); }}>
                  {cfg.label}
                </button>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-danger-ghost" onClick={() => { onDelete(); setOpen(false); }}>{Ic.trash}</button>
              {b.status !== 'completed' && (
                <button className="btn btn-ghost" onClick={() => { onStatus(b.id, 'completed'); setOpen(false); }}>
                  {Ic.check} Mark Complete
                </button>
              )}
              {!b.isPaid && (
                <button className="btn btn-ghost" onClick={() => { onPaid(b.id); setOpen(false); }}>
                  {Ic.dollar} Mark Paid
                </button>
              )}
              {b.status !== 'completed' && !alreadyLogged && (
                <button className="btn btn-secondary" onClick={() => { onLogRevenue(b); setOpen(false); }}>
                  {Ic.check} Complete & Log Revenue
                </button>
              )}
              <button className="btn btn-primary" onClick={() => { setOpen(false); onEdit(b); }}>{Ic.edit} Edit</button>
            </div>
          </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════

function CalendarView({ data, update, setView }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);

  const todayStr2 = now.toISOString().slice(0, 10);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const getDays = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ d: daysInPrev - i, overflow: true });
    for (let i = 1; i <= daysInMonth; i++) days.push({ d: i, overflow: false });
    while (days.length < 42) days.push({ d: days.length - daysInMonth - firstDay + 1, overflow: true });
    return days;
  };

  const bookingsOnDay = (day) => {
    if (day.overflow) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day.d).padStart(2, '0')}`;
    return data.bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
  };

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null;

  const selectedBookings = selectedDateStr
    ? data.bookings.filter(b => b.date === selectedDateStr && b.status !== 'cancelled')
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    : [];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <button className="btn btn-primary" onClick={() => setView('bookings')}>{Ic.plus} New Booking</button>
      </div>

      <div className="cal-container">
        <div className="cal-main">
          <div className="cal-nav">
            <button className="icon-btn" onClick={prevMonth}>{Ic.chL}</button>
            <h2 className="cal-month-title">{MONTHS[month]} {year}</h2>
            <button className="icon-btn" onClick={nextMonth}>{Ic.chR}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}>Today</button>
          </div>

          <div className="cal-grid">
            {DAYS_SHORT.map(d => <div key={d} className="cal-day-header">{d}</div>)}
            {getDays().map((day, i) => {
              const bks = bookingsOnDay(day);
              const dateStr = !day.overflow
                ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day.d).padStart(2, '0')}`
                : null;
              const isToday = dateStr === todayStr2;
              const isSelected = selectedDay === day.d && !day.overflow;
              return (
                <div
                  key={i}
                  className={clsx('cal-day', day.overflow && 'cal-overflow', isToday && 'cal-today', isSelected && 'cal-selected')}
                  onClick={() => !day.overflow && setSelectedDay(day.d === selectedDay ? null : day.d)}
                >
                  <span className="cal-day-num">{day.d}</span>
                  <div className="cal-dots">
                    {bks.slice(0, 3).map((b, j) => (
                      <span key={j} className="cal-dot" style={{ background: BOOKING_STATUSES[b.status]?.color || '#64748B' }} />
                    ))}
                    {bks.length > 3 && <span className="cal-dot-more">+{bks.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="cal-sidebar">
            <div className="cal-sidebar-header">
              <h3>{MONTHS[month]} {selectedDay}</h3>
              <button className="icon-btn" onClick={() => setSelectedDay(null)}>{Ic.x}</button>
            </div>
            {selectedBookings.length === 0 ? (
              <p className="card-empty">No bookings this day</p>
            ) : (
              selectedBookings.map(b => (
                <div key={b.id} className="cal-booking cal-booking-clickable" onClick={() => setDetailBooking(b)}>
                  <div className="cal-booking-time">{fmtTime(b.time) || 'TBD'}</div>
                  <div className="cal-booking-info">
                    <div className="cal-booking-name">{b.clientName}</div>
                    <div className="cal-booking-svc">{b.service}</div>
                    {b.price > 0 && <div className="cal-booking-price">{fmtMoney(b.price)}</div>}
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {detailBooking && (
        <Modal title={`Booking — ${detailBooking.clientName}`} onClose={() => setDetailBooking(null)} size="lg">
          <div className="detail-grid">
            <div className="detail-row"><span className="detail-label">Service</span><span className="detail-value">{detailBooking.service || '—'}</span></div>
            <div className="detail-row"><span className="detail-label">Date</span><span className="detail-value">{fmtDate(detailBooking.date)} {fmtTime(detailBooking.time)}</span></div>
            <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{detailBooking.clientAddress || '—'}</span></div>
            <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{detailBooking.clientPhone || '—'}</span></div>
            <div className="detail-row"><span className="detail-label">Price</span><span className="detail-value">{fmtMoneyFull(detailBooking.price)}</span></div>
            <div className="detail-row"><span className="detail-label">Payment</span><span className="detail-value">{detailBooking.paymentMethod || '—'}</span></div>
            <div className="detail-row"><span className="detail-label">Status</span><span className="detail-value"><StatusBadge status={detailBooking.status} /></span></div>
            {detailBooking.isPaid && <div className="detail-row"><span className="detail-label">Paid</span><span className="detail-value" style={{color:'var(--success)', fontWeight:600}}>✓ Yes</span></div>}
            {detailBooking.notes && <div className="detail-row detail-row-full"><span className="detail-label">Notes</span><span className="detail-value">{detailBooking.notes}</span></div>}
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setDetailBooking(null)}>Close</button>
            <button className="btn btn-primary" onClick={() => { setDetailBooking(null); setView('bookings'); }}>Go to Bookings</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════

const BLANK_TASK = { title: '', description: '', dueDate: '', priority: 'medium', category: 'admin', status: 'pending' };
const TASK_CATS = ['admin','client','marketing','personal','other'];

function TasksView({ data, update }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK_TASK);
  const [filter, setFilter] = useState('open');
  const [quickAdd, setQuickAdd] = useState('');
  const today = todayStr();

  const openAdd = () => { setForm({ ...BLANK_TASK }); setEditing(null); setShowForm(true); };
  const openEdit = (t) => { setForm({ ...t }); setEditing(t.id); setShowForm(true); };

  const saveTask = () => {
    if (!form.title.trim()) return;
    if (editing) {
      update('tasks', data.tasks.map(t => t.id === editing ? { ...t, ...form } : t));
    } else {
      update('tasks', [...data.tasks, { ...form, id: genId(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
  };

  const quickAddTask = (e) => {
    if (e.key === 'Enter' && quickAdd.trim()) {
      update('tasks', [...data.tasks, {
        id: genId(), title: quickAdd.trim(), description: '', dueDate: '', priority: 'medium',
        category: 'admin', status: 'pending', createdAt: new Date().toISOString(),
      }]);
      setQuickAdd('');
    }
  };

  const toggleComplete = (id) => {
    update('tasks', data.tasks.map(t => t.id === id
      ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed', completedAt: t.status !== 'completed' ? new Date().toISOString() : null }
      : t
    ));
  };

  const deleteTask = (id) => update('tasks', data.tasks.filter(t => t.id !== id));

  const filtered = useMemo(() => {
    const sorted = [...data.tasks].sort((a, b) => {
      const pa = Object.keys(PRIORITY).indexOf(a.priority);
      const pb = Object.keys(PRIORITY).indexOf(b.priority);
      if (pa !== pb) return pa - pb;
      return (a.dueDate || 'zzz').localeCompare(b.dueDate || 'zzz');
    });
    if (filter === 'open') return sorted.filter(t => t.status !== 'completed');
    if (filter === 'overdue') return sorted.filter(t => t.status !== 'completed' && t.dueDate && t.dueDate < today);
    if (filter === 'today') return sorted.filter(t => t.status !== 'completed' && t.dueDate === today);
    if (filter === 'done') return sorted.filter(t => t.status === 'completed');
    return sorted;
  }, [data.tasks, filter, today]);

  const groups = useMemo(() => {
    if (filter !== 'open') return null;
    const overdue = filtered.filter(t => t.dueDate && t.dueDate < today);
    const dueToday = filtered.filter(t => t.dueDate === today);
    const upcoming = filtered.filter(t => !t.dueDate || t.dueDate > today);
    return { overdue, dueToday, upcoming };
  }, [filtered, filter, today]);

  const TaskItem = ({ task: t }) => (
    <div className={clsx('task-item', t.status === 'completed' && 'task-done', t.dueDate && t.dueDate < today && t.status !== 'completed' && 'task-overdue')}>
      <button className={clsx('task-check', t.status === 'completed' && 'task-check-done')} onClick={() => toggleComplete(t.id)}>
        {t.status === 'completed' && Ic.check}
      </button>
      <div className="task-body">
        <div className="task-title">{t.title}</div>
        <div className="task-meta">
          {t.dueDate && (
            <span className={clsx('task-due', t.dueDate < today && t.status !== 'completed' && 'due-red')}>
              {t.dueDate < today && t.status !== 'completed' ? '⚠ Overdue · ' : ''}{fmtDateShort(t.dueDate)}
            </span>
          )}
          <span className="task-cat">{t.category}</span>
        </div>
        {t.description && <div className="task-desc">{t.description}</div>}
      </div>
      <PriorityBadge priority={t.priority} />
      <button className="icon-btn icon-btn-sm" onClick={() => openEdit(t)}>{Ic.edit}</button>
      <button className="icon-btn icon-btn-sm icon-btn-danger" onClick={() => deleteTask(t.id)}>{Ic.trash}</button>
    </div>
  );

  const GroupSection = ({ title, tasks, color }) =>
    tasks.length === 0 ? null : (
      <div className="task-group">
        <div className="task-group-header" style={{ color }}>{title} <span className="task-group-count">{tasks.length}</span></div>
        {tasks.map(t => <TaskItem key={t.id} task={t} />)}
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-sub">{data.tasks.filter(t => t.status !== 'completed').length} open tasks</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>{Ic.plus} Add Task</button>
      </div>

      <div className="quick-add-row">
        <span className="quick-add-icon">{Ic.plus}</span>
        <input
          className="quick-add-input"
          placeholder="Quick add task — press Enter"
          value={quickAdd}
          onChange={e => setQuickAdd(e.target.value)}
          onKeyDown={quickAddTask}
        />
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {[
          { id: 'open', label: 'Open' },
          { id: 'overdue', label: 'Overdue', color: '#EF4444' },
          { id: 'today', label: 'Due Today', color: '#F59E0B' },
          { id: 'done', label: 'Completed' },
          { id: 'all', label: 'All' },
        ].map(f => (
          <button
            key={f.id}
            className={clsx('filter-tab', filter === f.id && 'filter-active')}
            style={filter === f.id && f.color ? { color: f.color, borderColor: f.color } : {}}
            onClick={() => setFilter(f.id)}
          >{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Ic.clip} text="No tasks here" action={openAdd} actionLabel="Add First Task" />
      ) : groups ? (
        <>
          <GroupSection title="Overdue" tasks={groups.overdue} color="#EF4444" />
          <GroupSection title="Due Today" tasks={groups.dueToday} color="#F59E0B" />
          <GroupSection title="Upcoming" tasks={groups.upcoming} color="#94A3B8" />
        </>
      ) : (
        <div className="task-list">
          {filtered.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Task' : 'New Task'} onClose={() => setShowForm(false)} size="md">
          <div className="form-grid">
            <FormRow label="Title" required>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title" autoFocus />
            </FormRow>
            <FormRow label="Priority">
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FormRow>
            <FormRow label="Due Date">
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </FormRow>
            <FormRow label="Category">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {TASK_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormRow>
            <FormRow label="Description">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Optional details…" />
            </FormRow>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveTask}>Save Task</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REVENUE
// ═══════════════════════════════════════════════════════════

const BLANK_REV = { amount: '', service: '', category: '', date: '', paymentMethod: 'Cash', clientId: '', notes: '' };

function RevenueView({ data, update }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK_REV);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const today = todayStr();
  const thisMonth = today.slice(0, 7);
  const lastMonthDate = new Date(today);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);

  const monthRevenue = (m) =>
    data.revenues.filter(r => r.date?.startsWith(m)).reduce((s, r) => s + (r.amount || 0), 0);

  const ytd = data.revenues
    .filter(r => r.date?.startsWith(today.slice(0, 4)))
    .reduce((s, r) => s + (r.amount || 0), 0);

  const avg = data.revenues.length ? data.revenues.reduce((s, r) => s + (r.amount || 0), 0) / data.revenues.length : 0;

  const last12Months = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      months.push({ key, label: MONTHS_SHORT[d.getMonth()], amount: monthRevenue(key) });
    }
    return months;
  }, [data.revenues]);

  const byCategory = useMemo(() => {
    const cats = {};
    data.revenues.forEach(r => {
      const cat = r.category || r.service || 'Uncategorized';
      cats[cat] = (cats[cat] || 0) + (r.amount || 0);
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [data.revenues]);

  const filtered = useMemo(() => {
    let revs = [...data.revenues];
    if (filter === 'month') revs = revs.filter(r => r.date?.startsWith(thisMonth));
    if (filter === 'year') revs = revs.filter(r => r.date?.startsWith(today.slice(0, 4)));
    return revs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [data.revenues, filter, thisMonth, today]);

  const openAdd = () => { setForm({ ...BLANK_REV, date: today }); setEditing(null); setShowForm(true); };
  const openEdit = (r) => { setForm({ ...r, amount: r.amount?.toString() }); setEditing(r.id); setShowForm(true); };

  const saveRev = () => {
    const amount = parseFloat(form.amount) || 0;
    if (!amount) return;
    if (editing) {
      update('revenues', data.revenues.map(r => r.id === editing ? { ...r, ...form, amount } : r));
    } else {
      update('revenues', [...data.revenues, { ...form, amount, id: genId(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
  };

  const deleteRev = (id) => update('revenues', data.revenues.filter(r => r.id !== id));

  const exportCSV = () => {
    const rows = [
      ['Date', 'Service', 'Category', 'Amount', 'Payment Method', 'Notes'],
      ...data.revenues.map(r => [r.date, r.service, r.category, r.amount, r.paymentMethod, r.notes]),
    ];
    const csv = rows.map(r => r.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `revenue-${today}.csv`;
    a.click();
  };

  const maxBar = Math.max(...last12Months.map(m => m.amount), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Revenue</h1>
          <p className="page-sub">Financial tracking & reporting</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={exportCSV}>{Ic.dl} Export CSV</button>
          <button className="btn btn-primary" onClick={openAdd}>{Ic.plus} Log Revenue</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={Ic.dollar} label="This Month"  value={fmtMoney(monthRevenue(thisMonth))} color="#10B981" />
        <StatCard icon={Ic.dollar} label="Last Month"  value={fmtMoney(monthRevenue(lastMonth))} color="#3B82F6" />
        <StatCard icon={Ic.trending} label="YTD Total"  value={fmtMoney(ytd)}                    color="#A78BFA" />
        <StatCard icon={Ic.star}   label="Avg per Job" value={fmtMoney(avg)}                     color="#F59E0B" />
      </div>

      <div className="rev-grid">
        {/* Bar Chart */}
        <div className="card">
          <h3 className="card-title">Revenue — Last 12 Months</h3>
          <div className="bar-chart">
            {last12Months.map((m, i) => (
              <div key={i} className="bar-col">
                <div className="bar-wrapper">
                  <div className="bar-fill" style={{ height: `${(m.amount / maxBar) * 100}%`, background: m.key === thisMonth ? '#3B82F6' : '#334155' }} />
                </div>
                <div className="bar-label">{m.label}</div>
                {m.amount > 0 && <div className="bar-val">{fmtMoney(m.amount)}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* By Category */}
        <div className="card">
          <h3 className="card-title">Top Categories</h3>
          {byCategory.length === 0 ? (
            <p className="card-empty">No data yet</p>
          ) : (
            <div className="cat-list">
              {byCategory.map(([cat, amt], i) => {
                const total = data.revenues.reduce((s, r) => s + (r.amount || 0), 0);
                const pct = total ? ((amt / total) * 100).toFixed(0) : 0;
                return (
                  <div key={i} className="cat-item">
                    <div className="cat-name">{cat}</div>
                    <div className="cat-bar-wrap">
                      <div className="cat-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="cat-amount">{fmtMoney(amt)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue List */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3>Transactions</h3>
          <div className="filter-tabs">
            {[{ id: 'all', l: 'All' }, { id: 'month', l: 'This Month' }, { id: 'year', l: 'This Year' }].map(f => (
              <button key={f.id} className={clsx('filter-tab', filter === f.id && 'filter-active')} onClick={() => setFilter(f.id)}>{f.l}</button>
            ))}
          </div>
        </div>

        {/* Awaiting Payment — completed but unpaid bookings */}
        {(() => {
          const unpaid = data.bookings.filter(b => b.status === 'completed' && !b.isPaid);
          if (unpaid.length === 0) return null;
          return (
            <div className="awaiting-payment-section">
              <h4 className="awaiting-title">⏳ Awaiting Payment ({unpaid.length})</h4>
              <div className="awaiting-list">
                {unpaid.map(b => (
                  <div key={b.id} className="awaiting-row">
                    <div className="awaiting-info">
                      <span className="awaiting-client">{b.clientName}</span>
                      <span className="awaiting-service">{b.service}</span>
                      <span className="awaiting-amount">{fmtMoneyFull(b.price)}</span>
                    </div>
                    <button className="btn btn-primary btn-xs" onClick={() => {
                      update('bookings', data.bookings.map(bk => bk.id === b.id ? { ...bk, isPaid: true } : bk));
                      const newRev = {
                        id: genId(), amount: b.price || 0, service: b.service,
                        category: b.category || '', date: todayStr(),
                        paymentMethod: b.paymentMethod || 'Cash', clientId: b.clientId || '',
                        notes: `Auto-logged from completed booking`, createdAt: new Date().toISOString(),
                      };
                      update('revenues', [...data.revenues, newRev]);
                    }}>
                      {Ic.check} Mark Paid & Log
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {filtered.length === 0 ? (
          <p className="card-empty">No revenue entries yet</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th>Service</th><th>Category</th><th>Method</th><th>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="table-row">
                    <td>{fmtDateShort(r.date)}</td>
                    <td>{r.service || '—'}</td>
                    <td>{r.category || '—'}</td>
                    <td>{r.paymentMethod || '—'}</td>
                    <td className="td-amount">{fmtMoneyFull(r.amount)}</td>
                    <td>
                      <button className="icon-btn icon-btn-sm" onClick={() => openEdit(r)}>{Ic.edit}</button>
                      <button className="icon-btn icon-btn-sm icon-btn-danger" onClick={() => deleteRev(r.id)}>{Ic.trash}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Entry' : 'Log Revenue'} onClose={() => setShowForm(false)} size="md">
          <div className="form-grid">
            <FormRow label="Amount ($)" required>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" min="0" step="0.01" autoFocus />
            </FormRow>
            <FormRow label="Date">
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </FormRow>
            <FormRow label="Service">
              <input value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} placeholder="e.g. Lawn Mowing" />
            </FormRow>
            <FormRow label="Category">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select…</option>
                {SERVICE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormRow>
            <FormRow label="Payment Method">
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormRow>
            <FormRow label="Client">
              <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                <option value="">No client</option>
                {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormRow>
            <FormRow label="Notes">
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional note" />
            </FormRow>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveRev}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════════════════════

function NotesView({ data, update }) {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [addColor, setAddColor] = useState(NOTE_COLORS[0]);

  const addNote = () => {
    if (!newText.trim() && !newTitle.trim()) return;
    update('notes', [...data.notes, {
      id: genId(), title: newTitle, text: newText, color: addColor,
      pinned: false, createdAt: new Date().toISOString(),
    }]);
    setNewText(''); setNewTitle(''); setAddColor(NOTE_COLORS[0]);
  };

  const startEdit = (n) => { setEditId(n.id); setEditText(n.text); setEditTitle(n.title || ''); };

  const saveEdit = (id) => {
    update('notes', data.notes.map(n => n.id === id ? { ...n, text: editText, title: editTitle } : n));
    setEditId(null);
  };

  const deleteNote = (id) => update('notes', data.notes.filter(n => n.id !== id));
  const togglePin = (id) => update('notes', data.notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const changeColor = (id, color) => update('notes', data.notes.map(n => n.id === id ? { ...n, color } : n));

  const sorted = [...data.notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Notes</h1>
      </div>

      {/* Quick Add */}
      <div className="note-add-card">
        <input
          className="note-add-title"
          placeholder="Title (optional)"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <textarea
          className="note-add-body"
          placeholder="Write a note…"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          rows={3}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addNote(); }}
        />
        <div className="note-add-footer">
          <div className="color-pickers">
            {NOTE_COLORS.map(c => (
              <button
                key={c}
                className={clsx('color-dot', addColor === c && 'color-dot-active')}
                style={{ background: c === NOTE_COLORS[0] ? '#334155' : c }}
                onClick={() => setAddColor(c)}
              />
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={addNote}>{Ic.plus} Add Note</button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Ic.note} text="No notes yet" sub="Add your first note above" />
      ) : (
        <div className="notes-grid">
          {sorted.map(n => (
            <div key={n.id} className={clsx('note-card', n.pinned && 'note-pinned')} style={{ background: n.color || NOTE_COLORS[0] }}>
              {editId === n.id ? (
                <>
                  <input
                    className="note-edit-title"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <textarea
                    className="note-edit-body"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={5}
                    autoFocus
                  />
                  <div className="note-edit-footer">
                    <button className="btn btn-ghost btn-xs" onClick={() => setEditId(null)}>Cancel</button>
                    <button className="btn btn-primary btn-xs" onClick={() => saveEdit(n.id)}>Save</button>
                  </div>
                </>
              ) : (
                <>
                  {n.pinned && <span className="pin-indicator">{Ic.pin}</span>}
                  {n.title && <div className="note-title">{n.title}</div>}
                  <div className="note-text">{n.text}</div>
                  <div className="note-footer">
                    <span className="note-date">{fmtDateShort(n.createdAt?.slice(0, 10))}</span>
                    <div className="note-actions">
                      <div className="color-pickers">
                        {NOTE_COLORS.map(c => (
                          <button
                            key={c}
                            className={clsx('color-dot color-dot-sm', n.color === c && 'color-dot-active')}
                            style={{ background: c === NOTE_COLORS[0] ? '#334155' : c }}
                            onClick={() => changeColor(n.id, c)}
                          />
                        ))}
                      </div>
                      <button className={clsx('icon-btn icon-btn-sm', n.pinned && 'icon-btn-active')} onClick={() => togglePin(n.id)} title="Pin">{Ic.pin}</button>
                      <button className="icon-btn icon-btn-sm" onClick={() => startEdit(n)} title="Edit">{Ic.edit}</button>
                      <button className="icon-btn icon-btn-sm icon-btn-danger" onClick={() => deleteNote(n.id)} title="Delete">{Ic.trash}</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REQUESTS VIEW
// ═══════════════════════════════════════════════════════════

function RequestsView({ data, update }) {
  const requests = data.requests || [];
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const updateRequest = (id, changes) => {
    update('requests', requests.map(r => r.id === id ? { ...r, ...changes } : r));
  };

  const deleteRequest = (id) => {
    if (window.confirm('Delete this request?')) {
      update('requests', requests.filter(r => r.id !== id));
    }
  };

  const unaddressedCount = requests.filter(r => r.status === 'unaddressed').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Custom Requests</h1>
          <p className="page-sub">{requests.length} total · {unaddressedCount} unaddressed</p>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        {[['all', 'All'], ['unaddressed', 'Unaddressed'], ['contacted', 'Contacted'], ['confirmed', 'Confirmed']].map(([val, label]) => (
          <button key={val} className={clsx('filter-tab', filter === val && 'filter-tab-active')} onClick={() => setFilter(val)}>
            {label}
            {val !== 'all' && <span className="filter-count">{requests.filter(r => r.status === val).length}</span>}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state"><p>No requests found.</p></div>
      ) : (
        <div className="requests-list">
          {sorted.map(req => {
            const statusCfg = REQUEST_STATUSES[req.status] || REQUEST_STATUSES.unaddressed;
            const isExpanded = expandedId === req.id;
            return (
              <div key={req.id} className="request-card">
                <div className="request-card-header" onClick={() => setExpandedId(isExpanded ? null : req.id)}>
                  <div className="request-card-left">
                    <span className="request-status-dot" style={{ background: statusCfg.color }} />
                    <div>
                      <div className="request-name">{req.name || 'Unknown'}</div>
                      <div className="request-meta">{req.phone} · {req.email}</div>
                    </div>
                  </div>
                  <div className="request-card-right">
                    <span className="request-date">{fmtDateShort(req.date || req.createdAt?.slice(0, 10))}</span>
                    <span className="chevron">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="request-card-body">
                    <div className="request-detail-grid">
                      <div className="req-detail"><span>Address</span><p>{req.address || '—'}</p></div>
                      <div className="req-detail"><span>Date</span><p>{fmtDate(req.date)} {req.time}</p></div>
                      <div className="req-detail req-detail-full"><span>Description</span><p>{req.description || '—'}</p></div>
                      {req.materialsNeeded && <div className="req-detail req-detail-full"><span>Materials Needed</span><p>{req.materialsNeeded}</p></div>}
                      {req.otherNotes && <div className="req-detail req-detail-full"><span>Other Notes</span><p>{req.otherNotes}</p></div>}
                    </div>

                    <div className="request-actions">
                      <div className="request-action-row">
                        <label className="req-field-label">Status</label>
                        <select
                          className="req-select"
                          value={req.status}
                          onChange={e => updateRequest(req.id, { status: e.target.value })}
                        >
                          {Object.entries(REQUEST_STATUSES).map(([val, cfg]) => (
                            <option key={val} value={val}>{cfg.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="request-action-row">
                        <label className="req-field-label">Price Confirmed</label>
                        <input
                          className="req-input"
                          type="text"
                          placeholder="e.g. $250"
                          value={req.priceConfirmed || ''}
                          onChange={e => updateRequest(req.id, { priceConfirmed: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                      <button className="btn btn-ghost btn-danger-ghost btn-xs" onClick={() => deleteRequest(req.id)}>
                        {Ic.trash} Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('dab_auth') === '1');
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState(loadData);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => { saveData(data); }, [data]);

  // Poll the Express server every 30s for new bookings/contacts + availability updates
  useEffect(() => {
    if (!authed) return;

    const pollPending = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}api/pending`);
        if (!res.ok) return;
        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) return;

        setData(prev => {
          const contacts = [...prev.contacts];
          items.forEach(item => {
            const type = item.type || (item.message ? 'contact' : 'booking');
            if (type === 'booking') {
              // All website bookings → Inbox first (contacts array with _type:'booking')
              if (!contacts.find(c => c.webhookId === item.id)) {
                contacts.push({
                  id: genId(), webhookId: item.id, _type: 'booking',
                  name: item.customer_name || item.name || '',
                  email: item.email_address || item.email || '',
                  phone: item.phone_number || item.phone || '',
                  address: item.address || '',
                  service_list: item.service_list || '',
                  cartItems: item.cart_items || [],
                  preferredDate: item.preferred_date || item.scheduled_date?.split(' ')[0] || '',
                  preferredTime: item.preferred_time || item.scheduled_date?.split(' ')[1] || '',
                  backupDate: item.backup_date || null,
                  backupTime: item.backup_time || null,
                  has_quoted_services: item.has_quoted_services || false,
                  payment_method: item.payment_method || 'Cash',
                  materials_needed: item.materials_needed || 'No',
                  notes: item.extra_notes || item.notes || '',
                  fees: (item.total_amount || 0) - (item.subtotal || 0),
                  dateAvailability: null,
                  processedStatus: null,
                  status: 'new', source: 'website',
                  referralCode: item.referralCode || null,
                  usedReferralCode: item.usedReferralCode || null,
                  referralCreditsEarned: item.referralCreditsEarned || 0,
                  referralCount: item.referralCount || 0,
                  bookingId: item.bookingId || item.id || null,
                  createdAt: item.receivedAt || item.date_submitted || new Date().toISOString(),
                });
              }
            } else if (type === 'custom_request') {
              if (!contacts.find(c => c.webhookId === item.id)) {
                contacts.push({
                  id: genId(), webhookId: item.id, _type: 'custom_request',
                  name: item.name || '',
                  email: item.email || '',
                  phone: item.phone || '',
                  address: item.address || '',
                  date: item.date || '',
                  time: item.time || '',
                  description: item.description || '',
                  materialsNeeded: item.materialsNeeded || '',
                  otherNotes: item.otherNotes || '',
                  paymentMethod: item.paymentMethod || '',
                  dateAvailability: null,
                  processedStatus: null,
                  status: 'new', source: 'website',
                  createdAt: item.receivedAt || item.timestamp || new Date().toISOString(),
                });
              }
            } else if (type === 'contact') {
              const existingIdx = contacts.findIndex(c => c.webhookId === item.id);
              if (existingIdx === -1) {
                contacts.push({
                  id: genId(), webhookId: item.id, _type: 'contact',
                  contactId: item.contactId || item.id || '',
                  name: item.name || item.contactName || '',
                  email: item.email || item.contactEmail || '',
                  phone: item.phone || item.contactPhone || '',
                  message: item.message || item.contactMessage || '',
                  status: 'new', source: 'website',
                  createdAt: item.receivedAt || new Date().toISOString(),
                  notes: '',
                });
              } else if (item.aiSuggestedResponse && !contacts[existingIdx].aiSuggestedResponse) {
                contacts[existingIdx] = { ...contacts[existingIdx], aiSuggestedResponse: item.aiSuggestedResponse };
              }
            } else if (type === 'ai_response') {
              const idx = contacts.findIndex(c => c.contactId === item.contactId || c.webhookId === item.contactId);
              if (idx !== -1) {
                contacts[idx] = { ...contacts[idx], aiSuggestedResponse: item.aiSuggestedResponse };
              }
            } else if (type === 'date_confirmation') {
              const idx = contacts.findIndex(c => c.bookingId === item.bookingId || c.webhookId === item.bookingId);
              if (idx !== -1) {
                contacts[idx] = { ...contacts[idx], customerConfirmed: true, customerConfirmedAt: item.confirmedAt };
              }
            }
          });

          // For any date_confirmation items, create confirmed booking + client if not already present
          const bookings = [...prev.bookings];
          const clients = [...prev.clients];
          items.filter(i => i.type === 'date_confirmation').forEach(item => {
            // First: if a booking already exists directly (contact may have been deleted after processing)
            const directBookingIdx = bookings.findIndex(b => b.webhookId === item.bookingId || b.bookingId === item.bookingId);
            const confirmFields = {
              status: 'confirmed',
              ...(item.confirmedDate ? { date: item.confirmedDate } : {}),
              ...(item.confirmedTime ? { time: item.confirmedTime } : {}),
              ...(item.confirmedPrice !== undefined && item.confirmedPrice !== null ? { price: item.confirmedPrice } : {}),
            };
            if (directBookingIdx !== -1) {
              bookings[directBookingIdx] = { ...bookings[directBookingIdx], ...confirmFields };
              return;
            }
            const contact = contacts.find(c => c.bookingId === item.bookingId || c.webhookId === item.bookingId);
            if (!contact) return;
            // If booking exists via contact, update its status
            const existingIdx = bookings.findIndex(b => b.webhookId === contact.webhookId || b.bookingId === contact.bookingId);
            if (existingIdx !== -1) {
              bookings[existingIdx] = { ...bookings[existingIdx], ...confirmFields };
              return;
            }

            // Find or create client
            const email = contact.email || '';
            const phone = contact.phone || '';
            let client = clients.find(c => (email && c.email === email) || (phone && c.phone === phone));
            if (!client) {
              client = {
                id: genId(), name: contact.name || '', email, phone,
                address: contact.address || '', notes: '', tags: ['New'],
                createdAt: new Date().toISOString(),
              };
              clients.push(client);
            }

            const svcName = contact.description
              ? `Custom: ${contact.description.slice(0, 60)}`
              : (contact.service_list || contact.service || 'Custom Request');

            bookings.push({
              id: genId(),
              webhookId: contact.webhookId,
              bookingId: contact.bookingId || null,
              clientId: client.id,
              clientName: contact.name || '',
              clientEmail: email,
              clientPhone: phone,
              clientAddress: contact.address || '',
              service: svcName,
              date: contact.scheduledDate || contact.date || '',
              time: contact.scheduledTime || contact.time || '',
              price: 0,
              status: 'confirmed',
              source: 'website',
              paymentMethod: contact.paymentMethod || contact.payment_method || 'Cash',
              notes: contact.otherNotes || contact.notes || '',
              isPaid: false,
              createdAt: new Date().toISOString(),
            });
          });

          return { ...prev, contacts, bookings, clients };
        });

        await fetch(`${import.meta.env.BASE_URL}api/pending`, { method: 'DELETE' });
      } catch {}
    };

    const pollAvailability = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}api/availability`);
        if (!res.ok) return;
        const updates = await res.json();
        if (!Array.isArray(updates) || updates.length === 0) return;

        setData(prev => ({
          ...prev,
          contacts: prev.contacts.map(c => {
            const upd = updates.find(u => u.bookingId === c.webhookId);
            return upd ? { ...c, dateAvailability: { preferred: upd.preferred, backup: upd.backup, alternatives: upd.alternatives || [] } } : c;
          }),
        }));

        for (const upd of updates) {
          fetch(`${import.meta.env.BASE_URL}api/availability/${upd.bookingId}`, { method: 'DELETE' }).catch(() => {});
        }
      } catch {}
    };

    const pollConfirmations = async () => {
      try {
        const res = await fetch('https://www.doitallbros.com/api/get-confirmations', { method: 'DELETE' });
        if (!res.ok) return;
        const items = await res.json();
        if (!Array.isArray(items) || items.length === 0) return;
        setData(prev => {
          const bookings = [...prev.bookings];
          const clients = [...prev.clients];
          items.forEach(({ bookingId, confirmedAt, confirmedDate, confirmedTime, confirmedPrice }) => {
            // Case 1: booking already exists → update status + date/time/price + ensure client exists
            const bIdx = bookings.findIndex(b => b.webhookId === bookingId || b.bookingId === bookingId);
            if (bIdx !== -1) {
              bookings[bIdx] = { ...bookings[bIdx], status: 'confirmed', ...(confirmedDate ? { date: confirmedDate } : {}), ...(confirmedTime ? { time: confirmedTime } : {}), ...(confirmedPrice !== undefined && confirmedPrice !== null ? { price: confirmedPrice } : {}) };
              const b = bookings[bIdx];
              const email = b.clientEmail || '';
              const phone = b.clientPhone || '';
              if ((email || phone) && !clients.find(c => (email && c.email === email) || (phone && c.phone === phone))) {
                clients.push({ id: genId(), name: b.clientName || '', email, phone, address: b.clientAddress || '', notes: '', tags: ['New'], createdAt: new Date().toISOString() });
              }
              return;
            }
            // Case 2: inbox contact exists → create confirmed booking
            const contact = prev.contacts.find(c => c.webhookId === bookingId || c.bookingId === bookingId);
            if (contact) {
              const email = contact.email || '';
              const phone = contact.phone || '';
              let client = clients.find(c => (email && c.email === email) || (phone && c.phone === phone));
              if (!client) {
                client = { id: genId(), name: contact.name || '', email, phone, address: contact.address || '', notes: '', tags: ['New'], createdAt: new Date().toISOString() };
                clients.push(client);
              }
              const svcName = contact.description ? `Custom: ${contact.description.slice(0, 60)}` : (contact.service_list || contact.service || 'Service');
              bookings.push({ id: genId(), webhookId: contact.webhookId, bookingId: contact.bookingId || null, clientId: client.id, clientName: contact.name || '', clientEmail: email, clientPhone: phone, clientAddress: contact.address || '', service: svcName, date: contact.scheduledDate || contact.date || '', time: contact.scheduledTime || contact.time || '', price: 0, status: 'confirmed', source: 'website', paymentMethod: contact.paymentMethod || 'Cash', notes: contact.notes || '', isPaid: false, createdAt: confirmedAt });
            }
          });
          return { ...prev, bookings, clients };
        });
      } catch {}
    };

    pollPending();
    pollAvailability();
    pollConfirmations();
    const interval = setInterval(() => { pollPending(); pollAvailability(); pollConfirmations(); }, 30000);
    return () => clearInterval(interval);
  }, [authed]);

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const newInboxCount = useMemo(() => {
    const nc = data.contacts.filter(c => c.status === 'new').length;
    const nb = data.bookings.filter(b => b.source === 'website' && b.status === 'pending').length;
    return nc + nb; // custom_requests are contacts with status 'new', already counted above
  }, [data.contacts, data.bookings]);

  const logout = () => { sessionStorage.removeItem('dab_auth'); setAuthed(false); };

  if (!authed) {
    return <LoginScreen onLogin={() => { sessionStorage.setItem('dab_auth', '1'); setAuthed(true); }} />;
  }

  const props = { data, update, setView };

  const handleNav = (id) => { setView(id); setMobileNavOpen(false); };

  return (
    <div className="app">
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setMobileNavOpen(o => !o)}>☰</button>
        <span className="mobile-brand">DoItAllBros Tracker</span>
        {newInboxCount > 0 && <span className="mobile-badge">{newInboxCount}</span>}
      </div>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNavOpen(false)}>
          <nav className="mobile-nav-panel" onClick={e => e.stopPropagation()}>
            {NAV.map(({ id, label, icon }) => (
              <button key={id} className={clsx('mobile-nav-item', view === id && 'nav-active')} onClick={() => handleNav(id)}>
                <span className="nav-icon">{Ic[icon]}</span>
                <span>{label}</span>
                {id === 'inbox' && newInboxCount > 0 && <span className="nav-badge">{newInboxCount}</span>}
              </button>
            ))}
            <button className="mobile-nav-item" onClick={logout}>
              <span className="nav-icon">{Ic.logout}</span>
              <span>Lock</span>
            </button>
          </nav>
        </div>
      )}

      <Sidebar view={view} onChange={handleNav} inboxCount={newInboxCount} onLogout={logout} />
      <div className="main">
        {view === 'dashboard' && <Dashboard {...props} />}
        {view === 'inbox'     && <InboxView {...props} />}
        {view === 'clients'   && <ClientsView {...props} />}
        {view === 'bookings'  && <BookingsView {...props} />}
        {view === 'calendar'  && <CalendarView {...props} />}
        {view === 'tasks'     && <TasksView {...props} />}
        {view === 'revenue'   && <RevenueView {...props} />}
        {view === 'notes'     && <NotesView {...props} />}
      </div>
    </div>
  );
}

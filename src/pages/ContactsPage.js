import React, { useState, useEffect, useCallback } from 'react';
import { getContacts } from '../api';

const STATUS_OPTIONS = ['Not Started', 'Draft Created', 'Sent', 'Letter Sent', 'Responded', 'Meeting Booked'];
const TRACK_OPTIONS = ['', 'Advocacy', 'Track 1', 'Track 2'];
const TIER_OPTIONS = ['', '1', '2', '3'];

function statusClass(s) {
  if (s === 'Not Started') return 'status-not-started';
  if (s === 'Draft Created') return 'status-draft';
  if (s === 'Sent') return 'status-sent';
  if (s === 'Letter Sent') return 'status-letter';
  if (s === 'Responded') return 'status-responded';
  if (s === 'Meeting Booked') return 'status-meeting';
  return 'status-not-started';
}

function trackBadge(track) {
  if (track === 'Advocacy') return 'badge badge-advocacy';
  if (track === 'Track 1') return 'badge badge-track1';
  if (track === 'Track 2') return 'badge badge-track2';
  return 'badge';
}

export default function ContactsPage({ navigateTo }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (trackFilter) params.track = trackFilter;
      if (tierFilter) params.tier = tierFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await getContacts(params);
      setContacts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, trackFilter, tierFilter, statusFilter]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  // Group by track
  const tracks = ['Advocacy', 'Track 1', 'Track 2'];
  const grouped = {};
  tracks.forEach(t => { grouped[t] = contacts.filter(c => c.track === t); });
  const ungrouped = contacts.filter(c => !tracks.includes(c.track));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Contacts</div>
        <div className="page-subtitle">{contacts.length} contacts · Click any row to view details</div>
      </div>

      <div className="filters-bar">
        <input
          className="filter-input"
          placeholder="Search name, org, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={trackFilter} onChange={e => setTrackFilter(e.target.value)}>
          <option value="">All Tracks</option>
          {TRACK_OPTIONS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="filter-select" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="">All Tiers</option>
          {TIER_OPTIONS.filter(Boolean).map(t => <option key={t} value={t}>Tier {t}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(trackFilter || tierFilter || statusFilter || search) && (
          <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 10px' }} onClick={() => {
            setSearch(''); setTrackFilter(''); setTierFilter(''); setStatusFilter('');
          }}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading contacts…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {tracks.map(track => {
            const rows = grouped[track];
            if (!rows || rows.length === 0) return null;
            return (
              <div key={track}>
                <div className="track-header">
                  <span className={trackBadge(track)}>{track}</span>
                  <span className="track-count">{rows.length} contacts</span>
                </div>
                <ContactTable rows={rows} navigateTo={navigateTo} />
              </div>
            );
          })}
          {ungrouped.length > 0 && (
            <div>
              <div className="track-header"><h3>Other</h3></div>
              <ContactTable rows={ungrouped} navigateTo={navigateTo} />
            </div>
          )}
          {contacts.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px' }}>
              No contacts match your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ContactTable({ rows, navigateTo }) {
  return (
    <div className="contacts-table-wrap">
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Organisation</th>
            <th>Email</th>
            <th>Tier</th>
            <th>Status</th>
            <th>Date Sent</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id} onClick={() => navigateTo('contact-detail', c.id)}>
              <td style={{ fontWeight: 500 }}>{c.name}</td>
              <td style={{ color: 'var(--text-muted)' }}>{c.title}</td>
              <td>{c.organisation}</td>
              <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{c.email}</td>
              <td>
                <span className={`badge badge-tier${c.tier}`}>T{c.tier}</span>
              </td>
              <td>
                <span className={`status-badge ${statusClass(c.status)}`}>{c.status}</span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{c.date_sent || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

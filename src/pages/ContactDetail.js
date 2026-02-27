import React, { useState, useEffect, useCallback } from 'react';
import { getContact, previewTemplate, updateContact } from '../api';

const STATUS_OPTIONS = ['Not Started', 'Draft Created', 'Sent', 'Responded', 'Meeting Booked'];

function statusClass(s) {
  if (s === 'Not Started') return 'status-not-started';
  if (s === 'Draft Created') return 'status-draft';
  if (s === 'Sent') return 'status-sent';
  if (s === 'Responded') return 'status-responded';
  if (s === 'Meeting Booked') return 'status-meeting';
  return 'status-not-started';
}

export default function ContactDetail({ contactId, navigateTo }) {
  const [contact, setContact] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [editingStatus, setEditingStatus] = useState(false);

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const loadContact = useCallback(async () => {
    if (!contactId) return;
    setLoading(true);
    try {
      const [cRes, pRes] = await Promise.all([
        getContact(contactId),
        previewTemplate(contactId)
      ]);
      setContact(cRes.data);
      setPreview(pRes.data);
    } catch (e) {
      addToast('Failed to load contact', 'error');
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => { loadContact(); }, [loadContact]);

  async function handleStatusChange(newStatus) {
    try {
      const res = await updateContact(contactId, { status: newStatus });
      setContact(res.data);
      setEditingStatus(false);
      addToast(`Status updated to "${newStatus}"`, 'success');
    } catch (e) {
      addToast('Failed to update status', 'error');
    }
  }

  async function handleEdit(formData) {
    try {
      const res = await updateContact(contactId, formData);
      setContact(res.data);
      setShowEditModal(false);
      addToast('Contact updated', 'success');
      // Reload preview in case track changed
      const pRes = await previewTemplate(contactId);
      setPreview(pRes.data);
    } catch (e) {
      addToast('Failed to update contact', 'error');
    }
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading contact…</div>;
  if (!contact) return <div className="loading">Contact not found.</div>;

  const initials = contact.name ? contact.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <div>
      {/* Header */}
      <div className="detail-header">
        <button className="detail-back" onClick={() => navigateTo('contacts')}>← Back</button>
        <div className="detail-avatar">{initials}</div>
        <div style={{ flex: 1 }}>
          <div className="detail-name">{contact.name}</div>
          <div className="detail-meta">{contact.title} · {contact.organisation}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {editingStatus ? (
            <select
              className="editable-select"
              defaultValue={contact.status}
              onChange={e => handleStatusChange(e.target.value)}
              onBlur={() => setEditingStatus(false)}
              autoFocus
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <span
              className={`status-badge ${statusClass(contact.status)}`}
              style={{ cursor: 'pointer' }}
              title="Click to change status"
              onClick={() => setEditingStatus(true)}
            >
              {contact.status}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => setShowEmailModal(true)}
        >
          ✉ Preview Email
        </button>
        <button className="btn btn-ghost" onClick={() => setShowEditModal(true)}>
          ✏ Edit Contact
        </button>
      </div>

      <div className="detail-grid">
        {/* Contact Info */}
        <div className="detail-card">
          <div className="detail-card-title">Contact Info</div>
          <InfoRow label="Name" value={contact.name} />
          <InfoRow label="Title" value={contact.title} />
          <InfoRow label="Organisation" value={contact.organisation} />
          <InfoRow label="Email" value={<a href={`mailto:${contact.email}`}>{contact.email}</a>} />
          <InfoRow label="Tier" value={<span className={`badge badge-tier${contact.tier}`}>Tier {contact.tier}</span>} />
          <InfoRow label="Track" value={contact.track} />
          <InfoRow label="Status" value={contact.status} />
          <InfoRow label="Date Sent" value={contact.date_sent || '—'} />
          <InfoRow label="Response" value={contact.response || '—'} />
        </div>

        {/* Notes + Email Preview */}
        <div className="detail-card">
          <div className="detail-card-title">Personalisation Notes</div>
          <div className="notes-box">
            {contact.notes || <span style={{ color: 'var(--text-muted)' }}>No notes added.</span>}
          </div>

          <div style={{ marginTop: '20px' }}>
            <div className="detail-card-title">Email Preview</div>
            {preview ? (
              <div>
                <div className="email-subject">Subject: {preview.subject}</div>
                <div className="email-preview">{preview.body}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No preview available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showEmailModal && preview && (
        <EmailModal
          contact={contact}
          preview={preview}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          contact={contact}
          onSave={handleEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'} {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailModal({ contact, preview, onClose }) {
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '680px', width: '100%' }}>
        <div className="modal-title">✉ Email Preview — {contact.name}</div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>To</div>
          <div style={{ fontSize: '13px', color: 'var(--text)' }}>{contact.name} &lt;{contact.email}&gt;</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Subject</div>
          <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span>{preview.subject}</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '11px', padding: '4px 8px', flexShrink: 0 }}
              onClick={() => copyToClipboard(preview.subject)}
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Body</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              onClick={() => copyToClipboard(preview.body)}
            >
              Copy body
            </button>
          </div>
          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '13px',
            lineHeight: '1.7',
            color: 'var(--text)',
            whiteSpace: 'pre-wrap',
            maxHeight: '380px',
            overflowY: 'auto',
          }}>
            {preview.body}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button
            className="btn btn-primary"
            onClick={() => copyToClipboard(`Subject: ${preview.subject}\n\n${preview.body}`)}
          >
            Copy full email
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function EditModal({ contact, onSave, onClose }) {
  const [form, setForm] = useState({
    name: contact.name || '',
    title: contact.title || '',
    organisation: contact.organisation || '',
    email: contact.email || '',
    tier: contact.tier || 2,
    track: contact.track || 'Track 1',
    status: contact.status || 'Not Started',
    notes: contact.notes || '',
    response: contact.response || ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">✏ Edit Contact</div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Organisation</label>
            <input className="form-input" value={form.organisation} onChange={e => setForm(f => ({ ...f, organisation: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Tier</label>
              <select className="form-select" value={form.tier} onChange={e => setForm(f => ({ ...f, tier: Number(e.target.value) }))}>
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Track</label>
              <select className="form-select" value={form.track} onChange={e => setForm(f => ({ ...f, track: e.target.value }))}>
                <option value="Advocacy">Advocacy</option>
                <option value="Track 1">Track 1</option>
                <option value="Track 2">Track 2</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes / Personalisation</label>
            <textarea className="form-textarea" rows={4} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Response</label>
            <textarea className="form-textarea" rows={2} value={form.response} onChange={e => setForm(f => ({ ...f, response: e.target.value }))} placeholder="Record any response received…" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

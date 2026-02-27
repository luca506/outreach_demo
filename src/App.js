import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/ContactsPage';
import ContactDetail from './pages/ContactDetail';
import './App.css';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedContactId, setSelectedContactId] = useState(null);

  function navigateTo(p, contactId = null) {
    setPage(p);
    if (contactId) setSelectedContactId(contactId);
  }

  return (
    <div className="app">
      <Sidebar page={page} navigateTo={navigateTo} />
      <main className="main-content">
        {page === 'dashboard' && <Dashboard navigateTo={navigateTo} />}
        {page === 'contacts' && <ContactsPage navigateTo={navigateTo} />}
        {page === 'contact-detail' && (
          <ContactDetail
            contactId={selectedContactId}
            navigateTo={navigateTo}
          />
        )}
      </main>
    </div>
  );
}

function Sidebar({ page, navigateTo }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">B</div>
        <div>
          <div className="logo-name">Braind</div>
          <div className="logo-sub">Outreach</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${page === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigateTo('dashboard')}
        >
          <span className="nav-icon">▦</span>
          Dashboard
        </button>
        <button
          className={`nav-item ${page === 'contacts' || page === 'contact-detail' ? 'active' : ''}`}
          onClick={() => navigateTo('contacts')}
        >
          <span className="nav-icon">◎</span>
          Contacts
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px 0' }}>
          Demo mode — no backend required
        </div>
      </div>
    </aside>
  );
}

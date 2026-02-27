import React, { useState, useEffect } from 'react';
import { getStats } from '../api';

export default function Dashboard({ navigateTo }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadStats() {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="loading"><div className="spinner" /> Loading dashboard…</div>
  );

  const trackMap = {};
  (stats?.byTrack || []).forEach(t => { trackMap[t.track] = t.c; });
  const tierMap = {};
  (stats?.byTier || []).forEach(t => { tierMap[t.tier] = t.c; });

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">Real-time overview of your Braind outreach campaign</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Contacts" value={stats?.total || 0} cls="highlight" />
        <StatCard label="Not Started" value={stats?.notStarted || 0} />
        <StatCard label="Drafts Created" value={stats?.draftCreated || 0} cls="warning" />
        <StatCard label="Sent" value={stats?.sent || 0} cls="highlight" />
        <StatCard label="Responded" value={stats?.responded || 0} cls="success" />
        <StatCard label="Meetings Booked" value={stats?.meetingBooked || 0} cls="success" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <SectionCard title="By Track">
          <BarItem label="Advocacy" value={trackMap['Advocacy'] || 0} total={stats?.total} color="#f87171" />
          <BarItem label="Track 1 (Public Sector)" value={trackMap['Track 1'] || 0} total={stats?.total} color="#60a5fa" />
          <BarItem label="Track 2 (Commercial)" value={trackMap['Track 2'] || 0} total={stats?.total} color="#c084fc" />
        </SectionCard>

        <SectionCard title="By Tier">
          <BarItem label="Tier 1 (Ministers)" value={tierMap[1] || 0} total={stats?.total} color="var(--tier1)" />
          <BarItem label="Tier 2 (CEOs/Leaders)" value={tierMap[2] || 0} total={stats?.total} color="var(--tier2)" />
          <BarItem label="Tier 3 (Partners)" value={tierMap[3] || 0} total={stats?.total} color="var(--tier3)" />
        </SectionCard>

        <SectionCard title="Pipeline Progress">
          <PipelineRow label="Not Started" value={stats?.notStarted || 0} total={stats?.total} color="var(--text-muted)" />
          <PipelineRow label="Draft Created" value={stats?.draftCreated || 0} total={stats?.total} color="var(--warning)" />
          <PipelineRow label="Sent" value={stats?.sent || 0} total={stats?.total} color="var(--info)" />
          <PipelineRow label="Responded" value={stats?.responded || 0} total={stats?.total} color="var(--success)" />
          <PipelineRow label="Meeting Booked" value={stats?.meetingBooked || 0} total={stats?.total} color="var(--success)" />
        </SectionCard>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Campaign Legend</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <LegendCard
            color="var(--tier1)"
            badge="Tier 1 — Advocacy"
            heading="Senior Politicians & Officials"
            body="Goal is relationship-building and visibility — not a sales pitch. We are asking for guidance and a brief call. Emails position BraindAI as an ambitious Cork-founded company that wants to support Ireland's AI leadership vision."
          />
          <LegendCard
            color="var(--tier2)"
            badge="Tier 2 — Track 1"
            heading="AI Audit & Consulting"
            body="For public sector organisations and semi-states behind on digital. Lead with our AI Readiness Assessment — help them understand where to start before committing to transformation. CTA is a 20-minute call. Note procurement process explicitly."
          />
          <LegendCard
            color="#c084fc"
            badge="Tier 2 — Track 2"
            heading="Bespoke AI Transformation"
            body="For digitally mature organisations ready for custom AI workflows and intelligent automation. Partnership tone — we want to grow with you long-term. Position for future procurement opportunities. Acknowledge tender process."
          />
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigateTo('contacts')}>
            View All Contacts
          </button>
          <button className="btn btn-ghost" onClick={() => navigateTo('contacts')}>
            Filter by Tier 1
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, cls = '' }) {
  return (
    <div className={`stat-card ${cls}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
  );
}

function BarItem({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>{value}</span>
      </div>
      <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

function PipelineRow({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', minWidth: '24px', textAlign: 'right' }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '32px', textAlign: 'right' }}>{pct}%</div>
    </div>
  );
}

function LegendCard({ color, badge, heading, body }) {
  return (
    <div style={{
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '2px',
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: '11px', fontWeight: '700', color: color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{badge}</span>
      </div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{heading}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{body}</div>
    </div>
  );
}

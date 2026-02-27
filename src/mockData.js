/**
 * mockData.js
 * Self-contained in-memory data store and template renderer for the static demo.
 * All mutations (status changes, edits) are applied to the module-level array
 * so they persist within the browser session.
 */

// ---------------------------------------------------------------------------
// Template rendering (ported from server/src/templates.js)
// ---------------------------------------------------------------------------

const TEMPLATES = {
  Advocacy: {
    subject: "BraindAI \u2014 Supporting Ireland's AI Leadership",
    body: `Dear {{name}},

I hope this message finds you well. My name is Luca Mariotti \u2014 I'm Head of Operations at BraindAI, a Cork-founded, Irish-built AI company. I'm reaching out with genuine respect for the work you're doing to shape Ireland's digital future.

Ireland is at a defining moment. With the EU Council Presidency beginning in July 2026 and the EU AI Summit coming to Dublin in October 2026, the decisions made in the months ahead will determine whether Ireland emerges as a genuine leader in AI \u2014 or watches that opportunity pass to others.

The Taoiseach has spoken clearly about his ambition for indigenous Irish companies to be at the heart of Ireland's AI story. We share that ambition deeply. BraindAI was founded in Cork, built by an Irish team, and our focus is entirely on helping Irish organisations \u2014 public and private \u2014 harness AI in a practical, responsible, and sovereign way.

We're not writing to sell anything. We're writing because we want to understand how a company like ours can best contribute to the national vision you're helping to shape. We'd welcome the chance to introduce ourselves and to listen.

Would you or a member of your team be open to a brief call at your convenience? Even fifteen minutes would mean a great deal to us.

With real respect and ambition,

Luca Mariotti
Head of Operations, BraindAI
luca@braindai.ie | braindai.ie
Cork, Ireland`,
  },

  "Track 1": {
    subject: "BraindAI \u2014 Understanding Your AI Readiness",
    body: `Dear {{name}},

I'm writing to introduce BraindAI \u2014 a Cork-based Irish AI company that helps public sector organisations and semi-states understand exactly where they stand on AI readiness, before committing to any transformation programme.

Since the publication of the Digital Ireland strategy, many organisations are under pressure to demonstrate a credible AI plan. In our experience, the challenge isn't a lack of ambition \u2014 it's not knowing where to start. That's precisely what we help with.

BraindAI offers a structured AI Readiness Assessment: a clear, honest audit of your organisation's current data landscape, processes, and capability. We work alongside your existing teams, identify where AI can genuinely add value \u2014 efficiency, cost reduction, service improvement \u2014 and deliver a practical roadmap, typically within four weeks. There's no obligation to proceed beyond that.

We have experience advising organisations that support UK government bodies, and we're bringing that expertise home to Ireland.

I want to be clear: we're not asking for a contract. We're introducing ourselves so that when AI procurement opportunities arise at {{organisation}}, you know who we are and what we stand for. Any formal engagement would, of course, go through the appropriate public procurement process.

Could we arrange a 20-minute call at your convenience?

Kind regards,

Luca Mariotti
Head of Operations, BraindAI
luca@braindai.ie | braindai.ie
Cork, Ireland`,
  },

  "Track 2": {
    subject: "BraindAI \u2014 A Partnership for AI Transformation",
    body: `Dear {{name}},

I'm Luca Mariotti, Head of Operations at BraindAI \u2014 a Cork-founded Irish AI company. I'm reaching out because we believe {{organisation}} is exactly the kind of forward-thinking organisation we want to build a long-term relationship with.

The organisations we admire most aren't the ones chasing AI for its own sake \u2014 they're the ones who understand that lasting transformation comes from embedding intelligent systems thoughtfully, at every layer of the business. Custom AI workflows. Intelligent automation. Smarter decision support. Not as one-off projects, but as a shared journey.

Ireland's Digital Ireland strategy has raised the bar. Boards and leadership teams are being asked to show not just an interest in AI, but genuine progress. We want to be the Irish company that helps organisations like {{organisation}} answer that question with confidence.

We're a young company, but we're serious about building deep, lasting partnerships with organisations that are ready to move. We're not here to pitch a product and disappear \u2014 we want to understand your priorities and grow alongside you.

We understand fully that formal engagement with an organisation of your scale would go through public tender and procurement. We're not asking to skip that process \u2014 we're asking to be on your radar when those opportunities arise.

Would you be open to an exploratory conversation? We'd welcome the chance to listen as much as to share what we're building.

With best regards,

Luca Mariotti
Head of Operations, BraindAI
luca@braindai.ie | braindai.ie
Cork, Ireland`,
  },
};

export function renderTemplate(track, contact) {
  const tmpl = TEMPLATES[track] || TEMPLATES["Track 1"];
  const render = (str) =>
    str
      .replace(/\{\{name\}\}/g, contact.name)
      .replace(/\{\{title\}\}/g, contact.title || '')
      .replace(/\{\{organisation\}\}/g, contact.organisation || '');
  return { subject: render(tmpl.subject), body: render(tmpl.body) };
}

// ---------------------------------------------------------------------------
// Contacts — full seed data with some realistic statuses for demo realism
// ---------------------------------------------------------------------------

const NOW = '2026-02-27 09:00:00';

function c(id, name, title, organisation, email, tier, track, status = 'Not Started', date_sent = '') {
  return { id, name, title, organisation, email, tier, track, status, date_sent, response: '', notes: '', address: '', created_at: NOW, updated_at: NOW };
}

// Mutable array — mutations persist for the browser session
const contacts = [
  // --- Tier 1 Advocacy ---
  c(1,  'Miche\u00e1l Martin',   'Taoiseach',                                        'Dept. of the Taoiseach',           'micheal.martin@oireachtas.ie',     1, 'Advocacy', 'Sent',          '2026-02-10'),
  c(2,  'Niamh Smyth',           'Minister of State for AI & Digital Transformation', 'Dept. Enterprise, Trade & Employment', 'niamh.smyth@oireachtas.ie',     1, 'Advocacy', 'Sent',          '2026-02-10'),
  c(3,  'Se\u00e1n Canney',      'Minister of State for Digital Infrastructure & Skills', 'Dept. Environment & Communications', 'sean.canney@oireachtas.ie',  1, 'Advocacy', 'Not Started',   ''),
  c(4,  'Peter Burke',           'Minister for Enterprise, Trade & Employment',        'Dept. Enterprise, Trade & Employment', 'peter.burke@oireachtas.ie',     1, 'Advocacy', 'Not Started',   ''),
  c(5,  'Malcolm Byrne',         'Chair, Oireachtas AI Committee',                    'Oireachtas',                       'malcolm.byrne@oireachtas.ie',      1, 'Advocacy', 'Responded',     '2026-02-12'),

  // --- Tier 1 Track 1 ---
  c(6,  "Darragh O'Brien",       'Minister for Housing',                              'Dept. Housing, Local Government & Heritage', 'darragh.obrien@oireachtas.ie', 1, 'Track 1', 'Not Started', ''),
  c(7,  'Donal Burke',           'Minister for Education',                            'Dept. Education',                  'donal.burke@oireachtas.ie',        1, 'Track 1', 'Not Started',   ''),
  c(8,  'Minister',              'Minister',                                          'Dept. Social Protection',          'socialprotection@gov.ie',          1, 'Track 1', 'Not Started',   ''),

  // --- Tier 2 Track 1: Semi-states and transport ---
  c(9,  'Donal Geoghegan',       'CEO',    'An Post',                           'info@anpost.com',      2, 'Track 1', 'Not Started',  ''),
  c(10, 'CEO',                   'CEO',    'CIE Group',                         'info@cie.ie',          2, 'Track 1', 'Not Started',  ''),
  c(11, 'CEO',                   'CEO',    'Irish Rail (Iarn\u00f3d \u00c9ireann)', 'info@irishrail.ie', 2, 'Track 1', 'Not Started',  ''),
  c(12, 'CEO',                   'CEO',    'Bus \u00c9ireann',                  'info@buseireann.ie',   2, 'Track 1', 'Not Started',  ''),
  c(13, 'Bernard Gloster',       'CEO',    'HSE (Health Service Executive)',     'info@hse.ie',          2, 'Track 1', 'Draft Created',''),
  c(14, 'CEO',                   'CEO',    'RT\u00c9',                          'info@rte.ie',          2, 'Track 1', 'Not Started',  ''),

  // --- Tier 2 Track 1: Local authorities ---
  c(15, 'Ann Doherty',           'Chief Executive', 'Cork City Council',         'info@corkcity.ie',     2, 'Track 1', 'Meeting Booked', '2026-02-14'),
  c(16, 'Chief Executive',       'Chief Executive', 'Cork County Council',       'info@corkcoco.ie',     2, 'Track 1', 'Responded',      '2026-02-15'),
  c(17, 'Chief Executive',       'Chief Executive', 'Dublin City Council',       'info@dublincity.ie',   2, 'Track 1', 'Sent',           '2026-02-17'),
  c(18, 'Chief Executive',       'Chief Executive', 'Fingal County Council',     'info@fingal.ie',       2, 'Track 1', 'Not Started',    ''),
  c(19, 'Chief Executive',       'Chief Executive', 'D\u00fan Laogha\u00edre-Rathdown Council', 'info@dlrcoco.ie', 2, 'Track 1', 'Not Started', ''),
  c(20, 'Chief Executive',       'Chief Executive', 'South Dublin County Council','info@sdublincoco.ie',  2, 'Track 1', 'Not Started',    ''),
  c(21, 'Chief Executive',       'Chief Executive', 'Galway City Council',       'info@galwaycity.ie',   2, 'Track 1', 'Not Started',    ''),
  c(22, 'Chief Executive',       'Chief Executive', 'Galway County Council',     'info@galwaycoco.ie',   2, 'Track 1', 'Not Started',    ''),
  c(23, 'Chief Executive',       'Chief Executive', 'Limerick City & County Council', 'info@limerick.ie', 2, 'Track 1', 'Not Started',   ''),
  c(24, 'Chief Executive',       'Chief Executive', 'Waterford City & County Council', 'info@waterfordcouncil.ie', 2, 'Track 1', 'Not Started', ''),
  c(25, 'Chief Executive',       'Chief Executive', 'Kerry County Council',      'info@kerrycoco.ie',    2, 'Track 1', 'Not Started',    ''),
  c(26, 'Chief Executive',       'Chief Executive', 'Tipperary County Council',  'info@tipperarycoco.ie',2, 'Track 1', 'Not Started',    ''),
  c(27, 'Chief Executive',       'Chief Executive', 'Wexford County Council',    'info@wexfordcoco.ie',  2, 'Track 1', 'Not Started',    ''),
  c(28, 'Chief Executive',       'Chief Executive', 'Wicklow County Council',    'info@wicklowcoco.ie',  2, 'Track 1', 'Not Started',    ''),
  c(29, 'Chief Executive',       'Chief Executive', 'Kildare County Council',    'info@kildarecoco.ie',  2, 'Track 1', 'Not Started',    ''),
  c(30, 'Chief Executive',       'Chief Executive', 'Meath County Council',      'info@meathcoco.ie',    2, 'Track 1', 'Not Started',    ''),
  c(31, 'Chief Executive',       'Chief Executive', 'Louth County Council',      'info@louthcoco.ie',    2, 'Track 1', 'Not Started',    ''),
  c(32, 'Chief Executive',       'Chief Executive', 'Mayo County Council',       'info@mayococo.ie',     2, 'Track 1', 'Not Started',    ''),
  c(33, 'Chief Executive',       'Chief Executive', 'Sligo County Council',      'info@sligococo.ie',    2, 'Track 1', 'Not Started',    ''),
  c(34, 'Chief Executive',       'Chief Executive', 'Donegal County Council',    'info@donegalcoco.ie',  2, 'Track 1', 'Not Started',    ''),
  c(35, 'Chief Executive',       'Chief Executive', 'Roscommon County Council',  'info@roscommoncoco.ie',2, 'Track 1', 'Not Started',    ''),
  c(36, 'Chief Executive',       'Chief Executive', 'Cavan County Council',      'info@cavancoco.ie',    2, 'Track 1', 'Not Started',    ''),
  c(37, 'Chief Executive',       'Chief Executive', 'Monaghan County Council',   'info@monaghancoco.ie', 2, 'Track 1', 'Not Started',    ''),
  c(38, 'Chief Executive',       'Chief Executive', 'Leitrim County Council',    'info@leitrimcoco.ie',  2, 'Track 1', 'Not Started',    ''),
  c(39, 'Chief Executive',       'Chief Executive', 'Longford County Council',   'info@longfordcoco.ie', 2, 'Track 1', 'Not Started',    ''),
  c(40, 'Chief Executive',       'Chief Executive', 'Westmeath County Council',  'info@westmeathcoco.ie',2, 'Track 1', 'Not Started',    ''),
  c(41, 'Chief Executive',       'Chief Executive', 'Offaly County Council',     'info@offalycoco.ie',   2, 'Track 1', 'Not Started',    ''),
  c(42, 'Chief Executive',       'Chief Executive', 'Laois County Council',      'info@laoiscoco.ie',    2, 'Track 1', 'Not Started',    ''),
  c(43, 'Chief Executive',       'Chief Executive', 'Kilkenny County Council',   'info@kilkennycoco.ie', 2, 'Track 1', 'Not Started',    ''),
  c(44, 'Chief Executive',       'Chief Executive', 'Carlow County Council',     'info@carlowcoco.ie',   2, 'Track 1', 'Not Started',    ''),
  c(45, 'Chief Executive',       'Chief Executive', 'Clare County Council',      'info@clarecoco.ie',    2, 'Track 1', 'Not Started',    ''),

  // --- Tier 2 Track 2: Digitally mature semi-states and financial bodies ---
  c(46, 'Gabriel Makhlouf',      'Governor',  'Central Bank of Ireland',         'enquiries@centralbank.ie',         2, 'Track 2', 'Sent',          '2026-02-18'),
  c(47, 'CEO',                   'CEO',       'ESB (Electricity Supply Board)',   'info@esb.ie',                      2, 'Track 2', 'Draft Created', ''),
  c(48, 'CEO',                   'CEO',       'Bord G\u00e1is Energy',           'info@bordgais.ie',                 2, 'Track 2', 'Not Started',   ''),
  c(49, 'CEO',                   'CEO',       'Dublin Airport Authority (daa)',   'info@daa.ie',                      2, 'Track 2', 'Not Started',   ''),
  c(50, 'CEO',                   'CEO',       'Irish Water (Uisce \u00c9ireann)', 'info@water.ie',                    2, 'Track 2', 'Not Started',   ''),
  c(51, 'CEO',                   'CEO',       'Coillte',                          'info@coillte.ie',                  2, 'Track 2', 'Not Started',   ''),
  c(52, 'CEO',                   'CEO',       'Bord na M\u00f3na',               'info@bordnamona.ie',               2, 'Track 2', 'Not Started',   ''),
  c(53, 'CEO',                   'CEO',       'Transport Infrastructure Ireland (TII)', 'info@tii.ie',              2, 'Track 2', 'Not Started',   ''),
  c(54, "Cora O'Brien",          'CEO',       'Insurance Ireland',                'info@insuranceireland.eu',          2, 'Track 2', 'Not Started',   ''),
  c(55, 'Ann Prendergast',       'CEO',       'Brokers Ireland',                  'ann.prendergast@brokersireland.ie',2, 'Track 2', 'Not Started',   ''),
  c(56, 'CEO',                   'CEO',       'Financial Services Ireland (IBEC)','info@ibec.ie',                     2, 'Track 2', 'Not Started',   ''),
  c(57, 'Dr John Lonsdale',      'CEO',       'CeADAR (National AI Centre)',      'info@ceadar.ie',                   2, 'Track 2', 'Not Started',   ''),
  c(58, 'CEO',                   'CEO',       'Skillnet Ireland',                 'info@skillnetireland.ie',           2, 'Track 2', 'Not Started',   ''),
  c(59, 'CEO',                   'CEO',       'SOLAS',                            'info@solas.ie',                    2, 'Track 2', 'Not Started',   ''),

  // --- Tier 3 Advocacy ---
  c(60, 'Michael Lohan',         'CEO',       'IDA Ireland',                      'idaireland@ida.ie',                3, 'Advocacy', 'Not Started',  ''),
];

// ---------------------------------------------------------------------------
// Filtering / sorting helpers (mirrors server contacts.js query logic)
// ---------------------------------------------------------------------------

function filterContacts({ search, track, tier, status } = {}) {
  let result = contacts.slice();
  if (track)  result = result.filter(c => c.track === track);
  if (tier)   result = result.filter(c => c.tier === Number(tier));
  if (status) result = result.filter(c => c.status === status);
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(c =>
      (c.name || '').toLowerCase().includes(s) ||
      (c.organisation || '').toLowerCase().includes(s) ||
      (c.email || '').toLowerCase().includes(s)
    );
  }
  // ORDER BY tier ASC, track ASC, name ASC
  result.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (a.track !== b.track) return a.track.localeCompare(b.track);
    return a.name.localeCompare(b.name);
  });
  return result;
}

function findById(id) {
  return contacts.find(c => c.id === Number(id)) || null;
}

function patchContact(id, data) {
  const idx = contacts.findIndex(c => c.id === Number(id));
  if (idx === -1) return null;
  contacts[idx] = { ...contacts[idx], ...data, updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19) };
  return contacts[idx];
}

// ---------------------------------------------------------------------------
// Stats computation (mirrors server contacts.js /stats/summary)
// ---------------------------------------------------------------------------

function computeStats() {
  const total = contacts.length;
  const statusCounts = {};
  const trackCounts = {};
  const tierCounts = {};

  contacts.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    trackCounts[c.track]   = (trackCounts[c.track]   || 0) + 1;
    tierCounts[c.tier]     = (tierCounts[c.tier]     || 0) + 1;
  });

  return {
    total,
    notStarted:    statusCounts['Not Started']    || 0,
    draftCreated:  statusCounts['Draft Created']  || 0,
    sent:          statusCounts['Sent']            || 0,
    responded:     statusCounts['Responded']       || 0,
    meetingBooked: statusCounts['Meeting Booked']  || 0,
    byTrack: Object.entries(trackCounts).map(([track, c]) => ({ track, c })),
    byTier:  Object.entries(tierCounts).map(([tier, c])   => ({ tier: Number(tier), c })),
  };
}

// ---------------------------------------------------------------------------
// Promise wrapper — mimics the { data: ... } shape axios returns
// ---------------------------------------------------------------------------

function ok(data) {
  return Promise.resolve({ data });
}

// ---------------------------------------------------------------------------
// Public mock API — same signatures as client/src/api.js
// ---------------------------------------------------------------------------

export const mockGetContacts     = (params)     => ok(filterContacts(params));
export const mockGetContact      = (id)         => ok(findById(id));
export const mockUpdateContact   = (id, data)   => ok(patchContact(id, data));
export const mockPreviewTemplate = (id)         => {
  const contact = findById(id);
  if (!contact) return Promise.reject(new Error('Not found'));
  return ok(renderTemplate(contact.track, contact));
};
export const mockGetStats        = ()           => ok(computeStats());

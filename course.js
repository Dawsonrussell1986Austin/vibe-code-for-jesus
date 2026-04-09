// =============================================================================
// Vibe Code for Jesus — course.js
// Hash-routed single-page course app: dashboard, module list, module viewer,
// live Q&A, community, account. Uses auth.js for user state.
// =============================================================================

import { requireAuth, signOut } from './auth.js';

// ---------- Course content ----------
const MODULES = [
  {
    n: '01',
    slug: 'foundations',
    title: 'Foundations & mindset',
    duration: '14 min',
    summary: 'What vibe coding actually is, why Claude Code is a generational shift, and the mindset that lets total beginners ship like senior engineers.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'What "vibe coding" really means (and what it doesn\'t)',
      'Why Claude Code is a 10× shift, not just another AI tool',
      'The "ship today" mindset — taste over perfection',
      'How to think about building with AI as your senior teammate'
    ],
    homework: { title: 'Pick your project', file: 'module-01-pick-your-project.pdf' }
  },
  {
    n: '02',
    slug: 'setting-up',
    title: 'Setting up Claude Code',
    duration: '18 min',
    summary: 'Install Claude Code, configure your terminal, and run your first real prompt. We walk you through every click, on camera.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'Install Claude Code on Mac, Windows, or Linux',
      'Configure your terminal and shell',
      'Create your first project folder',
      'Run your first prompt and see Claude write real code',
      'Trust mode, permissions, and how to stay safe'
    ],
    homework: { title: 'Install + first prompt checklist', file: 'module-02-install-checklist.pdf' }
  },
  {
    n: '03',
    slug: 'prompting',
    title: 'Prompting like a pro',
    duration: '22 min',
    summary: 'The exact prompts, patterns, and CLAUDE.md tricks that turn Claude into a senior teammate who writes clean, working code on the first try.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'The anatomy of a 10× prompt',
      'CLAUDE.md — your project\'s persistent brain',
      '5 prompt patterns we use every day',
      'How to debug a prompt that\'s going sideways',
      'The "ask before you build" pattern'
    ],
    homework: { title: '50 battle-tested prompt templates', file: 'module-03-prompt-library.zip' }
  },
  {
    n: '04',
    slug: 'github',
    title: 'GitHub without the fear',
    duration: '16 min',
    summary: 'Create a repo, commit your work, push to GitHub, and use branches confidently. No prior Git experience required.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'What Git and GitHub actually are (in plain English)',
      'Create your first repo and push your first commit',
      'Branches, pulls, and merges without breaking things',
      'How to never lose your work again',
      'The "let Claude do the git stuff" workflow'
    ],
    homework: { title: 'Your first GitHub repo', file: 'module-04-first-repo.pdf' }
  },
  {
    n: '05',
    slug: 'vercel',
    title: 'Deploying with Vercel',
    duration: '12 min',
    summary: 'Take your project from your laptop to a real, shareable URL on the internet — in under 10 minutes, for free.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'What deployment actually means',
      'Connect Vercel to your GitHub repo',
      'Push → live URL in under 60 seconds',
      'Custom domains and how to point them',
      'Environment variables and secrets'
    ],
    homework: { title: 'Deploy checklist + free domain ideas', file: 'module-05-deploy-checklist.pdf' }
  },
  {
    n: '06',
    slug: 'first-website',
    title: 'Build your first website',
    duration: '38 min',
    summary: 'Follow along as we vibe code a beautiful, fast, mobile-ready website from scratch. Yours by the end of this module.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'Pick your stack (we recommend Next.js + Tailwind)',
      'Generate the entire landing page with one prompt',
      'Add your own copy, brand, and images',
      'Make it mobile-perfect',
      'Ship it and share the URL'
    ],
    homework: { title: 'Website starter kit + brand template', file: 'module-06-website-starter.zip' }
  },
  {
    n: '07',
    slug: 'first-app',
    title: 'Build your first app or SaaS',
    duration: '52 min',
    summary: 'Add a database, authentication, and AI features. Ship a real product people can actually use — and that you can charge for.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'Pick your idea (we walk you through 5 starter ideas)',
      'Add a database with Supabase',
      'Add Google + magic link login',
      'Add an AI feature with Claude',
      'Polish, ship, and share'
    ],
    homework: { title: 'SaaS starter kit (auth + db + AI)', file: 'module-07-saas-starter.zip' }
  },
  {
    n: '08',
    slug: 'get-paid',
    title: 'Get paid: Stripe, subscriptions & billing',
    duration: '34 min',
    featured: true,
    summary: 'Connect Stripe, collect one-time payments, run monthly subscriptions, send invoices, and handle online billing — all in under an hour. Yes, your project can make real money.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'Set up your Stripe account (US, CA, UK, AU & more)',
      'Add Stripe Checkout to your app in 10 minutes',
      'Collect one-time payments (your first $1)',
      'Run monthly & annual subscriptions',
      'Send invoices and handle refunds',
      'Webhooks 101: knowing when someone pays',
      'Customer portal: let users manage their own billing'
    ],
    homework: { title: 'Stripe integration starter + invoice templates', file: 'module-08-stripe-starter.zip' }
  },
  {
    n: '09',
    slug: 'advanced',
    title: 'Advanced moves & pro workflows',
    duration: '28 min',
    summary: 'MCP servers, sub-agents, hooks, custom skills, and the exact workflows top builders use to ship 10× faster.',
    video: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    lessons: [
      'MCP servers: giving Claude superpowers',
      'Sub-agents and parallel work',
      'Hooks: automating your dev loop',
      'Custom skills for your repeated workflows',
      'The 10× builder weekly routine'
    ],
    homework: { title: 'Pro workflow cheat sheet + MCP starter', file: 'module-09-pro-workflows.pdf' }
  }
];

// Next live Q&A — easy to update
const NEXT_QA = {
  date: 'Thursday, April 16, 2026',
  time: '12:00 PM CT',
  topic: 'Stripe, billing, and your first paying customer',
  joinUrl: 'https://meet.google.com/your-q-and-a-link',
  hosts: 'Will Farmerie & Dawson Russell'
};

// ---------- Progress (localStorage for now; trivial to swap to Supabase) ----------
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('vcfj_progress') || '{}'); }
  catch { return {}; }
}
function saveProgress(p) { localStorage.setItem('vcfj_progress', JSON.stringify(p)); }
function setComplete(slug, done) {
  const p = loadProgress();
  if (done) p[slug] = { completedAt: new Date().toISOString() };
  else delete p[slug];
  saveProgress(p);
}
function isComplete(slug) { return !!loadProgress()[slug]; }
function completedCount() { return Object.keys(loadProgress()).length; }

// ---------- DOM helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// ---------- Views ----------
function viewDashboard(user) {
  const total = MODULES.length;
  const done = completedCount();
  const pct = Math.round((done / total) * 100);
  const nextModule = MODULES.find(m => !isComplete(m.slug)) || MODULES[0];
  const firstName = user.name.split(' ')[0] || user.name;

  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Welcome back</p>
        <h1 class="main-title">Hey ${esc(firstName)} &mdash; ready to ship?</h1>
      </div>
      <div class="header-actions">
        <span class="header-pill">${done}/${total} modules complete</span>
      </div>
    </header>

    <section class="dash-grid">
      <div class="dash-card dash-card-resume">
        <p class="dash-eyebrow">Pick up where you left off</p>
        <div class="dash-resume-num">${nextModule.n}</div>
        <h2 class="dash-resume-title">${esc(nextModule.title)}</h2>
        <p class="dash-resume-summary">${esc(nextModule.summary)}</p>
        <div class="dash-resume-meta">
          <span>${esc(nextModule.duration)}</span>
          <span>•</span>
          <span>${nextModule.lessons.length} lessons</span>
          <span>•</span>
          <span>1 download</span>
        </div>
        <a href="#module/${nextModule.slug}" class="btn btn-dark">${done === 0 ? 'Start Module 01' : 'Resume module ' + nextModule.n}</a>
      </div>

      <div class="dash-card dash-card-qa">
        <p class="dash-eyebrow">Next live Q&amp;A</p>
        <h3 class="dash-qa-title">${esc(NEXT_QA.topic)}</h3>
        <div class="dash-qa-meta">
          <div><strong>${esc(NEXT_QA.date)}</strong></div>
          <div>${esc(NEXT_QA.time)}</div>
          <div class="dash-qa-hosts">with ${esc(NEXT_QA.hosts)}</div>
        </div>
        <a href="${esc(NEXT_QA.joinUrl)}" target="_blank" rel="noopener" class="btn btn-dark btn-block">Join the call</a>
        <p class="dash-qa-fineprint">Held every Thursday at 12:00 PM CT. Bring your code, your questions, your stuck spots.</p>
      </div>
    </section>

    <section class="progress-block">
      <div class="progress-block-head">
        <h3>Your 3&#8209;hour build path</h3>
        <span class="progress-block-pct">${pct}%</span>
      </div>
      <div class="progress-bar progress-bar-lg">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
    </section>

    <section class="module-list">
      <div class="section-head">
        <h3>All modules</h3>
        <a href="#modules" class="section-head-link">View all →</a>
      </div>
      <div class="module-cards">
        ${MODULES.slice(0, 6).map(renderModuleCard).join('')}
      </div>
    </section>
  `;
}

function renderModuleCard(m) {
  const done = isComplete(m.slug);
  const featuredCls = m.featured ? ' module-row-featured' : '';
  return `
    <a href="#module/${m.slug}" class="module-row${featuredCls}${done ? ' module-row-done' : ''}">
      <div class="module-row-num">${m.n}</div>
      <div class="module-row-meta">
        <div class="module-row-title">${esc(m.title)}${m.featured ? ' <span class="money-tag">make money</span>' : ''}</div>
        <div class="module-row-summary">${esc(m.summary)}</div>
        <div class="module-row-foot">
          <span>${esc(m.duration)}</span>
          <span>•</span>
          <span>${m.lessons.length} lessons</span>
          <span>•</span>
          <span>1 download</span>
        </div>
      </div>
      <div class="module-row-state">${done ? '<span class="state-check">✓</span>' : '<span class="state-arrow">→</span>'}</div>
    </a>
  `;
}

function viewAllModules() {
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Curriculum</p>
        <h1 class="main-title">All modules</h1>
        <p class="main-sub">Nine focused modules. Three hours. One launched, money-ready project — yours.</p>
      </div>
    </header>
    <div class="module-cards">
      ${MODULES.map(renderModuleCard).join('')}
    </div>
  `;
}

function viewModule(slug) {
  const m = MODULES.find(x => x.slug === slug);
  if (!m) return viewNotFound();
  const done = isComplete(m.slug);
  const idx = MODULES.indexOf(m);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  return `
    <header class="main-header">
      <a href="#dashboard" class="back-link">← Dashboard</a>
    </header>

    <article class="module-view">
      <div class="module-view-head">
        <div class="module-view-num">Module ${m.n}${m.featured ? ' &middot; <span class="money-tag">make money</span>' : ''}</div>
        <h1 class="module-view-title">${esc(m.title)}</h1>
        <div class="module-view-meta">
          <span>${esc(m.duration)}</span>
          <span>•</span>
          <span>${m.lessons.length} lessons</span>
          <span>•</span>
          <span>1 download</span>
        </div>
      </div>

      <div class="video-wrap">
        <iframe src="${esc(m.video)}" allowfullscreen frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>

      <div class="module-grid-2col">
        <div>
          <h2 class="module-h2">What you&rsquo;ll learn</h2>
          <p class="module-p">${esc(m.summary)}</p>

          <h3 class="module-h3">Step&#8209;by&#8209;step</h3>
          <ol class="module-steps">
            ${m.lessons.map(l => `<li>${esc(l)}</li>`).join('')}
          </ol>
        </div>

        <aside class="module-sidebar">
          <div class="module-side-card">
            <p class="dash-eyebrow">Homework</p>
            <h4 class="module-side-title">${esc(m.homework.title)}</h4>
            <a href="downloads/${esc(m.homework.file)}" class="btn btn-dark btn-block" download>Download homework</a>
            <p class="module-side-fine">PDF or zip · ready in seconds</p>
          </div>

          <div class="module-side-card">
            <p class="dash-eyebrow">Live Q&amp;A this week</p>
            <h4 class="module-side-title">${esc(NEXT_QA.topic)}</h4>
            <p class="module-side-meta">${esc(NEXT_QA.date)} · ${esc(NEXT_QA.time)}</p>
            <a href="${esc(NEXT_QA.joinUrl)}" target="_blank" rel="noopener" class="btn btn-ghost btn-block">Add to calendar</a>
          </div>

          <div class="module-side-card module-side-card-mark">
            <label class="check-row">
              <input type="checkbox" id="completeChk" ${done ? 'checked' : ''} />
              <span>Mark module as complete</span>
            </label>
          </div>
        </aside>
      </div>

      <nav class="module-nav">
        ${prev ? `<a class="module-nav-prev" href="#module/${prev.slug}">← ${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a class="module-nav-next" href="#module/${next.slug}">${esc(next.title)} →</a>` : '<a class="module-nav-next" href="#dashboard">Back to dashboard →</a>'}
      </nav>
    </article>
  `;
}

function viewQA() {
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Live Q&amp;A</p>
        <h1 class="main-title">Code Hour</h1>
        <p class="main-sub">Every Thursday. Bring your code, your stuck spots, your questions.</p>
      </div>
    </header>
    <section class="qa-grid">
      <div class="dash-card dash-card-qa">
        <p class="dash-eyebrow">This week</p>
        <h3 class="dash-qa-title">${esc(NEXT_QA.topic)}</h3>
        <div class="dash-qa-meta">
          <div><strong>${esc(NEXT_QA.date)}</strong></div>
          <div>${esc(NEXT_QA.time)}</div>
          <div class="dash-qa-hosts">with ${esc(NEXT_QA.hosts)}</div>
        </div>
        <a href="${esc(NEXT_QA.joinUrl)}" target="_blank" rel="noopener" class="btn btn-dark btn-block">Join the call</a>
      </div>
      <div class="dash-card">
        <h3 class="dash-qa-title">How Code Hour works</h3>
        <ul class="qa-list">
          <li>Held every Thursday at 12:00 PM CT</li>
          <li>Live on Google Meet — link emailed an hour before</li>
          <li>Bring questions, screen shares, broken code, big ideas</li>
          <li>Will and Dawson take questions live</li>
          <li>Recordings posted in the community after</li>
        </ul>
      </div>
    </section>
  `;
}

function viewCommunity() {
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Community</p>
        <h1 class="main-title">Join the builders</h1>
        <p class="main-sub">Real people building real things, sharing wins and stuck spots.</p>
      </div>
    </header>
    <div class="dash-card">
      <h3>Discord community</h3>
      <p>Our Discord is where builders trade prompts, share launches, and help each other ship. No drama, no spam — just builders.</p>
      <a href="#" class="btn btn-dark">Join the Discord</a>
    </div>
  `;
}

function viewAccount(user) {
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Settings</p>
        <h1 class="main-title">Your account</h1>
      </div>
    </header>
    <div class="dash-card account-card">
      <div class="account-row">
        <span class="account-label">Name</span>
        <span class="account-value">${esc(user.name)}</span>
      </div>
      <div class="account-row">
        <span class="account-label">Email</span>
        <span class="account-value">${esc(user.email)}</span>
      </div>
      <div class="account-row">
        <span class="account-label">Sign in method</span>
        <span class="account-value">${esc(user.provider)}</span>
      </div>
      <div class="account-row">
        <span class="account-label">Plan</span>
        <span class="account-value">The 3-Hour Challenge</span>
      </div>
      <div class="account-actions">
        <button class="btn btn-ghost" id="resetProgress">Reset progress</button>
        <button class="btn btn-dark" id="signOutBtn">Sign out</button>
      </div>
    </div>
  `;
}

function viewNotFound() {
  return `<div class="dash-card"><h2>Not found</h2><p><a href="#dashboard">← Back to dashboard</a></p></div>`;
}

// ---------- Router ----------
function parseHash() {
  const h = (window.location.hash || '#dashboard').slice(1);
  if (h.startsWith('module/')) return { route: 'module', slug: h.split('/')[1] };
  return { route: h || 'dashboard' };
}

function updateSidebar() {
  const { route } = parseHash();
  document.querySelectorAll('.side-link').forEach(a => {
    a.classList.toggle('side-link-active', a.dataset.route === route || (route === 'module' && a.dataset.route === 'modules'));
  });
  const total = MODULES.length;
  const done = completedCount();
  const pct = Math.round((done / total) * 100);
  $('#sidebarProgressFill').style.width = pct + '%';
  $('#sidebarProgressText').textContent = `${done} of ${total} complete`;
}

async function render() {
  const user = await requireAuth();
  if (!user) return;

  // Sidebar user
  $('#userName').textContent = user.name;
  $('#userEmail').textContent = user.email;
  $('#userAvatar').textContent = (user.name[0] || 'U').toUpperCase();

  const { route, slug } = parseHash();
  let html = '';
  switch (route) {
    case 'dashboard': html = viewDashboard(user); break;
    case 'modules':   html = viewAllModules(); break;
    case 'module':    html = viewModule(slug); break;
    case 'qa':        html = viewQA(); break;
    case 'community': html = viewCommunity(); break;
    case 'account':   html = viewAccount(user); break;
    default:          html = viewNotFound();
  }
  $('#mainContent').innerHTML = html;
  window.scrollTo(0, 0);
  updateSidebar();

  // Wire up dynamic interactions per view
  const chk = $('#completeChk');
  if (chk) {
    chk.addEventListener('change', () => {
      setComplete(slug, chk.checked);
      updateSidebar();
    });
  }
  const reset = $('#resetProgress');
  if (reset) reset.addEventListener('click', () => {
    if (confirm('Reset all module progress?')) {
      localStorage.removeItem('vcfj_progress');
      render();
    }
  });
  const so = $('#signOutBtn');
  if (so) so.addEventListener('click', signOut);
}

// ---------- Init ----------
window.addEventListener('hashchange', render);
$('#logoutBtn').addEventListener('click', signOut);
render();

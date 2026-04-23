// =============================================================================
// The Genesis Challenge — course.js
// Hash-routed single-page course app: dashboard, module list, module viewer,
// live Q&A, community, account. Uses auth.js for user state.
// =============================================================================

import { requireAuth, signOut } from './auth.js';

// ---------- Course content ----------
const MODULES = [
  {
    n: '01', slug: 'foundations',
    title: 'Foundations & mindset',
    duration: '14 min',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
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
    n: '02', slug: 'setting-up',
    title: 'Setting up Claude Code',
    duration: '18 min',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
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
    n: '03', slug: 'prompting',
    title: 'Prompting like a pro',
    duration: '22 min',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
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
    n: '04', slug: 'github',
    title: 'GitHub without the fear',
    duration: '16 min',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
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
    n: '05', slug: 'vercel',
    title: 'Deploying with Vercel',
    duration: '12 min',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
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
    n: '06', slug: 'first-website',
    title: 'Build your first website',
    duration: '38 min',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80',
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
    n: '07', slug: 'first-app',
    title: 'Build your first app or SaaS',
    duration: '52 min',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
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
    n: '08', slug: 'get-paid',
    title: 'Get paid: Stripe, subscriptions & billing',
    duration: '34 min',
    featured: true,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
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
    n: '09', slug: 'advanced',
    title: 'Advanced moves & pro workflows',
    duration: '28 min',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
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
// State per module slug: { videoWatched, homeworkDownloaded, completedAt }
function loadProgress() {
  try { return JSON.parse(localStorage.getItem('vcfj_progress') || '{}'); }
  catch { return {}; }
}
function saveProgress(p) { localStorage.setItem('vcfj_progress', JSON.stringify(p)); }
function getModuleState(slug) {
  const p = loadProgress();
  return p[slug] || { videoWatched: false, homeworkDownloaded: false, completedAt: null };
}
function setModuleState(slug, patch) {
  const p = loadProgress();
  p[slug] = { ...getModuleState(slug), ...patch };
  saveProgress(p);
}
function setComplete(slug, done) {
  const p = loadProgress();
  if (done) p[slug] = { ...getModuleState(slug), completedAt: new Date().toISOString() };
  else { p[slug] = { ...getModuleState(slug), completedAt: null }; }
  saveProgress(p);
}
function isComplete(slug) {
  const s = getModuleState(slug);
  return !!s.completedAt;
}
function completedCount() {
  const p = loadProgress();
  return Object.values(p).filter(v => v && v.completedAt).length;
}
function isUnlocked(slug) {
  // Module 1 is always unlocked. Subsequent modules require previous to be complete.
  const idx = MODULES.findIndex(m => m.slug === slug);
  if (idx <= 0) return true;
  return isComplete(MODULES[idx - 1].slug);
}
function canMarkComplete(slug) {
  const s = getModuleState(slug);
  return s.videoWatched && s.homeworkDownloaded;
}

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
  const unlocked = isUnlocked(m.slug);
  const featuredCls = m.featured ? ' module-row-featured' : '';
  const lockedCls = !unlocked ? ' module-row-locked' : '';
  const doneCls = done ? ' module-row-done' : '';
  const stateIcon = !unlocked ? '<span class="state-lock">🔒</span>' : (done ? '<span class="state-check">✓</span>' : '<span class="state-arrow">→</span>');
  return `
    <a href="#module/${m.slug}" class="module-row${featuredCls}${doneCls}${lockedCls}">
      <div class="module-row-thumb" style="background-image:url('${esc(m.image)}')"></div>
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
          ${!unlocked ? '<span>•</span><span class="row-locked-pill">Locked</span>' : ''}
        </div>
      </div>
      <div class="module-row-state">${stateIcon}</div>
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
  const unlocked = isUnlocked(m.slug);
  const idx = MODULES.indexOf(m);
  const prev = MODULES[idx - 1];
  const next = MODULES[idx + 1];

  // Locked view — user hasn't completed previous module
  if (!unlocked) {
    return `
      <header class="main-header">
        <a href="#dashboard" class="back-link">← Dashboard</a>
      </header>
      <article class="module-view module-locked">
        <div class="locked-icon">🔒</div>
        <div class="module-view-num">Module ${m.n} · Locked</div>
        <h1 class="module-view-title">${esc(m.title)}</h1>
        <p class="locked-msg">Complete <strong>Module ${prev.n}: ${esc(prev.title)}</strong> first to unlock this one.</p>
        <p class="locked-sub">We gate the modules in order so you actually finish the build instead of skipping ahead. Trust the path &mdash; you&rsquo;re going to ship something real.</p>
        <a href="#module/${prev.slug}" class="btn btn-dark">Go to Module ${prev.n}</a>
      </article>
    `;
  }

  const state = getModuleState(m.slug);
  const canMark = canMarkComplete(m.slug);

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

      <div class="video-wrap video-wrap-placeholder" id="videoWrap">
        <div class="video-placeholder">
          <div class="video-placeholder-eyebrow">
            <span class="video-placeholder-pulse"></span>
            Doors open Friday, May 1
          </div>
          <h3 class="video-placeholder-title">Module videos drop Friday, May 1.</h3>
          <p class="video-placeholder-sub">We&rsquo;re putting the finishing touches on every lesson so you can ship something real on day one. You&rsquo;re on the waitlist &mdash; we&rsquo;ll email you the moment they&rsquo;re live.</p>
          <a href="#dashboard" class="btn btn-dark">Back to dashboard</a>
        </div>
      </div>

      <div class="gate-row">
        <label class="gate-step gate-step-disabled">
          <input type="checkbox" disabled />
          <span class="gate-num">1</span>
          <span class="gate-text">Watch the video <em>(unlocks April&nbsp;14)</em></span>
        </label>
        <label class="gate-step ${state.homeworkDownloaded ? 'gate-step-done' : ''}">
          <input type="checkbox" id="hwChk" ${state.homeworkDownloaded ? 'checked' : ''} />
          <span class="gate-num">2</span>
          <span class="gate-text">I&rsquo;ve downloaded the homework</span>
        </label>
        <label class="gate-step gate-step-disabled">
          <input type="checkbox" disabled />
          <span class="gate-num">3</span>
          <span class="gate-text">Mark module complete <em>(unlocks April&nbsp;14)</em></span>
        </label>
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
            <a href="downloads/${esc(m.homework.file)}" class="btn btn-dark btn-block" id="hwLink" download>Download homework</a>
            <p class="module-side-fine">PDF or zip · ready in seconds</p>
          </div>

          <div class="module-side-card">
            <p class="dash-eyebrow">Live Q&amp;A this week</p>
            <h4 class="module-side-title">${esc(NEXT_QA.topic)}</h4>
            <p class="module-side-meta">${esc(NEXT_QA.date)} · ${esc(NEXT_QA.time)}</p>
            <a href="${esc(NEXT_QA.joinUrl)}" target="_blank" rel="noopener" class="btn btn-ghost btn-block">Add to calendar</a>
          </div>
        </aside>
      </div>

      <nav class="module-nav">
        ${prev ? `<a class="module-nav-prev" href="#module/${prev.slug}">← ${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? (done ? `<a class="module-nav-next" href="#module/${next.slug}">${esc(next.title)} →</a>` : `<span class="module-nav-next module-nav-disabled">🔒 Complete this module to unlock ${esc(next.title)}</span>`) : '<a class="module-nav-next" href="#dashboard">Back to dashboard →</a>'}
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
        <p class="main-sub">Every Thursday at 12pm CT. Bring your code, your stuck spots, your questions.</p>
      </div>
    </header>

    <section class="qa-hero">
      <div class="qa-hero-image">
        <img src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1600&q=80" alt="People on a video conference call together" loading="lazy" />
        <div class="qa-hero-overlay"></div>
        <div class="qa-hero-badges">
          <div class="qa-live-pill"><span class="qa-live-dot"></span> Live this Thursday</div>
        </div>
        <div class="qa-hero-faces">
          <div class="qa-face qa-face-1">
            <div class="qa-face-name">Will F.</div>
            <div class="qa-face-mic">🎙</div>
          </div>
          <div class="qa-face qa-face-2">
            <div class="qa-face-name">Dawson R.</div>
            <div class="qa-face-mic">🎙</div>
          </div>
          <div class="qa-face qa-face-3">
            <div class="qa-face-name">Pastor Mike</div>
          </div>
          <div class="qa-face qa-face-4">
            <div class="qa-face-name">Sarah K.</div>
          </div>
          <div class="qa-face qa-face-5">
            <div class="qa-face-name">Marcus J.</div>
          </div>
          <div class="qa-face qa-face-6">
            <div class="qa-face-name">+ 47 more</div>
          </div>
        </div>
      </div>
    </section>

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
        <p class="qa-fineprint">Link opens Google Meet in a new tab. Camera optional, microphone encouraged.</p>
      </div>
      <div class="dash-card">
        <h3 class="dash-qa-title">How Code Hour works</h3>
        <ul class="qa-list">
          <li>Held every Thursday at 12:00 PM CT</li>
          <li>Live on Google Meet &mdash; link emailed an hour before</li>
          <li>Bring questions, screen shares, broken code, big ideas</li>
          <li>Will and Dawson take questions live</li>
          <li>Recordings posted in the community after</li>
        </ul>
      </div>
    </section>

    <section class="qa-upcoming">
      <h3 class="qa-section-title">Upcoming sessions</h3>
      <div class="qa-upcoming-list">
        <div class="qa-upcoming-row">
          <div class="qa-upcoming-date">
            <div class="qa-up-mo">APR</div>
            <div class="qa-up-day">16</div>
          </div>
          <div class="qa-upcoming-meta">
            <div class="qa-upcoming-topic">Stripe, billing, and your first paying customer</div>
            <div class="qa-upcoming-sub">Thursday &middot; 12:00 PM CT &middot; with Will &amp; Dawson</div>
          </div>
          <div class="qa-up-pill qa-up-pill-live">Live</div>
        </div>
        <div class="qa-upcoming-row">
          <div class="qa-upcoming-date">
            <div class="qa-up-mo">APR</div>
            <div class="qa-up-day">23</div>
          </div>
          <div class="qa-upcoming-meta">
            <div class="qa-upcoming-topic">Deploying to Vercel: domains, env vars, and the gotchas</div>
            <div class="qa-upcoming-sub">Thursday &middot; 12:00 PM CT &middot; with Will</div>
          </div>
          <div class="qa-up-pill">Upcoming</div>
        </div>
        <div class="qa-upcoming-row">
          <div class="qa-upcoming-date">
            <div class="qa-up-mo">APR</div>
            <div class="qa-up-day">30</div>
          </div>
          <div class="qa-upcoming-meta">
            <div class="qa-upcoming-topic">Friday Demo Day &mdash; show what you built this month</div>
            <div class="qa-upcoming-sub">Thursday &middot; 12:00 PM CT &middot; with Dawson</div>
          </div>
          <div class="qa-up-pill">Upcoming</div>
        </div>
        <div class="qa-upcoming-row">
          <div class="qa-upcoming-date">
            <div class="qa-up-mo">MAY</div>
            <div class="qa-up-day">07</div>
          </div>
          <div class="qa-upcoming-meta">
            <div class="qa-upcoming-topic">CLAUDE.md masterclass &mdash; the file that changes everything</div>
            <div class="qa-upcoming-sub">Thursday &middot; 12:00 PM CT &middot; with Will &amp; Dawson</div>
          </div>
          <div class="qa-up-pill">Upcoming</div>
        </div>
      </div>
    </section>

    <section class="qa-recordings">
      <h3 class="qa-section-title">Recent recordings</h3>
      <div class="qa-rec-grid">
        <a href="#" class="qa-rec-card">
          <div class="qa-rec-thumb" style="background-image: url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80')"><span class="qa-rec-duration">68 min</span></div>
          <div class="qa-rec-meta">
            <div class="qa-rec-date">Apr 9, 2026</div>
            <div class="qa-rec-title">Supabase RLS, Resend, and the Vercel env var trap</div>
          </div>
        </a>
        <a href="#" class="qa-rec-card">
          <div class="qa-rec-thumb" style="background-image: url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80')"><span class="qa-rec-duration">72 min</span></div>
          <div class="qa-rec-meta">
            <div class="qa-rec-date">Apr 2, 2026</div>
            <div class="qa-rec-title">Pricing your first product (without losing your nerve)</div>
          </div>
        </a>
        <a href="#" class="qa-rec-card">
          <div class="qa-rec-thumb" style="background-image: url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80')"><span class="qa-rec-duration">61 min</span></div>
          <div class="qa-rec-meta">
            <div class="qa-rec-date">Mar 26, 2026</div>
            <div class="qa-rec-title">Going from "it works locally" to "it works in production"</div>
          </div>
        </a>
      </div>
    </section>
  `;
}

// ---------- Community feed (built-in, no Discord) ----------
const SEED_POSTS = [
  {
    id: 'p3',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '1 day ago',
    body: 'Heads up everyone — Code Hour this Thursday is going to focus on Stripe + subscriptions. If you\'re working on Module 8 bring your stuck spots and we\'ll work through them live. 12pm CT as always.',
    likes: 24,
    tag: 'Announcement',
    pinned: true,
    replies: [
      { author: 'Sarah K.', initials: 'SK', timeAgo: '23 hours ago', body: 'Will be there! Bringing my webhook nightmare with me.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '22 hours ago', body: 'Any chance you\'ll cover handling subscription cancellations gracefully? That\'s where I keep tripping.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '22 hours ago', body: 'Yes — adding it to the agenda right now Marcus. Good call.' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '20 hours ago', body: 'Will be on a hospital visit but the recording is enough for me. Thanks for posting these always.' },
      { author: 'Emily R.', initials: 'ER', timeAgo: '14 hours ago', body: 'First time joining live. Do I need to download Zoom or is it in the app?' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '13 hours ago', body: 'Right inside the app Emily — Live Q&A tab on the left. Just click in 2 minutes before noon.' }
    ]
  },
  {
    id: 'p1',
    author: 'Pastor Mike',
    initials: 'PM',
    timeAgo: '2 hours ago',
    body: 'Just shipped my church\'s new sermon archive page in like 40 minutes. Module 6 is gold. Already getting comments from members about how much faster it loads. Thank you Will and Dawson 🙏',
    likes: 12,
    tag: 'Win',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 hour ago', body: 'Mike this is huge. Drop the link when you\'re ready, I want to share it on the next Code Hour as a case study.' },
      { author: 'Sarah K.', initials: 'SK', timeAgo: '1 hour ago', body: 'How did you handle the audio embeds? Did you self-host or use an existing service?' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '55 min ago', body: 'Sarah we\'re still on Buzzsprout for hosting — I just had Claude pull their oEmbed and drop it into a card layout. Took maybe 6 prompts.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '40 min ago', body: 'Pastor this is the kind of post that keeps me showing up. Congrats man.' }
    ]
  },
  {
    id: 'p2',
    author: 'Sarah K.',
    initials: 'SK',
    timeAgo: '5 hours ago',
    body: 'Stuck on Module 8 — Stripe webhook isn\'t firing in local dev. I\'m using ngrok like the lesson says but Claude keeps telling me my secret is wrong even though I just regenerated it. What am I missing?',
    likes: 3,
    tag: 'Help',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '4 hours ago', body: 'Two things to check: (1) is the webhook secret you\'re using the one Stripe shows you in the ngrok endpoint setup, not your account-level one? They\'re different. (2) Did you restart your dev server after putting the new secret in .env.local? Next.js will not pick it up otherwise.' },
      { author: 'Sarah K.', initials: 'SK', timeAgo: '4 hours ago', body: 'OH. Number 2 was it. I cannot believe that was the whole thing. Restart fixed it. Webhook is firing now. Bless you Dawson.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '3 hours ago', body: 'Saving this thread, I have a feeling I\'m going to need it later this week.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '3 hours ago', body: 'Adding a "restart your dev server after env changes" note to Module 8. This bites everyone once.' },
      { author: 'Hannah B.', initials: 'HB', timeAgo: '2 hours ago', body: 'I just hit this exact issue last week. Wish I had seen the post.' }
    ]
  },
  {
    id: 'p4',
    author: 'Marcus J.',
    initials: 'MJ',
    timeAgo: '1 day ago',
    body: 'First $1 came in this morning. I was not prepared for how good that would feel. Built a sermon outline → slides converter for pastors. $9 one-time. 6 sales in the first 12 hours. Wow.',
    likes: 31,
    tag: 'Win',
    replies: [
      { author: 'Pastor Tom', initials: 'PT', timeAgo: '23 hours ago', body: 'Marcus link please, I will literally buy this right now.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '23 hours ago', body: 'Pastor Tom — sermonslides.app. Still rough around the edges but functional.' },
      { author: 'Pastor Tom', initials: 'PT', timeAgo: '22 hours ago', body: 'Just bought it. Worked first try. You should charge $19.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '22 hours ago', body: 'Marcus this is the post I\'m showing my next discovery call. Congrats. And yes, raise your prices.' },
      { author: 'Emily R.', initials: 'ER', timeAgo: '20 hours ago', body: 'Did you market it at all or just post in this group?' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '19 hours ago', body: 'Just posted in two pastor Facebook groups I was already in. No ads, no list, nothing fancy.' }
    ]
  },
  {
    id: 'p5',
    author: 'Emily R.',
    initials: 'ER',
    timeAgo: '2 days ago',
    body: 'Question for the group: anyone using Supabase for a small group prayer wall? I want emails on new prayer requests but the realtime stuff is overkill for what I need. What did you use?',
    likes: 5,
    tag: 'Question',
    replies: [
      { author: 'Rachel M.', initials: 'RM', timeAgo: '2 days ago', body: 'I built basically this exact thing for our women\'s ministry. Supabase + Resend for the emails. Took a Saturday morning.' },
      { author: 'Emily R.', initials: 'ER', timeAgo: '2 days ago', body: 'Rachel that sounds perfect. How are you triggering the email — database webhook or edge function?' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '2 days ago', body: 'Database webhook on insert → Resend API. Like 30 lines of code total. Claude wrote almost all of it.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 day ago', body: 'Plus one for Resend. Free tier covers 100/day which is plenty for a small group.' }
    ]
  },
  {
    id: 'p6',
    author: 'David L.',
    initials: 'DL',
    timeAgo: '6 hours ago',
    body: 'Shipped my first landing page in 90 minutes flat. I am 47, have never written a line of code in my life, and I am sitting here staring at the deployed URL like it\'s a miracle. Because it is.',
    likes: 28,
    tag: 'Win',
    replies: [
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '5 hours ago', body: 'David this is what got me hooked too. The first deploy is the moment.' },
      { author: 'Hannah B.', initials: 'HB', timeAgo: '4 hours ago', body: 'Drop the link! We need to see it.' },
      { author: 'David L.', initials: 'DL', timeAgo: '3 hours ago', body: 'It\'s for my landscaping business — davidlandscaping.com. Still need to write better copy but the structure is there.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '2 hours ago', body: 'David this looks great. Solid hero, clear pricing. You\'re ahead of 90% of small business sites already.' }
    ]
  },
  {
    id: 'p7',
    author: 'Hannah B.',
    initials: 'HB',
    timeAgo: '8 hours ago',
    body: 'Vercel deployment is giving me a 404 on every page except the home page. Local dev works perfectly. What am I missing?',
    likes: 2,
    tag: 'Help',
    replies: [
      { author: 'Caleb S.', initials: 'CS', timeAgo: '7 hours ago', body: 'Are your file names lowercase? Vercel is case-sensitive but your local Mac probably isn\'t. About.html and about.html are different on the server.' },
      { author: 'Hannah B.', initials: 'HB', timeAgo: '7 hours ago', body: 'Oh. OH. That\'s exactly it. I had About.html and was linking to about.html. Renamed and pushed and it works. Caleb you saved me an evening.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '6 hours ago', body: 'This is one of the most common gotchas in the whole course. We have a 2 minute video on it in Module 5 about the 30 minute mark — worth a rewatch.' }
    ]
  },
  {
    id: 'p8',
    author: 'Pastor Tom',
    initials: 'PT',
    timeAgo: '10 hours ago',
    body: 'Show & tell — our new church website is officially live: gracecov.org. Built it last weekend. Sermon archive, events, what to expect, give button. Old site quote was $11k. New site cost $20.',
    likes: 47,
    tag: 'Show',
    replies: [
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '9 hours ago', body: 'Tom this is beautiful. The "What to expect" page is so warm. I\'m stealing the structure for ours.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '9 hours ago', body: 'The font pairing is on point. What did you go with?' },
      { author: 'Pastor Tom', initials: 'PT', timeAgo: '8 hours ago', body: 'Newsreader for headlines, Inter for body. I literally copied what The Genesis Challenge uses because it looked good 😄' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '7 hours ago', body: 'Imitation, sincerest form, etc 😄 The site looks fantastic Tom.' },
      { author: 'Emily R.', initials: 'ER', timeAgo: '5 hours ago', body: 'Pastor Tom one piece of feedback — the contact form is sending me to a "Thank you" page that 404s. Easy fix but wanted to flag.' },
      { author: 'Pastor Tom', initials: 'PT', timeAgo: '4 hours ago', body: 'Emily THANK YOU. Fixed. This is why this group is the best.' }
    ]
  },
  {
    id: 'p9',
    author: 'Jenna W.',
    initials: 'JW',
    timeAgo: '11 hours ago',
    body: 'Question for the more experienced folks: Cursor vs Claude Code — which one do you actually reach for day to day? I started with Cursor and now I am wondering if I should switch.',
    likes: 8,
    tag: 'Question',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '10 hours ago', body: 'I use both. Claude Code in the terminal for anything that touches multiple files or runs commands (git, deploy, test). Cursor when I want to scrub a single file with inline diffs. They complement each other more than they compete.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '9 hours ago', body: 'Same as Dawson. Claude Code for "go build me this whole feature" and Cursor for "tweak this one function."' },
      { author: 'Jenna W.', initials: 'JW', timeAgo: '8 hours ago', body: 'OK that helps a lot. I was thinking it had to be one or the other.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '7 hours ago', body: 'Module 2 actually walks through both side by side — give it another watch with this question in mind, you\'ll see the split clearly.' }
    ]
  },
  {
    id: 'p10',
    author: 'Aaron P.',
    initials: 'AP',
    timeAgo: '14 hours ago',
    body: 'Built a youth group event app this weekend. Kids check in with their phone, parents get a text when they leave. Took 4 hours. Our youth pastor cried when he saw it.',
    likes: 39,
    tag: 'Win',
    replies: [
      { author: 'Pastor Tim', initials: 'PT', timeAgo: '13 hours ago', body: 'Aaron WHAT. Send me everything. I need this for our youth group yesterday.' },
      { author: 'Aaron P.', initials: 'AP', timeAgo: '12 hours ago', body: 'Pastor Tim — happy to share the codebase. DM me. Stack: Next.js + Supabase + Twilio.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '11 hours ago', body: 'You should productize this. Every children\'s ministry in America would pay for this.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '10 hours ago', body: 'Seriously Aaron. Happy to help you turn this into a real product if you want to talk about it.' }
    ]
  },
  {
    id: 'p11',
    author: 'Rachel M.',
    initials: 'RM',
    timeAgo: '15 hours ago',
    body: 'Supabase Row Level Security is melting my brain. Every policy I write either lets everyone in or lets nobody in. Is there a Module on this I missed?',
    likes: 6,
    tag: 'Help',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '14 hours ago', body: 'RLS is the part of Supabase nobody warns you about. Quick hack: paste your table schema into Claude and say "write me RLS policies that let users only read and write rows where user_id = auth.uid()". 9 times out of 10 it nails it on the first try.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '14 hours ago', body: 'Just tried that. Worked first try. I have been writing these by hand for two days. I want to scream and laugh at the same time.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '12 hours ago', body: 'Saving this. RLS is the wall I keep hitting too.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '10 hours ago', body: 'Adding an "RLS in 6 minutes" lesson to Module 4 this week. Promise.' }
    ]
  },
  {
    id: 'p12',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '18 hours ago',
    body: 'Quick announcement — we just shipped a new mini-module on Stripe Connect for those of you building marketplaces or want to pay out other people. It\'s tucked into Module 8 as a bonus lesson. Go check it out.',
    likes: 19,
    tag: 'Announcement',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '17 hours ago', body: 'YES. I have been waiting for this. Watching tonight.' },
      { author: 'Brandon F.', initials: 'BF', timeAgo: '16 hours ago', body: 'This is exactly what I need for the church platform I\'m building. Thank you Will.' },
      { author: 'Sarah K.', initials: 'SK', timeAgo: '14 hours ago', body: 'Does it cover the express vs standard accounts decision? That\'s where I get stuck on every Connect project.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '13 hours ago', body: 'Yes Sarah — there\'s a full decision tree at the 8 minute mark.' }
    ]
  },
  {
    id: 'p13',
    author: 'Caleb S.',
    initials: 'CS',
    timeAgo: '19 hours ago',
    body: 'Where are you all hosting Bible study notes? I want something my whole small group can edit together but Notion feels like overkill and Google Docs is clunky on mobile.',
    likes: 4,
    tag: 'Question',
    replies: [
      { author: 'Levi B.', initials: 'LB', timeAgo: '18 hours ago', body: 'I built a simple shared notes app with Supabase + a textarea. Took an hour. My group loves it because it\'s just OUR thing.' },
      { author: 'Caleb S.', initials: 'CS', timeAgo: '17 hours ago', body: 'Levi this might be the answer. Did you do auth or just keep it open?' },
      { author: 'Levi B.', initials: 'LB', timeAgo: '16 hours ago', body: 'Magic link login through Supabase. 6 of us are the only ones with the link. Works great.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '14 hours ago', body: 'I\'m doing this next weekend. Stealing the idea.' }
    ]
  },
  {
    id: 'p14',
    author: 'Megan L.',
    initials: 'ML',
    timeAgo: '20 hours ago',
    body: 'GOT MY FIRST PAYING CUSTOMER. $19/month for a sermon prep tool I built two weeks ago. I had to pull over in my car because I was crying. Thank you to everyone in this group who answered my dumb questions along the way.',
    likes: 56,
    tag: 'Win',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '19 hours ago', body: 'Megan this is the moment. Frame the email. Save the screenshot. Remember it.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '19 hours ago', body: 'There were no dumb questions Megan. Congratulations. This is the good stuff.' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '18 hours ago', body: 'Megan I want to be your second customer. Send me the link.' },
      { author: 'Sarah K.', initials: 'SK', timeAgo: '17 hours ago', body: 'CRYING WITH YOU. So happy for you.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '15 hours ago', body: 'Megan you got this. The next 10 customers come faster than the first one I promise.' }
    ]
  },
  {
    id: 'p15',
    author: 'Jacob T.',
    initials: 'JT',
    timeAgo: '22 hours ago',
    body: 'Claude Code keeps editing the wrong file. I tell it to fix the navbar in Header.tsx and it edits Footer.tsx instead. Anyone else hit this?',
    likes: 7,
    tag: 'Help',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '21 hours ago', body: 'Two fixes. (1) Open the file you want changed in your editor before prompting — Claude looks at active files first. (2) Be explicit in the prompt: "Edit /src/components/Header.tsx ONLY. Do not touch other files." Capital letters help, weirdly.' },
      { author: 'Jacob T.', initials: 'JT', timeAgo: '20 hours ago', body: 'Both worked. Especially the explicit path. I was assuming it could read my mind.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '19 hours ago', body: 'I\'ve started giving it the file path AND the function name every time. Saves so much grief.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '18 hours ago', body: 'This is the #1 prompting upgrade. Specificity beats cleverness every time.' }
    ]
  },
  {
    id: 'p16',
    author: 'Pastor Tim',
    initials: 'PT',
    timeAgo: '1 day ago',
    body: 'Show & tell — finally launched my sermon notes search engine. 12 years of my own sermons indexed and searchable by topic, verse, or keyword. Took me three Saturdays. Honestly might be the most useful thing I\'ve ever built for my own ministry.',
    likes: 33,
    tag: 'Show',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 day ago', body: 'Pastor Tim this is exactly the kind of project the Challenge was made for. Personal, practical, would never exist if you waited for someone else to build it.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '1 day ago', body: 'I want to know more about your indexing approach. Did you use embeddings or just full text search?' },
      { author: 'Pastor Tim', initials: 'PT', timeAgo: '23 hours ago', body: 'Dawson — Supabase pgvector for embeddings, OpenAI text-embedding-3-small for the embeddings themselves. Claude walked me through the whole thing. I\'ve never written a database query in my life.' },
      { author: 'Caleb S.', initials: 'CS', timeAgo: '20 hours ago', body: 'Pastor Tim would you be willing to do a guest lesson? I would pay to learn this.' }
    ]
  },
  {
    id: 'p17',
    author: 'Olivia C.',
    initials: 'OC',
    timeAgo: '1 day ago',
    body: 'Domain registrar recommendations? I\'ve always used GoDaddy and I have a feeling that\'s not the move.',
    likes: 3,
    tag: 'Question',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '1 day ago', body: 'Cloudflare Registrar. At cost pricing, no upsells, no nonsense. Move all my domains there years ago.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 day ago', body: 'Plus one Cloudflare. Or Porkbun if you want a friendly UI. Both are night and day better than GoDaddy.' },
      { author: 'Olivia C.', initials: 'OC', timeAgo: '23 hours ago', body: 'Switching everything tomorrow. Thank you both.' }
    ]
  },
  {
    id: 'p18',
    author: 'Brandon F.',
    initials: 'BF',
    timeAgo: '1 day ago',
    body: 'Just cancelled a $400/month SaaS subscription because I rebuilt the same tool for my church in one Saturday. Same features, faster, and I own it now. Three years of payments saved going forward.',
    likes: 41,
    tag: 'Win',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '1 day ago', body: 'Brandon this is the math nobody talks about. $400/mo over 3 years is $14k. That\'s a real number for a church.' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '1 day ago', body: 'What was the SaaS? I bet half of us are paying for the same thing.' },
      { author: 'Brandon F.', initials: 'BF', timeAgo: '1 day ago', body: 'It was a member directory + small group sign up tool. Not naming names because they\'re a fine company, just way overbuilt for what we needed.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '23 hours ago', body: 'I am literally evaluating two of these tools right now. Going to try building it instead.' }
    ]
  },
  {
    id: 'p19',
    author: 'Ruth A.',
    initials: 'RA',
    timeAgo: '1 day ago',
    body: 'Google Auth is redirecting back to localhost:3000 in production and breaking everything. I added the production URL to my Supabase auth settings already. What did I miss?',
    likes: 4,
    tag: 'Help',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '1 day ago', body: 'You probably also need to add the production URL to your Google Cloud Console OAuth credentials under "Authorized redirect URIs". Supabase points at Google, Google has its own list.' },
      { author: 'Ruth A.', initials: 'RA', timeAgo: '1 day ago', body: 'That was it. Two places, both need the URL. Thank you.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '23 hours ago', body: 'Adding a "two places to update redirect URIs" callout to Module 7. This trips literally everyone.' }
    ]
  },
  {
    id: 'p20',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '2 days ago',
    body: 'VIP Slack thread of the week — Marcus J. helping Pastor Tim wire up Stripe webhooks at 11pm on a Tuesday because Tim wanted to get his Sunday giving page live before service. This is why we built the VIP channel. Builders helping builders.',
    likes: 22,
    tag: 'Announcement',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '2 days ago', body: 'It was a fun thread. Tim shipped at 11:47pm and his giving page worked Sunday morning. That\'s the dream.' },
      { author: 'Pastor Tim', initials: 'PT', timeAgo: '2 days ago', body: 'Marcus literally walked me through it on a screen share. I\'m never going back to the old way of doing things.' }
    ]
  },
  {
    id: 'p21',
    author: 'Noah J.',
    initials: 'NJ',
    timeAgo: '2 days ago',
    body: 'Built a website for my friend\'s coffee shop yesterday afternoon. He\'s been saying for two years he needed one. Took three hours including writing all the copy together. He paid me $400 cash and bought me lunch. AI is wild.',
    likes: 36,
    tag: 'Win',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '2 days ago', body: 'Noah you just discovered a side hustle. There are a million coffee shops, restaurants, salons, and small businesses with terrible websites. You can do one a weekend.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '2 days ago', body: 'How did you price it? I\'ve had two friends ask me to do theirs and I have no idea what to charge.' },
      { author: 'Noah J.', initials: 'NJ', timeAgo: '2 days ago', body: 'I told him "whatever feels fair for an afternoon of work". He picked $400 which felt generous to me. Next one I\'ll just say $500 flat.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '1 day ago', body: 'Noah charge $1000 next time. I am dead serious.' }
    ]
  },
  {
    id: 'p22',
    author: 'Faith K.',
    initials: 'FK',
    timeAgo: '2 days ago',
    body: 'Tailwind or vanilla CSS for someone just starting out? I keep going back and forth.',
    likes: 5,
    tag: 'Question',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '2 days ago', body: 'Vanilla CSS. Hot take but here\'s why: when you\'re prompting Claude, vanilla CSS is much easier to read in the diff. Tailwind hides intent behind class names. Once you have a few projects under your belt, switch to Tailwind for speed.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '2 days ago', body: 'I disagree slightly — Tailwind gets you to "looks good" faster as a beginner. But Dawson\'s point about readability is valid. Either is fine, the wrong answer is to spend 3 weeks deciding.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '2 days ago', body: 'OK starting with vanilla. I\'ll switch when it hurts.' }
    ]
  },
  {
    id: 'p23',
    author: 'Daniel R.',
    initials: 'DR',
    timeAgo: '2 days ago',
    body: 'Show & tell — Bible verse memorization app I built for my kids. Spaced repetition, daily reminders, simple progress tracker. They\'ve memorized 14 verses in two weeks. I am the proudest dad on earth.',
    likes: 49,
    tag: 'Show',
    replies: [
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '2 days ago', body: 'Daniel I need this for my own kids. Is it on the App Store or web only?' },
      { author: 'Daniel R.', initials: 'DR', timeAgo: '2 days ago', body: 'Web only — thekidsverses.app. Free, no signup. I just wanted my kids to use it but happy to share.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '2 days ago', body: 'Just shared this with our entire homeschool co-op. You\'re going to get some traffic.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 day ago', body: 'This is the kind of thing that exists ONLY because someone in this group decided they could build it. Beautiful Daniel.' }
    ]
  },
  {
    id: 'p24',
    author: 'Esther N.',
    initials: 'EN',
    timeAgo: '2 days ago',
    body: 'My environment variables work perfectly in local dev but Vercel says they\'re undefined. I added them to the Vercel dashboard. What now?',
    likes: 3,
    tag: 'Help',
    replies: [
      { author: 'Caleb S.', initials: 'CS', timeAgo: '2 days ago', body: 'Did you redeploy after adding them? Env vars only get baked in at build time. Trigger a new deploy and they\'ll show up.' },
      { author: 'Esther N.', initials: 'EN', timeAgo: '2 days ago', body: 'That was it. I assumed they were live the moment I clicked save. Redeployed and everything works. Thank you Caleb.' },
      { author: 'Hannah B.', initials: 'HB', timeAgo: '1 day ago', body: 'Same exact thing happened to me last week. We need a "Vercel gotchas" cheat sheet.' }
    ]
  },
  {
    id: 'p25',
    author: 'Pastor Greg',
    initials: 'PG',
    timeAgo: '3 days ago',
    body: 'I officially cancelled the $9,000 quote I had been sitting on for our church website. Built the new site myself this week. Better than what they were going to give me. Two questions: (1) where do I send the celebration cake to Will and Dawson, and (2) what should I do with the $9k I just saved?',
    likes: 67,
    tag: 'Win',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '3 days ago', body: 'Pastor Greg this is the best thing I\'ve read all week. My answer to question 2: missions budget.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '3 days ago', body: 'I love this on every level. Cake unnecessary. Photo of the live site is the only payment I need.' },
      { author: 'Pastor Greg', initials: 'PG', timeAgo: '3 days ago', body: 'Live site: gracebrazos.org. Missions budget it is.' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '2 days ago', body: 'Greg the site is gorgeous. Welcome to the dark side.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '2 days ago', body: 'I just teared up reading this. Praise God for what he\'s doing in this community.' }
    ]
  },
  {
    id: 'p26',
    author: 'Lydia G.',
    initials: 'LG',
    timeAgo: '3 days ago',
    body: 'I still don\'t fully understand what should go in a CLAUDE.md file vs what should go in a regular prompt. Anyone have a good mental model?',
    likes: 11,
    tag: 'Question',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '3 days ago', body: 'CLAUDE.md = the things you would tell every new contractor on day one. Tech stack, naming conventions, where files live, what NOT to do. Prompts = the actual task. If you find yourself saying the same thing in 3 prompts in a row, it belongs in CLAUDE.md.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '3 days ago', body: 'Plus one Will. My rule of thumb: CLAUDE.md is the "constants" of your project, prompts are the "variables".' },
      { author: 'Lydia G.', initials: 'LG', timeAgo: '2 days ago', body: 'Both of those analogies just made it click. Thank you.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '2 days ago', body: 'Saving this whole thread. This was my sticking point too.' }
    ]
  },
  {
    id: 'p27',
    author: 'Stephen M.',
    initials: 'SM',
    timeAgo: '3 days ago',
    body: 'Show & tell — youth devotional generator for our youth pastor. Pulls from our denomination\'s reading plan, generates discussion questions for the age group, formats it as a printable PDF. Saves him 4 hours a week.',
    likes: 28,
    tag: 'Show',
    replies: [
      { author: 'Aaron P.', initials: 'AP', timeAgo: '3 days ago', body: 'Stephen this is incredible. Youth pastors everywhere need this.' },
      { author: 'Pastor Tim', initials: 'PT', timeAgo: '2 days ago', body: 'Would you be willing to share how you handled the PDF generation? That\'s the part I always get stuck on.' },
      { author: 'Stephen M.', initials: 'SM', timeAgo: '2 days ago', body: 'Pastor Tim — I used react-pdf. Claude wrote 90% of it. I\'ll DM you the relevant files.' }
    ]
  },
  {
    id: 'p28',
    author: 'Mary E.',
    initials: 'ME',
    timeAgo: '3 days ago',
    body: 'Git is yelling at me. I run git commit and it says "please tell me who you are". I\'m me??',
    likes: 9,
    tag: 'Help',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '3 days ago', body: 'Ha! Git wants your name and email. Run these two commands once and you\'re set forever: `git config --global user.name "Mary E."` and `git config --global user.email "you@example.com"`.' },
      { author: 'Mary E.', initials: 'ME', timeAgo: '3 days ago', body: 'Marcus thank you. It worked. Git and I are friends again.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '2 days ago', body: 'This is in Module 3 but I\'ll add a more obvious callout. Easy to miss the first time.' }
    ]
  },
  {
    id: 'p29',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '3 days ago',
    body: 'Last week\'s Code Hour recording is posted in the Live Q&A tab. Topics: Stripe webhooks, RLS policies, Vercel env var gotchas, and an extended Q&A about pricing your first product. ~70 minutes. Worth the watch.',
    likes: 17,
    tag: 'Announcement',
    replies: [
      { author: 'Hannah B.', initials: 'HB', timeAgo: '3 days ago', body: 'Watching now. The pricing section is gold.' },
      { author: 'Megan L.', initials: 'ML', timeAgo: '2 days ago', body: 'The pricing section is actually what gave me the courage to charge $19/mo for my tool. Thanks for that Will.' }
    ]
  },
  {
    id: 'p30',
    author: 'Joshua W.',
    initials: 'JW',
    timeAgo: '3 days ago',
    body: 'Just got my first Stripe payout deposited into my actual bank account. $237. I am sitting here looking at my checking account like it\'s a love letter from God. Six weeks ago I had never heard the word "deploy".',
    likes: 52,
    tag: 'Win',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '3 days ago', body: 'Joshua this is the moment that changes everything. From here forward you\'re a person who builds things and gets paid for them. That\'s a different person than you were 6 weeks ago.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '3 days ago', body: 'Joshua this is going on the homepage if you let me. With your permission of course.' },
      { author: 'Joshua W.', initials: 'JW', timeAgo: '2 days ago', body: 'Will absolutely yes. Use whatever helps another beginner get off the fence.' }
    ]
  },
  {
    id: 'p31',
    author: 'Hope L.',
    initials: 'HL',
    timeAgo: '3 days ago',
    body: 'What are you all using for image generation? I need some hero images for a landing page and I\'m tired of stock photos.',
    likes: 4,
    tag: 'Question',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '3 days ago', body: 'Midjourney for "I need a beautiful image" and DALL-E (via ChatGPT) for "I need a fast iteration". Both are great. Midjourney is more painterly, DALL-E is more literal.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '3 days ago', body: 'Plus one Midjourney. The aesthetic is hard to beat.' },
      { author: 'Hope L.', initials: 'HL', timeAgo: '2 days ago', body: 'Trying Midjourney tonight. Thanks both.' }
    ]
  },
  {
    id: 'p32',
    author: 'Levi B.',
    initials: 'LB',
    timeAgo: '4 days ago',
    body: 'Show & tell — small group attendance tracker I built for our church. Replaces a paper sign in sheet that nobody could read. Group leaders just tap names, the data shows up in a dashboard for the staff. 2 hours of work.',
    likes: 24,
    tag: 'Show',
    replies: [
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '4 days ago', body: 'Levi I have been begging for this for years. Send me the link.' },
      { author: 'Brandon F.', initials: 'BF', timeAgo: '3 days ago', body: 'How are you handling the dashboard side? Is it a separate page or just a Google Sheet view?' },
      { author: 'Levi B.', initials: 'LB', timeAgo: '3 days ago', body: 'Brandon — separate page with simple bar charts. Recharts library, Claude wrote the entire dashboard in one prompt.' }
    ]
  },
  {
    id: 'p33',
    author: 'Naomi V.',
    initials: 'NV',
    timeAgo: '4 days ago',
    body: 'TypeScript errors are making me want to quit. I just want to build a thing. Why does it keep yelling at me about types?',
    likes: 6,
    tag: 'Help',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '4 days ago', body: 'Naomi don\'t quit — paste the entire error into Claude and say "explain this error in plain English and fix it for me". Don\'t try to debug TypeScript in your head, that\'s a fool\'s errand even for pros.' },
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '4 days ago', body: 'Also: you\'re allowed to use `any` as a temporary escape hatch. The TypeScript police will not arrest you. Ship the thing, then come back and tighten types later.' },
      { author: 'Naomi V.', initials: 'NV', timeAgo: '4 days ago', body: 'I needed permission to use `any`. Thank you. I was treating it like a moral failing.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '3 days ago', body: 'Marcus is right. Done > perfect. Always.' }
    ]
  },
  {
    id: 'p34',
    author: 'Pastor Sam',
    initials: 'PS',
    timeAgo: '4 days ago',
    body: 'Built a church directory in 2 hours. Searchable, mobile friendly, photos, contact info, families grouped together. Our admin assistant just hugged me. This was a 3 year unfinished project.',
    likes: 44,
    tag: 'Win',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '4 days ago', body: 'Pastor Sam this is exactly the use case we built the Challenge for. The "3 year unfinished project" line gets me every time.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '3 days ago', body: 'The hug is the real metric. Good job Pastor Sam.' },
      { author: 'Pastor Greg', initials: 'PG', timeAgo: '3 days ago', body: 'Pastor Sam how are you handling photo permissions / privacy? That\'s the part I keep getting stuck on.' },
      { author: 'Pastor Sam', initials: 'PS', timeAgo: '3 days ago', body: 'Greg — auth wall for the directory itself, only members can see it. And families opt in by uploading their own photo. Took the privacy question off my plate entirely.' }
    ]
  },
  {
    id: 'p35',
    author: 'Grace H.',
    initials: 'GH',
    timeAgo: '4 days ago',
    body: 'Best service for transactional email? Need to send password resets, magic links, and order confirmations. Don\'t want to wrestle with deliverability for two weeks.',
    likes: 5,
    tag: 'Question',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '4 days ago', body: 'Resend. Not even close. Their developer experience is the best in the category and the free tier is generous.' },
      { author: 'Caleb S.', initials: 'CS', timeAgo: '4 days ago', body: 'Plus one Resend. Postmark is also great if you want a more "enterprise" feel.' },
      { author: 'Grace H.', initials: 'GH', timeAgo: '3 days ago', body: 'Resend it is. Loved the demo on their homepage.' }
    ]
  },
  {
    id: 'p36',
    author: 'Eli C.',
    initials: 'EC',
    timeAgo: '4 days ago',
    body: 'Show & tell — daily devotional via text message. Built it as a gift for my mom. She gets one verse + a 3 sentence reflection every morning at 7am. She has texted me every single day this week to say it made her cry.',
    likes: 71,
    tag: 'Show',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '4 days ago', body: 'Eli stop, I\'m at the kitchen table, my coffee is now cold because I just spent ten minutes telling my wife about your post.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '4 days ago', body: 'This is the use case. This is why we do this. Eli you should productize this — every adult child has a parent who would love this.' },
      { author: 'Megan L.', initials: 'ML', timeAgo: '3 days ago', body: 'I want this for my mom. Eli is there a way to sign up?' },
      { author: 'Eli C.', initials: 'EC', timeAgo: '3 days ago', body: 'Megan you just talked me into making this a real thing. Building the signup page tonight.' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '2 days ago', body: 'Eli post the link the second it\'s up. I\'ll buy ten of them for the elderly folks in my congregation.' }
    ]
  },
  {
    id: 'p37',
    author: 'Phoebe O.',
    initials: 'PO',
    timeAgo: '4 days ago',
    body: 'My DNS is pointing to Vercel but my old site is still showing. It\'s been an hour. Did I do this wrong?',
    likes: 2,
    tag: 'Help',
    replies: [
      { author: 'Caleb S.', initials: 'CS', timeAgo: '4 days ago', body: 'DNS propagation can take up to 24 hours but usually 10-30 minutes. Try a private/incognito window or use whatsmydns.net to see what other servers around the world are seeing. Your local DNS cache is probably the issue.' },
      { author: 'Phoebe O.', initials: 'PO', timeAgo: '4 days ago', body: 'Incognito window shows the new site. So it\'s working, my browser was just lying to me. Caleb you\'re a saint.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '3 days ago', body: '"My browser was lying to me" should be the Module 5 subtitle.' }
    ]
  },
  {
    id: 'p38',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '5 days ago',
    body: 'New starter kit just dropped — a "small business landing page" template you can clone in one prompt. Tailored for the kind of work a lot of you are doing for friends, churches, and side gigs. Find it under Resources in Module 5.',
    likes: 26,
    tag: 'Announcement',
    replies: [
      { author: 'Noah J.', initials: 'NJ', timeAgo: '5 days ago', body: 'Just used this for a client. Cut another 30 minutes off the build. Thank you.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '4 days ago', body: 'This is going to be my go-to for friend projects. Beautiful template Will.' }
    ]
  },
  {
    id: 'p39',
    author: 'Isaac D.',
    initials: 'ID',
    timeAgo: '5 days ago',
    body: 'Built my sister\'s wedding website this weekend. RSVPs, registry links, schedule, photo gallery, the whole thing. She cried when she saw it. Best brother of the year award I think.',
    likes: 38,
    tag: 'Win',
    replies: [
      { author: 'Hannah B.', initials: 'HB', timeAgo: '5 days ago', body: 'Isaac this is so sweet. Did you build the RSVP form yourself or use a service?' },
      { author: 'Isaac D.', initials: 'ID', timeAgo: '5 days ago', body: 'Built it. Supabase form, Resend confirmation email. The whole thing was maybe 3 hours.' },
      { author: 'Pastor Tom', initials: 'PT', timeAgo: '4 days ago', body: 'Isaac are you taking commissions? My niece is getting married in May.' }
    ]
  },
  {
    id: 'p40',
    author: 'Tabitha R.',
    initials: 'TR',
    timeAgo: '5 days ago',
    body: 'Real beginner question: when do I need a database vs when can I just use a JSON file? I\'m building a small recipe app for our women\'s ministry.',
    likes: 7,
    tag: 'Question',
    replies: [
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '5 days ago', body: 'Great question. Rule of thumb: if the data is read only and you control all of it, JSON file is fine. If users need to add or edit data, you need a database. For your recipe app — if you\'re typing the recipes yourself, JSON. If members add their own recipes, Supabase.' },
      { author: 'Tabitha R.', initials: 'TR', timeAgo: '5 days ago', body: 'That makes total sense. Going JSON for v1 and adding Supabase later if members ask for upload.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '4 days ago', body: 'This is the right call Tabitha. Build the simplest version first, add complexity only when you need it.' }
    ]
  },
  {
    id: 'p41',
    author: 'Gideon T.',
    initials: 'GT',
    timeAgo: '5 days ago',
    body: 'Show & tell — a pastor scheduling app for our staff team. Lets the senior pastor see who\'s preaching, who\'s leading worship, who\'s on hospital visit rotation, all in one calendar view. Took a Saturday and a Sunday afternoon.',
    likes: 19,
    tag: 'Show',
    replies: [
      { author: 'Pastor Sam', initials: 'PS', timeAgo: '5 days ago', body: 'Gideon this is exactly what we\'ve been trying to find for years. Open source it please.' },
      { author: 'Gideon T.', initials: 'GT', timeAgo: '4 days ago', body: 'Pastor Sam — putting it on GitHub this week. Will share the link here when it\'s up.' }
    ]
  },
  {
    id: 'p42',
    author: 'Lois M.',
    initials: 'LM',
    timeAgo: '5 days ago',
    body: 'Stripe is in test mode but I think I have my live key in production. How do I tell which I\'m using right now?',
    likes: 3,
    tag: 'Help',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '5 days ago', body: 'Live keys start with `sk_live_` and test keys start with `sk_test_`. Check the first few characters of your Stripe key in your env vars. If you see `live`, you\'re in production mode.' },
      { author: 'Lois M.', initials: 'LM', timeAgo: '5 days ago', body: 'Marcus thank you. Mine starts with `sk_test_` so I\'m safely in test mode. Whew.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '4 days ago', body: 'Pro tip: name your env vars STRIPE_TEST_SECRET_KEY and STRIPE_LIVE_SECRET_KEY so you can never confuse them again.' }
    ]
  },
  {
    id: 'p43',
    author: 'Pastor Eli',
    initials: 'PE',
    timeAgo: '6 days ago',
    body: 'Kids ministry signup form is DONE. Parents pre-register their kids, we get an organized list, no more paper sign-ins on Sunday morning chaos. Built it after Wednesday night service in like 90 minutes.',
    likes: 27,
    tag: 'Win',
    replies: [
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '6 days ago', body: 'Pastor Eli I am stealing this concept. Sunday morning kids check in is my nightmare.' },
      { author: 'Rachel M.', initials: 'RM', timeAgo: '5 days ago', body: 'How do you handle allergies and special needs notes? That\'s the part our team always struggles with.' },
      { author: 'Pastor Eli', initials: 'PE', timeAgo: '5 days ago', body: 'Rachel — separate field on the form, gets surfaced in the printable check in sheet for the volunteers each week. Game changer.' }
    ]
  },
  {
    id: 'p44',
    author: 'Eunice F.',
    initials: 'EF',
    timeAgo: '6 days ago',
    body: 'Accessibility tools — what are y\'all using? I want to make sure my church site is usable for older members and folks with vision issues.',
    likes: 8,
    tag: 'Question',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '6 days ago', body: 'Three free tools: (1) WAVE browser extension for instant accessibility audit, (2) Lighthouse in Chrome DevTools, (3) just paste your HTML into Claude and ask "what accessibility issues do you see?". That third one is shockingly thorough.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '6 days ago', body: 'And don\'t forget keyboard testing — try navigating your site with only Tab and Enter. If you can\'t, neither can a screen reader user.' },
      { author: 'Eunice F.', initials: 'EF', timeAgo: '5 days ago', body: 'Just ran my site through WAVE and found 11 issues. Fixing tonight. Thank you both.' }
    ]
  },
  {
    id: 'p45',
    author: 'Silas N.',
    initials: 'SN',
    timeAgo: '6 days ago',
    body: 'Show & tell — biblical Greek flashcards app. I\'m studying for my Greek exam and got tired of paper cards. Spaced repetition, audio pronunciation, parsing hints. I\'m using it every day and my classmates want a copy.',
    likes: 22,
    tag: 'Show',
    replies: [
      { author: 'Caleb S.', initials: 'CS', timeAgo: '6 days ago', body: 'Silas as a former Greek student I would have killed for this. Send me the link.' },
      { author: 'Pastor Tim', initials: 'PT', timeAgo: '5 days ago', body: 'Same — and this could easily become a paid app for seminary students. There\'s a market here.' },
      { author: 'Silas N.', initials: 'SN', timeAgo: '5 days ago', body: 'I might explore that after my exam. Right now I just need to pass.' }
    ]
  },
  {
    id: 'p46',
    author: 'Anna P.',
    initials: 'AP',
    timeAgo: '6 days ago',
    body: 'Vercel build is timing out at 15 minutes. It worked yesterday. I haven\'t added anything huge. Help?',
    likes: 4,
    tag: 'Help',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '6 days ago', body: 'Did you maybe `npm install` a giant package? Sometimes a single dependency can balloon build time. Run `npm list --depth=0` to see what\'s installed.' },
      { author: 'Anna P.', initials: 'AP', timeAgo: '6 days ago', body: 'Yeah I added a UI library that turned out to be enormous. Removed it, build is back to 30 seconds. Marcus you genius.' },
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '5 days ago', body: 'Anna this is one of the most common foot guns. Bundlephobia.com is your friend before adding any new package.' }
    ]
  },
  {
    id: 'p47',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '6 days ago',
    body: 'Friday demo day is back! Show up Friday at 1pm CT in the Live Q&A tab and demo what you built this week. 2 minutes per person. Wins, half-built things, ugly first drafts — all welcome. Sign up in the thread below.',
    likes: 18,
    tag: 'Announcement',
    replies: [
      { author: 'Megan L.', initials: 'ML', timeAgo: '6 days ago', body: 'I\'m in. Demo-ing my sermon prep tool.' },
      { author: 'Aaron P.', initials: 'AP', timeAgo: '5 days ago', body: 'I\'m in. Showing the youth check in app.' },
      { author: 'Eli C.', initials: 'EC', timeAgo: '5 days ago', body: 'Putting me down — demoing the SMS devotional thing.' }
    ]
  },
  {
    id: 'p48',
    author: 'Jonah K.',
    initials: 'JK',
    timeAgo: '1 week ago',
    body: 'Replaced Mailchimp with a self built newsletter tool for my list of 800 readers. Cost dropped from $35/month to $0. The whole thing took 3 evenings. Owning your tools feels different than renting them.',
    likes: 33,
    tag: 'Win',
    replies: [
      { author: 'Dawson Russell', initials: 'DR', timeAgo: '1 week ago', body: 'Jonah "owning vs renting" is the line of the week. Stealing it.' },
      { author: 'Faith K.', initials: 'FK', timeAgo: '6 days ago', body: 'How are you handling deliverability? That\'s the only thing that keeps me on Mailchimp.' },
      { author: 'Jonah K.', initials: 'JK', timeAgo: '6 days ago', body: 'Faith — Resend on the back end. Their deliverability is excellent and they handle all the SPF/DKIM stuff for you.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '6 days ago', body: 'Resend has quietly become the answer to half the questions in this group.' }
    ]
  },
  {
    id: 'p49',
    author: 'Priscilla R.',
    initials: 'PR',
    timeAgo: '1 week ago',
    body: 'How are you all handling refunds? My first customer asked for one and I had no system in place. I just refunded them through the Stripe dashboard but it felt clunky.',
    likes: 6,
    tag: 'Question',
    replies: [
      { author: 'Marcus J.', initials: 'MJ', timeAgo: '1 week ago', body: 'For low volume, the Stripe dashboard is honestly fine. Don\'t build a refund admin panel until you\'re processing at least a few refunds a week.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 week ago', body: 'Plus one Marcus. The first 10 of anything should be done manually so you understand what the system actually needs to do. Then automate.' },
      { author: 'Priscilla R.', initials: 'PR', timeAgo: '6 days ago', body: 'OK I was over thinking it. Manual it is.' }
    ]
  },
  {
    id: 'p50',
    author: 'Barnabas L.',
    initials: 'BL',
    timeAgo: '1 week ago',
    body: 'Show & tell — built a church live stream landing page that pulls our YouTube stream into a clean watch experience with the bulletin, song lyrics, and a chat for online viewers. Sunday morning was the first run and it actually worked.',
    likes: 31,
    tag: 'Show',
    replies: [
      { author: 'Pastor Greg', initials: 'PG', timeAgo: '1 week ago', body: 'Barnabas this is incredible. We pay for a service that does basically this and ours is uglier than yours.' },
      { author: 'Will Farmerie', initials: 'WF', timeAgo: '1 week ago', body: 'The chat integration is the part that\'s usually missing from DIY stream pages. How did you handle moderation?' },
      { author: 'Barnabas L.', initials: 'BL', timeAgo: '6 days ago', body: 'Will — Supabase auth wall, only signed in members can post. Two ushers from the in person service moderate from their phones. Worked perfectly.' },
      { author: 'Pastor Mike', initials: 'PM', timeAgo: '6 days ago', body: 'Barnabas would you be willing to share the code? I\'ll happily Venmo you a thank you.' }
    ]
  }
];

function loadCommunityPosts() {
  try {
    const stored = JSON.parse(localStorage.getItem('vcfj_posts') || 'null');
    return stored && Array.isArray(stored) ? stored : SEED_POSTS;
  } catch { return SEED_POSTS; }
}
function saveCommunityPosts(posts) {
  localStorage.setItem('vcfj_posts', JSON.stringify(posts));
}

function viewCommunity(user) {
  const posts = loadCommunityPosts();
  const initials = (user.name[0] || 'U').toUpperCase();
  const totalReplies = posts.reduce((acc, p) => acc + (Array.isArray(p.replies) ? p.replies.length : 0), 0);
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Community</p>
        <h1 class="main-title">The Build Hall</h1>
        <p class="main-sub">Builders sharing wins, asking questions, and helping each other ship. No drama, no spam, no Discord. Just us.</p>
      </div>
    </header>

    <section class="hall-search">
      <div class="hall-search-input-wrap">
        <span class="hall-search-icon">⌕</span>
        <input id="hallSearch" class="hall-search-input" type="search" placeholder="Search wins, questions, Stripe, Supabase, prayer wall, anything…" autocomplete="off" />
        <button class="hall-search-clear" id="hallSearchClear" type="button" aria-label="Clear search" hidden>×</button>
      </div>
      <div class="hall-filters" role="tablist" aria-label="Filter posts">
        <button class="hall-filter hall-filter-active" data-filter="all" type="button">All <span class="hall-filter-count">${posts.length}</span></button>
        <button class="hall-filter" data-filter="Win" type="button">Wins</button>
        <button class="hall-filter" data-filter="Help" type="button">Help</button>
        <button class="hall-filter" data-filter="Question" type="button">Questions</button>
        <button class="hall-filter" data-filter="Show" type="button">Show &amp; tell</button>
        <button class="hall-filter" data-filter="Announcement" type="button">Announcements</button>
      </div>
      <div class="hall-stats">${posts.length} threads &middot; ${totalReplies} replies &middot; updated just now</div>
    </section>

    <section class="composer">
      <div class="composer-avatar">${initials}</div>
      <div class="composer-body">
        <textarea id="composerText" class="composer-input" placeholder="What are you working on, ${esc(user.name.split(' ')[0])}? Wins, stuck spots, questions — all welcome."></textarea>
        <div class="composer-actions">
          <select id="composerTag" class="composer-tag-select">
            <option value="Win">Win 🎉</option>
            <option value="Help">Help</option>
            <option value="Question">Question</option>
            <option value="Show">Show &amp; tell</option>
          </select>
          <button class="btn btn-dark" id="composerPost" type="button">Post to Build Hall</button>
        </div>
      </div>
    </section>

    <section class="feed" id="hallFeed">
      ${posts.map(renderPost).join('')}
    </section>
    <div class="hall-empty" id="hallEmpty" hidden>No threads match that search. Try a different keyword.</div>
  `;
}

function renderPost(p) {
  const replies = Array.isArray(p.replies) ? p.replies : [];
  const replyCount = replies.length;
  const repliesHtml = replies.map(r => `
    <div class="reply">
      <div class="reply-avatar">${esc(r.initials)}</div>
      <div class="reply-body">
        <div class="reply-head">
          <span class="reply-author">${esc(r.author)}</span>
          <span class="reply-time">${esc(r.timeAgo)}</span>
        </div>
        <div class="reply-text">${esc(r.body)}</div>
      </div>
    </div>
  `).join('');
  return `
    <article class="post${p.pinned ? ' post-pinned' : ''}" data-id="${p.id}" data-tag="${esc(p.tag)}" data-search="${esc((p.author + ' ' + p.body + ' ' + p.tag + ' ' + replies.map(r => r.author + ' ' + r.body).join(' ')).toLowerCase())}">
      <div class="post-avatar">${esc(p.initials)}</div>
      <div class="post-body">
        <div class="post-head">
          <div class="post-author">${esc(p.author)}</div>
          ${p.pinned ? '<span class="post-pin">📌 Pinned</span>' : ''}
          <span class="post-time">${esc(p.timeAgo)}</span>
          <span class="post-tag post-tag-${p.tag.toLowerCase()}">${esc(p.tag)}</span>
        </div>
        <div class="post-text">${esc(p.body)}</div>
        <div class="post-actions">
          <button class="post-action" data-action="like" data-id="${p.id}">♥ ${p.likes}</button>
          <button class="post-action" data-action="reply" data-id="${p.id}">💬 ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}</button>
        </div>
        ${replyCount > 0 ? `
          <div class="replies" data-replies="${p.id}" hidden>
            ${repliesHtml}
            <form class="reply-composer" data-reply-form="${p.id}">
              <input type="text" class="reply-input" placeholder="Write a reply…" />
              <button type="submit" class="btn btn-dark btn-sm">Reply</button>
            </form>
          </div>` : ''}
      </div>
    </article>
  `;
}

function viewVIP(user) {
  const isVip = !!loadProgress().vip; // simple flag
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">VIP add&#8209;on</p>
        <h1 class="main-title">${isVip ? 'Welcome to VIP' : 'Get the personal touch'}</h1>
        <p class="main-sub">${isVip ? 'You\'re in. Use the perks below to get unstuck and ship faster.' : 'Add VIP for $97 and get a private 1:1 walkthrough plus the founders\' Slack channel.'}</p>
      </div>
    </header>

    <section class="vip-grid">
      <div class="vip-card vip-card-main">
        <div class="vip-price">
          <span class="vip-price-amount">+$97</span>
          <span class="vip-price-unit">one-time upgrade</span>
        </div>
        <h2 class="vip-headline">The personal walkthrough</h2>
        <p class="vip-sub">A 30-minute private 1:1 with Will or Dawson. Bring whatever you&rsquo;re building, whatever&rsquo;s broken, whatever you can&rsquo;t figure out. We&rsquo;ll look at your code together and unblock you.</p>
        <ul class="vip-features">
          <li><strong>Private 30-minute 1:1</strong> with Will or Dawson on Google Meet</li>
          <li><strong>Founders&rsquo; Slack channel</strong> access &mdash; ask questions anytime</li>
          <li><strong>Priority support</strong> in your inbox</li>
          <li><strong>Personal code review</strong> of one project of your choice</li>
          <li><strong>Lifetime access</strong> &mdash; pay once, keep it forever</li>
        </ul>
        ${isVip
          ? '<a href="#" class="btn btn-dark btn-block" id="bookVip">Book my 1:1 call</a>'
          : '<button class="btn btn-dark btn-block" id="upgradeVip">Upgrade to VIP &middot; $97</button>'}
        <p class="vip-fineprint">${isVip ? 'You can book your call any time before module 9.' : 'One-time. No subscriptions. Counts toward your money-back guarantee.'}</p>
      </div>

      <div class="vip-card">
        <h3 class="vip-side-title">What VIP students say</h3>
        <blockquote class="vip-quote">
          &ldquo;The 30-minute call with Dawson saved me a week of guessing. He pointed me to the right approach in the first five minutes and the rest was just shipping.&rdquo;
          <cite>&mdash; Sarah K., shipped her first SaaS in 4 hours</cite>
        </blockquote>
        <blockquote class="vip-quote">
          &ldquo;I bought VIP because I was scared. Honestly the Slack channel alone is worth it &mdash; Will answered my prompt question at 11pm on a Tuesday.&rdquo;
          <cite>&mdash; Pastor Mike</cite>
        </blockquote>
      </div>
    </section>
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
    case 'community': html = viewCommunity(user); break;
    case 'vip':       html = viewVIP(user); break;
    case 'account':   html = viewAccount(user); break;
    default:          html = viewNotFound();
  }
  $('#mainContent').innerHTML = html;
  window.scrollTo(0, 0);
  updateSidebar();

  // Wire up dynamic interactions per view
  wireModuleHandlers(slug);
  wireCommunityHandlers(user);
  wireVipHandlers();
  wireAccountHandlers();
}

function wireModuleHandlers(slug) {
  // Watch checkbox
  const watchedChk = $('#watchedChk');
  if (watchedChk) {
    watchedChk.addEventListener('change', () => {
      setModuleState(slug, { videoWatched: watchedChk.checked });
      render();
    });
  }
  // Homework checkbox + auto-mark on download click
  const hwChk = $('#hwChk');
  if (hwChk) {
    hwChk.addEventListener('change', () => {
      setModuleState(slug, { homeworkDownloaded: hwChk.checked });
      render();
    });
  }
  const hwLink = $('#hwLink');
  if (hwLink) {
    hwLink.addEventListener('click', () => {
      setModuleState(slug, { homeworkDownloaded: true });
      // Don't re-render immediately so the download still proceeds
      setTimeout(render, 200);
    });
  }
  // Mark complete checkbox
  const chk = $('#completeChk');
  if (chk) {
    chk.addEventListener('change', () => {
      if (!canMarkComplete(slug) && chk.checked) {
        chk.checked = false;
        alert('Please watch the video and download the homework first.');
        return;
      }
      setComplete(slug, chk.checked);
      render();
    });
  }
}

function wireCommunityHandlers(user) {
  const postBtn = $('#composerPost');
  if (postBtn) {
    postBtn.addEventListener('click', () => {
      const text = $('#composerText').value.trim();
      if (!text) return;
      const tag = $('#composerTag').value;
      const posts = loadCommunityPosts();
      posts.unshift({
        id: 'p' + Date.now(),
        author: user.name,
        initials: (user.name[0] || 'U').toUpperCase(),
        timeAgo: 'just now',
        body: text,
        likes: 0,
        tag,
        replies: []
      });
      saveCommunityPosts(posts);
      render();
    });
  }

  // Like button
  document.querySelectorAll('.post-action[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const posts = loadCommunityPosts();
      const p = posts.find(x => x.id === id);
      if (p) { p.likes = (p.likes || 0) + 1; saveCommunityPosts(posts); render(); }
    });
  });

  // Reply toggle
  document.querySelectorAll('.post-action[data-action="reply"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const panel = document.querySelector(`[data-replies="${id}"]`);
      if (panel) {
        panel.hidden = !panel.hidden;
        if (!panel.hidden) {
          const input = panel.querySelector('.reply-input');
          if (input) setTimeout(() => input.focus(), 50);
        }
      }
    });
  });

  // Reply submit
  document.querySelectorAll('[data-reply-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = form.dataset.replyForm;
      const input = form.querySelector('.reply-input');
      const text = input.value.trim();
      if (!text) return;
      const posts = loadCommunityPosts();
      const p = posts.find(x => x.id === id);
      if (!p) return;
      if (!Array.isArray(p.replies)) p.replies = [];
      p.replies.push({
        author: user.name,
        initials: (user.name[0] || 'U').toUpperCase(),
        timeAgo: 'just now',
        body: text
      });
      saveCommunityPosts(posts);
      render();
    });
  });

  // Search
  const searchInput = $('#hallSearch');
  const clearBtn = $('#hallSearchClear');
  const empty = $('#hallEmpty');
  let activeFilter = 'all';

  function applyFilter() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    if (clearBtn) clearBtn.hidden = !q;
    let visible = 0;
    document.querySelectorAll('.feed .post').forEach(article => {
      const haystack = article.dataset.search || '';
      const tag = article.dataset.tag || '';
      const matchesSearch = !q || haystack.includes(q);
      const matchesFilter = activeFilter === 'all' || tag === activeFilter;
      const show = matchesSearch && matchesFilter;
      article.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  }

  if (searchInput) searchInput.addEventListener('input', applyFilter);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (searchInput) { searchInput.value = ''; searchInput.focus(); }
    applyFilter();
  });

  document.querySelectorAll('.hall-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hall-filter').forEach(b => b.classList.remove('hall-filter-active'));
      btn.classList.add('hall-filter-active');
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  });
}

function wireVipHandlers() {
  const upgrade = $('#upgradeVip');
  if (upgrade) {
    upgrade.addEventListener('click', () => {
      if (confirm('Upgrade to VIP for $97? In production this would open Stripe Checkout.')) {
        const p = loadProgress();
        p.vip = { upgradedAt: new Date().toISOString() };
        saveProgress(p);
        render();
      }
    });
  }
  const book = $('#bookVip');
  if (book) book.addEventListener('click', (e) => {
    e.preventDefault();
    alert('VIP booking link would open here. (We\'ll wire this to Calendly in production.)');
  });
}

function wireAccountHandlers() {
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

// =============================================================================
// Vibe Code for Jesus — course.js
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

      <div class="video-wrap" id="videoWrap">
        <iframe src="${esc(m.video)}" allowfullscreen frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </div>

      <div class="gate-row">
        <label class="gate-step ${state.videoWatched ? 'gate-step-done' : ''}">
          <input type="checkbox" id="watchedChk" ${state.videoWatched ? 'checked' : ''} />
          <span class="gate-num">1</span>
          <span class="gate-text">I&rsquo;ve watched the video</span>
        </label>
        <label class="gate-step ${state.homeworkDownloaded ? 'gate-step-done' : ''}">
          <input type="checkbox" id="hwChk" ${state.homeworkDownloaded ? 'checked' : ''} />
          <span class="gate-num">2</span>
          <span class="gate-text">I&rsquo;ve downloaded the homework</span>
        </label>
        <label class="gate-step ${done ? 'gate-step-done' : ''}">
          <input type="checkbox" id="completeChk" ${done ? 'checked' : ''} ${canMark || done ? '' : 'disabled'} />
          <span class="gate-num">3</span>
          <span class="gate-text">Mark module complete</span>
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

// ---------- Community feed (built-in, no Discord) ----------
const SEED_POSTS = [
  {
    id: 'p1',
    author: 'Pastor Mike',
    initials: 'PM',
    timeAgo: '2 hours ago',
    body: 'Just shipped my church\'s new sermon archive page in like 40 minutes. Module 6 is gold. Already getting comments from members about how much faster it loads. Thank you Will and Dawson 🙏',
    likes: 12,
    replies: 4,
    tag: 'Win'
  },
  {
    id: 'p2',
    author: 'Sarah K.',
    initials: 'SK',
    timeAgo: '5 hours ago',
    body: 'Stuck on Module 8 — Stripe webhook isn\'t firing in local dev. Anyone hit this? I\'m using ngrok like the lesson says but Claude keeps telling me my secret is wrong even though I just regenerated it.',
    likes: 3,
    replies: 7,
    tag: 'Help'
  },
  {
    id: 'p3',
    author: 'Will Farmerie',
    initials: 'WF',
    timeAgo: '1 day ago',
    body: 'Heads up everyone — Code Hour this Thursday is going to focus on Stripe + subscriptions. If you\'re working on Module 8 bring your stuck spots and we\'ll work through them live. 12pm CT as always.',
    likes: 24,
    replies: 9,
    tag: 'Announcement',
    pinned: true
  },
  {
    id: 'p4',
    author: 'Marcus J.',
    initials: 'MJ',
    timeAgo: '1 day ago',
    body: 'First $1 came in this morning. I was not prepared for how good that would feel. Built a sermon outline → slides converter for pastors. $9 one-time. 6 sales in the first 12 hours. Wow.',
    likes: 31,
    replies: 11,
    tag: 'Win'
  },
  {
    id: 'p5',
    author: 'Emily R.',
    initials: 'ER',
    timeAgo: '2 days ago',
    body: 'Question for the group: anyone using Supabase for a small group prayer wall? I want emails on new prayer requests but the realtime stuff is overkill for what I need. What did you use?',
    likes: 5,
    replies: 6,
    tag: 'Question'
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
  return `
    <header class="main-header">
      <div>
        <p class="eyebrow">Community</p>
        <h1 class="main-title">The Build Hall</h1>
        <p class="main-sub">Builders sharing wins, asking questions, and helping each other ship. No drama, no spam, no Discord. Just us.</p>
      </div>
    </header>

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

    <section class="feed">
      ${posts.map(renderPost).join('')}
    </section>
  `;
}

function renderPost(p) {
  return `
    <article class="post${p.pinned ? ' post-pinned' : ''}" data-id="${p.id}">
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
          <button class="post-action" data-action="reply" data-id="${p.id}">💬 ${p.replies} ${p.replies === 1 ? 'reply' : 'replies'}</button>
        </div>
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
          &ldquo;The 30-minute call with Dawson saved me a week of frustration. He spotted the bug in 90 seconds.&rdquo;
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
        replies: 0,
        tag
      });
      saveCommunityPosts(posts);
      render();
    });
  }
  document.querySelectorAll('.post-action[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const posts = loadCommunityPosts();
      const p = posts.find(x => x.id === id);
      if (p) { p.likes = (p.likes || 0) + 1; saveCommunityPosts(posts); render(); }
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

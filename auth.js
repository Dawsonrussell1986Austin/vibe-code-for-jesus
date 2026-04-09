// =============================================================================
// The Genesis Challenge — auth.js
// Handles Google OAuth + email magic link via Supabase, with a graceful
// localStorage demo fallback so the course works locally without any setup.
//
// To enable real auth:
//   1. Create a free project at https://supabase.com
//   2. In Authentication → Providers, enable Google + Email
//   3. Add your site URL (e.g. http://localhost:4173) to the redirect allow list
//   4. Replace SUPABASE_URL and SUPABASE_ANON_KEY below with your values
// =============================================================================

const SUPABASE_URL  = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const DEMO_MODE = SUPABASE_URL.includes('YOUR_PROJECT') || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('YOUR_');

let supabase = null;
if (!DEMO_MODE) {
  // Lazy-load supabase-js from CDN only when real auth is configured
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ---------- Public API ----------
export async function signInWithGoogle() {
  if (DEMO_MODE) {
    setDemoUser({ email: 'demo@itwasverygood.com', name: 'Demo Student', provider: 'google' });
    window.location.href = 'course.html';
    return;
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/course.html' }
  });
  if (error) throw error;
}

export async function signInWithMagicLink(email) {
  if (DEMO_MODE) {
    setDemoUser({ email, name: email.split('@')[0], provider: 'magic' });
    return { demo: true };
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + '/course.html' }
  });
  if (error) throw error;
  return { demo: false };
}

export async function signOut() {
  if (DEMO_MODE) {
    localStorage.removeItem('vcfj_user');
    localStorage.removeItem('vcfj_progress');
    window.location.href = 'login.html';
    return;
  }
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

export async function getCurrentUser() {
  if (DEMO_MODE) {
    const raw = localStorage.getItem('vcfj_user');
    return raw ? JSON.parse(raw) : null;
  }
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return null;
  return {
    email: data.user.email,
    name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
    provider: data.user.app_metadata?.provider || 'email'
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// ---------- Demo helpers ----------
function setDemoUser(user) {
  localStorage.setItem('vcfj_user', JSON.stringify(user));
}

// ---------- Page wiring ----------
const isLoginPage = !!document.getElementById('magicForm');
if (isLoginPage) {
  // If already signed in, jump straight to the course
  getCurrentUser().then(u => {
    if (u) window.location.href = 'course.html';
  });

  // Pre-fill from query params (?email=foo&provider=google)
  const params = new URLSearchParams(window.location.search);
  const emailParam = params.get('email');
  const providerParam = params.get('provider');
  if (emailParam) {
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.value = emailParam;
  }
  if (providerParam === 'google') {
    setTimeout(() => document.getElementById('googleBtn')?.click(), 200);
  } else if (emailParam) {
    setTimeout(() => document.getElementById('magicForm')?.requestSubmit(), 200);
  }

  const status = document.getElementById('status');
  const showStatus = (msg, kind = 'info') => {
    status.hidden = false;
    status.className = 'auth-status auth-status-' + kind;
    status.textContent = msg;
  };

  document.getElementById('googleBtn').addEventListener('click', async () => {
    try {
      showStatus('Redirecting to Google…', 'info');
      await signInWithGoogle();
    } catch (e) {
      showStatus(e.message || 'Google sign-in failed', 'error');
    }
  });

  document.getElementById('magicForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) return;
    const btn = document.getElementById('magicBtn');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const result = await signInWithMagicLink(email);
      if (result.demo) {
        showStatus('Demo mode active — taking you to the course…', 'success');
        setTimeout(() => { window.location.href = 'course.html'; }, 700);
      } else {
        showStatus('Check your email — we just sent you a magic link.', 'success');
        btn.textContent = 'Magic link sent ✓';
      }
    } catch (e) {
      showStatus(e.message || 'Could not send magic link', 'error');
      btn.disabled = false;
      btn.textContent = 'Send me a magic link';
    }
  });

  if (DEMO_MODE) {
    showStatus('Demo mode — Supabase not configured yet. Any email signs you in.', 'info');
  }
}

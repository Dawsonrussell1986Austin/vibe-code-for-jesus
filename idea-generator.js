// Idea generator page logic — rotating demographic prompts + Claude API fetch.

const PROMPTS = [
  "I\u2019m a pastor and every Sunday morning I scramble to find sermon illustrations.",
  "I\u2019m a homeschool mom and tracking what each kid did this week takes hours.",
  "I run a small coffee shop and our loyalty punch cards keep getting lost.",
  "I\u2019m a worship leader and our song rotation lives in five different group chats.",
  "I\u2019m a youth pastor and I can never tell which students actually showed up.",
  "I\u2019m a freelancer and chasing invoices is the worst part of my month.",
  "I\u2019m a missionary and my support newsletter takes a whole Saturday to write.",
  "I\u2019m a high-school teacher and grading short essays eats my evenings.",
  "I run a Christian bookstore and our stockroom is a guessing game.",
  "I\u2019m a foster parent and I can never find a calm activity that lasts more than 10 minutes.",
];

const promptEl = document.getElementById("promptRotator");
const form = document.getElementById("ideaForm");
const textarea = document.getElementById("problem");
const counter = document.getElementById("counter");
const generateBtn = document.getElementById("generateBtn");
const btnLabel = generateBtn.querySelector(".idea-btn-label");
const statusEl = document.getElementById("status");
const loadingSection = document.getElementById("loading");
const loadingSub = document.getElementById("loadingSub");
const resultsSection = document.getElementById("results");
const cardGrid = document.getElementById("ideaCards");
const regenBtn = document.getElementById("regenBtn");

// ---------- loading state ----------
const LOADING_STEPS = [
  "Reading what you wrote\u2026",
  "Looking for the real pain underneath\u2026",
  "Sketching three angles\u2026",
  "Picking who'd actually buy each one\u2026",
  "Finding the hooks that would stop them scrolling\u2026",
  "Tightening the words\u2026",
  "Almost there\u2026",
];
let loadingTimer = null;
function startLoading() {
  let i = 0;
  loadingSub.textContent = LOADING_STEPS[0];
  loadingSection.hidden = false;
  setTimeout(() => {
    loadingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
  loadingTimer = setInterval(() => {
    i = (i + 1) % LOADING_STEPS.length;
    loadingSub.style.opacity = "0";
    setTimeout(() => {
      loadingSub.textContent = LOADING_STEPS[i];
      loadingSub.style.opacity = "1";
    }, 200);
  }, 2200);
}
function stopLoading() {
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
  loadingSection.hidden = true;
}

// ---------- rotating prompts ----------
let promptIdx = 0;
function rotatePrompt() {
  promptIdx = (promptIdx + 1) % PROMPTS.length;
  promptEl.style.opacity = "0";
  setTimeout(() => {
    promptEl.textContent = "\u201C" + PROMPTS[promptIdx] + "\u201D";
    promptEl.style.opacity = "1";
  }, 220);
}
promptEl.textContent = "\u201C" + PROMPTS[0] + "\u201D";
setInterval(rotatePrompt, 3400);

// ---------- counter ----------
function updateCounter() {
  const len = textarea.value.length;
  counter.textContent = `${len} / 1000`;
  counter.classList.toggle("idea-counter-warn", len > 900);
}
textarea.addEventListener("input", updateCounter);
updateCounter();

// ---------- status helpers ----------
function showStatus(msg, kind = "info") {
  statusEl.hidden = false;
  statusEl.textContent = msg;
  statusEl.className = "idea-status idea-status-" + kind;
}
function clearStatus() {
  statusEl.hidden = true;
  statusEl.textContent = "";
  statusEl.className = "idea-status";
}

// ---------- render ----------
function renderIdeas(ideas) {
  cardGrid.innerHTML = "";
  ideas.forEach((idea, i) => {
    const card = document.createElement("article");
    card.className = "idea-card";
    card.innerHTML = `
      <div class="idea-card-num">${String(i + 1).padStart(2, "0")}</div>
      <h3 class="idea-card-name">${escapeHtml(idea.name || "")}</h3>
      <p class="idea-card-tagline">${escapeHtml(idea.tagline || "")}</p>
      <p class="idea-card-body">${escapeHtml(idea.what_it_does || "")}</p>

      <div class="idea-card-section">
        <p class="idea-card-section-label">Build first</p>
        <p class="idea-card-section-body">${escapeHtml(idea.build_first || "")}</p>
      </div>

      <div class="idea-card-section">
        <p class="idea-card-section-label">How to market it</p>
        <div class="idea-card-marketing">
          <div class="market-block">
            <p class="market-label">Audience</p>
            <p class="market-body">${escapeHtml(idea.marketing?.audience || "")}</p>
          </div>
          <div class="market-block">
            <p class="market-label">Where to find them</p>
            <p class="market-body">${escapeHtml(idea.marketing?.where_to_find_them || "")}</p>
          </div>
          <div class="market-block">
            <p class="market-label">The hook</p>
            <p class="market-body market-hook">&ldquo;${escapeHtml(idea.marketing?.the_hook || "")}&rdquo;</p>
          </div>
        </div>
      </div>
    `;
    cardGrid.appendChild(card);
  });

  resultsSection.hidden = false;
  // Scroll results into view smoothly.
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------- submit ----------
async function generate() {
  const problem = textarea.value.trim();
  if (problem.length < 10) {
    showStatus("Tell us a little more — at least 10 characters.", "error");
    return;
  }

  clearStatus();
  resultsSection.hidden = true;
  generateBtn.disabled = true;
  btnLabel.textContent = "Generating\u2026";
  generateBtn.classList.add("is-loading");
  startLoading();

  try {
    const res = await fetch("/api/generate-ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showStatus(data.error || "Something went wrong. Please try again.", "error");
      return;
    }
    if (!Array.isArray(data.ideas) || data.ideas.length === 0) {
      showStatus("Couldn\u2019t generate ideas. Please try again.", "error");
      return;
    }

    renderIdeas(data.ideas);
  } catch (err) {
    console.error(err);
    showStatus("Network error. Please check your connection and try again.", "error");
  } finally {
    stopLoading();
    generateBtn.disabled = false;
    btnLabel.textContent = "Generate 3 ideas";
    generateBtn.classList.remove("is-loading");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  generate();
});

regenBtn.addEventListener("click", () => {
  resultsSection.hidden = true;
  clearStatus();
  textarea.focus();
  textarea.scrollIntoView({ behavior: "smooth", block: "center" });
});

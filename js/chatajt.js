const DATA_FILES = ['about', 'experience', 'projects', 'skills', 'services', 'faq', 'contact'];

const FALLBACK_PROMPTS = [
  'Tell me about AJ',
  'Show my work',
  'Can AJ build websites?',
  'Tell me about Pulse.bot',
  'Download CV',
  'Contact AJ',
];

async function loadKnowledge(){
  try {
    const results = await Promise.all(
      DATA_FILES.map((name) =>
        fetch(`data/${name}.json`).then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${name}.json`);
          return res.json();
        })
      )
    );
    return Object.fromEntries(DATA_FILES.map((name, i) => [name, results[i]]));
  } catch (err) {
    return null;
  }
}

function findBestMatch(knowledge, query){
  if (!knowledge || !knowledge.faq) return null;
  const q = query.toLowerCase();
  let best = null;
  let bestScore = 0;

  knowledge.faq.entries.forEach((entry) => {
    let score = 0;
    entry.keywords.forEach((kw) => {
      if (q.includes(kw.toLowerCase())) score += kw.length;
    });
    if (entry.prompt && q.includes(entry.prompt.toLowerCase())) score += 50;
    if (score > bestScore){
      bestScore = score;
      best = entry;
    }
  });

  return bestScore > 0 ? best : null;
}

export async function initChatAJT(){
  const launcher = document.getElementById('chatajtLauncher');
  const panel = document.getElementById('chatajtPanel');
  const closeBtn = document.getElementById('chatajtClose');
  const messages = document.getElementById('chatajtMessages');
  const promptsEl = document.getElementById('chatajtPrompts');
  const form = document.getElementById('chatajtForm');
  const input = document.getElementById('chatajtInput');

  if (!launcher || !panel) return;

  const openPanel = () => {
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    input && input.focus();
  };
  const closePanel = () => {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
  };

  launcher.addEventListener('click', () => {
    panel.classList.contains('is-open') ? closePanel() : openPanel();
  });
  closeBtn && closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  const addMessage = (text, who) => {
    const div = document.createElement('div');
    div.className = `chatajt-msg ${who}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  const runAction = (action) => {
    if (!action) return;
    if (action.type === 'scrollTo'){
      const target = document.querySelector(action.target);
      target && target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (action.type === 'download'){
      const a = document.createElement('a');
      a.href = action.target;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const knowledge = await loadKnowledge();

  const handleQuery = (query) => {
    addMessage(query, 'user');
    if (!knowledge){
      addMessage(
        "ChatAJT couldn't load its knowledge base just now — try viewing this site over a local or live server, or email tubogaj@gmail.com directly.",
        'bot'
      );
      return;
    }
    const match = findBestMatch(knowledge, query);
    if (match){
      addMessage(match.answer, 'bot');
      runAction(match.action);
    } else {
      addMessage(knowledge.faq.fallback, 'bot');
    }
  };

  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      handleQuery(value);
      input.value = '';
    });
  }

  const suggested = (knowledge && knowledge.faq && knowledge.faq.suggestedPrompts) || FALLBACK_PROMPTS;
  suggested.forEach((prompt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chatajt-prompt';
    btn.textContent = prompt;
    btn.addEventListener('click', () => handleQuery(prompt));
    promptsEl.appendChild(btn);
  });
}

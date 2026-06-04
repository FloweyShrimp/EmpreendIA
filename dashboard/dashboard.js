// ───── SIDEBAR TOGGLE ─────
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-open');
});

// ───── NAVEGAÇÃO SIDEBAR ─────
const navLinks = document.querySelectorAll('.sidebar-links a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ───── MASCOTE FLUTUANTE → ABRE CHAT ─────
const mascote = document.getElementById('mascoteFlutuante');
mascote.addEventListener('click', () => {
  document.getElementById('chatInput').focus();
  document.querySelector('.chat-wrapper').scrollIntoView({ behavior: 'smooth' });
});

// ───── CHAT COM IA (Claude API) ─────
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

const systemPrompt = `Você é o mentor da EmpreendIA, um assistente inteligente e animado que ajuda empreendedores brasileiros a crescerem no digital.
Você tem a personalidade de um mentor experiente, direto, motivador e bem-humorado — como um fantoche carismático que entende de negócios.
Quando o empreendedor te contar sobre o negócio dele, você analisa e sugere estratégias práticas de marketing digital, presença online e vendas.
Você também conhece tendências atuais do mercado digital brasileiro.
Responda sempre em português, de forma clara, objetiva e encorajadora. Use emojis com moderação para deixar a conversa mais leve.`;

const conversationHistory = [];

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `msg ${type}`;

  if (type === 'bot') {
    msg.innerHTML = `
      <img src="mascote.png" class="msg-avatar" alt="">
      <div class="msg-bubble">${text}</div>
    `;
  } else {
    msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
  }

  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

function addTyping() {
  const msg = document.createElement('div');
  msg.className = 'msg bot typing';
  msg.id = 'typingIndicator';
  msg.innerHTML = `
    <img src="mascote.png" class="msg-avatar" alt="">
    <div class="msg-bubble">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';
  chatSend.disabled = true;
  addTyping();

  conversationHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    const reply = data.content[0].text;

    conversationHistory.push({ role: 'assistant', content: reply });

    removeTyping();
    addMessage(reply, 'bot');
  } catch (err) {
    removeTyping();
    addMessage('Ops! Tive um probleminha técnico. Tenta de novo em instantes 😅', 'bot');
  }

  chatSend.disabled = false;
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

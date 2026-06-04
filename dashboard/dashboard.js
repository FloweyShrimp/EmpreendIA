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

// ───── CHAT COM IA (Gemini API) ─────
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// 🔑 SUA CHAVE AQUI:
const GEMINI_API_KEY = 'AQ.Ab8RN6J27fRyUqo-azv5XKdm_1BeegPrNUXXzcrYcFhj19THxg';

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

  conversationHistory.push({
    role: 'user',
    parts: [{ text }]
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: conversationHistory
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error('Resposta do Gemini:', JSON.stringify(data));
      removeTyping();
      addMessage('Erro: ' + (data.error?.message || 'Resposta inesperada'), 'bot');
      chatSend.disabled = false;
      return;
    }

    const reply = data.candidates[0].content.parts[0].text;

    conversationHistory.push({
      role: 'model',
      parts: [{ text: reply }]
    });

    removeTyping();
    addMessage(reply, 'bot');

  } catch (err) {
    console.error('Erro ao chamar Gemini:', err);
    removeTyping();
    addMessage('Ops! Tive um probleminha técnico. Tenta de novo em instantes 😅', 'bot');
  }

  chatSend.disabled = false;
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

/**
 * EduBot AI - Smart Student AI Study Assistant
 * Interactive Client Logic
 */

// ==================== STATE MANAGEMENT ====================
const STORAGE_KEYS = {
  THEME: 'edubot_theme',
  CHATS: 'edubot_chats_v1',
  ACTIVE_CHAT_ID: 'edubot_active_chat_id',
  USER_PROFILE: 'edubot_user_profile',
  API_KEY: 'gemini_api_key'
};

const DEFAULT_API_KEY = '';
let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
let activeChatId = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID) || null;
let apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || DEFAULT_API_KEY;
let chats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '[]');
let userProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || JSON.stringify({
  name: 'Alex Johnson',
  major: 'cs',
  explanationStyle: 'detailed',
  tone: 'encouraging'
}));

let attachedFile = null;
let isBotThinking = false;
let isRecordingVoice = false;
let recognitionInstance = null;

// ==================== SMART KNOWLEDGE BASE ====================
const SMART_RESPONSES = [
  {
    keywords: ['newton', 'motion', 'physics', 'first law', 'inertia'],
    title: 'Newton’s Laws of Motion in Sports',
    reply: `### 🏀 Newton's Three Laws of Motion (Sports Edition)

Isaac Newton’s laws describe the relationship between a body and the forces acting upon it. Here is how they apply in everyday sports:

---

#### 1. First Law: The Law of Inertia
> *"An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced external force."*

* **Real-World Example:** A soccer ball sits still on the penalty spot until a player applies a force (kicking it). Once airborne, gravity and air resistance slow it down.
* **Key Formula:** $\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{constant}$

---

#### 2. Second Law: Force = Mass × Acceleration ($F = ma$)
> *"The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."*

* **Real-World Example:** A baseball pitcher throws a lightweight baseball with massive acceleration compared to trying to throw a heavy shot put with the same arm force.

---

#### 3. Third Law: Action & Reaction
> *"For every action, there is an equal and opposite reaction."*

* **Real-World Example:** When a swimmer pushes backwards against the pool wall with their feet, the wall exerts an equal force pushing the swimmer forward through the water.

---
💡 **Study Tip:** Remember **I-F-A** (*Inertia*, *Force*, *Action-Reaction*) for quick exam recall!`
  },
  {
    keywords: ['photosynthesis', 'chlorophyll', 'biology', 'light reaction', 'calvin'],
    title: 'Photosynthesis Master Quiz & Breakdown',
    reply: `### 🌿 Photosynthesis: Concept Breakdown & Quick Quiz

Photosynthesis is the biochemical process by which photoautotrophs convert sunlight, water, and $\\text{CO}_2$ into oxygen and glucose.

#### Chemical Equation:
\`\`\`text
6CO2 + 6H2O + Light Energy  ──►  C6H12O6 (Glucose) + 6O2
\`\`\`

---

#### Key Phases:
1. **Light-Dependent Reactions (Thylakoid membrane):** Uses photons to split $\\text{H}_2\\text{O}$, producing $\\text{ATP}$, $\\text{NADPH}$, and releasing $\\text{O}_2$.
2. **Light-Independent Reactions / Calvin Cycle (Stroma):** Uses $\\text{ATP}$ and $\\text{NADPH}$ to fix carbon into $\\text{G3P}$ / Glucose.

---

### 🧠 Quick Flash Quiz: Test Your Recall
**Question:** Where do the light-independent reactions (Calvin Cycle) specifically take place within the chloroplast?

* **A)** Thylakoid lumen
* **B)** Chloroplast Stroma *(Correct!)*
* **C)** Inner mitochondrial matrix
* **D)** Outer membrane pore

*Type your answer or ask for more practice questions!*`
  },
  {
    keywords: ['derivative', 'calculus', 'product rule', 'math', 'differentiation', 'solve'],
    title: 'Step-by-Step Calculus Derivative',
    reply: `### 📐 Step-by-Step Derivative Solver

Let's find the derivative of:
$$f(x) = (3x^2 + 5) \\cdot \\sin(x)$$

---

#### **Step 1: Identify the Product Rule**
When a function is a product of two terms $u(x) \\cdot v(x)$, its derivative is:
$$\\frac{d}{dx}[u \\cdot v] = u'v + uv'$$

Let:
* $u(x) = 3x^2 + 5$
* $v(x) = \\sin(x)$

---

#### **Step 2: Differentiate Each Part**
* $u'(x) = \\frac{d}{dx}(3x^2 + 5) = 6x$
* $v'(x) = \\frac{d}{dx}(\\sin(x)) = \\cos(x)$

---

#### **Step 3: Combine with Product Rule**
$$f'(x) = (6x)(\\sin(x)) + (3x^2 + 5)(\\cos(x))$$

---

#### **Final Answer:**
$$f'(x) = 6x\\sin(x) + (3x^2 + 5)\\cos(x)$$

✅ **Pro Check:** Always check if terms can be factored further or simplified using trigonometric identities!`
  },
  {
    keywords: ['ww1', 'world war', 'history', 'causes of war', 'mnemonic', 'alliances'],
    title: 'Causes of World War 1 Summary',
    reply: `### 🌍 Causes of World War I (1914–1918)

Historians summarize the fundamental underlying causes of World War I using the famous mnemonic **M-A-I-N**:

---

* 🎖️ **M — Militarism:** Massive arms race in Europe (notably naval rivalry between Great Britain and Germany).
* 🤝 **A — Alliances:** Complex secret and open treaties (Triple Entente vs. Triple Alliance) meaning a conflict between two drew all powers in.
* 👑 **I — Imperialism:** Fierce competition for colonial territories and resources in Africa and Asia.
* 🚩 **N — Nationalism:** Intense national pride and ethnic tensions, particularly in the Balkan region ("the Powder Keg of Europe").

---

#### The Spark:
> **June 28, 1914:** The assassination of Archduke Franz Ferdinand of Austria-Hungary by Gavrilo Princip in Sarajevo.

⚡ **Exam Tip:** Write down **M-A-I-N + Spark** at the top of your essay outline for an instant framework!`
  },
  {
    keywords: ['python', 'recursion', 'code', 'function', 'fibonacci', 'binary search'],
    title: 'Understanding Recursion in Python',
    reply: `### 💻 Understanding Recursion in Python

**Recursion** is a programming technique where a function calls itself to solve smaller subproblems of the same problem.

Every recursive algorithm **MUST** have two parts:
1. **Base Case:** The condition where the recursion terminates.
2. **Recursive Case:** The step where the function calls itself with modified arguments.

---

#### Example: Factorial Calculation ($n!$)

\`\`\`python
def factorial(n: int) -> int:
    """Calculates the factorial of n recursively."""
    # 1. Base Case: 0! = 1 and 1! = 1
    if n <= 1:
        return 1
    
    # 2. Recursive Case: n * (n - 1)!
    return n * factorial(n - 1)

# Test the function
print(f"5! = {factorial(5)}")  # Output: 120
\`\`\`

---

#### 🔍 Visual Call Stack for \`factorial(3)\`:
\`\`\`text
factorial(3)
  └── 3 * factorial(2)
            └── 2 * factorial(1)
                      └── 1 (Base case reached!)
\`\`\`

⚠️ **Common Pitfall:** Forgetting the base case leads to a \`RecursionError: maximum recursion depth exceeded\`!`
  }
];

// Fallback smart response generator based on query semantics
function generateFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('quiz') || q.includes('test me') || q.includes('practice')) {
    return `### 📝 Study Quiz Generator

Here is a 3-question active recall check on **"${escapeHtml(query)}"**:

1. **Fundamental Definition:** In your own words, what is the core mechanism of this concept?
2. **Application:** How would this principle behave under edge-case or reverse conditions?
3. **Problem Solving:** What is the primary formula or relationship governing this system?

👉 *Reply with your thoughts on question #1, and I'll evaluate your answer with feedback and score!*`;
  }

  if (q.includes('summarize') || q.includes('summary') || q.includes('notes')) {
    return `### 📑 Executive Study Summary: ${escapeHtml(query)}

Here is a structured synthesis of the key points:

* 🎯 **Core Objective:** Breaking down the essential principles into clear, high-yield takeaways.
* 🔑 **Key Terminology:**
  - **Concept A:** Primary operational definition.
  - **Concept B:** Interconnected variable and dependency.
* 📊 **Exam Focus Points:**
  1. Understand the theoretical foundation.
  2. Know how to solve direct application problems.
  3. Memorize the 2 most common pitfalls.

Would you like me to generate flashcards or a practice problem set next?`;
  }

  if (q.includes('homework') || q.includes('help') || q.includes('how to')) {
    return `### 🎓 Homework Guidance & Step Breakdown

Let's tackle this systematically:

#### Phase 1: Clarifying the Givens
* What are your known inputs, constraints, or boundary conditions?
* What specific output or proof is required?

#### Phase 2: Choosing the Right Strategy
* Which core theorem or formula directly connects the givens to the unknown?

#### Phase 3: Step-by-Step Execution
Tell me what step you've reached so far, or paste the exact problem statement, and I will guide you without just giving the answer away so you master the concept!`;
  }

  // Default rich study reply
  return `### 📚 Study Assistant Insight on "${escapeHtml(query)}"

Great question! Here is a structured overview tailored for your **${userProfile.major.toUpperCase()}** studies:

1. **Fundamental Concept:**
   This topic revolves around core foundational rules. Mastering it requires understanding both the *theory* and its *practical application*.

2. **Step-by-Step Approach:**
   * Step 1: Identify all known variables and core constraints.
   * Step 2: Apply the governing formula or algorithmic paradigm.
   * Step 3: Sanity-check the result against real-world boundaries.

\`\`\`text
Input (Problem) ──► Apply Principles ──► Verified Solution
\`\`\`

> 💡 **Study Reminder:** Try to explain this concept aloud in under 60 seconds (Feynman Technique) to test your true mastery!

How else can I assist with this topic? (e.g., *Generate a Quiz*, *Provide Code Example*, *Summarize Formulas*)`;
}

// ==================== DOM ELEMENTS ====================
const DOM = {
  // Theme & Layout
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  sidebar: document.getElementById('sidebar'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  openSidebarBtn: document.getElementById('openSidebarBtn'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),

  // Header
  activeChatTitle: document.getElementById('activeChatTitle'),
  exportChatBtn: document.getElementById('exportChatBtn'),

  // Chat Viewport
  messagesViewport: document.getElementById('messagesViewport'),
  welcomeScreen: document.getElementById('welcomeScreen'),
  messagesList: document.getElementById('messagesList'),
  typingIndicator: document.getElementById('typingIndicator'),
  samplePromptCards: document.querySelectorAll('.sample-prompt-card'),

  // Sidebar Actions & History
  newChatBtn: document.getElementById('newChatBtn'),
  quickPromptBtns: document.querySelectorAll('.quick-prompt-btn'),
  chatHistoryList: document.getElementById('chatHistoryList'),
  clearAllChatsBtn: document.getElementById('clearAllChatsBtn'),

  // User Profile & Settings
  userNameDisplay: document.getElementById('userNameDisplay'),
  majorSelector: document.getElementById('majorSelector'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsModal: document.getElementById('settingsModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  studentNameInput: document.getElementById('studentNameInput'),
  explanationStyleSelect: document.getElementById('explanationStyleSelect'),

  // Input Box & Attachments
  chatTextarea: document.getElementById('chatTextarea'),
  sendBtn: document.getElementById('sendBtn'),
  attachBtn: document.getElementById('attachBtn'),
  fileUploadInput: document.getElementById('fileUploadInput'),
  attachmentPreview: document.getElementById('attachmentPreview'),
  attachmentName: document.getElementById('attachmentName'),
  attachmentSize: document.getElementById('attachmentSize'),
  removeAttachmentBtn: document.getElementById('removeAttachmentBtn'),
  voiceBtn: document.getElementById('voiceBtn'),

  // Toast
  toastNotification: document.getElementById('toastNotification'),
  toastText: document.getElementById('toastText')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserProfile();
  initChatHistory();
  setupEventListeners();
  refreshIcons();
});

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==================== THEME MANAGEMENT ====================
function initTheme() {
  DOM.html.setAttribute('data-theme', currentTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  DOM.html.setAttribute('data-theme', currentTheme);
  localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
  showToast(`Switched to ${currentTheme} mode`);
}

// ==================== USER PROFILE ====================
function initUserProfile() {
  DOM.userNameDisplay.textContent = userProfile.name;
  DOM.majorSelector.value = userProfile.major || 'cs';
  DOM.studentNameInput.value = userProfile.name;
  DOM.explanationStyleSelect.value = userProfile.explanationStyle || 'detailed';

  const toneRadio = document.querySelector(`input[name="tone"][value="${userProfile.tone || 'encouraging'}"]`);
  if (toneRadio) toneRadio.checked = true;
}

function saveUserProfile() {
  userProfile.name = DOM.studentNameInput.value.trim() || 'Alex Johnson';
  userProfile.major = DOM.majorSelector.value;
  userProfile.explanationStyle = DOM.explanationStyleSelect.value;
  
  const selectedTone = document.querySelector('input[name="tone"]:checked');
  if (selectedTone) userProfile.tone = selectedTone.value;

  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  DOM.userNameDisplay.textContent = userProfile.name;
  DOM.settingsModal.classList.add('hidden');
  showToast('Preferences updated successfully!');
}

// ==================== CHAT SESSIONS & HISTORY ====================
function initChatHistory() {
  renderHistorySidebar();

  if (activeChatId) {
    const current = chats.find(c => c.id === activeChatId);
    if (current && current.messages.length > 0) {
      loadChat(activeChatId);
      return;
    }
  }
  
  // If no active chat or empty, start fresh
  startNewChat();
}

function startNewChat() {
  activeChatId = 'chat_' + Date.now();
  localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, activeChatId);
  DOM.activeChatTitle.textContent = 'New Study Session';
  DOM.messagesList.innerHTML = '';
  DOM.welcomeScreen.classList.remove('hidden');
  clearAttachment();
  renderHistorySidebar();
  DOM.chatTextarea.focus();
}

function renderHistorySidebar() {
  DOM.chatHistoryList.innerHTML = '';

  if (chats.length === 0) {
    DOM.chatHistoryList.innerHTML = `<div class="empty-history">No past study chats yet.</div>`;
    return;
  }

  chats.slice().reverse().forEach(chat => {
    const item = document.createElement('div');
    item.className = `history-item ${chat.id === activeChatId ? 'active' : ''}`;
    item.setAttribute('data-id', chat.id);

    item.innerHTML = `
      <div class="history-item-left">
        <i data-lucide="message-square"></i>
        <span class="history-item-title">${escapeHtml(chat.title)}</span>
      </div>
      <button class="delete-chat-btn" title="Delete chat">
        <i data-lucide="trash-2"></i>
      </button>
    `;

    // Click to load chat
    item.querySelector('.history-item-left').addEventListener('click', () => {
      loadChat(chat.id);
      closeMobileSidebar();
    });

    // Delete single chat
    item.querySelector('.delete-chat-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteChat(chat.id);
    });

    DOM.chatHistoryList.appendChild(item);
  });

  refreshIcons();
}

function loadChat(chatId) {
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  activeChatId = chatId;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, activeChatId);
  DOM.activeChatTitle.textContent = chat.title;

  DOM.messagesList.innerHTML = '';
  DOM.welcomeScreen.classList.add('hidden');

  chat.messages.forEach(msg => {
    appendMessageUI(msg.role, msg.content, msg.attachment, false);
  });

  renderHistorySidebar();
  scrollToBottom();
}

function deleteChat(chatId) {
  chats = chats.filter(c => c.id !== chatId);
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));

  if (activeChatId === chatId) {
    if (chats.length > 0) {
      loadChat(chats[chats.length - 1].id);
    } else {
      startNewChat();
    }
  } else {
    renderHistorySidebar();
  }
  showToast('Chat removed from history');
}

function clearAllChats() {
  if (!confirm('Are you sure you want to clear all chat history?')) return;
  chats = [];
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  startNewChat();
  showToast('Chat history cleared');
}

// ==================== MESSAGE HANDLING ====================
async function handleSendMessage() {
  const text = DOM.chatTextarea.value.trim();
  if (!text && !attachedFile) return;
  if (isBotThinking) return;

  const currentAttachment = attachedFile;
  clearAttachment();

  // Hide welcome card
  DOM.welcomeScreen.classList.add('hidden');

  // Append user message UI
  appendMessageUI('user', text, currentAttachment, true);

  // Clear input & reset height
  DOM.chatTextarea.value = '';
  DOM.chatTextarea.style.height = 'auto';
  DOM.sendBtn.disabled = true;

  // Persist user message to chat session
  saveMessageToChat('user', text, currentAttachment);

  // Show Typing Indicator
  showTypingIndicator(true);
  isBotThinking = true;

  const currentKey = (apiKey || DEFAULT_API_KEY || '').trim();

  try {
    let botReply = '';
    if (currentKey && currentKey.length > 10) {
      botReply = await callGeminiAPI(text, currentKey);
    } else {
      botReply = matchSmartResponse(text);
    }
    showTypingIndicator(false);
    isBotThinking = false;

    appendMessageUI('bot', botReply, null, true);
    saveMessageToChat('bot', botReply, null);
    scrollToBottom();
  } catch (err) {
    console.warn('Gemini API call failed, falling back to smart response:', err);
    const fallbackReply = matchSmartResponse(text);
    showTypingIndicator(false);
    isBotThinking = false;

    appendMessageUI('bot', fallbackReply, null, true);
    saveMessageToChat('bot', fallbackReply, null);
    scrollToBottom();
  }
}

async function callGeminiAPI(userPrompt, key) {
  const models = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash'
  ];
  
  const currentChat = chats.find(c => c.id === activeChatId);
  const rawMessages = currentChat ? currentChat.messages : [{ role: 'user', content: userPrompt }];

  const contents = [];
  let lastRole = null;

  for (const m of rawMessages) {
    if (!m.content) continue;
    const role = m.role === 'user' ? 'user' : 'model';
    if (role === lastRole && contents.length > 0) {
      contents[contents.length - 1].parts[0].text += '\n\n' + m.content;
    } else {
      contents.push({
        role: role,
        parts: [{ text: m.content }]
      });
      lastRole = role;
    }
  }

  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }
  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    contents.push({ role: 'user', parts: [{ text: userPrompt }] });
  }

  let lastError = null;
  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      });

      if (!res.ok) {
        if (res.status === 404) continue;
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts.map(p => p.text).join('\n');
      }
    } catch (e) {
      lastError = e;
      if (e.message && (e.message.includes('API_KEY_INVALID') || e.message.includes('API key not valid'))) {
        throw e;
      }
    }
  }
  throw lastError || new Error('No response from Gemini API');
}

function matchSmartResponse(userText) {
  const clean = userText.toLowerCase();

  for (const item of SMART_RESPONSES) {
    const match = item.keywords.some(kw => clean.includes(kw));
    if (match) {
      return item.reply;
    }
  }

  return generateFallbackResponse(userText);
}

function saveMessageToChat(role, content, attachment) {
  let currentChat = chats.find(c => c.id === activeChatId);

  if (!currentChat) {
    const autoTitle = (role === 'user' && content) 
      ? (content.slice(0, 32) + (content.length > 32 ? '...' : '')) 
      : 'Study Session';
    
    currentChat = {
      id: activeChatId,
      title: autoTitle,
      timestamp: Date.now(),
      messages: []
    };
    chats.push(currentChat);
    DOM.activeChatTitle.textContent = autoTitle;
  } else if (currentChat.messages.length === 0 && role === 'user' && content) {
    currentChat.title = content.slice(0, 32) + (content.length > 32 ? '...' : '');
    DOM.activeChatTitle.textContent = currentChat.title;
  }

  currentChat.messages.push({
    role,
    content,
    attachment: attachment ? { name: attachment.name, size: attachment.size } : null,
    timestamp: Date.now()
  });

  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  renderHistorySidebar();
}

// ==================== UI RENDERING ====================
function appendMessageUI(role, content, attachment, animate = true) {
  const row = document.createElement('div');
  row.className = `message-row ${role}`;
  if (!animate) row.style.animation = 'none';

  if (role === 'user') {
    let attachmentHtml = '';
    if (attachment) {
      attachmentHtml = `
        <div class="attached-file-badge">
          <i data-lucide="paperclip"></i>
          <span>${escapeHtml(attachment.name)}</span>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="bubble">
        ${attachmentHtml}
        <div>${escapeHtml(content).replace(/\n/g, '<br>')}</div>
      </div>
    `;
  } else {
    // Bot message with markdown formatting & action bar
    const parsedHtml = parseMarkdown(content);

    row.innerHTML = `
      <div class="bot-avatar-col">
        <i data-lucide="bot"></i>
      </div>
      <div class="bot-message-wrapper">
        <div class="bubble">
          ${parsedHtml}
        </div>
        <div class="bot-action-bar">
          <button class="action-bar-btn copy-msg-btn" title="Copy response">
            <i data-lucide="copy"></i>
            <span>Copy</span>
          </button>
          <button class="action-bar-btn thumbs-up-btn" title="Helpful response">
            <i data-lucide="thumbs-up"></i>
          </button>
          <button class="action-bar-btn thumbs-down-btn" title="Needs improvement">
            <i data-lucide="thumbs-down"></i>
          </button>
        </div>
      </div>
    `;

    // Bind action bar buttons
    const copyBtn = row.querySelector('.copy-msg-btn');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(content).then(() => {
        copyBtn.innerHTML = `<i data-lucide="check"></i><span>Copied!</span>`;
        copyBtn.classList.add('active');
        refreshIcons();
        showToast('Bot response copied to clipboard');
        setTimeout(() => {
          copyBtn.innerHTML = `<i data-lucide="copy"></i><span>Copy</span>`;
          copyBtn.classList.remove('active');
          refreshIcons();
        }, 2000);
      });
    });

    const thumbsUp = row.querySelector('.thumbs-up-btn');
    const thumbsDown = row.querySelector('.thumbs-down-btn');

    thumbsUp.addEventListener('click', () => {
      thumbsUp.classList.toggle('active');
      thumbsDown.classList.remove('active');
      if (thumbsUp.classList.contains('active')) {
        showToast('Thanks for the feedback! 🌟');
      }
    });

    thumbsDown.addEventListener('click', () => {
      thumbsDown.classList.toggle('active');
      thumbsUp.classList.remove('active');
      if (thumbsDown.classList.contains('active')) {
        showToast('Feedback noted. EduBot will refine future answers.');
      }
    });

    // Code block copy buttons
    row.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const codeText = btn.closest('.code-block-wrapper').querySelector('pre').innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          btn.innerHTML = `<i data-lucide="check"></i> Copied`;
          refreshIcons();
          setTimeout(() => {
            btn.innerHTML = `<i data-lucide="copy"></i> Copy`;
            refreshIcons();
          }, 2000);
        });
      });
    });
  }

  DOM.messagesList.appendChild(row);
  refreshIcons();
  scrollToBottom();
}

function showTypingIndicator(show) {
  if (show) {
    DOM.typingIndicator.classList.remove('hidden');
  } else {
    DOM.typingIndicator.classList.add('hidden');
  }
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(() => {
    DOM.messagesViewport.scrollTop = DOM.messagesViewport.scrollHeight;
  }, 50);
}

// ==================== MARKDOWN PARSER ====================
function parseMarkdown(md) {
  if (!md) return '';

  let html = md;

  // 1. Code blocks with language header and copy button
  html = html.replace(/```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang.trim() || 'code';
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span>${escapeHtml(language.toUpperCase())}</span>
          <button class="copy-code-btn"><i data-lucide="copy"></i> Copy</button>
        </div>
        <pre><code>${escapeHtml(code.trim())}</code></pre>
      </div>
    `;
  });

  // 2. Headings
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 3. Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // 4. Horizontal Rules
  html = html.replace(/^---$/gim, '<hr style="border:none; border-top:1px solid var(--border-color); margin:14px 0;">');

  // 5. Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 6. Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // 7. Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // 8. Paragraphs & Line Breaks
  const paragraphs = html.split(/\n\n+/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<blockquote') || p.startsWith('<hr')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  });

  return paragraphs.join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Mobile Drawer Toggle
  DOM.openSidebarBtn.addEventListener('click', openMobileSidebar);
  DOM.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  DOM.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // New Chat & Clear History
  DOM.newChatBtn.addEventListener('click', () => {
    startNewChat();
    closeMobileSidebar();
  });
  DOM.clearAllChatsBtn.addEventListener('click', clearAllChats);

  // Suggested Prompts Click
  DOM.samplePromptCards.forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      DOM.chatTextarea.value = prompt;
      handleSendMessage();
    });
  });

  // Quick Action Buttons
  DOM.quickPromptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      let text = '';
      switch (action) {
        case 'explain':
          text = 'Explain the concept of [Insert Topic] in simple terms with a real-world analogy.';
          break;
        case 'summarize':
          text = 'Summarize my lecture notes into key bullet points, formulas, and a memory mnemonic.';
          break;
        case 'quiz':
          text = 'Practice Quiz: Give me 3 multiple-choice questions on [Insert Topic] to test my recall.';
          break;
        case 'homework':
          text = 'Homework Help: Step-by-step guidance on solving this problem: [Insert Problem Statement]';
          break;
      }
      DOM.chatTextarea.value = text;
      DOM.chatTextarea.focus();
      DOM.chatTextarea.dispatchEvent(new Event('input'));
      closeMobileSidebar();
    });
  });

  // Textarea Auto-expand & Enter to send
  DOM.chatTextarea.addEventListener('input', () => {
    DOM.chatTextarea.style.height = 'auto';
    DOM.chatTextarea.style.height = Math.min(DOM.chatTextarea.scrollHeight, 160) + 'px';
    DOM.sendBtn.disabled = DOM.chatTextarea.value.trim().length === 0 && !attachedFile;
  });

  DOM.chatTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!DOM.sendBtn.disabled) {
        handleSendMessage();
      }
    }
  });

  // Send Button Click
  DOM.sendBtn.addEventListener('click', handleSendMessage);

  // Attachment Handling
  DOM.attachBtn.addEventListener('click', () => {
    DOM.fileUploadInput.click();
  });

  DOM.fileUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      attachedFile = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      };
      DOM.attachmentName.textContent = attachedFile.name;
      DOM.attachmentSize.textContent = attachedFile.size;
      DOM.attachmentPreview.classList.remove('hidden');
      DOM.sendBtn.disabled = false;
      showToast(`Attached: ${file.name}`);
    }
  });

  DOM.removeAttachmentBtn.addEventListener('click', clearAttachment);

  // Voice Input Speech-to-Text Simulation / Web Speech API
  DOM.voiceBtn.addEventListener('click', toggleVoiceInput);

  // Major / Grade Quick Switch
  DOM.majorSelector.addEventListener('change', () => {
    userProfile.major = DOM.majorSelector.value;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    showToast(`Major updated to ${DOM.majorSelector.options[DOM.majorSelector.selectedIndex].text}`);
  });

  // Settings Modal
  DOM.settingsBtn.addEventListener('click', () => {
    DOM.settingsModal.classList.remove('hidden');
  });

  DOM.closeModalBtn.addEventListener('click', () => {
    DOM.settingsModal.classList.add('hidden');
  });

  DOM.cancelSettingsBtn.addEventListener('click', () => {
    DOM.settingsModal.classList.add('hidden');
  });

  DOM.saveSettingsBtn.addEventListener('click', saveUserProfile);

  // Export Transcript / Notes
  DOM.exportChatBtn.addEventListener('click', exportChatTranscript);
}

// ==================== ATTACHMENTS & VOICE ====================
function clearAttachment() {
  attachedFile = null;
  DOM.fileUploadInput.value = '';
  DOM.attachmentPreview.classList.add('hidden');
  DOM.sendBtn.disabled = DOM.chatTextarea.value.trim().length === 0;
}

function toggleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    if (!recognitionInstance) {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        isRecordingVoice = true;
        DOM.voiceBtn.classList.add('recording');
        showToast('Listening... Speak your study question now');
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        DOM.chatTextarea.value = (DOM.chatTextarea.value + ' ' + transcript).trim();
        DOM.chatTextarea.dispatchEvent(new Event('input'));
        showToast('Speech recognized!');
      };

      recognitionInstance.onerror = () => {
        stopVoiceRecording();
        showToast('Voice input ended');
      };

      recognitionInstance.onend = () => {
        stopVoiceRecording();
      };
    }

    if (!isRecordingVoice) {
      recognitionInstance.start();
    } else {
      recognitionInstance.stop();
    }
  } else {
    // Fallback simulation if browser blocks or doesn't support
    if (!isRecordingVoice) {
      isRecordingVoice = true;
      DOM.voiceBtn.classList.add('recording');
      showToast('Voice Recording Simulated (Listening...)');
      setTimeout(() => {
        DOM.chatTextarea.value = "Explain Newton's Laws of Motion with sports examples.";
        DOM.chatTextarea.dispatchEvent(new Event('input'));
        stopVoiceRecording();
        showToast('Voice transcription added!');
      }, 2500);
    } else {
      stopVoiceRecording();
    }
  }
}

function stopVoiceRecording() {
  isRecordingVoice = false;
  DOM.voiceBtn.classList.remove('recording');
}

// ==================== EXPORT TRANSCRIPT ====================
function exportChatTranscript() {
  const currentChat = chats.find(c => c.id === activeChatId);
  if (!currentChat || currentChat.messages.length === 0) {
    showToast('No messages to export in this session.');
    return;
  }

  let transcript = `# EduBot AI Study Session: ${currentChat.title}\n`;
  transcript += `Student: ${userProfile.name} | Major: ${userProfile.major.toUpperCase()}\n`;
  transcript += `Date: ${new Date(currentChat.timestamp).toLocaleString()}\n\n`;
  transcript += `---\n\n`;

  currentChat.messages.forEach(m => {
    const sender = m.role === 'user' ? `🧑 ${userProfile.name}` : `🤖 EduBot AI`;
    transcript += `### ${sender}\n${m.content}\n\n`;
  });

  const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `EduBot_Study_Notes_${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Study notes exported as Markdown file! 📄');
}

// ==================== MOBILE SIDEBAR ====================
function openMobileSidebar() {
  DOM.sidebar.classList.add('open');
  DOM.sidebarBackdrop.classList.add('active');
}

function closeMobileSidebar() {
  DOM.sidebar.classList.remove('open');
  DOM.sidebarBackdrop.classList.remove('active');
}

// ==================== TOAST NOTIFICATIONS ====================
let toastTimeout = null;

function showToast(message) {
  DOM.toastText.textContent = message;
  DOM.toastNotification.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    DOM.toastNotification.classList.add('hidden');
  }, 2800);
}

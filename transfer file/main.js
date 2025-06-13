import { chatWithGemini, getTTS } from './gemini.js';

document.addEventListener('DOMContentLoaded', () => {
    const chatMessagesEl = document.getElementById('chatMessages');
    const userInputEl = document.getElementById('userInput');
    const sendButtonEl = document.getElementById('sendButton');

    function addMessage(text, sender, isTyping = false) {
        const el = document.createElement('div');
        el.className = `message ${sender}`;
        el.innerHTML = isTyping
            ? `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`
            : `<div class="bubble">${text}</div>`;
        chatMessagesEl.appendChild(el);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        return el;
    }

    async function handleSend() {
        const userText = userInputEl.value.trim();
        if (!userText) return;

        addMessage(userText, 'user');
        userInputEl.value = '';

        const typingEl = addMessage('', 'bot', true);

        try {
            const botText = await chatWithGemini(userText);
            typingEl.remove();
            addMessage(botText, 'bot');

            const audioBase64 = await getTTS(botText);
            if (audioBase64) {
                const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
                audio.play();
            }
        } catch (err) {
            console.error(err);
            typingEl.remove();
            addMessage("Something went wrong.", 'bot');
        }
    }

    sendButtonEl.addEventListener('click', handleSend);
    userInputEl.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleSend();
    });
});

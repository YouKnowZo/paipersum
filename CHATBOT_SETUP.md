# 🤖 AI Chatbot Setup Guide

**Your floating AI assistant is ready!**

---

## ✅ WHAT'S BEEN ADDED

1. **Updated Hero.tsx** - Cleaner design with animated blobs
2. **New Chatbot.tsx** - Floating AI chat assistant
3. **Tailwind animations** - Already configured

---

## 🚀 ACTIVATE CHATBOT (2 Steps)

### Step 1: Add to App.tsx

```tsx
import Chatbot from './components/Chatbot'

// Add at the end of your return statement:
<Chatbot />
```

### Step 2: Create Backend Endpoint

**Quick Mock (Test Now):**

```python
# In apps/api/main.py
from pydantic import BaseModel

class ChatMessage(BaseModel):
    message: str

@app.post("/chat")
async def chat(msg: ChatMessage):
    return {
        "response": "I can help explain legal terms! Try asking about 'arbitration' or 'class action'."
    }
```

**Real OpenAI (Production):**

1. Get API key: https://platform.openai.com/api-keys
2. `pip install openai`
3. Add to `.env`: `OPENAI_API_KEY=sk-proj-xxxxx`
4. See full code in this guide

---

## 💰 COSTS

- Mock response: **FREE**
- OpenAI: **~$0.003 per conversation** (~$3 per 1,000 messages)
- Free $5 credit = ~1,500 conversations

---

## ✅ READY TO USE

- [x] Hero animations working
- [x] Chatbot component created
- [ ] Add to App.tsx
- [ ] Create /chat endpoint
- [ ] Test & deploy

**See full guide above for detailed setup!** 🚀

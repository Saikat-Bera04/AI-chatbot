# EVO – AI Chatbot

A sleek, glass‑morphic AI companion built with **React.js** and powered by **Google Gemini**. Ask EVO anything—from coding help to fun facts—through a magical, animated interface.

---

## 🚀 Live Demo

[CLICK HERE 🔗](https://gorgeous-zuccutto-293945.netlify.app/)

*(Best viewed on modern Chromium‑based browsers)*

---

## ✨ Features

| UI & UX                                                         | AI Logic                                               |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| 🌈 Glass card with light‑green → blue → magenta linear gradient | 🔑 Secure access via **Gemini API** (serverless fetch) |
| 🖋️ Typewriter headline — **“ask anything you like”**           | 🤖 Configurable model (default: `gemini-pro`)          |
| 💫 Floating coloured particles + arrow accents                  | 📜 Conversation context maintained in state            |
| 🌟 Glow‑on‑focus input displaying **“write here”**              | ⏱️ Streaming responses (incremental render)            |
| 🪄 Magic‑wand icon on the send button                           | 📊 Token & latency stats in dev console                |

---

## 🖼️ Preview

> Add screenshots or a short GIF here to showcase the interaction.

---

## 🛠️ Tech Stack

* **React 18** + **Vite**
* **Tailwind CSS** for glassmorphism & responsiveness
* **Framer Motion** for typewriter + particle animations
* **Google Generative AI SDK** (`@google/generative-ai`)
* **Netlify** for continuous deployment

---

## 📦 Prerequisites

1. **Node.js ≥ 18** & npm
2. A **Gemini API key** → Get yours at [https://makersuite.google.com/](https://makersuite.google.com/).

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_actual_key_here
```

> Do **NOT** commit your key—`.gitignore` already excludes `.env`.

---

## 🏃‍♂️ Getting Started

```bash
# 1. Clone the repo
$ git clone https://github.com/<your‑username>/evo-chatbot.git
$ cd evo-chatbot

# 2. Install dependencies
$ npm install

# 3. Start the dev server
$ npm run dev     # opens http://localhost:5173
```

The app hot‑reloads on save. Linting and Prettier run automatically on commit (husky + lint‑staged).
---

## ⚙️ How It Works

1. **User input** triggers `handleSubmit` in `ChatCard.jsx`.
2. `useGemini` sends a **POST** to `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=VITE_GEMINI_API_KEY` with the chat prompt.
3. The **SSE** stream returns incremental `candidates` → appended to state → live‑typed on screen.
4. Errors & token counts are logged to the dev console for quick debugging.

---

## 🚢 Deployment

1. Push to a GitHub repo.
2. On Netlify → **New Site → Import from Git** → add `VITE_GEMINI_API_KEY` in *Site Settings → Environment*.
3. Netlify installs, builds, and deploys on every commit.

---

## 🗺️ Roadmap

* [ ] Persist chat history in `localStorage`
* [ ] Toggle light/dark glass themes
* [ ] Voice input & text‑to‑speech replies
* [ ] Unit tests with Vitest & React Testing Library

---

## 🤝 Contributing

Pull requests are welcome! Please fork the repo and create a feature branch:

```bash
git checkout -b feat/<short‑title>
```

Run `npm run lint` before submitting, and open a clear PR description.

---

## 📜 License

Distributed under the **MIT** License. See `LICENSE` for details.

---

## 🙏 Acknowledgements

* **Google Gemini** for the LLM magic
* **Glassmorphism UI** inspiration from [glassmorphism.com](https://glassmorphism.com/)
* Icon by [Lucide](https://lucide.dev/)

> Made with ♥ by [Saikat Bera](https://github.com/Saikat-Bera04)

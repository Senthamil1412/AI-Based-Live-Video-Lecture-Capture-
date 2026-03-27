<div align="center">

# 🎓 LectureLens AI
### *Your Lectures. Transcribed. Summarized. Understood.*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Pro-Multimodal-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![GPT-4](https://img.shields.io/badge/GPT--4_Turbo-Transcript_AI-74AA9C?style=for-the-badge&logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **LectureLens AI** is a full-stack, multimodal AI web application that captures live lectures, auto-transcribes speech in real time, and generates structured smart notes — powered by Google Gemini 1.5 Pro and GPT-4 Turbo.

</div>

---

## ✨ What Makes This Different?

Most note-taking apps just record. **LectureLens AI** *understands*.

| Feature | Traditional Tools | LectureLens AI |
|---|---|---|
| Recording | ✅ | ✅ |
| Transcription | ❌ Manual | ✅ Real-time Web Speech API |
| AI Summarization | ❌ | ✅ GPT-4 Turbo |
| **Video-to-Notes (AI Vision)** | ❌ | ✅ **Gemini 1.5 Pro Multimodal** |
| Q&A Extraction | ❌ | ✅ Automatic |
| Action Item Detection | ❌ | ✅ Extracted from lecture |
| Export (PDF/Markdown) | ❌ | ✅ One-click |

---

## 🧠 AI Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LectureLens AI Core                     │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   [Live Recording]    [Video Upload]      [Screen Capture]
   Webcam / Mic        MP4, WebM, AVI      System Audio + PIP
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
              ┌───────────────▼───────────────┐
              │     Real-Time Web Speech API   │
              │    (Transcription + Speaker    │
              │       Identification)          │
              └───────────────┬───────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
  [/api/analyze-video-  [/api/analyze-    [/api/transcribe]
    gemini]              content]
  Gemini 1.5 Pro        GPT-4 Turbo       Whisper / Local
  (Multimodal Vision)   (Transcript AI)
           │                  │
           └──────────────────┤
                              ▼
              ┌───────────────────────────────┐
              │         Smart Notes Engine     │
              │  ✦ Summary   ✦ Key Points      │
              │  ✦ Topics    ✦ Q&A Pairs       │
              │  ✦ Action Items                │
              └───────────────┬───────────────┘
                              ▼
              ┌───────────────────────────────┐
              │    Export & Library Layer      │
              │  PDF | Markdown | Timestamp    │
              │  Search | Tags | Grid View     │
              └───────────────────────────────┘
```

---

## 🚀 Key Features

### 📹 Multi-Source Video Capture
- **Webcam Only** — Record yourself speaking
- **Screen Only** — Capture slides and presentations
- **Dual PIP Mode** — Webcam floating over screen, simultaneously
- **Video Upload** — Drop in existing MP4/WebM/AVI lectures
- **Live Preview** — See exactly what's being captured

### 🎙️ Real-Time Transcription Engine
- **Instant Speech-to-Text** via Web Speech API (no server, no delay)
- **Auto Speaker Labels** — Identifies multiple speakers
- **Timestamp Sync** — Every word gets a timestamp
- **Confidence Scoring** — Visual accuracy indicators
- **Searchable Transcript** — Ctrl+F your lecture

### 🤖 Dual AI Analysis (The Real Magic)
- **Path A — Gemini 1.5 Pro (Video Vision)**: Sends the raw video to Google's multimodal model. It *watches* the video and generates transcript + notes directly from visual context.
- **Path B — GPT-4 Turbo (Transcript Analysis)**: Takes the speech transcript, sends it to OpenAI for structured extraction.
- Both paths return: **Summary**, **Key Points**, **Topics**, **Q&A Pairs**, and **Action Items**.

### 📚 Smart Lecture Library
- Grid view of all saved lectures with thumbnail metadata
- Full-text search across all transcripts
- Tag-based filtering (by subject, date, speaker)
- Click-to-jump navigation via timestamps

### 📤 Export Suite
- **PDF Export** — Formatted, printable notes with `jsPDF`
- **Markdown Export** — Writer-friendly `.md` format
- **Transcript Download** — Timestamped `.txt` file
- **Video Download** — Original recording in WebM

---

## 🏗️ Project Structure

```
lecture-capture/
│
├── app/                              # Next.js App Router
│   ├── page.tsx                      # 🏠 Landing / Dashboard
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   ├── globals.css                   # 🎨 Design system (glassmorphism)
│   │
│   ├── record/
│   │   ├── page.tsx                  # 🎬 Live recording interface
│   │   └── record.module.css
│   │
│   ├── upload/
│   │   └── page.tsx                  # 📁 Video upload & processing
│   │
│   ├── library/
│   │   ├── page.tsx                  # 📚 Lecture library (grid view)
│   │   └── library.module.css
│   │
│   ├── lecture/[id]/
│   │   ├── page.tsx                  # 🔍 Individual lecture viewer
│   │   └── lecture.module.css
│   │
│   └── api/
│       ├── analyze-video-gemini/     # 🔮 Gemini 1.5 Pro (video vision)
│       │   └── route.ts
│       ├── analyze-content/          # 🤖 GPT-4 Turbo (transcript AI)
│       │   └── route.ts
│       ├── analyze-transcript-gemini/# ✨ Gemini transcript analysis
│       │   └── route.ts
│       └── transcribe/               # 🎙️ Audio transcription endpoint
│           └── route.ts
│
├── public/                           # Static assets
├── main.tex                          # 📝 Research paper (LaTeX)
├── package.json
├── tsconfig.json
├── next.config.ts
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/lecture-capture.git
cd lecture-capture
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI (for video/multimodal analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI (for transcript-based smart notes)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase (optional — for cloud storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 🔑 Get your Gemini API key at [ai.google.dev](https://ai.google.dev/) | OpenAI key at [platform.openai.com](https://platform.openai.com/)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 How to Use

### 🔴 Record a Live Lecture
1. Go to **Start Recording** from the home page
2. Choose mode: **Webcam** / **Screen** / **PIP (Both)**
3. Click **Start Recording** → grant permissions
4. Speak — transcription happens *instantly* in real time
5. Click **Stop** → notes are generated automatically

### 📁 Upload a Pre-Recorded Video
1. Click **Upload Video**
2. Drag & drop any `.mp4`, `.webm`, `.avi`, or `.mov` file (max 500MB)
3. Click **Process Video** → Gemini AI analyzes it visually
4. Get full transcript + smart notes in seconds

### 🔍 Browse the Library
1. Click **Library** → see all your lectures in a grid
2. Search by keyword or filter by tag
3. Click **View** to open any lecture → jump to any timestamp

### 📄 Export Your Notes
- **PDF** — Click Export → PDF for a print-ready document
- **Markdown** — For editing in Notion, Obsidian, etc.
- **Transcript** — Plain text with timestamps

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Full-stack React framework |
| Language | **TypeScript 5** | Type-safe development |
| AI Vision | **Google Gemini 1.5 Pro** | Multimodal video understanding |
| AI Text | **GPT-4 Turbo (OpenAI)** | Transcript analysis & note generation |
| Speech | **Web Speech API** | Real-time browser transcription |
| Recording | **MediaRecorder API + RecordRTC** | Video/audio capture |
| Capture | **MediaDevices API** | Camera + screen access |
| PDF | **jsPDF + jsPDF-AutoTable** | Note export |
| Screenshot | **html2canvas** | Page captures |
| Storage | **Supabase** (optional) | Cloud lecture storage |
| Styling | **CSS Modules + Vanilla CSS** | Glassmorphism UI |
| Icons | **React Icons** | Feather icon set |

---

## 🎨 Design Philosophy

LectureLens AI uses a **Glassmorphism-first** design language:
- Dark base with frosted-glass card components
- HSL-based dynamic color palette (no flat primary colors)
- Google Fonts: **Inter** (UI) + **Outfit** (Headings)
- Smooth CSS transitions and micro-animations on every interaction
- Responsive across desktop, tablet, and mobile

---

## 📊 AI Model Details

### Gemini 1.5 Pro (Video Path)
- **Model**: `gemini-1.5-pro`  
- **Input**: Raw video (base64 inline data)
- **Output**: Transcript summary, key points, topics, Q&A, action items
- **Max Duration**: 5 minutes per request

### GPT-4 Turbo (Transcript Path)
- **Model**: `gpt-4-turbo-preview`
- **Temperature**: `0.5` (focused, factual outputs)
- **Max Tokens**: `2000`
- **Input**: Plain-text transcript
- **Output**: Structured JSON with educational analysis

---

## 🗺️ Roadmap

- [x] Live webcam + screen recording
- [x] Real-time Web Speech transcription
- [x] Gemini multimodal video analysis
- [x] GPT-4 transcript smart notes
- [x] Lecture library with search
- [x] PDF & Markdown export
- [ ] Supabase cloud sync across devices
- [ ] User authentication (NextAuth.js)
- [ ] Multi-language transcription support
- [ ] Live quiz generation from lecture content
- [ ] Collaborative annotations on shared lectures
- [ ] Video playback synchronized with transcript
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork → Clone → Branch → Code → PR
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Senth** — Final Year Computer Science Project

- 🎓 AI-Based Live Video Lecture Capture & Smart Notes System
- Built as an academic research project exploring multimodal AI in education

---

## 📚 Research Paper

This project is accompanied by a conference research paper (`main.tex`) documenting the system architecture, AI pipeline design, and experimental results.

> *"Bridging the gap between live lectures and intelligent, searchable knowledge — powered by multimodal AI."*

---

<div align="center">

**Built with ❤️ using Next.js 16, Google Gemini 1.5 Pro, and GPT-4 Turbo**

⭐ *Star this repo if it helped you!* ⭐

</div>

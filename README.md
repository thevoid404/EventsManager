# 🎟️ SEU Events Manager

A modern campus event hub built for Southeast University students and organizers. It helps students discover what's happening on campus, team up for hackathons and competitions, and generate digital boarding passes for events.

---

## 💡 What Is This Project About?

Campus events usually get lost in social media groups or messy chat threads. **SEU Events Manager** brings everything into one organized, sleek space:

- **Browse Campus Events**: Easily find hackathons, tech workshops, guest seminars, sports tournaments, and cultural fests with live countdown timers.
- **Form Squads & Find Teammates**: Joining a competition? Create a team, set the required team size, and approve or reject join requests. Or look through the "Free Agents" list to find classmates who also want to join.
- **Interactive 3D Event Pass**: Save or view a Swiss-style digital event ticket for any event you're attending, complete with your details and a scannable QR code.
- **Calendar Reminders**: Add any event directly to Google Calendar or download an `.ics` file with one click.
- **Quick Keyboard Search (`Ctrl+K` / `Cmd+K`)**: Jump to any event, notification, or page without touching your mouse.

---

## 🛠️ What Tech Is Used Here?

We kept the architecture modern, fast, and reliable:

### Frontend (Client-side)
- **Next.js 16 (React 19)**: Fast, modern web framework with smooth page transitions.
- **Tailwind CSS**: Dark-mode "Obsidian Editorial" design with vermilion accents.
- **Framer Motion**: Smooth animations, ticket sheen effects, and modal transitions.
- **Lucide Icons & QRCode**: Clean icons and instant QR code generation for tickets.

### Backend (Server & API)
- **NestJS (Node.js & TypeScript)**: A structured, modular REST API.
- **Prisma ORM**: Type-safe database queries.
- **PostgreSQL (Neon Cloud DB)**: Serverless cloud database storing users, events, teams, and notifications.
- **Cloudinary**: Cloud storage for event posters and avatars.
- **JWT (JSON Web Tokens)**: Secure login authentication.

---

## 🚀 How to Run It Locally

### 1. Prerequisites
- Node.js (version 20 or higher recommended)
- Git

### 2. Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
> The API server will start on `http://localhost:3001`.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to the Cloud

- **Backend (Render)**:
  - **Root Directory**: `backend`
  - **Build Command**: `npm install && npx prisma db push && npm run build`
  - **Start Command**: `npm run start:prod`
- **Frontend (Vercel / Render)**:
  - Set `NEXT_PUBLIC_API_URL` to your live backend URL (e.g. `https://your-backend.onrender.com`).

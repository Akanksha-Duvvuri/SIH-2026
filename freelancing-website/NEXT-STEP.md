# Part 2 — Profiles + Portfolio + Hiring

Adds real MongoDB-backed freelancer profiles, portfolio CRUD, public talent profiles, freelancer search, projects, and automatic project creation when an employer accepts an application.

Extract over the current project:
```bash
cd ~/Desktop/CSE/Projects/SIH-2026/freelancing-website
tar -xzf ~/Downloads/freelancing-platform-part-2-profiles-hiring.tar.gz --strip-components=1
```

Backend:
```bash
cd server
npm install
npm run dev
```
Frontend (second terminal):
```bash
cd ~/Desktop/CSE/Projects/SIH-2026/freelancing-website
npx next dev --webpack
```

Test freelancer: `/profile` → edit profile → add portfolio → `/freelancers` → open public profile.

Test employer: sign in with `employer@demo.local` / `DemoPass123!` → `/dashboard` → accept an application → `/projects`.

AI is deliberately excluded.

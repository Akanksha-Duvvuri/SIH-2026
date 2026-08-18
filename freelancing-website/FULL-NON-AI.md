# Full Non-AI MVP Overlay

This archive consolidates the marketplace implementation before the AI layer.

Included:
- real auth already present
- jobs + search/filter + create/edit/delete
- applications
- employer dashboard
- freelancer profiles
- portfolio CRUD
- freelancer discovery
- public profiles
- application acceptance -> project creation
- project lifecycle
- milestones + deliverables
- escrow/payment ledger simulation
- reviews + rating updates
- notifications
- project messaging
- marketplace analytics

It does NOT include the AI matching/insights layer yet.

## Extract
```bash
cd ~/Desktop/CSE/Projects/SIH-2026/freelancing-website
tar -xzf ~/Downloads/freelancing-platform-full-non-ai.tar.gz --strip-components=1
```

## Run
Terminal 1:
```bash
cd server
npm install
npm run dev
```
Terminal 2:
```bash
npx next dev --webpack
```

## Main demo flow
Freelancer register -> profile -> portfolio -> jobs -> search/filter -> apply -> applications.
Employer login -> dashboard -> applicants -> accept -> project -> fund escrow -> milestones -> approve/release -> complete -> reviews -> notifications -> messages -> analytics.

## Notes
- Escrow is a simulated ledger for the hackathon; no real money is moved.
- Portfolio image upload is intentionally omitted; add Cloudinary later.
- Messaging is project-scoped and uses basic polling/manual refresh rather than WebSockets.
- The next layer is AI matching, candidate ranking, skill-gap analysis, job intelligence and recommendation explanations.

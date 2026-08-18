FREELANCING PLATFORM — UI STARTER

This archive contains the first working UI milestone:
- Login page
- Demo login
- Protected dashboard redirect
- Freelancer dashboard
- AI recommendation cards
- Profile/project stats
- AI skill insight card
- Responsive desktop/mobile layout

INSTALL

1. Extract this archive into your existing Next.js project.

2. It is intended to replace:
   app/page.tsx
   app/dashboard/page.tsx
   app/globals.css
   app/layout.tsx

3. If app/dashboard does not exist, create it automatically by extracting
   the archive.

4. Run:
   npm run dev

5. Open:
   http://localhost:3000

LOGIN

Any non-empty email/password will work for now because authentication is
currently a frontend prototype.

You can also click:
"Continue with demo account"

The demo session is stored in localStorage.

NEXT STEP

The next milestone is to replace this mock authentication with:
Next.js frontend -> Express API -> MongoDB -> JWT auth.

Do NOT add a separate frontend framework or replace the current Next.js app.


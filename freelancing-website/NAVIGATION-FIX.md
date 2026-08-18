# Navigation + Collaboration Workflow

This overlay fixes the application shell so the visible sidebar matches the actual routes in the project.

## Sidebar now

### Freelancer

- Dashboard -> `/dashboard`
- Find work -> `/jobs`
- Talent -> `/freelancers`
- Projects -> `/projects`
- Analytics -> `/analytics`
- Profile -> `/profile`
- Notifications -> `/notifications`
- Messages -> `/messages`
- Applications -> `/applications`

### Employer

- Dashboard -> `/dashboard`
- Find work -> `/jobs`
- Talent -> `/freelancers`
- Projects -> `/projects`
- Analytics -> `/analytics`
- Profile -> `/profile`
- Notifications -> `/notifications`
- Messages -> `/messages`
- `+ Post a project` -> `/jobs/create`

## Additional fixes

- Sidebar links are role-aware.
- Employer no longer sees the freelancer-only Applications entry.
- All visible navigation items point to existing pages.
- The top-right profile avatar opens `/profile`.
- The top-right notification button opens `/notifications`.
- Employer has a working Post button.
- Mobile navigation is added at the bottom of the screen.
- Private pages redirect to `/login` when the backend session is missing.
- Public marketplace pages remain accessible without an authenticated session.

## Extract

```bash
cd ~/Desktop/CSE/Projects/SIH-2026/freelancing-website
tar -xzf ~/Downloads/freelancing-platform-navigation-fix.tar.gz --strip-components=1
```

Restart Next.js afterward:

```bash
npx next dev --webpack
```

The Express server does not need changes for this overlay.

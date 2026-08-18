# Milestone 2

This archive adds:

- Real Express + MongoDB backend
- JWT authentication stored in an httpOnly cookie
- Registration
- Login
- Logout
- Protected `/api/auth/me`
- Job model and searchable job API
- Seed data
- Job marketplace with search and filters
- Job detail pages
- Freelancer discovery with search/filter
- Projects + milestone/escrow UI
- Analytics UI
- Web development, AI/ML, cybersecurity, data, backend and design job categories

## Install backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and add your MongoDB Atlas connection string and a long JWT secret.

Then:

```bash
npm run dev
```

Backend:
`http://localhost:5000`

## Frontend

In the project root:

```bash
npm run dev
```

If Turbopack causes high CPU on your machine, use:

```bash
npx next dev --webpack
```

Frontend:
`http://localhost:3000`

## Demo accounts

The server seeds these automatically on the first empty database:

```text
freelancer@demo.local
DemoPass123!

employer@demo.local
DemoPass123!
```

## Important

The frontend no longer uses localStorage as authentication. Login/register now go through Express and MongoDB, and the server issues an httpOnly JWT cookie.

The job list is database-backed. The freelancer directory, project details and analytics currently use rich demo data so the UI is complete; these will be connected to MongoDB in the next backend pass.

## MongoDB recommendation

Use MongoDB Atlas for this project. It matches the MERN architecture and makes Mongoose queries/search/filtering straightforward.

Do not store portfolio images or large files directly inside MongoDB. Store files in object storage such as Cloudinary and save only URLs/metadata in MongoDB.

# Freelancing Platform

### AI-Powered Freelancing & Gig Marketplace

A full-stack freelancing marketplace designed to connect freelancers, gig workers, and employers through intelligent job matching, portfolio-based discovery, project management, analytics, and milestone-based payment protection.

> **Hackathon Project — SIH 1629: Freelancing Platform**

---

## 📌 Problem Statement

There is a significant gap in connecting freelancers and gig workers with short-term and project-based employment opportunities.

Existing platforms can make it difficult for:

### Freelancers

* To discover relevant opportunities efficiently.
* To stand out among large numbers of applicants.
* To understand which skills are currently in demand.
* To determine whether a project is actually a good fit.
* To build trust with new employers.

### Employers

* To find suitable freelancers quickly.
* To filter large numbers of applications.
* To evaluate candidates beyond basic profiles.
* To understand whether their project requirements and budget are competitive.
* To manage payments and project milestones securely.

This platform addresses these challenges through an **AI-assisted freelance marketplace**.

---

# 💡 Proposed Solution

The platform provides an end-to-end environment for freelance work:

```text
Discover
   ↓
AI Match
   ↓
Apply / Hire
   ↓
Project
   ↓
Milestones
   ↓
Payment
   ↓
Review
   ↓
Better Recommendations
```

The system serves both sides of the marketplace while continuously generating useful insights from marketplace activity.

---

# ✨ Core Features

## 1. Freelance Job Marketplace

Employers can post short-term and project-based opportunities.

Each project can contain:

* Job title
* Description
* Required skills
* Budget range
* Project duration
* Experience level
* Location
* Work mode
* Preferred languages
* Application requirements

Freelancers can browse, search and filter available opportunities.

### Search & Filtering

Users can search based on:

* Skills
* Keywords
* Budget
* Duration
* Experience
* Location
* Work mode
* Category
* Rating

---

# 2. Freelancer Profiles & Portfolios

Freelancers can create detailed professional profiles containing:

* Professional headline
* Biography
* Skills
* Experience
* Hourly rate
* Availability
* Languages
* Portfolio projects
* Completed projects
* Ratings
* Reviews

Employers can use these profiles to evaluate candidates before hiring.

---

# 3. AI-Powered Opportunity Matching

The platform calculates a compatibility score between a freelancer and a project.

### Example

```text
AI MATCH — 94%

✓ 5/5 required skills matched
✓ Experience requirement satisfied
✓ Budget compatible
✓ Availability compatible
✓ Similar portfolio projects detected

Why this opportunity?

Your previous Next.js and TypeScript projects
closely match the technical requirements of
this project.
```

The matching system considers:

| Factor                 | Weight |
| ---------------------- | -----: |
| Skill compatibility    |    40% |
| Experience             |    20% |
| Budget compatibility   |    15% |
| Rating                 |    10% |
| Availability           |    10% |
| Language compatibility |     5% |

The deterministic score provides consistent ranking, while the AI layer provides contextual explanations.

---

# 4. AI Skill Gap Analysis

The platform identifies skills that freelancers could develop to become eligible for more opportunities.

### Example

```text
CURRENT MATCH — 81%

Strong matches:
✓ Next.js
✓ React
✓ TypeScript
✓ PostgreSQL

Skill gap:
○ Docker

RECOMMENDATION

Adding Docker to your profile could improve
your eligibility for backend and deployment
projects.
```

This transforms the platform from a simple job board into a **career-development tool**.

---

# 5. AI Candidate Shortlisting

Employers can use AI-assisted ranking to quickly identify the strongest candidates.

```text
AI SHORTLIST

1. Candidate A       96%
2. Candidate B       93%
3. Candidate C       91%
```

Candidate ranking considers:

* Required skills
* Experience
* Portfolio similarity
* Budget
* Rating
* Availability
* Previous projects

The system also provides an explanation for each recommendation.

---

# 6. AI Job & Marketplace Insights

The platform analyzes aggregated marketplace data to generate useful insights.

### Example

```text
MARKETPLACE INSIGHT

Demand for AI/ML freelancers has increased 27%.

However, freelancers with cloud deployment
experience remain comparatively scarce.

OPPORTUNITY:

Python + ML + Cloud Deployment
```

Potential analytics include:

* Most demanded skills
* Skill supply
* Average project budgets
* Project categories
* Hiring trends
* Application trends
* Freelancer earnings
* Emerging skills
* Skill gaps
* Market opportunities

---

# 7. Milestone-Based Escrow

Projects can be divided into milestones with individual payment amounts.

### Example

```text
PROJECT VALUE

₹45,000

ESCROW
● FUNDED

────────────────────────

Milestone 1
UI & Architecture
₹12,000
✓ Completed

Milestone 2
Backend & APIs
₹18,000
● In Progress

Milestone 3
Deployment
₹15,000
○ Pending
```

Payments associated with milestones are released after the corresponding work is approved.

> For the hackathon prototype, escrow is implemented as a simulated payment/ledger system. Production deployment would integrate a compliant payment and escrow provider.

---

# 8. Ratings & Reviews

After completing a project:

* Employers can review freelancers.
* Freelancers can review employers.
* Ratings contribute to user reputation.
* Reviews can influence future recommendations.

This creates a reputation system that improves trust within the marketplace.

---

# 9. Project Management

Once an employer hires a freelancer, the job becomes a project.

Projects provide:

* Project status
* Milestones
* Deliverables
* Deadlines
* Payment status
* Completion tracking
* Reviews

---

# 🧠 AI Architecture

The recommendation system follows a hybrid approach.

```text
                         JOB
                          │
                          ▼
                 ┌─────────────────┐
                 │ Matching Engine │
                 └────────┬────────┘
                          │
               ┌──────────┴──────────┐
               │                     │
               ▼                     ▼
       Deterministic Score       AI Layer
               │                     │
               │              ┌──────┴──────┐
               │              │             │
               │         Explanation   Recommendations
               │
               └──────────┬──────────┘
                          ▼
                    Match Result
```

The system does not rely entirely on an LLM for ranking.

Instead:

1. Candidate/job data is evaluated using deterministic scoring.
2. The resulting score is calculated consistently.
3. AI generates explanations and additional insights.
4. The user receives an interpretable recommendation.

---

# 🏗️ System Architecture

```text
                    ┌───────────────────┐
                    │    Next.js App    │
                    │    Frontend       │
                    └─────────┬─────────┘
                              │
                         REST API
                              │
                    ┌─────────▼─────────┐
                    │ Express.js Server │
                    │   Backend API     │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │      MongoDB      │
                    │    + Mongoose     │
                    └───────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
           Matching Engine             AI Services
                                       Gemini API
```

---

# 🛠️ Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts
* Lucide React

## Backend

* Node.js
* Express.js
* TypeScript
* REST APIs
* JWT Authentication

## Database

* MongoDB
* Mongoose

## AI

* Google Gemini API
* Custom recommendation/matching engine

## Payments

* Razorpay
* Simulated milestone escrow system

## File Storage

* Cloudinary

## Deployment

* Vercel
* Render / Railway
* MongoDB Atlas

---

# 📁 Project Structure

```text
freelancing-platform/
│
├── client/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── freelancers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   ├── dashboard/
│   │   │   ├── freelancer/
│   │   │   └── employer/
│   │   ├── projects/
│   │   │   └── [id]/
│   │   └── analytics/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── jobs/
│   │   ├── freelancers/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── ai/
│   │   └── analytics/
│   │
│   ├── lib/
│   ├── types/
│   └── public/
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       │   ├── ai/
│       │   └── matching/
│       ├── utils/
│       └── server.ts
│
├── README.md
└── .gitignore
```

---

# 🗄️ Database Models

## User

```text
_id
name
email
password
role
avatar
location
bio
languages
createdAt
```

## FreelancerProfile

```text
_id
userId
headline
skills
experience
hourlyRate
availability
rating
completedProjects
```

## Portfolio

```text
_id
freelancerId
title
description
image
link
skills
```

## Job

```text
_id
employerId
title
description
skills
budgetMin
budgetMax
duration
experienceLevel
location
workMode
status
createdAt
```

## Application

```text
_id
jobId
freelancerId
proposal
bidAmount
matchScore
matchReason
status
createdAt
```

## Project

```text
_id
jobId
employerId
freelancerId
totalAmount
status
escrowStatus
createdAt
```

## Milestone

```text
_id
projectId
title
description
amount
dueDate
status
```

## Review

```text
_id
projectId
reviewerId
revieweeId
rating
comment
createdAt
```

---

# 🔐 Authentication

JWT-based authentication will be used.

### Roles

```text
FREELANCER
EMPLOYER
ADMIN
```

### Authentication API

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

# 🔌 API

## Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
```

## Applications

```text
POST  /api/jobs/:id/apply
GET   /api/jobs/:id/applications
PATCH /api/applications/:id
```

## Freelancers

```text
GET   /api/freelancers
GET   /api/freelancers/:id
PATCH /api/freelancers/:id
```

## Projects

```text
POST  /api/projects
GET   /api/projects/:id
PATCH /api/projects/:id
```

## Milestones

```text
POST  /api/projects/:id/milestones
PATCH /api/milestones/:id
```

## AI

```text
POST /api/ai/match
POST /api/ai/skill-gap
POST /api/ai/job-insights
POST /api/ai/candidate-shortlist
```

## Analytics

```text
GET /api/analytics/marketplace
GET /api/analytics/skills
GET /api/analytics/budgets
```

---

# ⚙️ Local Development

## Requirements

* Node.js 20+
* MongoDB or MongoDB Atlas
* Git
* Gemini API key

---

## Clone

```bash
git clone <repository-url>
cd freelancing-platform
```

---

## Frontend

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## Backend

```bash
cd server
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

# 🔑 Environment Variables

## Client

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Server

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

GEMINI_API_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`.env` files must never be committed to Git.

---

# 🧪 Demo Data

The hackathon prototype will include seeded data for:

* Freelancers
* Employers
* Jobs
* Applications
* Projects
* Milestones
* Reviews
* Marketplace analytics

The demo should be usable without requiring judges to manually create accounts or populate the database.

---

# 🎬 Demo Flow

## Freelancer Journey

```text
Login
  ↓
Freelancer Dashboard
  ↓
AI Recommended Opportunities
  ↓
View Job
  ↓
AI Match Explanation
  ↓
Apply
  ↓
Application Tracking
  ↓
Project
  ↓
Milestones
  ↓
Payment
  ↓
Review
```

## Employer Journey

```text
Login
  ↓
Employer Dashboard
  ↓
Post Project
  ↓
Applications
  ↓
AI Candidate Shortlist
  ↓
Select Freelancer
  ↓
Create Project
  ↓
Fund Milestones
  ↓
Track Deliverables
  ↓
Release Payment
  ↓
Review Freelancer
```

---

# 🌟 Innovation

The platform goes beyond a conventional Upwork-style marketplace.

### Explainable AI Matching

Users receive both a recommendation and the reasoning behind it.

### Skill Gap Intelligence

Freelancers are told which skills could increase their employability.

### Marketplace Intelligence

Aggregated marketplace activity is transformed into actionable insights.

### India-Focused Marketplace

The platform can incorporate:

* INR-based pricing
* Indian languages
* Local market demand
* Indian payment infrastructure
* Short-term gig work

### Milestone-Based Trust

Projects are structured around deliverables and milestone payments rather than a single transaction.

---

# 📈 Expected Impact

The platform aims to:

* Reduce the time required to find relevant freelance work.
* Reduce employer hiring effort.
* Improve freelancer visibility.
* Help freelancers identify valuable skills.
* Improve pricing transparency.
* Increase trust between employers and freelancers.
* Provide insight into emerging workforce demand.

---

# 🔮 Future Scope

Potential production extensions include:

* Real payment escrow through regulated providers
* KYC and identity verification
* GST invoice generation
* Semantic/vector-based job matching
* AI proposal generation
* AI contract generation
* Automated fraud detection
* Dispute resolution
* Skill certifications
* Real-time messaging
* Video interviews
* Regional-language AI assistance
* Personalized career roadmaps
* Reputation graphs
* Advanced employer analytics

---

# 👥 Team

Developed as a hackathon prototype for:

**SIH 1629 — Freelancing Platform**

---

# 📜 License

This project is currently developed as a hackathon prototype.

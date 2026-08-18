# Freelancing Platform

AI-powered freelancing marketplace for connecting freelancers and employers with project-based work.

> **Hackathon Topic: SIH 1629 — Freelancing Opportunities for India**

---

# Current Status

The project currently has the **non-AI marketplace foundation** implemented.

The current stack is:

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** MongoDB Atlas + Mongoose
* **Authentication:** JWT + httpOnly cookies
* **Development:** Next.js Webpack dev server + `tsx watch` for Express

AI functionality is intentionally being added later.

---

# ✅ Features Implemented So Far

## 1. Authentication

### User registration

* Freelancer registration
* Employer registration
* Password validation
* Password hashing with bcrypt
* Duplicate email prevention

### Login

* Email/password authentication
* JWT generation
* JWT stored in an httpOnly cookie
* Persistent authenticated sessions
* Protected API routes

### Logout

* JWT cookie cleared
* Session invalidated

### Session verification

```text
GET /api/auth/me
```

Used by the frontend to determine the logged-in user and role.

---

# 2. Role-Based Access

Two primary roles currently exist:

```text
FREELANCER
EMPLOYER
```

Permissions are enforced by the backend.

### Freelancer can

* Browse jobs
* Search/filter jobs
* Apply to jobs
* Track applications
* Withdraw applications
* Manage profile
* Manage portfolio
* Browse projects
* View assigned projects

### Employer can

* Post jobs
* Edit jobs
* Delete jobs
* View applicants
* Shortlist applicants
* Accept applicants
* Reject applicants
* Browse freelancers
* View projects
* Manage project status

---

# 3. Freelance Job Marketplace

Employers can create project-based job listings.

Each job supports:

* Title
* Company/client
* Description
* Category
* Required skills
* Minimum budget
* Maximum budget
* Duration
* Experience level
* Location
* Work mode
* Application count
* Job status

### Current categories

* Web Development
* AI / ML
* Cybersecurity
* Backend
* Data
* Mobile Development
* UI/UX
* DevOps / Cloud
* Content / Writing
* Marketing

---

# 4. Job Search & Filtering

The job marketplace currently supports:

### Search

Search across indexed job content including:

* Title
* Description
* Skills
* Category

### Filters

* Category
* Work mode
* Experience level
* Budget range

### Job details

Each job has a dedicated page containing:

* Description
* Budget
* Duration
* Experience level
* Location
* Work mode
* Required skills
* Application count
* Apply interface

---

# 5. Job Posting

Employers have a dedicated:

```text
/jobs/create
```

page.

The employer can create a real MongoDB-backed job.

### Current flow

```text
Employer
   ↓
Post Project
   ↓
Express API
   ↓
MongoDB
   ↓
Job appears in marketplace
```

---

# 6. Applications

Freelancers can apply to jobs.

An application contains:

* Freelancer
* Job
* Proposal
* Bid amount
* Status
* Creation timestamp

### Application statuses

```text
submitted
shortlisted
accepted
rejected
withdrawn
```

### Current freelancer flow

```text
Browse job
   ↓
Apply
   ↓
Write proposal
   ↓
Set bid
   ↓
Submit
   ↓
Track application
```

---

# 7. Employer Applicant Management

Employers have access to applicant data for jobs they own.

The employer dashboard currently shows:

* Posted jobs
* Open jobs
* Applications
* Shortlisted candidates
* Applicant profiles
* Skills
* Ratings
* Completed projects
* Bid amounts

Employers can:

```text
Shortlist
Accept
Reject
```

When an application is accepted:

```text
Accepted applicant
       ↓
Project created
       ↓
Job becomes "in-progress"
       ↓
Other active applications rejected
```

---

# 8. Freelancer Profiles

Freelancers can maintain a real MongoDB-backed profile.

Current profile fields:

* Name
* Professional headline
* Bio
* Location
* Skills
* Languages
* Avatar field
* Rating
* Completed projects

### Profile page

```text
/profile
```

Freelancers can update their information without modifying the database manually.

---

# 9. Portfolio

Freelancers can create portfolio entries.

Each portfolio item supports:

* Project title
* Description
* Skills used
* Project URL
* Image URL field

### Portfolio operations

* Create
* View
* Delete
* Update through API

Portfolio entries are associated with the freelancer who created them.

### Current limitation

Actual image uploading is **not implemented yet**.

The database currently stores an optional image URL.

---

# 10. Freelancer Discovery

Employers can browse freelancers through:

```text
/freelancers
```

Search currently supports:

* Name
* Headline
* Bio
* Skills

Filters currently support:

* Skill

Freelancer cards display:

* Name
* Headline
* Location
* Skills
* Rating
* Completed projects

---

# 11. Public Freelancer Profiles

Each freelancer has a public profile page:

```text
/freelancers/[id]
```

The page contains:

* Basic profile information
* Skills
* Languages
* Rating
* Completed projects
* Biography
* Portfolio

This is intended to serve as the employer-facing candidate profile.

---

# 12. Projects

When an employer accepts an application, a project is automatically created.

### Project contains

* Job
* Employer
* Freelancer
* Contract value
* Project status
* Escrow status
* Start date
* End date

### Project statuses

```text
created
in-progress
completed
cancelled
```

### Current flow

```text
Job
 ↓
Application
 ↓
Accepted
 ↓
Project created
 ↓
Job becomes in-progress
```

---

# 13. Project Dashboard

Users can access projects belonging to them.

```text
/projects
```

Project detail:

```text
/projects/[id]
```

Current project page shows:

* Job information
* Employer
* Freelancer
* Contract value
* Project status
* Escrow status
* Project scope
* Skills

There are currently controls for:

* Starting a project
* Marking a project completed
* Updating escrow state

---

# 14. Escrow Foundation

The current project model includes an escrow state.

Supported states:

```text
not-funded
funded
partially-released
released
```

The current implementation is a **simulation/state system**, not a real financial escrow service.

Actual payment gateway integration is still pending.

---

# 15. Employer Dashboard

The employer dashboard includes:

```text
Posted jobs
Open jobs
Applications
Shortlisted candidates
```

It also provides:

* Applicant cards
* Candidate skills
* Ratings
* Completed projects
* Bid amounts
* Shortlisting
* Accept/reject actions
* Post-project button

---

# 16. Freelancer Dashboard

The freelancer dashboard currently includes:

* Profile strength
* Active project summary
* Application summary
* Earnings placeholder
* Recommended opportunities UI
* Profile improvement prompts
* Application navigation

Some dashboard statistics are currently **demo/placeholder values** and will be connected to real aggregates later.

---

# 17. Analytics UI

The analytics page currently contains:

* Active project count
* Open opportunity count
* Freelancer count
* Average project value
* Skill-demand visualization
* Category budget information
* Marketplace insight UI

Some analytics values are currently **seed/demo data** rather than calculated directly from all production records.

The analytics backend still needs to be expanded.

---

# 18. Seed / Demo Data

The backend currently seeds:

* Demo freelancer
* Demo employer
* Freelance jobs
* Different categories
* Different skills
* Different budgets
* Different locations
* Different experience levels

### Demo accounts

```text
Freelancer
freelancer@demo.local
DemoPass123!

Employer
employer@demo.local
DemoPass123!
```

---

# 🚧 TODO — Remaining Non-AI Features

## Priority 1 — Project & Milestone System

This is the biggest remaining core marketplace feature.

### Milestones

* [ ] Create milestone
* [ ] Edit milestone
* [ ] Delete milestone
* [ ] Milestone amount
* [ ] Milestone deadline
* [ ] Milestone description
* [ ] Milestone status

### Milestone statuses

```text
pending
in-progress
submitted
revision-requested
approved
paid
```

### Deliverables

* [ ] Freelancer submits deliverable
* [ ] Attach deliverable URL/file
* [ ] Employer reviews deliverable
* [ ] Employer approves
* [ ] Employer requests revision
* [ ] Freelancer resubmits

---

# 🚧 TODO — Escrow & Payments

Current implementation only stores escrow state.

Need to add:

* [ ] Escrow funding action
* [ ] Transaction model
* [ ] Transaction history
* [ ] Milestone payment release
* [ ] Amount released
* [ ] Amount remaining
* [ ] Payment timestamps
* [ ] Mock transaction IDs
* [ ] Payment summary

### Later

* [ ] Razorpay integration
* [ ] Production payment workflow
* [ ] Real escrow/payment provider
* [ ] Refund handling

For the hackathon, a simulated ledger is sufficient.

---

# 🚧 TODO — Reviews & Reputation

Add a `Review` model.

### Employer → Freelancer

* [ ] Rating
* [ ] Written review
* [ ] Communication rating
* [ ] Quality rating
* [ ] Timeliness rating

### Freelancer → Employer

* [ ] Rating
* [ ] Written review
* [ ] Communication rating
* [ ] Requirements clarity

### Reputation

* [ ] Automatic average rating
* [ ] Completed project count
* [ ] Review count
* [ ] Success rate
* [ ] Reputation summary

---

# 🚧 TODO — Notifications

Create a notification system for events such as:

* [ ] New application
* [ ] Application shortlisted
* [ ] Application accepted
* [ ] Application rejected
* [ ] Project created
* [ ] Milestone submitted
* [ ] Milestone approved
* [ ] Revision requested
* [ ] Payment released
* [ ] Project completed
* [ ] New review

---

# 🚧 TODO — Messaging

Basic employer ↔ freelancer communication.

### Needed

* [ ] Conversation model
* [ ] Message model
* [ ] Project-specific conversations
* [ ] Send messages
* [ ] Message timestamps
* [ ] Read/unread state
* [ ] Conversation list

Real-time WebSockets are optional for the hackathon.

---

# 🚧 TODO — Better Profile System

### Freelancer

* [ ] Experience history
* [ ] Education
* [ ] Certifications
* [ ] Hourly rate
* [ ] Availability hours
* [ ] Preferred project type
* [ ] Preferred job categories
* [ ] Profile completion percentage

### Employer

* [ ] Company profile
* [ ] Company description
* [ ] Industry
* [ ] Company location
* [ ] Company website
* [ ] Hiring history
* [ ] Employer rating

---

# 🚧 TODO — File Uploads

Currently only URLs are supported.

Add:

* [ ] Cloudinary integration
* [ ] Profile image upload
* [ ] Portfolio image upload
* [ ] Project deliverables
* [ ] File metadata
* [ ] File size/type validation

Do not store large files directly in MongoDB.

---

# 🚧 TODO — Better Search

Current search works, but it can be significantly improved.

### Jobs

* [ ] Relevance sorting
* [ ] Advanced keyword search
* [ ] Skill synonym matching
* [ ] Salary/budget ranges
* [ ] Date posted filter
* [ ] Job category search
* [ ] Location search

### Freelancers

* [ ] Experience filter
* [ ] Rating filter
* [ ] Hourly rate filter
* [ ] Availability filter
* [ ] Location filter
* [ ] Completed projects filter
* [ ] Multi-skill matching

---

# 🚧 TODO — Real Analytics

Replace placeholder statistics with actual MongoDB aggregation queries.

### Marketplace

* [ ] Total jobs
* [ ] Active jobs
* [ ] Total freelancers
* [ ] Total employers
* [ ] Completed projects
* [ ] Total transaction volume

### Skills

* [ ] Most requested skills
* [ ] Freelancer supply by skill
* [ ] Skill demand trends
* [ ] Category demand

### Financial

* [ ] Average project budget
* [ ] Average freelancer bid
* [ ] Total platform volume
* [ ] Earnings by category
* [ ] Payment completion rate

---

# 🚧 TODO — Admin System

Optional but useful for the demo.

* [ ] Admin role
* [ ] User management
* [ ] Job moderation
* [ ] Report handling
* [ ] Dispute management
* [ ] Platform statistics
* [ ] Fraud flags
* [ ] Account suspension

---

# 🤖 AI FEATURES — ADD LAST

AI is deliberately separated from the core implementation.

## AI Matching

* [ ] Freelancer ↔ job match score
* [ ] Candidate ↔ project match score
* [ ] Skill compatibility
* [ ] Experience compatibility
* [ ] Budget compatibility
* [ ] Availability compatibility
* [ ] Portfolio relevance

---

## AI Candidate Ranking

* [ ] Rank employer applicants
* [ ] Explain ranking
* [ ] Highlight strongest candidate
* [ ] Identify candidate weaknesses
* [ ] Generate shortlist

---

## AI Skill Gap

* [ ] Compare freelancer skills against market demand
* [ ] Identify missing skills
* [ ] Estimate opportunity improvement
* [ ] Recommend learning paths

---

## AI Job Analysis

When an employer posts a job:

* [ ] Analyze job requirements
* [ ] Recommend skills
* [ ] Recommend budget
* [ ] Detect missing information
* [ ] Estimate candidate availability
* [ ] Improve job description

---

## AI Marketplace Intelligence

* [ ] Skill demand prediction
* [ ] Pricing insights
* [ ] Emerging categories
* [ ] Freelancer supply/demand gaps
* [ ] Regional trends
* [ ] AI-generated marketplace reports

---

# 🧪 Testing TODO

* [ ] API endpoint testing
* [ ] Authentication testing
* [ ] Role authorization testing
* [ ] Application workflow testing
* [ ] Project workflow testing
* [ ] Payment state testing
* [ ] Form validation
* [ ] Error states
* [ ] Loading states
* [ ] Empty states

---

# 🎨 UI / UX TODO

The base UI is implemented, but final hackathon polish remains.

* [ ] Mobile navigation
* [ ] Better dashboard statistics
* [ ] Skeleton loaders
* [ ] Toast notifications
* [ ] Confirmation modals
* [ ] Better form validation
* [ ] Consistent empty states
* [ ] Responsive tables/cards
* [ ] Final visual polish
* [ ] Hackathon demo flow optimization

---

# 🗺️ Recommended Final Build Order

```text
CURRENT
  ↓
Milestones
  ↓
Deliverables
  ↓
Escrow ledger
  ↓
Reviews
  ↓
Notifications
  ↓
Messaging
  ↓
Real analytics
  ↓
File uploads
  ↓
UI polish
  ↓
AI matching
  ↓
AI skill gap
  ↓
AI candidate ranking
  ↓
AI market intelligence
```

---

# 🎯 Hackathon MVP Definition

The final demo should be able to show:

```text
Freelancer registers
        ↓
Builds profile
        ↓
Adds portfolio
        ↓
Searches jobs
        ↓
Filters opportunities
        ↓
Applies
        ↓
Employer reviews applicant
        ↓
Employer accepts
        ↓
Project created
        ↓
Milestones created
        ↓
Freelancer submits work
        ↓
Employer approves
        ↓
Payment released
        ↓
Project completed
        ↓
Both sides review each other
        ↓
Marketplace analytics
        ↓
AI recommendations
```

That is the target **end-to-end product story**.

---

# ⚡ Priority for the Hackathon

### Critical

* [x] Authentication
* [x] MongoDB connection
* [x] Job marketplace
* [x] Search/filter
* [x] Job posting
* [x] Applications
* [x] Employer dashboard
* [x] Freelancer profiles
* [x] Portfolio
* [x] Hiring workflow
* [x] Projects

### Next

* [ ] Milestones
* [ ] Escrow ledger
* [ ] Reviews
* [ ] Notifications
* [ ] Real analytics
* [ ] Better seed data
* [ ] Final UI polish

### After core platform

* [ ] Messaging
* [ ] File uploads
* [ ] Razorpay
* [ ] Admin

### Final innovation layer

* [ ] AI matching
* [ ] AI candidate ranking
* [ ] AI skill gap
* [ ] AI job analysis
* [ ] AI marketplace intelligence

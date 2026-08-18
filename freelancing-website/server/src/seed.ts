import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Job } from "./models/Job.js";
import { Application } from "./models/Application.js";
import { Portfolio } from "./models/Portfolio.js";
import { Project } from "./models/Project.js";
import { Milestone } from "./models/Milestone.js";
import { Transaction } from "./models/Transaction.js";
import { Message } from "./models/Message.js";
import { Notification } from "./models/Notification.js";
import { Review } from "./models/Review.js";

const jobs = [
  {
    title: "Next.js SaaS Dashboard",
    company: "Northstar Labs",
    category: "Web Development",
    description: "Build a responsive SaaS dashboard with authentication, charts and a PostgreSQL backend.",
    skills: ["Next.js", "TypeScript", "React", "PostgreSQL", "Tailwind"],
    budgetMin: 20000,
    budgetMax: 30000,
    duration: "2 weeks",
    experienceLevel: "Intermediate",
    workMode: "Remote",
    location: "India"
  },
  {
    title: "AI Resume Analyzer",
    company: "TalentGrid",
    category: "AI / ML",
    description: "Create an AI service that scores resumes against job descriptions and explains skill gaps.",
    skills: ["Python", "LLMs", "NLP", "FastAPI", "React"],
    budgetMin: 25000,
    budgetMax: 40000,
    duration: "3 weeks",
    experienceLevel: "Intermediate",
    workMode: "Remote",
    location: "India"
  },
  {
    title: "Security Audit for Node API",
    company: "SecureLayer",
    category: "Cybersecurity",
    description: "Perform an application security review of a Node.js REST API and provide remediation guidance.",
    skills: ["OWASP", "Node.js", "Burp Suite", "API Security", "Linux"],
    budgetMin: 30000,
    budgetMax: 50000,
    duration: "10 days",
    experienceLevel: "Expert",
    workMode: "Remote",
    location: "Bengaluru"
  },
  {
    title: "WhatsApp Automation Integration",
    company: "Flowstack",
    category: "Backend",
    description: "Integrate WhatsApp messaging, webhooks and transactional workflows into an existing product.",
    skills: ["Node.js", "APIs", "Webhooks", "MongoDB", "REST"],
    budgetMin: 12000,
    budgetMax: 18000,
    duration: "10 days",
    experienceLevel: "Intermediate",
    workMode: "Remote",
    location: "India"
  },
  {
    title: "React E-commerce Frontend",
    company: "Cartline",
    category: "Web Development",
    description: "Implement a high-performance storefront with product discovery, filters and checkout UX.",
    skills: ["React", "Next.js", "TypeScript", "CSS", "REST APIs"],
    budgetMin: 18000,
    budgetMax: 28000,
    duration: "2 weeks",
    experienceLevel: "Beginner",
    workMode: "Hybrid",
    location: "Hyderabad"
  },
  {
    title: "SOC Dashboard & Threat Analytics",
    company: "BlueShield",
    category: "Cybersecurity",
    description: "Build a dashboard that visualizes security events and highlights anomalous activity.",
    skills: ["Python", "Cybersecurity", "React", "Data Visualization", "Linux"],
    budgetMin: 35000,
    budgetMax: 60000,
    duration: "4 weeks",
    experienceLevel: "Expert",
    workMode: "Remote",
    location: "Pune"
  },
  {
    title: "Computer Vision Prototype",
    company: "VisionForge",
    category: "AI / ML",
    description: "Prototype an image classification pipeline and expose inference through an API.",
    skills: ["Python", "PyTorch", "Computer Vision", "FastAPI", "Docker"],
    budgetMin: 30000,
    budgetMax: 50000,
    duration: "3 weeks",
    experienceLevel: "Expert",
    workMode: "Remote",
    location: "India"
  },
  {
    title: "UI/UX Redesign for Fintech App",
    company: "Ledgerly",
    category: "Design",
    description: "Redesign the onboarding and dashboard experience for a personal finance product.",
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
    budgetMin: 15000,
    budgetMax: 25000,
    duration: "12 days",
    experienceLevel: "Intermediate",
    workMode: "Remote",
    location: "Mumbai"
  },
  {
    title: "Python Data Pipeline",
    company: "DataNorth",
    category: "Data",
    description: "Build a reliable ETL pipeline for marketplace data and expose summary analytics.",
    skills: ["Python", "Pandas", "SQL", "ETL", "MongoDB"],
    budgetMin: 22000,
    budgetMax: 35000,
    duration: "2 weeks",
    experienceLevel: "Intermediate",
    workMode: "Remote",
    location: "India"
  }
];

export async function seedDatabase() {
  const jobCount = await Job.countDocuments();

  if (jobCount > 0) {
    // Ensure demo users and basic relational data exist even if jobs are already seeded
    const freelancer = await User.findOne({ email: "freelancer@demo.local" });
    const employer = await User.findOne({ email: "employer@demo.local" });
    if (freelancer && employer) {
      // Seed applications for the first 3 jobs if missing
      const firstJobs = await Job.find({ employerId: employer._id }).limit(3);
      for (const job of firstJobs) {
        const existing = await Application.findOne({ jobId: job._id, freelancerId: freelancer._id });
        if (!existing) {
          await Application.create({ jobId: job._id, freelancerId: freelancer._id, proposal: "I can deliver this project with a clean, production-ready implementation and clear communication.", bidAmount: Math.round((job.budgetMin + job.budgetMax) / 2), status: "submitted" });
          await Job.findByIdAndUpdate(job._id, { $inc: { applications: 1 } });
        }
      }
      // Seed portfolio if missing
      const portfolioCount = await Portfolio.countDocuments({ freelancerId: freelancer._id });
      if (!portfolioCount) {
        await Portfolio.insertMany([
          { freelancerId: freelancer._id, title: "Full-stack Commerce Platform", description: "Next.js commerce platform with payments, admin tools and a MongoDB backend.", link: "https://example.com", skills: ["Next.js", "Node.js", "MongoDB", "Payments"] },
          { freelancerId: freelancer._id, title: "AI Study Assistant", description: "AI-powered study workflow with a React interface and API integrations.", skills: ["React", "Python", "AI/ML"] }
        ]);
      }

      // Seed projects, milestones, transactions, messages, notifications, reviews if missing
      await seedRelationalData(employer, freelancer);
    }
    return;
  }

  // === Fresh database — seed everything from scratch ===
  const password = await bcrypt.hash("DemoPass123!", 12);

  const employer = await User.create({
    name: "Demo Employer",
    email: "employer@demo.local",
    password,
    role: "employer",
    headline: "Hiring manager",
    location: "India"
  });

  const freelancer = await User.create({
    name: "Demo Freelancer",
    email: "freelancer@demo.local",
    password,
    role: "freelancer",
    headline: "Full-stack developer",
    bio: "Full-stack developer focused on React, Next.js and Node.js.",
    location: "Hyderabad",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
    languages: ["English", "Hindi", "Telugu"],
    rating: 4.9,
    completedProjects: 18,
    hourlyRate: 1200,
    availability: "20 hrs/week"
  });

  const createdJobs = await Job.insertMany(
    jobs.map((job, index) => ({
      ...job,
      employerId: employer._id,
      applications: 7 + index * 3,
      status: "open"
    }))
  );

  // Create applications for first 5 jobs
  const applicationsToCreate = [];
  const statuses: Array<"submitted" | "shortlisted" | "accepted"> = [
    "accepted", "shortlisted", "submitted", "submitted", "submitted"
  ];
  for (let i = 0; i < Math.min(5, createdJobs.length); i++) {
    const job = createdJobs[i];
    applicationsToCreate.push({
      jobId: job._id,
      freelancerId: freelancer._id,
      proposal: getProposal(i),
      bidAmount: Math.round((job.budgetMin + job.budgetMax) / 2),
      status: statuses[i]
    });
  }
  await Application.insertMany(applicationsToCreate);

  // Update application counts for those jobs
  for (let i = 0; i < Math.min(5, createdJobs.length); i++) {
    await Job.findByIdAndUpdate(createdJobs[i]._id, { $inc: { applications: 1 } });
  }

  // Seed portfolio
  await Portfolio.insertMany([
    { freelancerId: freelancer._id, title: "Full-stack Commerce Platform", description: "Next.js commerce platform with payments, admin tools and a MongoDB backend.", link: "https://example.com", skills: ["Next.js", "Node.js", "MongoDB", "Payments"] },
    { freelancerId: freelancer._id, title: "AI Study Assistant", description: "AI-powered study workflow with a React interface and API integrations.", skills: ["React", "Python", "AI/ML"] },
    { freelancerId: freelancer._id, title: "Real-time Chat Application", description: "WebSocket-powered chat app with message persistence and user presence.", skills: ["Node.js", "React", "MongoDB", "WebSockets"] }
  ]);

  // Seed relational data (projects, milestones, transactions, messages, notifications, reviews)
  await seedRelationalData(employer, freelancer);

  console.log(`✓ Seeded jobs, demo users, and full relational data. Freelancer: ${freelancer.email}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedRelationalData(employer: any, freelancer: any) {
  // Check if projects already exist — skip if so
  const projectCount = await Project.countDocuments();
  if (projectCount > 0) return;

  // Find the accepted application and its job to create a project
  const acceptedApp = await Application.findOne({
    freelancerId: freelancer._id,
    status: "accepted"
  }).lean();

  if (!acceptedApp) return;

  const job = await Job.findById(acceptedApp.jobId).lean();
  if (!job) return;

  // Mark the job as in-progress
  await Job.findByIdAndUpdate(job._id, { status: "in-progress" });

  // Create the project
  const totalAmount = Math.round((job.budgetMin + job.budgetMax) / 2);
  const project = await Project.create({
    jobId: job._id,
    employerId: employer._id,
    freelancerId: freelancer._id,
    totalAmount,
    status: "in-progress",
    escrowStatus: "funded",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // started 1 week ago
  });

  // Create milestones
  const milestone1 = await Milestone.create({
    projectId: project._id,
    title: "Project setup and architecture",
    description: "Set up the development environment, configure build pipeline and implement the base architecture.",
    amount: Math.round(totalAmount * 0.3),
    status: "approved",
    deliverable: "Repository with project structure, CI setup and initial deployment.",
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  });

  const milestone2 = await Milestone.create({
    projectId: project._id,
    title: "Core feature implementation",
    description: "Implement the primary features as discussed in the project requirements.",
    amount: Math.round(totalAmount * 0.5),
    status: "in-progress"
  });

  const milestone3 = await Milestone.create({
    projectId: project._id,
    title: "Testing and deployment",
    description: "Complete testing, bug fixes and production deployment.",
    amount: Math.round(totalAmount * 0.2),
    status: "pending"
  });

  // Create transactions for funded escrow and released milestone
  await Transaction.insertMany([
    {
      projectId: project._id,
      type: "escrow-fund",
      amount: totalAmount,
      status: "completed",
      reference: `ESC-${Date.now()}-001`
    },
    {
      projectId: project._id,
      milestoneId: milestone1._id,
      type: "milestone-release",
      amount: milestone1.amount,
      status: "completed",
      reference: `REL-${Date.now()}-001`
    }
  ]);

  // Create project messages
  await Message.insertMany([
    {
      projectId: project._id,
      senderId: employer._id,
      recipientId: freelancer._id,
      content: "Welcome to the project! I've funded the escrow and the milestones are set up. Let me know if you have any questions about the requirements."
    },
    {
      projectId: project._id,
      senderId: freelancer._id,
      recipientId: employer._id,
      content: "Thanks! I've reviewed the requirements and started on the first milestone. I'll share the initial architecture document by end of day."
    },
    {
      projectId: project._id,
      senderId: freelancer._id,
      recipientId: employer._id,
      content: "First milestone is complete — I've pushed the project setup, CI pipeline and base architecture. Ready for your review."
    },
    {
      projectId: project._id,
      senderId: employer._id,
      recipientId: freelancer._id,
      content: "Looks great! I've approved milestone 1 and released the payment. Moving on to the core features now."
    }
  ]);

  // Create notifications
  await Notification.insertMany([
    {
      userId: freelancer._id,
      type: "application",
      title: "Application accepted",
      message: `Your application for "${job.title}" has been accepted by ${job.company}. A project has been created.`,
      link: `/projects/${project._id}`,
      read: true
    },
    {
      userId: freelancer._id,
      type: "milestone",
      title: "Milestone approved",
      message: `"${milestone1.title}" has been approved and payment released.`,
      link: `/projects/${project._id}`,
      read: true
    },
    {
      userId: freelancer._id,
      type: "message",
      title: "New message from Demo Employer",
      message: "You have a new message regarding your project.",
      link: `/messages`,
      read: false
    },
    {
      userId: employer._id,
      type: "application",
      title: "New application received",
      message: `Demo Freelancer applied for "${job.title}".`,
      link: `/dashboard`,
      read: true
    },
    {
      userId: employer._id,
      type: "milestone",
      title: "Milestone submitted for review",
      message: `"${milestone2.title}" has been submitted for your review.`,
      link: `/projects/${project._id}`,
      read: false
    }
  ]);

  // Create a completed project with review (simulating past work)
  // Use a different job for the completed project
  const completedJob = await Job.findOne({
    employerId: employer._id,
    _id: { $ne: job._id },
    status: "open"
  }).lean();

  if (completedJob) {
    await Job.findByIdAndUpdate(completedJob._id, { status: "completed" });

    const completedProject = await Project.create({
      jobId: completedJob._id,
      employerId: employer._id,
      freelancerId: freelancer._id,
      totalAmount: Math.round((completedJob.budgetMin + completedJob.budgetMax) / 2),
      status: "completed",
      escrowStatus: "released",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    // Create a completed milestone for the completed project
    const completedMilestone = await Milestone.create({
      projectId: completedProject._id,
      title: "Full project delivery",
      description: "Complete project delivery including all requirements.",
      amount: completedProject.totalAmount,
      status: "approved",
      deliverable: "Final delivery with documentation and handoff.",
      submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      approvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    // Transaction for completed project
    await Transaction.insertMany([
      {
        projectId: completedProject._id,
        type: "escrow-fund",
        amount: completedProject.totalAmount,
        status: "completed",
        reference: `ESC-${Date.now()}-002`
      },
      {
        projectId: completedProject._id,
        milestoneId: completedMilestone._id,
        type: "milestone-release",
        amount: completedProject.totalAmount,
        status: "completed",
        reference: `REL-${Date.now()}-002`
      }
    ]);

    // Review from employer to freelancer
    await Review.create({
      projectId: completedProject._id,
      reviewerId: employer._id,
      revieweeId: freelancer._id,
      rating: 5,
      comment: "Excellent work! Delivered on time with clean, well-documented code. Communication was great throughout the project. Highly recommended."
    });

    // Review from freelancer to employer
    await Review.create({
      projectId: completedProject._id,
      reviewerId: freelancer._id,
      revieweeId: employer._id,
      rating: 5,
      comment: "Great client to work with. Clear requirements, fast feedback and prompt payments. Would love to work together again."
    });

    // Notification for completed project
    await Notification.insertMany([
      {
        userId: freelancer._id,
        type: "review",
        title: "New review received",
        message: `Demo Employer left a 5-star review for "${completedJob.title}".`,
        link: `/projects/${completedProject._id}`,
        read: false
      },
      {
        userId: employer._id,
        type: "project",
        title: "Project completed",
        message: `"${completedJob.title}" has been marked as completed.`,
        link: `/projects/${completedProject._id}`,
        read: true
      }
    ]);
  }
}

function getProposal(index: number): string {
  const proposals = [
    "I can deliver this project with a clean, production-ready implementation. I have extensive experience with the required tech stack and can start immediately.",
    "This project aligns perfectly with my expertise. I've built similar solutions before and can bring best practices from those experiences.",
    "I'm excited about this opportunity. My background in full-stack development makes me well-suited for this kind of work.",
    "I have hands-on experience with the tools and frameworks listed. I can deliver a high-quality solution within the timeline.",
    "I'd love to work on this project. I can provide regular updates and ensure the deliverables meet your expectations."
  ];
  return proposals[index % proposals.length];
}

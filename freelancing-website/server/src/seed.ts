import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Job } from "./models/Job.js";
import { Application } from "./models/Application.js";
import { Portfolio } from "./models/Portfolio.js";

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
  const count = await Job.countDocuments();

  if (count > 0) {
    const freelancer = await User.findOne({ email: "freelancer@demo.local" });
    const employer = await User.findOne({ email: "employer@demo.local" });
    if (freelancer && employer) {
      const firstJobs = await Job.find({ employerId: employer._id }).limit(3);
      for (const job of firstJobs) {
        const existing = await Application.findOne({ jobId: job._id, freelancerId: freelancer._id });
        if (!existing) {
          await Application.create({ jobId: job._id, freelancerId: freelancer._id, proposal: "I can deliver this project with a clean, production-ready implementation and clear communication.", bidAmount: Math.round((job.budgetMin + job.budgetMax) / 2), status: "submitted" });
          await Job.findByIdAndUpdate(job._id, { $inc: { applications: 1 } });
        }
      }
      const portfolioCount = await Portfolio.countDocuments({ freelancerId: freelancer._id });
      if (!portfolioCount) {
        await Portfolio.insertMany([
          { freelancerId: freelancer._id, title: "Full-stack Commerce Platform", description: "Next.js commerce platform with payments, admin tools and a MongoDB backend.", link: "https://example.com", skills: ["Next.js", "Node.js", "MongoDB", "Payments"] },
          { freelancerId: freelancer._id, title: "AI Study Assistant", description: "AI-powered study workflow with a React interface and API integrations.", skills: ["React", "Python", "AI/ML"] }
        ]);
      }
    }
    return;
  }

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

  await Job.insertMany(
    jobs.map((job, index) => ({
      ...job,
      employerId: employer._id,
      applications: 7 + index * 3,
      status: "open"
    }))
  );

  console.log(`✓ Seeded jobs and demo users. Freelancer: ${freelancer.email}`);
}

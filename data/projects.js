const PROJECTS_DATA = [
  {
    id: 1,
    name: "Nexus E-Commerce Platform",
    client: "Nexus Retail Group",
    clientLogo: "NR",
    status: "In Progress",
    dueDate: "2026-08-15",
    startDate: "2026-01-10",
    progress: 68,
    priority: "High",
    budget: "$48,000",
    budgetNum: 48000,
    description: "A full-stack e-commerce solution with custom inventory management, real-time analytics, and an AI-powered recommendation engine. The platform supports 50,000+ SKUs and handles peak traffic of 10,000 concurrent users.",
    techStack: ["React", "Node.js", "PostgreSQL", "Redis", "AWS", "Stripe"],
    teamMembers: [
      { name: "Sarah Chen", role: "Lead Developer", avatar: "SC" },
      { name: "Marcus Webb", role: "UI/UX Designer", avatar: "MW" },
      { name: "Priya Nair", role: "Backend Engineer", avatar: "PN" },
      { name: "Tom Alvarez", role: "DevOps", avatar: "TA" }
    ],
    milestones: [
      { label: "Design System", done: true },
      { label: "Product Catalogue", done: true },
      { label: "Checkout Flow", done: true },
      { label: "Payment Integration", done: false },
      { label: "Analytics Dashboard", done: false },
      { label: "Launch", done: false }
    ],
    category: "E-Commerce"
  },
  {
    id: 2,
    name: "Verdant Finance Portal",
    client: "Verdant Capital",
    clientLogo: "VC",
    status: "Completed",
    dueDate: "2026-05-30",
    startDate: "2025-11-01",
    progress: 100,
    priority: "Medium",
    budget: "$32,500",
    budgetNum: 32500,
    description: "A secure financial portal offering clients real-time portfolio tracking, document management, and advisor communication tools. Built with enterprise-grade security and SOC 2 compliance.",
    techStack: ["Vue.js", "Django", "MySQL", "Docker", "Azure", "Plaid API"],
    teamMembers: [
      { name: "Elena Marsh", role: "Project Manager", avatar: "EM" },
      { name: "David Kim", role: "Full Stack Dev", avatar: "DK" },
      { name: "Aisha Patel", role: "Security Analyst", avatar: "AP" }
    ],
    milestones: [
      { label: "Requirements", done: true },
      { label: "Backend API", done: true },
      { label: "Frontend UI", done: true },
      { label: "Security Audit", done: true },
      { label: "UAT Testing", done: true },
      { label: "Launch", done: true }
    ],
    category: "FinTech"
  },
  {
    id: 3,
    name: "HealthSync Patient App",
    client: "MedCore Systems",
    clientLogo: "MS",
    status: "On Hold",
    dueDate: "2026-10-01",
    startDate: "2026-03-15",
    progress: 35,
    priority: "High",
    budget: "$61,000",
    budgetNum: 61000,
    description: "A HIPAA-compliant mobile-first web application enabling patients to book appointments, access medical records, and communicate with healthcare providers. Integration with EHR systems is a core requirement.",
    techStack: ["Next.js", "GraphQL", "MongoDB", "FHIR API", "GCP", "Twilio"],
    teamMembers: [
      { name: "James Okafor", role: "Lead Developer", avatar: "JO" },
      { name: "Lucy Tran", role: "UX Researcher", avatar: "LT" },
      { name: "Raj Sharma", role: "Mobile Dev", avatar: "RS" },
      { name: "Nina Wolf", role: "QA Engineer", avatar: "NW" },
      { name: "Carlos Vega", role: "Backend Dev", avatar: "CV" }
    ],
    milestones: [
      { label: "Discovery Phase", done: true },
      { label: "Wireframes", done: true },
      { label: "API Architecture", done: false },
      { label: "Core Features", done: false },
      { label: "HIPAA Audit", done: false },
      { label: "Launch", done: false }
    ],
    category: "Healthcare"
  },
  {
    id: 4,
    name: "CityPulse Urban Dashboard",
    client: "Metro City Council",
    clientLogo: "MC",
    status: "In Progress",
    dueDate: "2026-09-20",
    startDate: "2026-02-01",
    progress: 52,
    priority: "Medium",
    budget: "$27,000",
    budgetNum: 27000,
    description: "A public-facing data visualisation platform displaying real-time city metrics — traffic patterns, air quality, public transit, and civic incident reports. Designed for transparency and citizen engagement.",
    techStack: ["React", "D3.js", "FastAPI", "InfluxDB", "Mapbox", "WebSocket"],
    teamMembers: [
      { name: "Amy Larson", role: "Data Visualisation", avatar: "AL" },
      { name: "Ben Osei", role: "Frontend Dev", avatar: "BO" },
      { name: "Zara Ahmed", role: "Data Engineer", avatar: "ZA" }
    ],
    milestones: [
      { label: "Data Architecture", done: true },
      { label: "Map Integration", done: true },
      { label: "Traffic Module", done: true },
      { label: "Air Quality Module", done: false },
      { label: "Public Testing", done: false },
      { label: "Launch", done: false }
    ],
    category: "GovTech"
  },
  {
    id: 5,
    name: "Arora Learning LMS",
    client: "Arora Education",
    clientLogo: "AE",
    status: "Completed",
    dueDate: "2026-04-10",
    startDate: "2025-10-01",
    progress: 100,
    priority: "Low",
    budget: "$19,800",
    budgetNum: 19800,
    description: "A fully-featured Learning Management System with course authoring tools, video streaming, interactive quizzes, progress tracking, and certificate generation. Supports 5,000 simultaneous students.",
    techStack: ["Angular", "Rails", "PostgreSQL", "S3", "Vimeo API", "Sendgrid"],
    teamMembers: [
      { name: "Fiona Blake", role: "Project Lead", avatar: "FB" },
      { name: "Omar Hassan", role: "Frontend Dev", avatar: "OH" },
      { name: "Mei Lin", role: "Backend Dev", avatar: "ML" }
    ],
    milestones: [
      { label: "Platform Setup", done: true },
      { label: "Course Builder", done: true },
      { label: "Video Integration", done: true },
      { label: "Assessment Engine", done: true },
      { label: "Certificates", done: true },
      { label: "Launch", done: true }
    ],
    category: "EdTech"
  },
  {
    id: 6,
    name: "Phantom Brand Studio",
    client: "Phantom Creative Agency",
    clientLogo: "PC",
    status: "In Progress",
    dueDate: "2026-08-30",
    startDate: "2026-04-01",
    progress: 80,
    priority: "High",
    budget: "$22,400",
    budgetNum: 22400,
    description: "A bespoke digital portfolio and client management studio for a top-tier creative agency. Features an immersive project showcase, client approval workflows, and a password-protected collaboration space.",
    techStack: ["Nuxt.js", "Sanity CMS", "Netlify", "GSAP", "Cloudinary"],
    teamMembers: [
      { name: "Isla Fontaine", role: "Creative Director", avatar: "IF" },
      { name: "Dario Reyes", role: "Frontend Dev", avatar: "DR" },
      { name: "Yuki Tanaka", role: "Motion Designer", avatar: "YT" }
    ],
    milestones: [
      { label: "Brand Identity", done: true },
      { label: "CMS Architecture", done: true },
      { label: "Showcase Pages", done: true },
      { label: "Client Portal", done: true },
      { label: "Animation Polish", done: false },
      { label: "Launch", done: false }
    ],
    category: "Creative"
  },
  {
    id: 7,
    name: "FreightFlow Logistics Hub",
    client: "Apex Logistics Co.",
    clientLogo: "AL",
    status: "On Hold",
    dueDate: "2026-11-15",
    startDate: "2026-05-01",
    progress: 20,
    priority: "Medium",
    budget: "$54,000",
    budgetNum: 54000,
    description: "An enterprise logistics management system enabling real-time shipment tracking, route optimisation, driver communication, and automated reporting for a national freight company.",
    techStack: ["React", "Spring Boot", "Kafka", "Elasticsearch", "HERE Maps", "Oracle DB"],
    teamMembers: [
      { name: "Paul Drummond", role: "Architect", avatar: "PD" },
      { name: "Siya Mokoena", role: "Backend Dev", avatar: "SM" },
      { name: "Hana Kobayashi", role: "Frontend Dev", avatar: "HK" },
      { name: "Liam Grant", role: "DevOps", avatar: "LG" }
    ],
    milestones: [
      { label: "System Design", done: true },
      { label: "Tracking Core", done: false },
      { label: "Route Optimiser", done: false },
      { label: "Reporting Module", done: false },
      { label: "Driver App", done: false },
      { label: "Launch", done: false }
    ],
    category: "Logistics"
  },
  {
    id: 8,
    name: "Solaris SaaS Platform",
    client: "Solaris Tech Inc.",
    clientLogo: "ST",
    status: "In Progress",
    dueDate: "2026-10-31",
    startDate: "2026-03-01",
    progress: 45,
    priority: "High",
    budget: "$88,000",
    budgetNum: 88000,
    description: "A multi-tenant SaaS platform for project management and team collaboration. Includes role-based access control, real-time notifications, white-label customisation, and Slack/Jira integrations.",
    techStack: ["React", "TypeScript", "NestJS", "PostgreSQL", "Redis", "Kubernetes", "Stripe"],
    teamMembers: [
      { name: "Nathan Cross", role: "CTO Liaison", avatar: "NC" },
      { name: "Amara Diallo", role: "Senior Dev", avatar: "AD" },
      { name: "Kira Petrov", role: "UI/UX", avatar: "KP" },
      { name: "Felix Jung", role: "Backend Dev", avatar: "FJ" },
      { name: "Tara Singh", role: "QA Lead", avatar: "TS" }
    ],
    milestones: [
      { label: "Auth & RBAC", done: true },
      { label: "Core Dashboard", done: true },
      { label: "Notifications", done: false },
      { label: "Integrations", done: false },
      { label: "Multi-tenancy", done: false },
      { label: "Launch", done: false }
    ],
    category: "SaaS"
  }
];

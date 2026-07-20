/**
 * downloadsData
 * Template documents available for direct download from KreatorNest.
 *
 * Each entry includes:
 *  - id: unique string identifier
 *  - title: display name
 *  - description: one-sentence description of what the template covers
 *  - category: used for filtering ("Contracts", "Proposals", "Invoices", "Briefs", "Checklists")
 *  - tags: short labels shown on the card
 *  - txtFile: path under /public/downloads/ for the editable .txt version
 *  - featured: if true, shown in the featured row at the top
 *  - icon: emoji icon for the card
 */
export const downloadsData = [
  {
    id: "dl-1",
    title: "Freelance Services Agreement",
    description: "A complete client contract covering scope, revisions, payment terms, IP ownership, cancellation, and governing law.",
    category: "Contracts",
    tags: ["Contract", "Legal", "IP"],
    txtFile: "/downloads/freelance-contract.txt",
    featured: true,
    icon: "📋",
    tier: "essential",
  },
  {
    id: "dl-2",
    title: "Change Order Form",
    description: "Formally document and price any out-of-scope work. Stops scope creep before it starts.",
    category: "Contracts",
    tags: ["Scope Creep", "Change Order"],
    txtFile: "/downloads/change-order.txt",
    featured: false,
    icon: "🔄",
  },
  {
    id: "dl-3",
    title: "Scope of Work Document",
    description: "Define exactly what is — and isn't — included in a project. Attach to your contract or use standalone.",
    category: "Contracts",
    tags: ["Scope", "Deliverables"],
    txtFile: "/downloads/scope-of-work.txt",
    featured: false,
    icon: "📐",
  },
  {
    id: "dl-4",
    title: "Project Proposal (3-Tier)",
    description: "A client-facing proposal with three package tiers, a clear problem statement, and a built-in call to action.",
    category: "Proposals",
    tags: ["Proposal", "Pricing", "Tiers"],
    txtFile: "/downloads/project-proposal.txt",
    featured: true,
    icon: "💼",
  },
  {
    id: "dl-5",
    title: "Invoice Template",
    description: "Clean, professional invoice with line items, payment terms, late fee clause, and PayNow/bank transfer fields.",
    category: "Invoices",
    tags: ["Invoice", "Billing", "Payment"],
    txtFile: "/downloads/invoice-template.txt",
    featured: true,
    icon: "🧾",
    tier: "essential",
  },
  {
    id: "dl-6",
    title: "Client Project Brief Form",
    description: "A structured intake questionnaire to gather everything you need before starting: goals, style, assets, budget, and timeline.",
    category: "Briefs",
    tags: ["Brief", "Onboarding", "Intake"],
    txtFile: "/downloads/client-brief-form.txt",
    featured: true,
    icon: "📝",
  },
  {
    id: "dl-7",
    title: "Project Kickoff Checklist",
    description: "A step-by-step checklist from contract signing to final delivery — covering every touchpoint so nothing falls through the cracks.",
    category: "Checklists",
    tags: ["Checklist", "Workflow", "Process"],
    txtFile: "/downloads/project-kickoff-checklist.txt",
    featured: false,
    icon: "✅",
  },
];

/** Download category filters. */
export const DOWNLOAD_CATEGORIES = [
  "All",
  "Contracts",
  "Proposals",
  "Invoices",
  "Briefs",
  "Checklists",
];

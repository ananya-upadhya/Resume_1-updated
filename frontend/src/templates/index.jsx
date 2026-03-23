import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import TechTemplate from "./TechTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import EtherXTemplate from "./EtherXTemplate";

/* ─────────────────────────────────────────────────────────
   TEMPLATE REGISTRY
   Add new templates here — everything else auto-updates
───────────────────────────────────────────────────────── */
export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with centered header and serif typography. Timeless and universally accepted.",
    accent: "#0a0a0a",
    tag: "Most Popular",
    component: ClassicTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two-column layout with a clean sidebar for contact and skills. Minimal and contemporary.",
    accent: "#2563eb",
    tag: "Recommended",
    component: ModernTemplate,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Developer-focused with monospace accents, compact structure, and code-style skill chips.",
    accent: "#16a34a",
    tag: "For Developers",
    component: TechTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold navy header, gold accents, and strong typographic hierarchy for senior-level roles.",
    accent: "#1e3a5f",
    tag: "Senior Level",
    component: ExecutiveTemplate,
  },
  {
    id: "etherx",
    name: "EtherX Signature",
    description: "Two-column layout with gold accents, initials avatar, and EtherX branding. ATS-safe with white background.",
    accent: "#C9A84C",
    tag: "EtherX Edition",
    component: EtherXTemplate,
  },
];

/* Used by ResumeBuilder to render the selected template */
export default function SelectedTemplate({ data, templateId }) {
  const found = TEMPLATES.find(t => t.id === templateId);
  const Component = found ? found.component : ClassicTemplate;
  return <Component data={data} />;
}

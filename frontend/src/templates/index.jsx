import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import TechTemplate from "./TechTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import EtherXTemplate from "./EtherXTemplate";
import StudentTemplate from "./StudentTemplate";

/* ─────────────────────────────────────────────────────────
   TEMPLATE REGISTRY
   All templates are ATS-optimized (v2)
───────────────────────────────────────────────────────── */
export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Modern two-column academic layout with centered header and clean vertical divider. Professional and universally accepted.",
    accent: "#111111",
    tag: "Most Popular",
    component: ClassicTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two-column layout with a blue header and clean sidebar for contact and skills. Minimal and contemporary.",
    accent: "#2563eb",
    tag: "Recommended",
    component: ModernTemplate,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Sophisticated Dark Navy & Gold two-column layout designed for senior IT professionals and developers.",
    accent: "#C9A84C",
    tag: "For Developers",
    component: TechTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sleek navy header block, timeline-style layout, and strong typographic hierarchy for leadership roles.",
    accent: "#111111",
    tag: "Senior Level",
    component: ExecutiveTemplate,
  },
  {
    id: "etherx",
    name: "EtherX Signature",
    description: "Elegant split layout featuring Forest Green & Gold accents, initials avatar, and refined branding.",
    accent: "#C9A84C",
    tag: "EtherX Edition",
    component: EtherXTemplate,
  },
  {
    id: "student",
    name: "Student / Intern",
    description: "Built for freshers, internships & university applications",
    accent: "#C85A38",
    tag: "For Students",
    component: StudentTemplate,
  },
];

export default function SelectedTemplate({ data, templateId }) {
  const found = TEMPLATES.find(t => t.id === templateId);
  const Component = found ? found.component : ClassicTemplate;
  return <Component data={data} />;
}

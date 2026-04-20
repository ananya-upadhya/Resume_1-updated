const ANALYZE_API_BASE = import.meta.env.VITE_ANALYZE_API_URL || "http://localhost:8000";
const ANALYZE_API = ANALYZE_API_BASE.replace(/\/api$/, "").replace(/\/$/, "");

async function callGroq(systemPrompt, userPrompt) {
    // Guard against empty prompts
    if (!userPrompt || userPrompt.trim().length < 5) {
        throw new Error("Input too short");
    }

    const res = await fetch(`${ANALYZE_API}/api/llm/enhance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        console.error("Enhancement API error:", data);
        throw new Error(data.detail || "AI enhancement failed");
    }
    return data.result || "";
}
// Each field type gets its own focused prompt
export const ENHANCERS = {

    // Personal fields
    name: (v) => callGroq(
        `You are a resume formatting expert. Format the provided name properly capitalised for a professional resume. Return ONLY the formatted name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    title: (v) => callGroq(
        `You are a resume expert. Improve the provided job title for ATS, making it industry-standard. Return ONLY the improved title, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    location: (v) => callGroq(
        `You are a resume expert. Format the provided location in standard professional resume format (City, State/Country). Return ONLY the formatted location, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    linkedin: (v) => callGroq(
        `You are a resume expert. Clean the provided LinkedIn URL or username to the standard format: linkedin.com/in/username. Return ONLY the URL, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    github: (v) => callGroq(
        `You are a resume expert. Clean the provided GitHub URL or username to the standard format: github.com/username. Return ONLY the URL, no introductory text, labels, or echoing of the prompt.`,
        v
    ),

    // Summary
    summary: (v, ctx) => callGroq(
        `You are a professional resume writer. Enhance the provided summary${ctx?.name ? ` for ${ctx.name}` : ""}${ctx?.title ? ` applying as ${ctx.title}` : ""} to be ATS-friendly, impactful, 3-4 sentences. No "I". Strong action words. Return ONLY the rewritten summary text. No introductory text, labels, or echoing of the prompt.`,
        v
    ),

    // Experience
    role: (v, ctx) => callGroq(
        `You are a resume expert. Improve the provided job role/title${ctx?.company ? ` at ${ctx.company}` : ""} for ATS, making it industry-standard. Return ONLY the improved title, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    company: (v) => callGroq(
        `You are a resume expert. Format the provided company name properly capitalised as it would appear on a professional resume. Return ONLY the formatted name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    bullets: (v, ctx) => callGroq(
        `You are a professional resume writer. Rewrite the provided bullet points${ctx?.role ? ` for ${ctx.role}` : ""}${ctx?.company ? ` at ${ctx.company}` : ""} to be ATS-friendly with strong action verbs and quantified impact. Keep same number of bullets. Return ONLY bullet lines starting with -, no introductory text, labels, or echoing of the prompt.`,
        v
    ),

    // Education
    institution: (v) => callGroq(
        `You are a resume expert. Format the provided college/university name properly capitalised. Return ONLY the formatted name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    degree: (v) => callGroq(
        `You are a resume expert. Format the provided degree name into standard abbreviated professional format (e.g. B.E., B.Tech, M.S., MBA). Return ONLY the formatted degree, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    field: (v) => callGroq(
        `You are a resume expert. Format the provided field of study properly capitalised with standard academic name. Return ONLY the formatted field name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),

    // Skills
    skills: (v, ctx) => callGroq(
        `You are a resume expert. Improve the provided skills list${ctx?.title ? ` for ${ctx.title}` : ""} — fix casing (javascript → JavaScript, css → CSS), remove duplicates, add 2-3 relevant missing skills. Return ONLY a comma-separated list of skill names, no introductory text, labels, or echoing of the prompt.`,
        Array.isArray(v) ? v.join(", ") : v
    ),

    // Projects
    projectName: (v) => callGroq(
        `You are a resume expert. Improve the provided project name to be clear, professional, and impactful. Return ONLY the improved project name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    tech: (v) => callGroq(
        `You are a resume expert. Format the provided tech stack properly capitalised and ordered (languages first, then frameworks, then tools). Return ONLY the formatted tech stack, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    projectBullets: (v, ctx) => callGroq(
        `You are a professional resume writer. Rewrite the provided project description${ctx?.name ? ` for "${ctx.name}"` : ""}${ctx?.tech ? ` using ${ctx.tech}` : ""} as ATS-friendly bullet points with strong action verbs and clear outcomes. Return ONLY bullet lines starting with -, no introductory text, labels, or echoing of the prompt.`,
        v
    ),

    // Certifications
    certName: (v) => callGroq(
        `You are a resume expert. Format the provided certification name by returning the full official properly capitalised name. Return ONLY the certification name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
    certIssuer: (v) => callGroq(
        `You are a resume expert. Format the provided certification issuer by returning the full official organisation name properly capitalised. Return ONLY the issuer name, no introductory text, labels, or echoing of the prompt.`,
        v
    ),
};
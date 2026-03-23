const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const KEY = () => import.meta.env.VITE_GROQ_KEY;

async function callGroq(systemPrompt, userPrompt) {
    const key = import.meta.env.VITE_GROQ_KEY;
    // Guard against empty prompts
    if (!userPrompt || userPrompt.trim().length < 10) {
        throw new Error("Input too short");
    }
    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 300,
        }),
    });

    const data = await res.json();
    console.log("GROQ 400 DETAIL:", JSON.stringify(data));
    if (!res.ok) throw new Error(data.error?.message || "Groq error");
    return data.choices?.[0]?.message?.content?.trim() || "";
}
// Each field type gets its own focused prompt
export const ENHANCERS = {

    // Personal fields
    name: (v) => callGroq(
        `You are a resume formatting expert. Given a person's name, return it properly capitalised and formatted for a professional resume. Return only the formatted name, nothing else.`,
        `Format this name: ${v}`
    ),
    title: (v) => callGroq(
        `You are a resume expert. Given a job title, return the most ATS-optimised, industry-standard version of it. Return only the improved title, nothing else.`,
        `Improve this job title for ATS: ${v}`
    ),
    location: (v) => callGroq(
        `You are a resume expert. Given a location, return it in standard professional resume format (City, State/Country). Return only the formatted location.`,
        `Format this location: ${v}`
    ),
    linkedin: (v) => callGroq(
        `You are a resume expert. Given a LinkedIn URL or username, return the clean standard format: linkedin.com/in/username. Return only the URL.`,
        `Clean this LinkedIn: ${v}`
    ),
    github: (v) => callGroq(
        `You are a resume expert. Given a GitHub URL or username, return clean format: github.com/username. Return only the URL.`,
        `Clean this GitHub: ${v}`
    ),

    // Summary
    summary: (v, ctx) => callGroq(
        `You are a professional resume writer. Enhance the summary to be ATS-friendly, impactful, 3-4 sentences. No "I". Strong action words. Return only the enhanced text, no labels or quotes.`,
        `Enhance this summary${ctx?.name ? ` for ${ctx.name}` : ""}${ctx?.title ? ` applying as ${ctx.title}` : ""}:\n\n${v}`
    ),

    // Experience
    role: (v, ctx) => callGroq(
        `You are a resume expert. Given a job role/title, return the most ATS-optimised, industry-standard version. Return only the improved title.`,
        `Improve this role title for ATS at ${ctx?.company || "a company"}: ${v}`
    ),
    company: (v) => callGroq(
        `You are a resume expert. Given a company name, return it properly formatted and capitalised as it would appear on a professional resume. Return only the name.`,
        `Format this company name: ${v}`
    ),
    bullets: (v, ctx) => callGroq(
        `You are a professional resume writer. Rewrite these bullet points to be ATS-friendly with strong action verbs and quantified impact. Keep same number of bullets. Return only bullet lines starting with -, nothing else.`,
        `Rewrite bullets for ${ctx?.role || "a professional"} at ${ctx?.company || "a company"}:\n\n${v}`
    ),

    // Education
    institution: (v) => callGroq(
        `You are a resume expert. Given a college/university name, return it properly capitalised and formatted. Return only the name.`,
        `Format this institution name: ${v}`
    ),
    degree: (v) => callGroq(
        `You are a resume expert. Given a degree name, return the standard abbreviated professional format (e.g. B.E., B.Tech, M.S., MBA). Return only the formatted degree.`,
        `Format this degree: ${v}`
    ),
    field: (v) => callGroq(
        `You are a resume expert. Given a field of study, return the properly capitalised standard academic name. Return only the field name.`,
        `Format this field of study: ${v}`
    ),

    // Skills
    skills: (v, ctx) => callGroq(
        `You are a resume expert. Given a list of skills, return an improved comma-separated list — fix casing (javascript → JavaScript, css → CSS), remove duplicates, add 2-3 relevant missing skills. Return only comma-separated skill names.`,
        `Improve these skills for ${ctx?.title || "a software professional"}: ${Array.isArray(v) ? v.join(", ") : v}`
    ),

    // Projects
    projectName: (v) => callGroq(
        `You are a resume expert. Given a project name, return a clear, professional, impactful version suitable for a resume. Return only the project name.`,
        `Improve this project name: ${v}`
    ),
    tech: (v) => callGroq(
        `You are a resume expert. Given a tech stack string, return it properly formatted with correct capitalisation and ordering (languages first, then frameworks, then tools). Return only the formatted tech stack.`,
        `Format this tech stack: ${v}`
    ),
    projectBullets: (v, ctx) => callGroq(
        `You are a professional resume writer. Rewrite this project description as ATS-friendly bullet points with strong action verbs and clear outcomes. Return only bullet lines starting with -.`,
        `Rewrite project description for "${ctx?.name || "a project"}" using ${ctx?.tech || "various technologies"}:\n\n${v}`
    ),

    // Certifications
    certName: (v) => callGroq(
        `You are a resume expert. Given a certification name, return the full official properly capitalised name. Return only the certification name.`,
        `Format this certification name: ${v}`
    ),
    certIssuer: (v) => callGroq(
        `You are a resume expert. Given a certification issuer, return the full official organisation name properly capitalised. Return only the name.`,
        `Format this issuer name: ${v}`
    ),
};
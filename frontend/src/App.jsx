import { useState } from "react";
import LandingPage from "./LandingPage";
import TemplateSelector from "./TemplateSelector";
import ResumeBuilder from "./components/ResumeBuilder";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [templateId, setTemplateId] = useState("classic");

  if (screen === "landing")
    return <LandingPage onStart={() => setScreen("template")} />;

  if (screen === "template")
    return (
      <TemplateSelector
        onSelect={id => { setTemplateId(id); setScreen("builder"); }}
        onBack={() => setScreen("landing")}
      />
    );

  return <ResumeBuilder templateId={templateId} onBack={() => setScreen("template")} />;
}
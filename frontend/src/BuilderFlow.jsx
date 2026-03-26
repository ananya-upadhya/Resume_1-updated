import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TemplateSelector from './TemplateSelector'
import ResumeBuilder from './components/ResumeBuilder'

export default function BuilderFlow() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('template')
  const [templateId, setTemplateId] = useState('classic')

  if (screen === 'template')
    return (
      <TemplateSelector
        onSelect={id => { setTemplateId(id); setScreen('builder') }}
        onBack={() => navigate('/')}
      />
    )

  return <ResumeBuilder templateId={templateId} />
}

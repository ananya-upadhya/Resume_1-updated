import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Search, File, AlertCircle, Target, CheckCircle2, XCircle, Database, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export default function Analyze() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loadingStage, setLoadingStage] = useState('idle')
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [hasStoredResume, setHasStoredResume] = useState(false)

  // Check for stored resume on mount
  useEffect(() => {
    const stored = localStorage.getItem('etherx_resume')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Check if it has meaningful content
        if (data.personal?.name || data.experience?.length > 0) {
          setHasStoredResume(true)
        }
      } catch (e) {
        console.error('Error parsing stored resume', e)
      }
    }
  }, [])

  const flattenResumeData = (data) => {
    if (!data) return ''
    
    let text = ''
    
    // Personal Info
    if (data.personal) {
      text += `Name: ${data.personal.name || ''}\n`
      text += `Title: ${data.personal.title || ''}\n`
      text += `Email: ${data.personal.email || ''}\n\n`
    }
    
    // Summary
    if (data.summary?.text) {
      text += `Professional Summary:\n${data.summary.text}\n\n`
    }
    
    // Experience
    if (data.experience && data.experience.length > 0) {
      text += `Experience:\n`
      data.experience.forEach(exp => {
        text += `- ${exp.role} at ${exp.company} (${exp.start || ''} - ${exp.end || (exp.current ? 'Present' : '')})\n`
        if (exp.bullets) text += `  ${exp.bullets}\n`
      })
      text += '\n'
    }
    
    // Skills
    if (data.skills && data.skills.length > 0) {
      text += `Skills: ${data.skills.join(', ')}\n\n`
    }
    
    // Projects
    if (data.projects && data.projects.length > 0) {
      text += `Projects:\n`
      data.projects.forEach(proj => {
        text += `- ${proj.name}\n`
        if (proj.bullets) text += `  ${proj.bullets}\n`
      })
      text += '\n'
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      text += `Education:\n`
      data.education.forEach(edu => {
        text += `- ${edu.degree} from ${edu.institution} (${edu.year || ''})\n`
      })
      text += '\n'
    }
    
    return text.trim()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0]
      if (f.type.includes('pdf') || f.name.endsWith('.docx')) {
        setFile(f)
        setError('')
      } else {
        setError('Please upload a PDF or DOCX file.')
      }
    }
  }

  const handleAnalyze = async () => {
    // Determine the source of the resume
    let isStoredSource = false
    let resumeContent = null
    
    if (file) {
      resumeContent = file
    } else if (hasStoredResume) {
      const stored = localStorage.getItem('etherx_resume')
      if (stored) {
        resumeContent = JSON.parse(stored)
        isStoredSource = true
      }
    }

    if (!resumeContent) {
      setError('Please upload a file or build a resume in the builder first.')
      return
    }

    if (!role.trim() && !jobDescription.trim()) {
      setError('Please specify a target role or job description.')
      return
    }

    setError('')
    setLoadingStage(isStoredSource ? 'preparing' : 'uploading')

    try {
      const API_URL = import.meta.env.VITE_ANALYZE_API_URL || 'http://localhost:8000'
      let response
      
      if (isStoredSource) {
        setLoadingStage('analyzing')
        const flattenedText = flattenResumeData(resumeContent)
        response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: flattenedText,
            role: role,
            job_description: jobDescription
          }),
        })
      } else {
        setLoadingStage('analyzing')
        const formData = new FormData()
        formData.append('file', resumeContent)
        formData.append('role', role)
        formData.append('job_description', jobDescription)
        
        response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          body: formData,
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        const detail = errData.detail || ''
        
        // Specific handling for image-based PDF error
        if (detail.includes('image-based')) {
          throw new Error('This PDF cannot be read. Please export your resume again from the Resume Builder.')
        }
        
        throw new Error(detail || `Server error: ${response.status}`)
      }

      const payload = await response.json()
      setAnalysisData(payload)
      setShowResults(true)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'An error occurred during analysis')
    } finally {
      setLoadingStage('idle')
    }
  }

  const getLoadingText = () => {
    switch (loadingStage) {
      case 'preparing': return 'Reading your saved resume...'
      case 'uploading': return 'Uploading file...'
      case 'analyzing': return 'Generating Intelligence...'
      default: return 'Analyze Profile'
    }
  }

  const renderScoreCircle = (label, score) => {
    const s = Math.round(score || 0)
    const color = s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'
    const circumference = 2 * Math.PI * 38
    const strokeDashoffset = circumference - (s / 100) * circumference
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" stroke="rgba(201,168,76,0.15)" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="38" 
              stroke={color} 
              strokeWidth="8" fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-xl font-bold" style={{ color: 'var(--accent-gold)' }}>
            {s}%
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-center whitespace-pre-wrap" style={{ color: 'rgba(201,168,76,0.9)' }}>{label}</p>
      </div>
    )
  }

  return (
    <div className="analyze-page-container space-y-8 pb-12 max-w-5xl mx-auto">
      <style>{`
        /* ─── Mobile Layout Overrides (Max 768px) ─── */
        @media (max-width: 768px) {
          aside { display: none !important; }
          main { 
            width: 100% !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            flex-direction: column !important;
          }
          main > div > div, .analyze-page-container { 
            padding: 1rem !important; 
            box-sizing: border-box !important;
          }
          .upload-drop-zone {
            width: 100% !important;
            min-height: 200px !important;
            padding: 1rem !important;
            box-sizing: border-box !important;
          }
        }
        
        .analyze-page-container h1, 
        .analyze-page-container h2, 
        .analyze-page-container h3, 
        .analyze-page-container p, 
        .analyze-page-container span,
        .analyze-page-container div {
          word-break: break-word;
          overflow-wrap: break-word;
        }

        @media (max-width: 480px) {
          .analyze-page-container h1, 
          .analyze-page-container h2, 
          .analyze-page-container h3,
          .analyze-page-container .text-xl,
          .analyze-page-container .text-2xl,
          .analyze-page-container .text-3xl {
            font-size: 1.4rem !important;
            line-height: 1.3 !important;
          }
          .analyze-page-container p, 
          .analyze-page-container span,
          .analyze-page-container .text-sm,
          .analyze-page-container .text-xs,
          .analyze-page-container .text-base {
            font-size: 0.8rem !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
      <div className="flex items-start md:items-center gap-3 mb-2">
        <button 
          onClick={() => window.location.href = '/'}
          className="md:hidden mt-1 flex items-center justify-center p-2 rounded-md bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] transition-colors border border-[rgba(201,168,76,0.2)] shrink-0"
          aria-label="Back to home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-gold)' }}>Resume Analyzer</h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: 'rgba(201,168,76,0.8)' }}>
            {hasStoredResume && !file 
              ? "Your saved resume is ready to analyze. You can also upload a different file."
              : "Upload a resume or provide job context to generate intelligence scoring."
            }
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Drop Zone */}
            <Card className="col-span-1 md:col-span-2">
              <CardContent className="pt-6">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`upload-drop-zone border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-colors flex flex-col items-center justify-center ${
                    file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  style={{ 
                    borderColor: file ? 'var(--accent-gold)' : 'rgba(201,168,76,0.3)', 
                    backgroundColor: file ? 'rgba(201,168,76,0.05)' : 'transparent',
                    opacity: (!file && hasStoredResume) ? 0.7 : 1
                  }}
                >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="flex justify-center mb-4"
                    >
                      {file
                        ? <File className="h-12 w-12 md:h-16 md:w-16" style={{ color: 'var(--accent-gold)' }} />
                        : (hasStoredResume ? <Database className="h-12 w-12 md:h-16 md:w-16" style={{ color: 'rgba(201,168,76,0.6)' }} /> : <UploadCloud className="h-12 w-12 md:h-16 md:w-16" style={{ color: 'var(--text-muted)' }} />)
                      }
                    </motion.div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ fontFamily: "'Cinzel', serif", color: 'var(--accent-gold)' }}>
                      {file ? file.name : (hasStoredResume ? 'EtherX Stored Resume Detected' : 'Drag & drop your resume')}
                    </h3>
                    <p className="text-xs md:text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                      {file
                        ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : (hasStoredResume ? 'You can analyze your saved profile or upload a new one' : 'Supports PDF and DOCX formats up to 5MB')
                      }
                    </p>
                  <div className="flex justify-center gap-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 border rounded-md text-sm font-medium transition-colors" style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.1)' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                        Browse Files
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        disabled={loadingStage !== 'idle'}
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0])
                            setError('')
                          }
                        }}
                      />
                    </label>
                    {file && (
                      <button 
                        onClick={() => setFile(null)}
                        className="px-4 py-2 border rounded-md text-sm font-medium transition-colors" 
                        style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#ef4444' }}
                      >
                        Use Saved Instead
                      </button>
                    )}
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center justify-center text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" /> {error}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Role & Job Description */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle style={{ color: 'var(--accent-gold)' }}>Target Role & Job Description</CardTitle>
                <CardDescription style={{ color: 'rgba(201,168,76,0.8)' }}>Provide the context to run keyword matching</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgba(201,168,76,0.6)' }} />
                  <Input
                    disabled={loadingStage !== 'idle'}
                    placeholder="Role Title (e.g. Senior Frontend Engineer)"
                    className="pl-10 h-10 w-full"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: 'var(--text-primary)' }}
                  />
                </div>
                
                <div className="relative">
                  <textarea 
                    disabled={loadingStage !== 'idle'}
                    placeholder="Paste the full job description here..."
                    className="w-full min-h-[120px] p-3 rounded-md border"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    style={{ 
                      background: 'rgba(201,168,76,0.05)', 
                      borderColor: 'rgba(201,168,76,0.2)', 
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'vertical',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={loadingStage !== 'idle'}
                    className="w-full md:w-auto overflow-hidden relative group"
                    style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, #A07830, #C9A84C, #F0C040)',
                      color: '#080808',
                      borderRadius: '8px',
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      border: 'none',
                      cursor: loadingStage !== 'idle' ? 'not-allowed' : 'pointer',
                      opacity: loadingStage !== 'idle' ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 20px rgba(201,168,76,0.25)',
                    }}
                    onMouseEnter={e => { if (loadingStage === 'idle') { e.currentTarget.style.transform = 'translateY(-2px)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div className="flex items-center justify-center">
                      {loadingStage !== 'idle' ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="mr-2 border-2 border-t-transparent border-black rounded-full w-4 h-4"
                          />
                          {getLoadingText()}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {hasStoredResume && !file ? 'Analyze Saved Resume' : 'Analyze Match'}
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>Intelligence Report</h2>
                <p className="text-sm" style={{ color: 'rgba(201,168,76,0.8)' }}>
                  {analysisData?.ats_verdict || "Resume analysis complete"}
                </p>
              </div>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(201,168,76,0.55)',
                  color: '#C9A84C',
                }}
                onClick={() => {
                  setShowResults(false)
                  setFile(null)
                  setAnalysisData(null)
                }}
              >
                New Analysis
              </button>
            </div>

            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("Overall Match\nProbability", analysisData?.shortlisting_probability * 100)}
                </CardContent>
              </Card>
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("Semantic\nFit", analysisData?.semantic_fit_score * 100)}
                </CardContent>
              </Card>
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("Skill\nCoverage", (() => {
                    const required = analysisData?.required_skills || []
                    const resumeSkills = (analysisData?.skills || []).map(s => s.toLowerCase())
                    if (!required.length) return 0
                    const matched = required.filter(r =>
                      resumeSkills.some(s => s.includes(r.toLowerCase()) || r.toLowerCase().includes(s))
                    ).length
                    return Math.min(100, Math.round((matched / required.length) * 100))
                  })())}
                </CardContent>
              </Card>
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("ATS\nScore", Math.round((analysisData?.ats_score ?? 0) * 100))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
                <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(34,197,94,0.1)', background: 'rgba(34,197,94,0.05)' }}>
                  <CardTitle className="text-base flex items-center text-green-500">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {analysisData?.strengths?.map((s, i) => (
                      <li key={i} className="text-sm text-green-400/90 leading-relaxed">• {s}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(239,68,68,0.1)', background: 'rgba(239,68,68,0.05)' }}>
                  <CardTitle className="text-base flex items-center text-red-500">
                    <XCircle className="w-4 h-4 mr-2" /> Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {analysisData?.weaknesses?.map((w, i) => (
                      <li key={i} className="text-sm text-red-400/90 leading-relaxed">• {w}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
              <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.05)' }}>
                <CardTitle className="text-base flex items-center" style={{ color: 'var(--accent-gold)' }}>
                  <Target className="w-4 h-4 mr-2" /> Strategic Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {analysisData?.suggestions?.map((s, i) => (
                    <li key={i} className="flex items-start text-sm" style={{ color: 'rgba(201,168,76,0.9)' }}>
                      <span className="mr-2 mt-0.5 text-gold">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Search, File, AlertCircle, Target, CheckCircle2, XCircle } from 'lucide-react'
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
    if (!file) { setError('Please upload a file first.'); return }
    if (!role.trim() && !jobDescription.trim()) { setError('Please specify a target role or job description.'); return }

    setError('')
    setLoadingStage('uploading')

    try {
      setLoadingStage('analyzing')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('role', role)
      formData.append('job_description', jobDescription)

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const analyzeRes = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json().catch(() => ({}))
        throw new Error(errData.detail || `Server error: ${analyzeRes.status}`)
      }

      const payload = await analyzeRes.json()
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
      case 'uploading': return 'Uploading...'
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
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-gold)' }}>Analyze Resume</h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Upload a resume and provide job context to generate intelligence scoring.
        </p>
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
                  className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-colors flex flex-col items-center justify-center ${
                    file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  style={{ borderColor: file ? 'var(--accent-gold)' : 'rgba(201,168,76,0.3)', backgroundColor: file ? 'rgba(201,168,76,0.05)' : 'transparent' }}
                >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="flex justify-center mb-4"
                    >
                      {file
                        ? <File className="h-12 w-12 md:h-16 md:w-16" style={{ color: 'var(--accent-gold)' }} />
                        : <UploadCloud className="h-12 w-12 md:h-16 md:w-16" style={{ color: 'var(--text-muted)' }} />
                      }
                    </motion.div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ fontFamily: "'Cinzel', serif", color: 'var(--accent-gold)' }}>
                      {file ? file.name : 'Drag & drop your resume'}
                    </h3>
                    <p className="text-xs md:text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {file
                      ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : 'Supports PDF and DOCX formats up to 5MB'
                    }
                  </p>
                  <div className="flex justify-center">
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
                    className="w-full md:w-auto"
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
                    {loadingStage !== 'idle' ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="mr-2 border-2 border-t-transparent border-primary-foreground rounded-full w-4 h-4"
                        />
                        {getLoadingText()}
                      </div>
                    ) : 'Analyze Match'}
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
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--accent-gold)' }}>Analysis Results</h2>
                <p className="text-sm" style={{ color: 'rgba(201,168,76,0.8)' }}>Direct compatibility check</p>
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
                  setRole('')
                  setJobDescription('')
                  setAnalysisData(null)
                }}
              >
                New Analysis
              </button>
            </div>

            <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("Overall Match\nScore", analysisData?.overall_score)}
                </CardContent>
              </Card>
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("Keyword\nMatch", analysisData?.keyword_match_score)}
                </CardContent>
              </Card>
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("Experience\nRelevance", analysisData?.experience_relevance_score)}
                </CardContent>
              </Card>
              <Card className="col-span-1 border" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                <CardContent className="pt-6 flex justify-center">
                  {renderScoreCircle("ATS\nCompliance", analysisData?.ats_compliance_score)}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Matched Keywords */}
              <Card className="border" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
                <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(34,197,94,0.1)', background: 'rgba(34,197,94,0.05)' }}>
                  <CardTitle className="text-base flex items-center text-green-500">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Matched Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {(!analysisData?.matched_keywords || analysisData.matched_keywords.length === 0) ? (
                      <span className="text-sm text-green-600/60 italic">No exact matches found.</span>
                    ) : (
                      analysisData.matched_keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              <Card className="border" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(239,68,68,0.1)', background: 'rgba(239,68,68,0.05)' }}>
                  <CardTitle className="text-base flex items-center text-red-500">
                    <XCircle className="w-4 h-4 mr-2" /> Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {(!analysisData?.missing_keywords || analysisData.missing_keywords.length === 0) ? (
                      <span className="text-sm text-red-600/60 italic">No missing keywords!</span>
                    ) : (
                      analysisData.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Suggestions */}
            {analysisData?.improvement_suggestions && analysisData.improvement_suggestions.length > 0 && (
              <Card className="border" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
                <CardHeader className="pb-3 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.05)' }}>
                  <CardTitle className="text-base flex items-center" style={{ color: 'var(--accent-gold)' }}>
                    <Target className="w-4 h-4 mr-2" /> Resume Target Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {analysisData.improvement_suggestions.map((s, i) => (
                      <li key={i} className="flex items-start text-sm" style={{ color: 'rgba(201,168,76,0.9)' }}>
                        <span className="mr-2 mt-0.5" style={{ color: 'var(--accent-gold)' }}>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

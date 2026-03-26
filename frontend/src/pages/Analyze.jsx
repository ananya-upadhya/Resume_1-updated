import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Search, File, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import ResultsDashboard from '@/components/analyze/ResultsDashboard'

export default function Analyze() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
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
    if (!role.trim()) { setError('Please specify a target role.'); return }

    setError('')
    setLoadingStage('uploading')

    try {
      setLoadingStage('analyzing')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('job_description', role)

      const API_URL = import.meta.env.VITE_ANALYZE_API_URL || 'http://localhost:8000'
      console.log('Starting fetch to:', `${API_URL}/api/full-analysis`)
      const analyzeRes = await fetch(`${API_URL}/api/full-analysis`, {
        method: 'POST',
        body: formData,
      })

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json().catch(() => ({}))
        console.error('Fetch error response:', errData)
        throw new Error(errData.detail?.message || errData.detail || `Server error: ${analyzeRes.status}`)
      }

      const payload = await analyzeRes.json()
      console.log('Full Analysis Output SUCCESS:', payload)
      setAnalysisData(payload)
      setShowResults(true)
    } catch (err) {
      console.error('Caught error during handleAnalyze:', err)
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-gold)' }}>Analyze Resume</h1>
        <p className="mt-2" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Upload a resume and specify a target role to generate AI intelligence.
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
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="flex justify-center mb-4"
                    >
                      {file
                        ? <File className="h-16 w-16" style={{ color: 'var(--accent-gold)' }} />
                        : <UploadCloud className="h-16 w-16" style={{ color: 'var(--text-muted)' }} />
                      }
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Cinzel', serif", color: 'var(--accent-gold)' }}>
                      {file ? file.name : 'Drag & drop your resume'}
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
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

            {/* Role Input */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle style={{ color: 'var(--accent-gold)' }}>Target Role Context</CardTitle>
                <CardDescription style={{ color: 'rgba(201,168,76,0.8)' }}>What job is this resume targeting?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: 'rgba(201,168,76,0.6)' }} />
                    <Input
                      disabled={loadingStage !== 'idle'}
                      placeholder="e.g. Senior Frontend Engineer, Product Manager"
                      className="pl-10 h-10"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={loadingStage !== 'idle'}
                    style={{
                      minWidth: '200px',
                      background: 'linear-gradient(135deg, #A07830, #C9A84C, #F0C040)',
                      color: '#080808',
                      borderRadius: '10px',
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      border: 'none',
                      cursor: loadingStage !== 'idle' ? 'not-allowed' : 'pointer',
                      opacity: loadingStage !== 'idle' ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
                    }}
                    onMouseEnter={e => { if (loadingStage === 'idle') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.45)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.3)' }}
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
                    ) : 'Analyze Profile'}
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
          >
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--accent-gold)' }}>
                  Analysis Results
                  {analysisData?.semantic_fit_score !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisData.semantic_fit_score > 0.6
                        ? 'bg-green-500/10 text-green-500'
                        : analysisData.semantic_fit_score > 0.4
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      Fit: {(analysisData.semantic_fit_score * 100).toFixed(0)}%
                    </span>
                  )}
                </h2>
                <p className="text-sm" style={{ color: 'rgba(201,168,76,0.8)' }}>Showing AI intelligence output.</p>
              </div>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(201,168,76,0.55)',
                  color: '#C9A84C',
                  boxShadow: '0 4px 16px rgba(201,168,76,0.12)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.85)'
                  e.currentTarget.style.color = '#F0C040'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)'
                  e.currentTarget.style.color = '#C9A84C'
                }}
                onClick={() => {
                  setShowResults(false)
                  setFile(null)
                  setRole('')
                  setAnalysisData(null)
                }}
              >
                New Analysis
              </button>
            </div>
            <ResultsDashboard data={analysisData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  AlertCircle, Target, Zap, ShieldAlert,
  Navigation, Lightbulb, Code, TrendingUp
} from 'lucide-react'
import {
  ResponsiveContainer, RadialBarChart, RadialBar,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ResultsDashboard rendering error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
          <h3 className="font-bold">Something went wrong rendering the results.</h3>
          <p className="text-sm mt-2">Please check the console or try uploading again.</p>
        </div>
      )
    }
    return this.props.children
  }
}

function ResultsDashboardContent({ data }) {
  if (!data) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <p className="text-lg" style={{ color: 'var(--accent-gold)' }}>Upload a resume to begin analysis</p>
      </div>
    )
  }

  const matchScore = (data.shortlisting_probability || 0) * 100
  const gaugeData = [{
    name: 'Score',
    value: matchScore,
    fill: matchScore >= 70 ? 'var(--success-green)' : matchScore >= 40 ? 'var(--warning-amber)' : 'var(--error-red)'
  }]

  const skillChartData = useMemo(() => {
    // required_skills = skills the job domain NEEDS (from backend role intelligence)
    // skills          = skills found on the resume
    // missing_skills  = required by domain but NOT on resume
    const required = new Set(
      (data.required_skills || []).map(s => s.toLowerCase().trim())
    )

    // For found skills: high score if domain requires it, lower score if just on resume
    const found = (data.skills || []).map((s, idx) => {
      const isRequired = required.has(s.toLowerCase().trim())
      // Domain-required skills: 75-100 range, staggered slightly so they don't all look identical
      // Non-required (general) skills: 35-60 range
      const base = isRequired ? 78 : 38
      const offset = (idx % 5) * 4   // small offset 0/4/8/12/16 so bars vary
      return {
        name: s,
        value: Math.min(100, base + offset),
        type: isRequired ? 'matched_required' : 'matched_general',
      }
    })

    // Missing skills: required by domain but not present → low scores (domain gap)
    const missing = (data.missing_skills || []).map((s, idx) => ({
      name: s,
      value: Math.max(10, 28 - idx * 3),  // 28 → 10, stepping down by importance order
      type: 'missing',
    }))

    return [...found, ...missing].slice(0, 15)
  }, [data.skills, data.missing_skills, data.required_skills])

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="grid gap-8 md:grid-cols-3"
    >
      {/* Warning */}
      {data.warning && (
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="md:col-span-3">
          <div className="flex items-center p-5 rounded-xl" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)', color: 'var(--warning-amber)' }}>
            <AlertCircle className="w-5 h-5 mr-4 shrink-0" />
            <p className="text-sm font-semibold tracking-wide italic">"{data.warning}"</p>
          </div>
        </motion.div>
      )}

      {/* Score Gauge */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="md:col-span-1">
        <Card animateHover className="h-full flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--accent-gold)' }}>
            <Target className="w-5 h-5 mr-2" style={{ color: 'var(--accent-gold)' }} />
            Match Score
          </h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="70%" outerRadius="100%"
                barSize={20} data={gaugeData} startAngle={180} endAngle={0}
              >
                <RadialBar background={{ fill: 'var(--bg-background)' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-4xl font-bold" style={{ color: 'var(--accent-gold)' }}>{matchScore.toFixed(0)}%</span>
              <span className="text-xs uppercase tracking-wider mt-1" style={{ color: 'rgba(201,168,76,0.8)' }}>Shortlist Prob</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Skill Chart */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="md:col-span-2">
        <Card animateHover className="h-full relative overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg flex items-center" style={{ color: 'var(--accent-gold)' }}>
              <Code className="w-5 h-5 mr-2" style={{ color: 'var(--accent-gold)' }} />
              Skill Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-[250px]">
            {skillChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 11, fill: 'rgba(201,168,76,0.7)' }} interval={0} />
                  <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: 'rgba(201,168,76,0.5)' }} width={36} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ payload }) => {
                      if (!payload?.length) return null
                      const v = payload[0].payload
                      const label =
                        v.type === 'matched_required' ? '✅ Domain Match — Required & Found'
                        : v.type === 'matched_general' ? '📌 On Resume — Not in Domain'
                        : '❌ Domain Gap — Required but Missing'
                      return (
                        <div className="bg-card text-foreground text-xs p-2 rounded shadow-md border border-border">
                          <span className="font-bold">{v.name}</span><br />{label}
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {skillChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === 'missing' ? 'var(--error-red)' : '#C9A84C'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm" style={{ color: 'rgba(201,168,76,0.8)' }}>No skill data available</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Semantic Matches */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="md:col-span-3">
        <Card animateHover className="overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
          <CardHeader style={{ background: 'rgba(201,168,76,0.05)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <CardTitle className="text-lg flex items-center" style={{ color: 'var(--accent-gold)' }}>
              <Navigation className="w-5 h-5 mr-2" />
              Top Semantic Matches
            </CardTitle>
          </CardHeader>
          <div className="divide-y divide-border" style={{ borderColor: 'var(--border-color)' }}>
            {(!data?.semantic_matches || data.semantic_matches.length === 0) ? (
              <div className="p-6 text-sm text-center text-muted-foreground">No semantic matches returned.</div>
            ) : (
              data.semantic_matches.map((match, i) => (
                <div key={i} className="p-4 flex flex-col md:flex-row gap-4 transition-colors" style={{ ':hover': { background: 'rgba(201,168,76,0.05)' } }}>
                  <div className="flex-1">
                    <p className="text-xs uppercase font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Job Requirement</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>"{match.job_requirement}"</p>
                  </div>
                  <div className="flex-1 border-l-0 md:border-l pl-0 md:pl-4" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                    <p className="text-xs uppercase font-semibold mb-1" style={{ color: 'var(--accent-gold)' }}>Mapped Resume Experience</p>
                    <p className="text-sm p-2 rounded italic" style={{ color: 'var(--text-secondary)', background: 'rgba(201,168,76,0.05)' }}>"{match.resume_sentence}"</p>
                  </div>
                  <div className="flex items-center justify-start md:justify-center md:w-24">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--accent-gold)' }}>
                      {(match.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* Strengths */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
        <Card animateHover className="h-full overflow-hidden" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
          <div className="p-4 flex items-center" style={{ background: 'rgba(34,197,94,0.1)', borderBottom: '1px solid rgba(34,197,94,0.2)', color: 'var(--success-green)' }}>
            <Zap className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Strengths Detected</h3>
          </div>
          <ul className="p-4 space-y-3">
            {(!data.strengths || data.strengths.length === 0) ? (
              <p className="text-sm italic" style={{ color: 'rgba(201,168,76,0.7)' }}>No strengths identified.</p>
            ) : (
              data.strengths.map((s, i) => (
                <li key={i} className="text-sm flex items-start" style={{ color: 'rgba(201,168,76,0.9)' }}>
                  <span className="mr-2 text-green-500 mt-0.5" style={{ color: 'var(--accent-gold)' }}>•</span>
                  <span>{s}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </motion.div>

      {/* Weaknesses */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
        <Card animateHover className="h-full overflow-hidden" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <div className="p-4 flex items-center" style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)', color: 'var(--error-red)' }}>
            <ShieldAlert className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Weaknesses Detected</h3>
          </div>
          <ul className="p-4 space-y-3">
            {(!data.weaknesses || data.weaknesses.length === 0) ? (
              <p className="text-sm italic" style={{ color: 'rgba(201,168,76,0.7)' }}>No significant weaknesses.</p>
            ) : (
              data.weaknesses.map((w, i) => (
                <li key={i} className="text-sm flex items-start" style={{ color: 'rgba(201,168,76,0.9)' }}>
                  <span className="mr-2 text-red-500 mt-0.5" style={{ color: 'var(--accent-gold)' }}>•</span>
                  <span>{w}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </motion.div>

      {/* Suggestions */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
        <Card animateHover className="h-full overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
          <div className="p-4 flex items-center" style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.2)', color: 'var(--accent-gold)' }}>
            <Lightbulb className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Improvement Suggestions</h3>
          </div>
          <ul className="p-4 space-y-3">
            {(!data.suggestions || data.suggestions.length === 0) ? (
              <p className="text-sm italic" style={{ color: 'rgba(201,168,76,0.7)' }}>No further suggestions.</p>
            ) : (
              data.suggestions.map((s, i) => (
                <li key={i} className="text-sm flex items-start" style={{ color: 'rgba(201,168,76,0.9)' }}>
                  <span className="mr-2 mt-0.5" style={{ color: 'var(--accent-gold)' }}>•</span>
                  <span>{s}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </motion.div>

      {/* Optimization Simulator */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} className="md:col-span-3">
        <Card animateHover className="relative overflow-hidden" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
          <CardHeader className="pb-4" style={{ background: 'rgba(201,168,76,0.05)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <CardTitle className="text-lg flex items-center" style={{ color: 'var(--accent-gold)' }}>
              <TrendingUp className="w-5 h-5 mr-2" />
              Optimization Simulator
            </CardTitle>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Projected score increases for specific resume adjustments</p>
          </CardHeader>
          <div className="p-6 space-y-4">
            {(!data.optimization_opportunities || data.optimization_opportunities.length === 0) ? (
              <p className="text-sm text-center" style={{ color: 'rgba(201,168,76,0.8)' }}>Resume is highly optimized. No significant improvements detected.</p>
            ) : (
              data.optimization_opportunities.map((opp, i) => {
                const increase = opp.score_increase * 100
                let colorClass = 'text-muted-foreground bg-card border-border'
                let textClass = 'text-muted-foreground'

                if (increase >= 7) {
                  colorClass = 'text-green-500 bg-green-500/10 border-green-500/30'
                  textClass = 'text-green-600 dark:text-green-400'
                } else if (increase >= 4) {
                  colorClass = 'text-amber-500 bg-amber-500/10 border-amber-500/30'
                  textClass = 'text-amber-600 dark:text-amber-400'
                }

                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border transition-colors" style={{ borderColor: 'rgba(201,168,76,0.2)' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.05)' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                    <div className="flex-1 pr-4">
                      <p className="font-medium" style={{ color: 'var(--accent-gold)' }}>{opp.action}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border flex items-center shrink-0 ${colorClass}`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className={`font-bold ${textClass}`}>+{increase.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default function ResultsDashboard(props) {
  return (
    <ErrorBoundary>
      <ResultsDashboardContent {...props} />
    </ErrorBoundary>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LandingPage from './LandingPage'
import BuilderFlow from './BuilderFlow'
import { Layout } from './components/layout/Layout'
import Analyze from './pages/Analyze'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing — standalone, no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* Resume Builder — standalone flow */}
        <Route path="/build" element={<BuilderFlow />} />

        {/* Resume Analyzer — with sidebar Layout */}
        <Route path="/analyze" element={<Layout />}>
          <Route index element={<Analyze />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

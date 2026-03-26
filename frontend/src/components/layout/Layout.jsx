import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function Layout() {
  const location = useLocation()
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-background)',
        color: 'var(--text-primary)',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden', position: 'relative' }}>

        {/* ─── Sticky Header — solid bg, NO backdrop-blur ───────── */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 2rem',
            background: 'var(--bg-background)',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              padding: '6px',
              borderRadius: '9999px',
              border: '1px solid rgba(201,168,76,0.25)',
              background: 'transparent',
              color: 'rgba(201,168,76,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
              e.currentTarget.style.color = '#C9A84C'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(201,168,76,0.7)'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* ─── Page Content ─────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {/* Decorative gold glow — positioned inside scroll container, away from header */}
          <div
            style={{
              position: 'fixed',
              top: '56px',
              right: 0,
              width: '500px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  )
}

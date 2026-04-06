import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'

export function Layout() {
  const location = useLocation()

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

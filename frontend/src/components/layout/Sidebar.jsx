import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileSearch, Home } from 'lucide-react'

const GOLD = '#C9A84C'
const GOLD_DIM = 'rgba(201,168,76,0.15)'

const navItems = [
  { name: 'Analyze Resume', href: '/analyze', icon: FileSearch },
]

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      style={{
        width: '240px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        transition: 'background 0.3s',
        zIndex: 40,
      }}
    >
      {/* ─── Logo ─────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/')}
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--border-color)',
          cursor: 'pointer',
          flexShrink: 0,
          textAlign: 'left',
          width: '100%',
        }}
      >
        <img
          src="/logo_dark.jpg"
          alt="EtherX"
          style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '4px' }}
        />
        <div>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              background: 'linear-gradient(90deg, #A07830, #F0C040, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            EtherX
          </div>
          <div
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#6B5A3A',
              marginTop: '1px',
            }}
          >
            Resume Intelligence
          </div>
        </div>
      </button>

      {/* ─── Nav ──────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>

        {/* Back to Builder */}
        <SidebarButton onClick={() => navigate('/build')} icon={<Home size={16} />} label="Resume Builder" />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0.25rem' }} />

        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.href}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              color: isActive ? GOLD : 'var(--text-secondary)',
              background: isActive ? GOLD_DIM : 'transparent',
              border: isActive ? `1px solid rgba(201,168,76,0.25)` : '1px solid transparent',
              transition: 'all 0.18s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.dataset.active) {
                e.currentTarget.style.background = 'rgba(201,168,76,0.07)'
                e.currentTarget.style.color = GOLD
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.dataset.active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }
            }}
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} style={{ color: isActive ? GOLD : 'var(--text-muted)' }} />
                <span>{item.name}</span>
                {isActive && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      width: '6px', height: '6px',
                      borderRadius: '50%',
                      background: GOLD,
                      boxShadow: `0 0 6px ${GOLD}`,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '30px', height: '30px',
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: GOLD, fontWeight: 700, fontSize: '0.8rem',
            flexShrink: 0,
          }}
        >
          U
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>User Access</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>Free Tier</p>
        </div>
      </div>
    </motion.aside>
  )
}

function SidebarButton({ onClick, icon, label }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid transparent',
        background: hover ? 'rgba(201,168,76,0.07)' : 'transparent',
        color: hover ? GOLD : 'var(--text-secondary)',
        fontSize: '0.82rem',
        fontWeight: 400,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s',
      }}
    >
      <span style={{ color: hover ? GOLD : 'var(--text-muted)' }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

// Need useState for SidebarButton
import { useState } from 'react'

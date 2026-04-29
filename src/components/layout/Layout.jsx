import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Layout.module.css'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '◼' },
  { to: '/profiles',  label: 'Profiles',  icon: '◻' },
  { to: '/search',    label: 'Search',    icon: '⌕' },
  { to: '/account',   label: 'Account',   icon: '◉' },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Insighta</span>
          <span className={styles.brandBadge}>Labs+</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userRow}>
          <span className={styles.username}>@{user?.username ?? '—'}</span>
          <span className={styles.role}>{user?.role}</span>
          <button className={styles.logout} onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
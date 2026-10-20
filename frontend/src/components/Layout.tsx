import { Link, Outlet, useNavigate } from 'react-router'
import type { Role } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { ROLE_HOME, ROLE_LABELS } from '../lib/roles'

export function Layout() {
  const { user, activeRole, setActiveRole, logout } = useAuth()
  const navigate = useNavigate()
  if (!user || !activeRole) return null

  const switchRole = (role: Role) => {
    setActiveRole(role)
    navigate(ROLE_HOME[role])
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <Link to={ROLE_HOME[activeRole]} className="flex min-h-10 items-center gap-2 font-bold">
            <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-chalk text-on-chalk">
              ✓
            </span>
            <span className="leading-tight">Feedback de clases</span>
          </Link>
          <button
            onClick={logout}
            className="min-h-10 rounded-lg px-3 text-muted hover:bg-paper hover:text-ink"
          >
            Salir
          </button>
        </div>
        {user.roles.length > 1 && (
          <nav aria-label="Cambiar de rol" className="mx-auto max-w-xl px-4 pb-3">
            <div className="grid auto-cols-fr grid-flow-col rounded-xl bg-paper p-1">
              {user.roles.map((role) => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  aria-pressed={role === activeRole}
                  className={`min-h-10 rounded-lg text-sm font-semibold ${
                    role === activeRole ? 'bg-surface text-ink shadow-sm' : 'text-muted'
                  }`}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-xl px-4 pt-6 pb-16">
        <p className="mb-1 text-sm text-muted">{user.full_name}</p>
        <Outlet />
      </main>
    </div>
  )
}

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { Link } from 'react-router'
import type { WindowState } from '../api/types'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'quiet'

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-chalk text-on-chalk hover:brightness-110',
  secondary: 'border-2 border-line bg-surface text-ink hover:border-muted',
  danger: 'border-2 border-correction/40 bg-surface text-correction hover:border-correction',
  quiet: 'text-chalk underline-offset-4 hover:underline',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    />
  )
}

type FieldProps = { label: string; hint?: ReactNode; id: string }

export function TextField({ label, hint, id, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <input
        id={id}
        className="min-h-12 rounded-xl border-2 border-line bg-surface px-3.5 text-base outline-none focus:border-chalk focus-visible:outline-none"
        {...props}
      />
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  )
}

export function TextArea({
  label,
  id,
  value,
  maxLength,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string; maxLength: number }) {
  const remaining = maxLength - value.length
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        <span className={`text-sm tabular-nums ${remaining < 50 ? 'text-correction' : 'text-muted'}`}>
          {remaining}
        </span>
      </div>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        rows={3}
        className="rounded-xl border-2 border-line bg-surface px-3.5 py-3 text-base outline-none focus:border-chalk focus-visible:outline-none"
        {...props}
      />
    </div>
  )
}

export function Alert({ kind = 'error', children }: { kind?: 'error' | 'success' | 'info'; children: ReactNode }) {
  const styles = {
    error: 'border-correction bg-correction-soft text-ink',
    success: 'border-chalk bg-chalk-soft text-ink',
    info: 'border-line bg-surface text-ink',
  }[kind]
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border-l-4 px-4 py-3 ${styles}`}>
      {children}
    </div>
  )
}

export function Loading({ label = 'Cargando…' }: { label?: string }) {
  return (
    <p className="py-10 text-center text-muted" role="status">
      {label}
    </p>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line px-5 py-8 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </div>
  )
}

export function PageHeader({ title, back, children }: { title: string; back?: { to: string; label: string }; children?: ReactNode }) {
  return (
    <header className="mb-6">
      {back && (
        <Link to={back.to} className="mb-3 inline-flex min-h-10 items-center gap-1 text-chalk hover:underline">
          <span aria-hidden>‹</span> {back.label}
        </Link>
      )}
      <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-balance">{title}</h1>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </header>
  )
}

const WINDOW_LABEL: Record<WindowState, string> = {
  upcoming: 'Próxima',
  open: 'Abierta',
  closed: 'Cerrada',
}

export function WindowBadge({ state }: { state: WindowState }) {
  const styles = {
    upcoming: 'bg-paper text-muted border-line',
    open: 'bg-chalk-soft text-ink border-chalk/40',
    closed: 'bg-paper text-muted border-line',
  }[state]
  return <span className={`rounded-full border px-2.5 py-0.5 text-sm ${styles}`}>{WINDOW_LABEL[state]}</span>
}

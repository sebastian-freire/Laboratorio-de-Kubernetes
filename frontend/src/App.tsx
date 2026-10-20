import { useEffect, useState } from 'react'
import { API_URL } from './api/config'

type Health = { status: string; database: string }

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json() as Promise<Health>)
      .then(setHealth)
      .catch(() => setError('No se pudo contactar a la API'))
  }, [])

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="text-2xl font-bold">Feedback de clases</h1>
      <p className="mt-4">
        Estado de la API:{' '}
        {error ?? (health ? `${health.status} (base de datos: ${health.database})` : 'consultando…')}
      </p>
    </main>
  )
}

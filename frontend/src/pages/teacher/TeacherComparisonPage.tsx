import type { SubjectComparison } from '../../api/types'
import { BarList } from '../../components/BarList'
import { Alert, EmptyState, Loading, PageHeader } from '../../components/ui'
import { formatAverage, plural } from '../../lib/format'
import { useApi } from '../../lib/useApi'

const percent = (value: number | null) => (value === null ? '–' : `${Math.round(value * 100)} %`)

export function TeacherComparisonPage() {
  const { data, error, loading } = useApi<SubjectComparison[]>('/teacher/comparison')

  return (
    <>
      <PageHeader title="Comparar mis materias" back={{ to: '/docente', label: 'Mis materias' }} />
      {error && <Alert>{error.message}</Alert>}
      {loading && !data && <Loading />}
      {data && data.length < 2 && <EmptyState title="Hace falta tener al menos dos materias para comparar" />}
      {data && data.length >= 2 && (
        <>
          <section className="mb-6 rounded-2xl bg-surface p-4">
            <h2 className="mb-1 text-lg font-bold">Promedio del semestre</h2>
            <p className="mb-4 text-sm text-muted">Escala de 1 a 5.</p>
            <BarList
              label="Promedio por materia"
              max={5}
              bars={data.map((s) => ({ label: s.name, value: s.average ?? 0, display: formatAverage(s.average) }))}
            />
          </section>
          <section className="mb-6 rounded-2xl bg-surface p-4">
            <h2 className="mb-1 text-lg font-bold">Participación</h2>
            <p className="mb-4 text-sm text-muted">
              Respuestas recibidas sobre las posibles (alumnos inscriptos por clases dictadas).
            </p>
            <BarList
              label="Participación por materia"
              max={1}
              bars={data.map((s) => ({ label: s.name, value: s.participation ?? 0, display: percent(s.participation) }))}
            />
          </section>
          <div className="overflow-x-auto rounded-2xl bg-surface">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Detalle por materia</caption>
              <thead className="border-b border-line text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Materia
                  </th>
                  <th scope="col" className="px-1.5 py-2.5 text-right font-semibold">
                    Clases
                  </th>
                  <th scope="col" className="px-1.5 py-2.5 text-right font-semibold">
                    Alumnos
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                    Respuestas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className="px-3 py-2.5 font-semibold">
                      {s.name}
                    </th>
                    <td className="px-1.5 py-2.5 text-right tabular-nums">{s.past_class_count}</td>
                    <td className="px-1.5 py-2.5 text-right tabular-nums">{s.student_count}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{s.response_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">
            {plural(data.length, 'materia', 'materias')}. Solo se comparan materias en las que sos docente.
          </p>
        </>
      )}
    </>
  )
}

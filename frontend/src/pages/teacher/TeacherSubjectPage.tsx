import { Link, useParams } from 'react-router'
import type { SubjectSummary } from '../../api/types'
import { Face } from '../../components/Face'
import { TrendChart } from '../../components/TrendChart'
import { Alert, EmptyState, Loading, PageHeader } from '../../components/ui'
import { dateShort, formatAverage, plural, timeShort } from '../../lib/format'
import { useApi } from '../../lib/useApi'
import { EnrollmentCode } from './TeacherPages'

// --- Una materia: promedio por clase y tendencia ---

export function TeacherSubjectPage() {
  const { subjectId } = useParams()
  const { data, error, loading } = useApi<SubjectSummary>(`/teacher/subjects/${subjectId}/summary`)
  const back = { to: '/docente', label: 'Mis materias' }

  if (error) {
    return (
      <>
        <PageHeader title="Materia" back={back} />
        <Alert>{error.message}</Alert>
      </>
    )
  }
  if (loading && !data) return <Loading />
  if (!data) return null

  const { subject, classes } = data
  const past = classes.filter((c) => c.window_state !== 'upcoming')

  return (
    <>
      <PageHeader title={subject.name} back={back}>
        <EnrollmentCode code={subject.enrollment_code} />
      </PageHeader>

      <section className="mb-8 flex items-center gap-4 rounded-2xl bg-surface p-5">
        {subject.average !== null && <Face rating={subject.average} size={64} />}
        <div>
          <p className="text-5xl leading-none font-bold">{formatAverage(subject.average)}</p>
          <p className="mt-1.5 text-muted">
            Promedio del semestre, {plural(subject.response_count, 'respuesta', 'respuestas')} en{' '}
            {plural(past.length, 'clase dictada', 'clases dictadas')}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">Promedio por clase</h2>
        <div className="rounded-2xl bg-surface p-3 pt-4">
          <TrendChart classes={classes} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Clases</h2>
        {classes.length === 0 ? (
          <EmptyState title="Esta materia no tiene clases cargadas" />
        ) : (
          <div className="overflow-hidden rounded-2xl bg-surface">
            <table className="w-full text-left">
              <thead className="border-b border-line text-sm text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-semibold">
                    Clase
                  </th>
                  <th scope="col" className="px-2 py-2.5 text-right font-semibold">
                    Respuestas
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {classes.map((c) => (
                  <tr key={c.id} className={c.window_state === 'upcoming' ? 'text-muted' : ''}>
                    <td className="px-4 py-2">
                      {c.window_state === 'upcoming' ? (
                        <span className="flex min-h-10 flex-col justify-center">
                          {dateShort(c.date)}, {timeShort(c.start_time)} h
                          <span className="text-sm">Próxima</span>
                        </span>
                      ) : (
                        <Link
                          to={`/docente/clases/${c.id}`}
                          className="flex min-h-10 flex-col justify-center font-semibold text-chalk hover:underline"
                        >
                          {dateShort(c.date)}, {timeShort(c.start_time)} h
                          {c.window_state === 'open' && (
                            <span className="text-sm font-normal text-muted">Todavía recibe respuestas</span>
                          )}
                        </Link>
                      )}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      {c.window_state === 'upcoming' ? '' : c.response_count}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold tabular-nums">
                      {c.window_state === 'upcoming' ? '' : formatAverage(c.average)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

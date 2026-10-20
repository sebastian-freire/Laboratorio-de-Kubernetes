import { Link, useParams } from 'react-router'
import type { ClassComments, TeacherSubject } from '../../api/types'
import { Face } from '../../components/Face'
import { Alert, EmptyState, Loading, PageHeader } from '../../components/ui'
import { dateLong, formatAverage, plural, timeShort } from '../../lib/format'
import { ratingLabel } from '../../lib/rating'
import { useApi } from '../../lib/useApi'

export function EnrollmentCode({ code }: { code: string }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
      Código para inscribirse:
      <span className="rounded-lg border-2 border-dashed border-line px-2.5 py-1 text-base font-bold tracking-[0.2em] text-ink">
        {code}
      </span>
    </p>
  )
}

// --- Mis materias ---

export function TeacherSubjectsPage() {
  const { data, error, loading } = useApi<TeacherSubject[]>('/teacher/subjects')

  return (
    <>
      <PageHeader title="Mis materias" />
      {error && <Alert>{error.message}</Alert>}
      {loading && !data && <Loading />}
      {data?.length === 0 && (
        <EmptyState title="No tenés materias asignadas">Pedile a la administración que te asigne una.</EmptyState>
      )}
      {data && data.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
          {data.map((subject) => (
            <li key={subject.id}>
              <Link
                to={`/docente/materias/${subject.id}`}
                className="flex min-h-20 items-center gap-3 px-4 py-3 hover:bg-paper"
              >
                {subject.average !== null ? (
                  <Face rating={subject.average} size={40} />
                ) : (
                  <span className="size-10 shrink-0 rounded-full border-2 border-dashed border-line" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold">{subject.name}</span>
                  <span className="text-sm text-muted">
                    {subject.average !== null
                      ? `Promedio ${formatAverage(subject.average)}, ${plural(subject.response_count, 'respuesta', 'respuestas')}`
                      : 'Sin respuestas todavía'}
                  </span>
                </span>
                <span aria-hidden className="text-2xl text-muted">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// --- Una clase: comentarios anónimos ---

export function TeacherClassPage() {
  const { classId } = useParams()
  const { data, error, loading } = useApi<ClassComments>(`/teacher/classes/${classId}/comments`)

  if (error) {
    return (
      <>
        <PageHeader title="Clase" back={{ to: '/docente', label: 'Mis materias' }} />
        <Alert>{error.message}</Alert>
      </>
    )
  }
  if (loading && !data) return <Loading />
  if (!data) return null

  const withText = data.comments.filter((c) => c.liked || c.disliked)
  const onlyRating = data.comments.length - withText.length

  return (
    <>
      <PageHeader
        title={dateLong(data.date)}
        back={{ to: `/docente/materias/${data.subject_id}`, label: data.subject_name }}
      >
        {timeShort(data.start_time)} h
      </PageHeader>

      <section className="mb-6 flex items-center gap-4 rounded-2xl bg-surface p-5">
        {data.average !== null && <Face rating={data.average} size={56} />}
        <div>
          <p className="text-4xl leading-none font-bold">{formatAverage(data.average)}</p>
          <p className="mt-1.5 text-muted">{plural(data.response_count, 'respuesta', 'respuestas')}</p>
        </div>
      </section>

      <p className="mb-4 text-sm text-muted">
        Las opiniones son anónimas y aparecen en orden aleatorio.
      </p>

      {data.comments.length === 0 && <EmptyState title="Nadie opinó sobre esta clase todavía" />}

      <ul className="flex flex-col gap-3">
        {withText.map((comment, i) => (
          <li key={i} className="rounded-2xl bg-surface p-4">
            <p className="mb-2 flex items-center gap-2 font-semibold">
              <Face rating={comment.rating} size={28} />
              {ratingLabel(comment.rating)}
            </p>
            {comment.liked && (
              <p className="mt-2">
                <span className="block text-sm font-semibold text-muted">Le gustó</span>
                {comment.liked}
              </p>
            )}
            {comment.disliked && (
              <p className="mt-2">
                <span className="block text-sm font-semibold text-muted">No le gustó</span>
                {comment.disliked}
              </p>
            )}
          </li>
        ))}
      </ul>
      {onlyRating > 0 && (
        <p className="mt-4 text-muted">
          {onlyRating === 1
            ? '1 persona calificó sin dejar comentarios.'
            : `${onlyRating} personas calificaron sin dejar comentarios.`}
        </p>
      )}
    </>
  )
}

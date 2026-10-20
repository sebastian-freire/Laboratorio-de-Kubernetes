import random
from decimal import Decimal

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from app.db import DbSession
from app.deps import TeacherUser
from app.feedback_window import window_state
from app.models import ClassSession, Feedback, Subject, SubjectTeacher, User
from app.schemas import (
    AnonymousFeedbackOut,
    ClassCommentsOut,
    ClassSummaryOut,
    SubjectSummaryOut,
    TeacherSubjectOut,
)

router = APIRouter(prefix="/teacher", tags=["docente"])


def rounded(value: Decimal | float | None) -> float | None:
    return round(float(value), 2) if value is not None else None


def teacher_subjects_query(teacher: User):
    """Regla R5: solo materias donde el docente está asignado (filtra por usuario autenticado)."""
    class_count = (
        select(func.count(ClassSession.id))
        .where(ClassSession.subject_id == Subject.id)
        .scalar_subquery()
    )

    def feedback_aggregate(aggregate):
        # Subconsulta escalar correlacionada con la materia de la consulta externa.
        return (
            select(aggregate)
            .join(ClassSession, ClassSession.id == Feedback.class_session_id)
            .where(ClassSession.subject_id == Subject.id)
            .scalar_subquery()
        )

    response_count = feedback_aggregate(func.count(Feedback.id))
    average = feedback_aggregate(func.avg(Feedback.rating))
    return (
        select(Subject, class_count, response_count, average)
        .join(SubjectTeacher, SubjectTeacher.subject_id == Subject.id)
        .where(SubjectTeacher.teacher_id == teacher.id)
        .order_by(Subject.name)
    )


def to_teacher_subject_out(row) -> TeacherSubjectOut:
    subject, class_count, response_count, average = row
    return TeacherSubjectOut(
        id=subject.id,
        name=subject.name,
        enrollment_code=subject.enrollment_code,
        class_count=class_count,
        response_count=response_count,
        average=rounded(average),
    )


@router.get("/subjects", response_model=list[TeacherSubjectOut])
def my_subjects(teacher: TeacherUser, db: DbSession) -> list[TeacherSubjectOut]:
    return [to_teacher_subject_out(row) for row in db.execute(teacher_subjects_query(teacher))]


def get_teacher_subject_row(db: DbSession, teacher: User, subject_id: int):
    row = db.execute(teacher_subjects_query(teacher).where(Subject.id == subject_id)).first()
    if row is None:  # ajena o inexistente: misma respuesta para no revelar que existe
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Materia no encontrada.")
    return row


@router.get("/subjects/{subject_id}/summary", response_model=SubjectSummaryOut)
def subject_summary(subject_id: int, teacher: TeacherUser, db: DbSession) -> SubjectSummaryOut:
    """Promedio y cantidad de respuestas por clase, ordenado por fecha (tendencia del semestre)."""
    row = get_teacher_subject_row(db, teacher, subject_id)
    rows = db.execute(
        select(ClassSession, func.count(Feedback.id), func.avg(Feedback.rating))
        .outerjoin(Feedback, Feedback.class_session_id == ClassSession.id)
        .where(ClassSession.subject_id == subject_id)
        .group_by(ClassSession.id)
        .order_by(ClassSession.date, ClassSession.start_time)
    )
    classes = [
        ClassSummaryOut(
            id=c.id,
            date=c.date,
            start_time=c.start_time,
            window_state=window_state(c.date),
            response_count=count,
            average=rounded(avg),
        )
        for c, count, avg in rows
    ]
    return SubjectSummaryOut(subject=to_teacher_subject_out(row), classes=classes)


@router.get("/classes/{class_id}/comments", response_model=ClassCommentsOut)
def class_comments(class_id: int, teacher: TeacherUser, db: DbSession) -> ClassCommentsOut:
    """Comentarios anónimos (D-018, D-020): sin datos del autor, sin fechas, en orden aleatorio."""
    row = db.execute(
        select(ClassSession, Subject.name)
        .join(Subject, Subject.id == ClassSession.subject_id)
        .join(SubjectTeacher, SubjectTeacher.subject_id == Subject.id)
        .where(ClassSession.id == class_id, SubjectTeacher.teacher_id == teacher.id)
    ).first()
    if row is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Clase no encontrada.")
    class_session, subject_name = row
    # Se seleccionan solo estas tres columnas: el id del alumno nunca sale de la base.
    comments = [
        AnonymousFeedbackOut(rating=rating, liked=liked, disliked=disliked)
        for rating, liked, disliked in db.execute(
            select(Feedback.rating, Feedback.liked, Feedback.disliked).where(
                Feedback.class_session_id == class_id
            )
        )
    ]
    random.shuffle(comments)
    ratings = [c.rating for c in comments]
    return ClassCommentsOut(
        id=class_session.id,
        subject_id=class_session.subject_id,
        subject_name=subject_name,
        date=class_session.date,
        start_time=class_session.start_time,
        response_count=len(ratings),
        average=rounded(sum(ratings) / len(ratings)) if ratings else None,
        comments=comments,
    )

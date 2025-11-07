from django.db.models import Sum, F
from grades.models import Mark, ResultSummary, GradeScale


def recompute_result_for_student_exam(enrollment, exam):
    """
    Recalculate total marks, percentage, and grade for a given student & exam.
    """
    marks = Mark.objects.filter(enrollment=enrollment, exam=exam)
    if not marks.exists():
        ResultSummary.objects.filter(enrollment=enrollment, exam=exam).delete()
        return None

    total_obtained = marks.aggregate(Sum("marks_obtained"))["marks_obtained__sum"] or 0
    total_max = marks.aggregate(Sum("max_marks"))["max_marks__sum"] or 0

    percentage = (total_obtained / total_max * 100) if total_max else 0

    # find grade scale
    grade_scale = (
        GradeScale.objects.filter(
            academic_year=enrollment.academic_year,
            min_percentage__lte=percentage,
            max_percentage__gte=percentage,
        )
        .order_by("-min_percentage")
        .first()
    )

    grade_letter = grade_scale.letter if grade_scale else None
    gpa_points = grade_scale.gpa_points if grade_scale else 0

    summary, created = ResultSummary.objects.update_or_create(
        enrollment=enrollment,
        exam=exam,
        defaults={
            "total_obtained": total_obtained,
            "total_max": total_max,
            "percentage": round(percentage, 2),
            "grade_letter": grade_letter,
            "gpa_points": gpa_points,
        },
    )
    return summary


def recompute_ranks_for_exam(exam):
    """
    Rank students within their classroom for a given exam.
    """
    summaries = (
        ResultSummary.objects.filter(exam=exam)
        .select_related("enrollment__classroom")
        .order_by("enrollment__classroom", "-percentage")
    )

    current_class = None
    rank = 0
    same_score_count = 0
    last_percentage = None

    for summary in summaries:
        classroom = summary.enrollment.classroom
        if classroom != current_class:
            # new class, reset rank counter
            current_class = classroom
            rank = 1
            same_score_count = 0
            last_percentage = summary.percentage
        else:
            # same class, increase rank or tie
            if summary.percentage == last_percentage:
                same_score_count += 1
            else:
                rank += same_score_count + 1
                same_score_count = 0
                last_percentage = summary.percentage

        summary.class_rank = rank
        summary.save(update_fields=["class_rank"])


def compute_cgpa_for_enrollment(enrollment):
    """
    Compute the average GPA across all exams for one student (yearly CGPA).
    """
    summaries = ResultSummary.objects.filter(enrollment=enrollment)
    if not summaries.exists():
        return 0

    # Weighted average using exam weightage if available
    total_weight = 0
    weighted_gpa = 0

    for s in summaries:
        weight = s.exam.weightage or 100
        total_weight += weight
        weighted_gpa += s.gpa_points * weight

    cgpa = weighted_gpa / total_weight if total_weight else 0
    return round(cgpa, 2)

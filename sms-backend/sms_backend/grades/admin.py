from django.contrib import admin
from .models import (
    AcademicYear,
    Exam,
    AssessmentType,
    GradeScale,
    Enrollment,
    Mark,
    ResultSummary
)

@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("name", "academic_year", "start_date", "end_date", "weightage")
    list_filter = ("academic_year",)
    search_fields = ("name",)


@admin.register(AssessmentType)
class AssessmentTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "weightage_within_subject")
    search_fields = ("name",)


@admin.register(GradeScale)
class GradeScaleAdmin(admin.ModelAdmin):
    list_display = ("letter", "min_percentage", "max_percentage", "gpa_points", "academic_year")
    list_filter = ("academic_year",)
    ordering = ("-min_percentage",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "academic_year", "classroom", "roll_no", "is_active")
    list_filter = ("academic_year", "classroom")
    search_fields = ("student__username", "admission_no")


@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display = ("enrollment", "subject", "exam", "marks_obtained", "max_marks", "created_by")
    list_filter = ("exam", "subject")
    search_fields = ("enrollment__student__username",)


@admin.register(ResultSummary)
class ResultSummaryAdmin(admin.ModelAdmin):
    list_display = ("enrollment", "exam", "total_obtained", "total_max", "percentage", "grade_letter", "class_rank")
    list_filter = ("exam", "grade_letter")
    search_fields = ("enrollment__student__username",)

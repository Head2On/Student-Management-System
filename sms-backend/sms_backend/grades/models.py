from django.db import models
from django.conf import settings
from courses.models import Course
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from school.models import Classroom,Subject


class AcademicYear(models.Model):
    name = models.CharField(max_length=20, unique=True)  # e.g., "2025-26"
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.name
    
class Exam(models.Model):
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name="exams")
    name = models.CharField(max_length=100)  # e.g., "Term 1", "Final Exam"
    start_date = models.DateField()
    end_date = models.DateField()
    weightage = models.FloatField(default=100)  # optional, for total weight of the exam

    class Meta:
        unique_together = ("academic_year", "name")
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.name} ({self.academic_year.name})"

#AssessmentType
class AssessmentType(models.Model):
    name = models.CharField(max_length=100, unique=True)   # e.g. "Unit Test", "Midterm", "Project"
    weightage_within_subject = models.FloatField(
        default=100, help_text="Weightage of this assessment within a subject (in %)"
    )
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.weightage_within_subject}%)"
#GradeScale
class GradeScale(models.Model):
    academic_year = models.ForeignKey(
        AcademicYear, on_delete=models.CASCADE, related_name="grade_scales"
    )
    min_percentage = models.FloatField()
    max_percentage = models.FloatField()
    letter = models.CharField(max_length=5)        # e.g. "A1", "B", "C"
    gpa_points = models.FloatField(default=0)
    remark = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ["-min_percentage"]
        unique_together = ("academic_year", "letter")

    def __str__(self):
        return f"{self.letter} ({self.min_percentage}-{self.max_percentage}%)"


from django.conf import settings

class Enrollment(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # assuming your Student extends User or links to it
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    academic_year = models.ForeignKey(
        "grades.AcademicYear",
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    classroom = models.ForeignKey(
        Classroom,  # adjust if your class/section model is named differently
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    roll_no = models.PositiveIntegerField()
    admission_no = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("academic_year", "classroom", "student")
        ordering = ["roll_no"]

    def __str__(self):
        return f"{self.student.username} - {self.classroom.name} ({self.academic_year.name})"

# Marks
class Mark(models.Model):
    enrollment = models.ForeignKey(
        "grades.Enrollment",
        on_delete=models.CASCADE,
        related_name="marks"
    )
    subject = models.ForeignKey(
        Subject,  # assuming you already have this in your school app
        on_delete=models.CASCADE,
        related_name="marks"
    )
    exam = models.ForeignKey(
        "grades.Exam",
        on_delete=models.CASCADE,
        related_name="marks"
    )
    assessment_type = models.ForeignKey(
        "grades.AssessmentType",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="marks"
    )

    max_marks = models.FloatField()
    marks_obtained = models.FloatField()
    remarks = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="marks_created"
    )

    class Meta:
        unique_together = ("enrollment", "subject", "exam", "assessment_type")
        ordering = ["exam", "subject"]

    def __str__(self):
        return f"{self.enrollment.student.username} - {self.subject.name} ({self.exam.name})"

    def clean(self):
        if self.marks_obtained > self.max_marks:
            raise ValidationError("Marks obtained cannot exceed maximum marks.")
        if self.marks_obtained < 0:
            raise ValidationError("Marks obtained cannot be negative.")

# Result summary 
class ResultSummary(models.Model):
    enrollment = models.ForeignKey(
        "grades.Enrollment",
        on_delete=models.CASCADE,
        related_name="results"
    )
    exam = models.ForeignKey(
        "grades.Exam",
        on_delete=models.CASCADE,
        related_name="results"
    )

    total_obtained = models.FloatField(default=0)
    total_max = models.FloatField(default=0)
    percentage = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0
    )
    grade_letter = models.CharField(max_length=5, blank=True, null=True)
    gpa_points = models.FloatField(default=0)
    class_rank = models.PositiveIntegerField(blank=True, null=True)

    computed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("enrollment", "exam")
        ordering = ["exam", "enrollment__roll_no"]

    def __str__(self):
        return f"{self.enrollment.student.username} - {self.exam.name} ({self.grade_letter or '-'})"
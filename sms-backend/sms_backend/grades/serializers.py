from rest_framework import serializers
from .models import (
    AcademicYear, Exam, AssessmentType, GradeScale,
    Enrollment, Mark, ResultSummary
)

# --- Master Serializers ---

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = "__all__"


class ExamSerializer(serializers.ModelSerializer):
    academic_year = serializers.StringRelatedField()

    class Meta:
        model = Exam
        fields = "__all__"


class AssessmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentType
        fields = "__all__"


class GradeScaleSerializer(serializers.ModelSerializer):
    academic_year = serializers.StringRelatedField()

    class Meta:
        model = GradeScale
        fields = "__all__"


# --- Enrollment & Marks ---

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.username", read_only=True)
    classroom_name = serializers.CharField(source="classroom.name", read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id", "student", "student_name", "academic_year", "classroom",
            "classroom_name", "roll_no", "admission_no", "is_active"
        ]


class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="enrollment.student.username", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    exam_name = serializers.CharField(source="exam.name", read_only=True)

    class Meta:
        model = Mark
        fields = [
            "id", "enrollment", "student_name", "subject", "subject_name",
            "exam", "exam_name", "assessment_type", "max_marks", "marks_obtained",
            "remarks", "created_by", "created_at", "updated_at"
        ]

    def validate(self, data):
        if data["marks_obtained"] > data["max_marks"]:
            raise serializers.ValidationError("Marks obtained cannot exceed maximum marks.")
        return data


class ResultSummarySerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="enrollment.student.username", read_only=True)
    classroom_name = serializers.CharField(source="enrollment.classroom.name", read_only=True)
    exam_name = serializers.CharField(source="exam.name", read_only=True)

    class Meta:
        model = ResultSummary
        fields = [
            "id", "enrollment", "student_name", "classroom_name", "exam", "exam_name",
            "total_obtained", "total_max", "percentage", "grade_letter",
            "gpa_points", "class_rank", "computed_at"
        ]

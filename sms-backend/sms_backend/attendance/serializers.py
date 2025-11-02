from rest_framework import serializers
# Make sure to import the models
from .models import Attendance
from users.models import User
from courses.models import Course

class StudentSerializer(serializers.ModelSerializer):
    """ Read-only serializer for nested student data """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CourseStudentSerializer(serializers.ModelSerializer):
    """ Serializer for listing students enrolled in a course (for Teachers) """
    students = StudentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'students']

class StudentCourseSerializer(serializers.ModelSerializer):
    """ A simple serializer for a student to see their courses """
    class Meta:
        model = Course
        fields = ['id', 'code', 'name']

class StudentAttendanceSerializer(serializers.ModelSerializer):
    """ Serializer for a teacher to see student status for a day """
    student = StudentSerializer(read_only=True)
    class Meta:
        model = Attendance
        fields = ['student', 'status']

class AttendanceSerializer(serializers.ModelSerializer):
    """ Serializer for GETTING a student's own attendance records """
    class Meta:
        model = Attendance
        fields = ['id', 'course', 'date', 'status']

class CreateAttendanceSerializer(serializers.Serializer):
    """ Serializer for POSTING a batch of attendance records """
    course_id = serializers.IntegerField()
    date = serializers.DateField()
    records = serializers.ListField(
        child=serializers.DictField()
    )

    def create(self, validated_data):
        course_id = validated_data['course_id']
        date = validated_data['date']
        records_data = validated_data['records']
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course not found.")
        
        created_records = []
        for record_data in records_data:
            student_id = record_data.get('student_id')
            status = record_data.get('status')
            
            if not student_id or not status:
                continue 

            attendance_record, created = Attendance.objects.update_or_create(
                student_id=student_id,
                course=course,
                date=date,
                defaults={'status': status}
            )
            created_records.append(attendance_record)
            
        return {'created_records': created_records}


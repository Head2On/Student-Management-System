from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from grades.models import Mark
from grades.services.recompute_results import recompute_result_for_student_exam


@receiver([post_save, post_delete], sender=Mark)
def update_result_summary(sender, instance, **kwargs):
    enrollment = instance.enrollment
    exam = instance.exam
    recompute_result_for_student_exam(enrollment, exam)

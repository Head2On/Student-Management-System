import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from courses.models import Course 

try:
    stripe.api_key = settings.STRIPE_SECRET_KEY
except AttributeError:
    print("FATAL ERROR: STRIPE_SECRET_KEY is not set in settings.py")
    stripe.api_key = None 


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        if not stripe.api_key:
            return Response(
                {"error": "Stripe API key is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        course_id = request.data.get('courseId')
        
        if not course_id:
            return Response(
                {"error": "courseId is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            course = get_object_or_404(Course, id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        image_url_list = []
        if course.image and hasattr(course.image, 'url'):
            image_url = request.build_absolute_uri(course.image.url)
            image_url_list.append(image_url)

        try:
            if not hasattr(settings, 'FRONTEND_DOMAIN'):
                print("FATAL ERROR: FRONTEND_DOMAIN is not set in settings.py")
                return Response(
                    {"error": "Server configuration error."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd', 
                        'product_data': {
                            'name': course.name,
                            'images': image_url_list, 
                        },
                        'unit_amount': int(course.price * 100), 
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{settings.FRONTEND_DOMAIN}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_DOMAIN}/checkout/{course_id}", 
                
                metadata={
                    'course_id': course.id,
                    'user_id': request.user.id
                }
            )
            
            # --- THIS IS THE FIX ---
            # Instead of just sending the ID, send the URL from the session object
            return Response({'id': session.id, 'url': session.url})
            # --- END OF FIX ---

        except Exception as e:
            print(f"Stripe Error: {str(e)}")
            return Response(
                {"error": "Could not create payment session. Check server logs."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


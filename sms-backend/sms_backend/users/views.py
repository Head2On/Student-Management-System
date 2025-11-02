from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer 
# Add IsAuthenticated permission
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .models import User

# Register Api
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Login API
from rest_framework.views import APIView
from django.contrib.auth import authenticate

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        if not role:
             return Response({"error": "Role was not provided"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None and user.role == role:
            refresh = RefreshToken.for_user(user)
           
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                # Send the full user object or at least the ID
                "user": {
                    "id": user.id, 
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                }
            })
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- ADD THIS NEW VIEW ---
class TeacherListView(generics.ListAPIView):
    """
    A view to list all users with the role 'teacher'.
    """
    serializer_class = UserSerializer
    # Only authenticated users can see this list
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        """
        This view should return a list of all users
        with the role 'teacher'.
        """
        return User.objects.filter(role='teacher')
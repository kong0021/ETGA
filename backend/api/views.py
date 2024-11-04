from django.shortcuts import render
from rest_framework import generics, viewsets
from .serializers import RoomSerializer, AppointmentSerializer
from .models import UserModel, Appointment
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


###
from rest_framework import views, status
from rest_framework.response import Response

# internals
from api.serializers import QuerySerializer, AddDocumentSerializer, TranscribeSerializer, MyTokenObtainPairSerializer, RegisterSerializer, ProfileSerializer
from api.models import QueryExplainer, AddDocumentModel, TranscribeModel, Profile, User
from api.utils import delete_vector_db, send_query_to_api
from api.serializers import CodeExplainSerializer
from api.models import CodeExplainer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

class QueryView(views.APIView):
    serializer_class = QuerySerializer
    # authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        qe = QueryExplainer.objects.all()
        serializer = self.serializer_class(qe, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #To reset db
    def delete(self, request, format=None):
        qe = QueryExplainer.objects.all()
        qe.delete()
        delete_vector_db()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AddDocumentView(views.APIView):
    serializer_class = AddDocumentSerializer
    # authentication_classes = [TokenAuthentication]  # Replace with JWTAuthentication if using JWT
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        qe = AddDocumentModel.objects.all()
        serializer = self.serializer_class(qe, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TranscribeView(views.APIView):
    serializer_class = TranscribeSerializer

    permission_classes = [AllowAny]

    def get(self, request, format=None):
        qe = TranscribeModel.objects.all()
        serializer = self.serializer_class(qe, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#####
# Create your views here.
class RoomView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = RoomSerializer

class AppointmentViewSet(views.APIView):
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        appointments = Appointment.objects.prefetch_related('query_explainer').all()
        serializer = AppointmentSerializer(appointments, many=True)

        # Return serialized data with associated queries
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserSignupView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class CreateRoomView(APIView):
#     serializer_class = CreateRoomSerializer

#     def post(self, request, format=None):
#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()

#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             guest_can_pause = serializer.data.guest_can_pause
#             votes_to_skip = serializer.data.votes_to_skip
#             #host = self.request.session.session_key
#             #queryset= Room.objects.filter(host=host)
#             # if queryset.exists():
#             #   room = queryset[0]
#             #   room.guest_can_pause = guest_can_pause
#             #   room.votes_to_skip = votes_to_skip
#             #   room.save(update_ fields=['guest_can_pause', 'votes_to_skip'])
#             # else:
#             #   room = Room(host=host,guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
#             #   room.save()
#             # return Response(RoomSerializer(room).data, status=status.HTTP_2)
# @csrf_exempt  # Disable CSRF for simplicity; use with caution and ensure proper security measures
# @require_POST
@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Load JSON data from the request body
            message = data.get('message')  # Get the message from the data
            response = send_query_to_api(message)  # Call your function to get a response
            return JsonResponse({'message': message, 'response': response})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

class CodeExplainView(views.APIView):
    serializer_class = CodeExplainSerializer
    permission_classes = [AllowAny]

    def get(self, request, format = None):
        qs = CodeExplainer.objects.all()
        serializer = self.serializer_class(qs, many = True)
        return Response(serializer.data)

    def post(self, request, format = None):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView:
    pass

class TokenView:    
    pass

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# This code defines another DRF View class called ProfileView, which inherits from generics.RetrieveAPIView and used to show user profile view.
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)

class PasswordEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        
        if user:
            user.otp = generate_numeric_otp()
            uidb64 = user.pk
            
             # Generate a token and include it in the reset link sent via email
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)

            # Store the reset_token in the user model for later verification
            user.reset_token = reset_token
            user.save()

            link = f"http://localhost:5173/create-new-password?otp={user.otp}&uidb64={uidb64}&reset_token={reset_token}"
            
            merge_data = {
                'link': link, 
                'username': user.username, 
            }
            subject = f"Password Reset Request"
            text_body = render_to_string("email/password_reset.txt", merge_data)
            html_body = render_to_string("email/password_reset.html", merge_data)
            
            msg = EmailMultiAlternatives(
                subject=subject, from_email=settings.FROM_EMAIL,
                to=[user.email], body=text_body
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send()
        return user
    

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        
        otp = payload['otp']
        uidb64 = payload['uidb64']
        password = payload['password']

        

        user = User.objects.get(id=uidb64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()
            
            return Response( {"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response( {"message": "An Error Occured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
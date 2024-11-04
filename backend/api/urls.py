from django.urls import path
from .views import RoomView, AppointmentViewSet, QueryView, AddDocumentView, TranscribeView, CodeExplainView, ProfileView, PasswordChangeView, PasswordEmailVerify
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    # path('home', UserSignupView.as_view()),
    path('use-query/',QueryView.as_view(),name='use-query'),
    path('add-documents/',AddDocumentView.as_view(),name='add-document'),
    path('transcribe/',TranscribeView.as_view(),name='transcribe-document'),
    path('code-explain/', CodeExplainView.as_view(), name = 'code-explain'),
    path('user/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path('user/profile/<user_id>/', ProfileView.as_view(), name='user_profile'),
    path('user/password-reset/<email>/', PasswordEmailVerify.as_view(), name='password_reset'),
    path('user/password-change/', PasswordChangeView.as_view(), name='password_reset'),
    path('appointments/', AppointmentViewSet.as_view(), name='appointment'),
]

#Input for query
# {
#   "_input":"How many therapy session did the user:'Alice Raven' have?"
# }

#Input for transcribe
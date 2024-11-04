from rest_framework import serializers
from .models import UserModel, Appointment, User, Profile

from rest_framework import serializers
#internal
from api.models import QueryExplainer, AddDocumentModel, TranscribeModel, Profile
from api.utils import send_query_to_api, add_document_to_db, transcribe_video
from api.models import CodeExplainer 
from api.utils import send_code_to_api

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class QuerySerializer(serializers.ModelSerializer):
    appointment = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(),
        help_text="Select the appointment ID"  # Optional: Add help text
    )

    class Meta:
        model = QueryExplainer
        fields = ['id', '_input', '_output', 'appointment']
        extra_kwargs = {
            '_output': {"read_only": True},
        }

    def create(self, validated_data):
        appointment = validated_data.pop('appointment')
        _output = send_query_to_api(validated_data["_input"])  # Assuming this is your function
        validated_data['_output'] = _output
        query = QueryExplainer.objects.create(**validated_data)
        appointment.queries.add(query)
        return query
    
class AddDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddDocumentModel
        fields = ['id','_input', '_output']
        extra_kwargs = {
            '_output': {"read_only": True},
        }
        
    def create(self, validated_data):
        qe = AddDocumentModel(**validated_data)
        _output = add_document_to_db(validated_data["_input"])
        qe._output = _output
        qe.save()
        return qe
    
class TranscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscribeModel
        fields = ['id','video_name', 'session_id', 'description', 'user', 'date', '_output']
        extra_kwargs = {
            '_output': {"read_only": True},
        }
        
    def create(self, validated_data):
        qe = TranscribeModel(**validated_data)
        _output = transcribe_video(validated_data["video_name"], validated_data["session_id"], validated_data["description"], validated_data["user"], validated_data["date"])
        qe._output = _output
        qe.save()
        return qe


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('first_name', 'last_name', 'description', 'last_modified', 'profileImage')

class AppointmentSerializer(serializers.ModelSerializer):
    queries = QuerySerializer(many=True, read_only=True)  

    class Meta:
        model = Appointment
        fields = ['session_id', 'patient', 'date', 'time', 'status', 'queries']
        
    def create(self, validated_data):
        return Appointment.objects.create(**validated_data)
    


# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ['first_name', 'last_name', 'email', 'password']

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['email'],
#             first_name=validated_data['first_name'],
#             last_name=validated_data['last_name'],
#             email=validated_data['email'],
#             password=validated_data['password']
#         )
#         return user
    
# class CreateRoomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Room
#         fields = ('guest_can_pause', 'votes_to_skip')

class CodeExplainSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeExplainer
        fields = ("id", "_input", "_output")
        extra_kwargs = {
            "_output":{"read_only": True}
        }

    def create(self, validated_data):
        ce = CodeExplainer(**validated_data)
        _output = send_code_to_api(validated_data["_input"])
        ce._output = _output 
        ce.save()
        return ce


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''
    class MyTokenObtainPairSerializer(TokenObtainPairSerializer):: This line creates a new token serializer called MyTokenObtainPairSerializer that is based on an existing one called TokenObtainPairSerializer. Think of it as customizing the way tokens work.
    @classmethod: This line indicates that the following function is a class method, which means it belongs to the class itself and not to an instance (object) of the class.
    def get_token(cls, user):: This is a function (or method) that gets called when we want to create a token for a user. The user is the person who's trying to access something on the website.
    token = super().get_token(user): Here, it's asking for a regular token from the original token serializer (the one it's based on). This regular token is like a key to enter the website.
    token['full_name'] = user.full_name, token['email'] = user.email, token['username'] = user.username: This code is customizing the token by adding extra information to it. For example, it's putting the user's full name, email, and username into the token. These are like special notes attached to the key.
    return token: Finally, the customized token is given back to the user. Now, when this token is used, it not only lets the user in but also carries their full name, email, and username as extra information, which the website can use as needed.
    '''
    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        try:
            token['vendor_id'] = user.vendor.id
        except:
            token['vendor_id'] = 0

        # ...

        # Return the token with custom claims
        return token


# Define a serializer for user registration, which inherits from serializers.ModelSerializer
class RegisterSerializer(serializers.ModelSerializer):
    # Define fields for the serializer, including password and password2
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Specify the model that this serializer is associated with
        model = User
        # Define the fields from the model that should be included in the serializer
        fields = ('full_name', 'email',  'password', 'password2')

    def validate(self, attrs):
        # Define a validation method to check if the passwords match
        if attrs['password'] != attrs['password2']:
            # Raise a validation error if the passwords don't match
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Return the validated attributes
        return attrs

    def create(self, validated_data):
        # Define a method to create a new user based on validated data
        user = User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
        )
        email_username, mobile = user.email.split('@')
        user.username = email_username

        # Set the user's password based on the validated data
        user.set_password(validated_data['password'])
        user.save()

        # Return the created user
        return user

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        return response
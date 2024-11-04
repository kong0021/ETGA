from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.html import mark_safe
####

class AddDocumentModel(models.Model):
    _input = models.TextField()
    _output = models.TextField()

    class Meta:
        db_table = "t_add_document"

class TranscribeModel(models.Model):
    video_name = models.TextField()
    session_id = models.TextField()
    description = models.TextField()
    user = models.TextField()
    date = models.TextField()
    _output = models.TextField()

    class Meta:
        db_table = "t_transcribe"
####
# Create your models here.
class UserModel(models.Model):
    email = models.EmailField((""), max_length=254)
    first_name = models.CharField(max_length=64, default="", unique=True)
    last_name = models.CharField(max_length=64, default="", unique=True)
    description = models.TextField()
    last_modified = models.DateTimeField(auto_now_add=True)
    profileImage = models.ImageField()



class Appointment(models.Model):
    session_id = models.AutoField(primary_key=True)
    patient = models.CharField(max_length=64, default="", unique=False)  
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=10, default='upcoming')
    queries = models.ManyToManyField('QueryExplainer', related_name='appointments', blank=True)

    def __str__(self):
        return f"Appointment {self.session_id} for {self.patient} on {self.date} at {self.time} with {self.status}"
    
    def update_status(self):
        from datetime import date
        if self.date < date.today():
            self.status = 'past'
        else:
            self.status = 'upcoming'
        self.save()

class QueryExplainer(models.Model):
    _input = models.TextField()
    _output = models.TextField()
    appointment = models.ForeignKey(Appointment, related_name='query_explainer', on_delete=models.CASCADE, null=True)


    class Meta:
        db_table = "t_query"

# class UserModel(models.Model):
#     guest_can_pause = models.BooleanField(null=False, default=False)
#     votes_to_skip = models.IntegerField(null=False, default=1)

class CodeExplainer(models.Model):
    _input = models.TextField()
    _output = models.TextField()

    class Meta:
        db_table = "t_code_explainer"

class User(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True) 
    full_name = models.CharField(max_length=100, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        email_username, mobile = self.email.split("@")
        if self.full_name == "" or self.full_name == None:
            self.full_name = email_username
        if self.username == "" or self.username == None:
            self.username = email_username  
    
        super(User, self).save(*args, **kwargs)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="image", default="default/default-user.jpg", null=True, blank=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.full_name)
    

    def save(self, *args, **kwargs):
        if self.full_name == "" or self.full_name == None:
            self.full_name = self.user.full_name
        super(Profile, self).save(*args, **kwargs)

    def thumbnail(self):
        return mark_safe('<img src="/media/%s" width="50" height="50" object-fit:"cover" style="border-radius: 30px; object-fit: cover;" />' % (self.image))
    

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
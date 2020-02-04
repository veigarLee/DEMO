from django.shortcuts import render
from project_demo.app_demo.models import UserModel
from rest_framework import serializers
from rest_framework.views import APIView
# from rest_framework.response import Response
from django.http import JsonResponse

from django.core.cache import cache
import uuid


# Create your views here.

def index(request):
    return render(request, 'index.html')
    
    
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserModel
#         fields = 'id', 'username', 'password'

class statics :
    str_id = 'id'
    str_username = 'username'
    str_password = 'password'
    str_token = 'token'
    str_status = 'status'
    str_message = 'message'
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = statics.str_id, statics.str_username, statics.str_password
        
class RegisterAPI(APIView):

    def post(self, request):
        if len(UserModel.objects.filter(username = request.data[statics.str_username])) == 0 :
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({statics.str_status : '200' , statics.str_message:'successful'})
            else:
                return JsonResponse({statics.str_status : '403' , statics.str_message:'invalid'})
        
        else:
            return JsonResponse({statics.str_status : '403' , statics.str_message:'User name already exists'})
        

class LoginAPI(APIView):
    def post(self, request):
        username = request.data[statics.str_username]
        password = request.data[statics.str_password]
        
        listUser = UserModel.objects.filter(username = request.data[statics.str_username])
        if len(listUser) == 0 :
            return JsonResponse({statics.str_status : '403' , statics.str_message:'Incorrect username or password'})
            
        user = listUser[0]
        if not user.verify_password(password):
            return JsonResponse({statics.str_status : '403' , statics.str_message:'Incorrect username or password'})


        token = uuid.uuid4().hex
        # cache.set(token, user.id, timeout=60 * 60)
        cache.set(token, username, timeout=60 * 60)
        
        return JsonResponse({statics.str_status : '200' , statics.str_message:'login success!',statics.str_username:username, statics.str_token:token})
        


    
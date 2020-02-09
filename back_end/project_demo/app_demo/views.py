from django.shortcuts import render
from project_demo.app_demo.models import UserModel
from project_demo.app_demo.models import CustomerModel
from rest_framework import serializers
from rest_framework.views import APIView
from django.http import JsonResponse

from django.core.cache import cache
import uuid

from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions



# Create your views here.

def index(request):
    return render(request, 'index.html')
    
class statics :
    str_id = 'id'
    str_username = 'username'
    str_password = 'password'
    str_token = 'token'
    str_status = 'status'
    str_success = 'success'
    str_data = 'data'
    str_message = 'message'
    str_name = 'name'
    str_age = 'age'
    str_address = 'address'
    
    
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
                return JsonResponse({statics.str_status : 200 , statics.str_message:'successful'})
            else:
                return JsonResponse({statics.str_status : 403 , statics.str_message:'invalid'})
        
        else:
            return JsonResponse({statics.str_status : 403 , statics.str_message:'User name already exists'})
        

class LoginAPI(APIView):
    def post(self, request):
        username = request.data[statics.str_username]
        password = request.data[statics.str_password]
        
        listUser = UserModel.objects.filter(username = request.data[statics.str_username])
        if len(listUser) == 0 :
            return JsonResponse({statics.str_status : 403 , statics.str_message:'Incorrect username or password'})
        
        user = listUser[0]
        if not user.verify_password(password):
            return JsonResponse({statics.str_status : 403 , statics.str_message:'Incorrect username or password'})


        token = uuid.uuid4().hex
        cache.set(token, username, timeout=60 * 60)
        
        
        return JsonResponse({statics.str_status : 200 , statics.str_message:'login success!',statics.str_username:username, statics.str_token:token})
        


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerModel
        fields = statics.str_id, statics.str_name,statics.str_age, statics.str_address

class MyTokenAuthentication (BaseAuthentication):
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        """
        token = request._request.GET.get(statics.str_token)
        username = cache.get(token)
        if(username == None) :
            raise exceptions.AuthenticationFailed('token authentification failed')
        return (username,token)
            
    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response, or `None` if the
        authentication scheme should return `403 Permission Denied` responses.
        """
        pass
 
class CustomerAPI(APIView):
    authentication_classes = [MyTokenAuthentication,]
    
    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({statics.str_success : True , statics.str_message:'success'})
        else:
            return JsonResponse({statics.str_success : False , statics.str_message:'fail'})
        
        
    def get(self, request):
        objAllCustomers = CustomerModel.objects.all()
        serializers = CustomerSerializer (instance=objAllCustomers ,many = True)
        return JsonResponse({statics.str_success : True ,statics.str_data:serializers.data,statics.str_message:'success'})
        
    def put(self, request):
        id = request.data[statics.str_id]
        name = request.data[statics.str_name]
        age = request.data[statics.str_age]
        address = request.data[statics.str_address]
        CustomerModel.objects.filter(id=id).update(name=name,age=age,address=address)
        
        return JsonResponse({statics.str_success : True , statics.str_message:'success'})
    
    def delete(self, request):
        id = request.data[statics.str_id]
        CustomerModel.objects.filter(id=id).delete()
        return JsonResponse({statics.str_success : True , statics.str_message:'success'})

    
    
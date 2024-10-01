# from django.shortcuts import render
# from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
#
# from core.model import User
#
#
# # Create your views here.
#
# class OfficeView(APIView):
#     permission_classes = (IsAuthenticated,)
#
#     def post(self, request):
#         if request.user.user_type != User.OWNER_USER or request.user.user_type != User.MANAGER_USER:
#             return Response({'detail': 'You do not have permission to create a company.'},
#                             status=status.HTTP_403_FORBIDDEN)
#
#         serializer = OfficeSerializer(data=request.data)
#
#         if serializer.is_valid():
#             serializer.save(owner=request.user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=400)
#

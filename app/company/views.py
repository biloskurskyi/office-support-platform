from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, User

from .serializers import CompanySerializer


class CompanyView(APIView):
    """
    View for creating and retrieving companies, restricted to owner users only.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.user.user_type != User.OWNER_USER:
            return Response({'detail': 'You do not have permission to create a company.'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

    def get(self, request):
        if request.user.user_type != User.OWNER_USER:
            return Response({'detail': 'You do not have permission to create a company.'},
                            status=status.HTTP_403_FORBIDDEN)

        companies = Company.objects.filter(owner=request.user.id)
        serializer = CompanySerializer(companies, many=True)
        if not companies.exists():
            return Response({"message": "No posts found for this user"}, status=200)

        return Response(serializer.data)


class CompanyDetailView(APIView):
    """
    View to retrieve, update, or delete a specific company.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        """
        Retrieve a specific company by ID.
        """
        try:
            company = Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            return Response({"message": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

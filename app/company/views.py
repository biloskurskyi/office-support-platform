from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, User

from .mixins import CompanyDetailMixin
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
            return Response({'detail': 'You do not have permission to get a companies.'},
                            status=status.HTTP_403_FORBIDDEN)

        companies = Company.objects.filter(owner=request.user.id)
        serializer = CompanySerializer(companies, many=True)
        if not companies.exists():
            return Response({"message": "No posts found for this user"}, status=200)

        return Response(serializer.data)


class CompanyDetailView(CompanyDetailMixin, APIView):
    """
    View to retrieve, update, or delete a specific company.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        """
        Retrieve a specific company by ID.
        """
        permission_response = self.check_permissions(request)
        if permission_response:
            return permission_response

        company = self.get_company_with_owner_check(request, pk)
        if isinstance(company, Response):
            return company

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        """
        Update a specific company by ID(partially).
        Only accessible by users with OWNER_USER type.
        """
        permission_response = self.check_permissions(request)
        if permission_response:
            return permission_response

        company = self.get_company_with_owner_check(request, pk)
        if isinstance(company, Response):
            return company

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific company by ID(fully).
        Only accessible by users with OWNER_USER type.
        """
        permission_response = self.check_permissions(request)
        if permission_response:
            return permission_response

        company = self.get_company_with_owner_check(request, pk)
        if isinstance(company, Response):
            return company

        serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific company by ID.
        """
        permission_response = self.check_permissions(request)
        if permission_response:
            return permission_response

        company = self.get_company_with_owner_check(request, pk)
        if isinstance(company, Response):
            return company

        company.delete()
        return Response({'message': 'Company deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

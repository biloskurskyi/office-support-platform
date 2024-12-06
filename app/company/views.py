from django.db.models import Q
from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, User
from user.serializers import UserSerializer

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


class CompanyManagersView(APIView):
    """
    API view that returns all unique managers for a specific company.
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, company_id):
        try:
            company = Company.objects.get(id=company_id)

            if company.owner != request.user:
                return Response({"error": "You are not the owner of this company."},
                                status=status.HTTP_403_FORBIDDEN)

            managers = User.objects.filter(
                Q(user_type=User.MANAGER_USER) & Q(company=company_id)
            )

            serializer = UserSerializer(managers, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Company.DoesNotExist:
            return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class VerifyCompanyOwnership(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, company_id):
        user = request.user
        company = Company.objects.filter(id=company_id, owner=user).first()
        if company:
            return Response({"isOwner": True})
        return Response({"isOwner": False}, status=403)

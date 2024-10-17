from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, User

from .serializers import UtilitySerializer


class UtilityView(APIView):
    def post(self, request):
        data = request.data
        office_id = data.get('office')

        if request.user.user_type not in [User.OWNER_USER, User.MANAGER_USER]:
            return Response({'detail': 'You do not have permission to get an office.'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            Office.objects.get(
                pk=office_id,
                company__owner=request.user
            ) if request.user.user_type == User.OWNER_USER else Office.objects.get(
                pk=office_id,
                manager=request.user
            )
        except Office.DoesNotExist:
            return Response({"error": "Office does not exist or you do not have access."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = UtilitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Utility created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    AIRequestLog,
    Challenge,
    ChallengeCategory,
    ChallengeInstance,
    Submission,
    Team,
    TeamMembership,
)
from .serializers import (
    AIRequestLogSerializer,
    ChallengeCategorySerializer,
    ChallengeInstanceSerializer,
    ChallengeSerializer,
    SubmissionSerializer,
    TeamMembershipSerializer,
    TeamSerializer,
)


class ChallengeCategoryViewSet(viewsets.ModelViewSet):
    queryset = ChallengeCategory.objects.all()
    serializer_class = ChallengeCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        team = serializer.save(owner=self.request.user)
        TeamMembership.objects.create(
            team=team, user=self.request.user, role=TeamMembership.Role.OWNER
        )

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def members(self, request, pk=None):
        team = self.get_object()
        serializer = TeamMembershipSerializer(team.memberships.select_related("user"), many=True)
        return Response(serializer.data)


class TeamMembershipViewSet(viewsets.ModelViewSet):
    queryset = TeamMembership.objects.select_related("team", "user")
    serializer_class = TeamMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChallengeInstanceViewSet(viewsets.ModelViewSet):
    queryset = ChallengeInstance.objects.select_related("challenge", "user", "team")
    serializer_class = ChallengeInstanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.select_related("challenge", "user", "team")
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        challenge = serializer.validated_data["challenge"]
        submitted_flag = serializer.validated_data["submitted_flag"]
        is_correct = submitted_flag == challenge.flag
        points_awarded = challenge.points if is_correct else 0
        serializer.save(
            user=self.request.user,
            is_correct=is_correct,
            points_awarded=points_awarded,
        )


class AIRequestLogViewSet(viewsets.ModelViewSet):
    queryset = AIRequestLog.objects.select_related("user", "team", "challenge")
    serializer_class = AIRequestLogSerializer
    permission_classes = [permissions.IsAdminUser]

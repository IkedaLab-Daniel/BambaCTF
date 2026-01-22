from datetime import timedelta

from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

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
    LoginSerializer,
    RegisterSerializer,
    SubmissionSerializer,
    TeamMembershipSerializer,
    TeamSerializer,
)

DEFAULT_INSTANCE_TTL_MINUTES = 60


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_id": user.id})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {"detail": "Invalid credentials."}, status=HTTP_401_UNAUTHORIZED
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_id": user.id})


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

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def start(self, request, pk=None):
        challenge = self.get_object()
        ttl_minutes = int(request.data.get("ttl_minutes", DEFAULT_INSTANCE_TTL_MINUTES))
        if ttl_minutes <= 0:
            return Response(
                {"detail": "ttl_minutes must be positive."},
                status=HTTP_400_BAD_REQUEST,
            )
        expires_at = timezone.now() + timedelta(minutes=ttl_minutes)
        endpoint_url = ""
        if challenge.slug == "hidden-comment":
            endpoint_url = request.build_absolute_uri(
                "/static/api/challenges/hidden-comment/index.html"
            )
        instance = ChallengeInstance.objects.create(
            challenge=challenge,
            user=request.user,
            team=request.user.team_memberships.first().team
            if request.user.team_memberships.exists()
            else None,
            status=ChallengeInstance.Status.PROVISIONING,
            expires_at=expires_at,
            endpoint_url=endpoint_url,
        )
        serializer = ChallengeInstanceSerializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        challenge = self.get_object()
        submitted_flag = request.data.get("submitted_flag")
        if not submitted_flag:
            return Response(
                {"detail": "submitted_flag is required."},
                status=HTTP_400_BAD_REQUEST,
            )
        is_correct = submitted_flag == challenge.flag
        points_awarded = challenge.points if is_correct else 0
        submission = Submission.objects.create(
            challenge=challenge,
            user=request.user,
            team=request.user.team_memberships.first().team
            if request.user.team_memberships.exists()
            else None,
            submitted_flag=submitted_flag,
            is_correct=is_correct,
            points_awarded=points_awarded,
        )
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data)


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

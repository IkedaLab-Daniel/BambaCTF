from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AIRequestLogViewSet,
    ChallengeCategoryViewSet,
    ChallengeInstanceViewSet,
    ChallengeViewSet,
    LoginView,
    RegisterView,
    SubmissionViewSet,
    TeamMembershipViewSet,
    TeamViewSet,
)

router = DefaultRouter()
router.register("categories", ChallengeCategoryViewSet, basename="category")
router.register("challenges", ChallengeViewSet, basename="challenge")
router.register("teams", TeamViewSet, basename="team")
router.register("memberships", TeamMembershipViewSet, basename="membership")
router.register("instances", ChallengeInstanceViewSet, basename="instance")
router.register("submissions", SubmissionViewSet, basename="submission")
router.register("ai-logs", AIRequestLogViewSet, basename="ai-log")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("", include(router.urls)),
]

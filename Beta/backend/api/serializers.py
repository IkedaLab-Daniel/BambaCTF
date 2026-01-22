from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    AIRequestLog,
    Challenge,
    ChallengeCategory,
    ChallengeInstance,
    Submission,
    Team,
    TeamMembership,
)

User = get_user_model()


class ChallengeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeCategory
        fields = ["id", "name", "slug", "created_at"]


class ChallengeSerializer(serializers.ModelSerializer):
    category = ChallengeCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ChallengeCategory.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Challenge
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "category",
            "category_id",
            "difficulty",
            "points",
            "flag",
            "is_active",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]
        extra_kwargs = {"flag": {"write_only": True}}


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "name", "owner", "created_at"]
        read_only_fields = ["owner", "created_at"]


class TeamMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembership
        fields = ["id", "team", "user", "role", "joined_at"]
        read_only_fields = ["joined_at"]


class ChallengeInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChallengeInstance
        fields = [
            "id",
            "challenge",
            "user",
            "team",
            "status",
            "started_at",
            "expires_at",
            "endpoint_url",
            "access_token",
            "orchestrator_ref",
        ]
        read_only_fields = ["user", "status", "started_at"]
        extra_kwargs = {"access_token": {"write_only": True}}


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "id",
            "challenge",
            "user",
            "team",
            "submitted_flag",
            "is_correct",
            "points_awarded",
            "created_at",
        ]
        read_only_fields = ["user", "is_correct", "points_awarded", "created_at"]


class AIRequestLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRequestLog
        fields = [
            "id",
            "user",
            "team",
            "challenge",
            "prompt",
            "response",
            "tokens_prompt",
            "tokens_completion",
            "policy_flags",
            "created_at",
        ]
        read_only_fields = ["created_at"]

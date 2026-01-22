from django.contrib import admin

from .models import (
    AIRequestLog,
    Challenge,
    ChallengeCategory,
    ChallengeInstance,
    Submission,
    Team,
    TeamMembership,
)

admin.site.register(ChallengeCategory)
admin.site.register(Challenge)
admin.site.register(Team)
admin.site.register(TeamMembership)
admin.site.register(ChallengeInstance)
admin.site.register(Submission)
admin.site.register(AIRequestLog)

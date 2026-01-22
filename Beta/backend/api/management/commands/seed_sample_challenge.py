from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import Challenge, ChallengeCategory


class Command(BaseCommand):
    help = "Create a sample web challenge with a hidden HTML comment flag."

    def handle(self, *args, **options):
        category, _ = ChallengeCategory.objects.get_or_create(
            name="Web", slug="web"
        )
        challenge, created = Challenge.objects.get_or_create(
            slug="hidden-comment",
            defaults={
                "title": "Hidden Comment",
                "description": "Find the flag hidden in the HTML source.",
                "category": category,
                "difficulty": Challenge.Difficulty.EASY,
                "points": 100,
                "flag": "flag{hidden_comment_intro}",
                "is_active": True,
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS("Sample challenge created."))
        else:
            self.stdout.write(self.style.WARNING("Sample challenge already exists."))

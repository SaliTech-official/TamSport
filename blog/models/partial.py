from django.db import models
from accounts.models import User
from django_jalali.db import models as jmodels
from parler.models import TranslatableModel, TranslatedFields
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from uuid import uuid4
from ..utils.blog_utils import get_localization_position


# class Comment(models.Model):
#     # relational fields
#     article = models.ForeignKey('Article', on_delete=models.CASCADE, related_name='comments')
#     author = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='comments', null=True)

#     # information fields
#     content = models.TextField(help_text="The content of the comment")
#     parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', help_text="Parent comment if this is a reply")

#     # date information
#     created_date = jmodels.jDateTimeField(auto_now_add=True, help_text="Date when the comment was created")
#     last_updated = jmodels.jDateTimeField(auto_now=True, help_text="Date when the comment was last modified")

#     class Meta:
#         ordering = ['created_date']
#         verbose_name = 'Comment'
#         verbose_name_plural = 'Comments'

#     def __str__(self):
#         return f"Comment by {self.author} on {self.article.title}"

#     def get_replies(self):
#         """Get all replies to this comment"""
#         return self.replies.filter(is_active=True)


class Player(TranslatableModel):
    # player information
    translations = TranslatedFields(
        name = models.CharField(max_length=250, help_text="The name of the player"),
    )
    image = models.ImageField(upload_to='players/', null=True, blank=True, help_text="Profile image of the player")
    number = models.IntegerField(null=True, blank=True, help_text="The jersey number of the player")

    # player position
    class Positions(models.TextChoices):
        DEFENDER = 'DEFENDER', 'مدافع'
        MIDFIELDER = 'MIDFIELDER', 'هافبک'
        FORWARD = 'FORWARD', 'مهاجم'
        GOALKEEPER = 'GOALKEEPER', 'دروازه‌بان'

    position = models.CharField(max_length=20, choices=Positions.choices, help_text="The position of the player on the field")

    # player stats
    goals = models.IntegerField(null=True, blank=True, help_text="The number of goals scored by the player")
    games = models.IntegerField(null=True, blank=True, help_text="The number of games played by the player")

    def __str__(self):
        return f"{self.name} - {self.position}"
    
    def get_name(self, language_code='fa'):
        if self.has_translation(language_code):
            return self.safe_translation_getter('name', language_code=language_code, default="")
        return ""

    def get_position(self, language_code="fa"):
        print(self.position, language_code)
        return get_localization_position(self.position, language_code)


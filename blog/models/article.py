from django.db import models
from accounts.models import Profile
from django.utils.text import slugify
from django_jalali.db import models as jmodels
from parler.models import TranslatableModel, TranslatedFields
from django.utils.translation import gettext_lazy as _
from uuid import uuid4
from .managers import ArticleManager



class Article(TranslatableModel):

    class Type(models.TextChoices):
        TEXT = 'TX', 'Text'
        SLIDE_SHOW = 'SS', 'Slide Show'
        VIDEO = 'VD', 'Video'


    class Status(models.TextChoices):
        DRAFT = 'DR', 'Draft'
        PUBLISHED = 'PB', 'Published'

    # Relationships
    author = models.ForeignKey(
        Profile,
        on_delete=models.SET_NULL,
        related_name='articles',
        null=True,
        help_text="The user who wrote this article"
    )


    team = models.ForeignKey("Team", on_delete=models.SET_NULL, related_name='articles', null=True)

    # Translated fields
    translations = TranslatedFields(
        title=models.CharField(_("title"), max_length=250),
        body=models.TextField(_("body")),
    )

    # Core fields
    slug = models.SlugField(max_length=250, unique=True, blank=True)

    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    
    type = models.CharField(
        max_length=2,
        choices=Type.choices,
        default=Type.TEXT,
    )

    # video url field for storing a video url for video type articles
    video_url = models.URLField(null=True, blank=True)

    # Scheduled publishing date and time
    scheduled_publish_at = models.DateTimeField(null=True, blank=True, help_text="Date and time when the article should be published automatically")
    scheduled_task_id = models.CharField(max_length=255, null=True, blank=True, help_text="Celery task ID for scheduled publication")

    # Timestamps
    created_date = jmodels.jDateTimeField(
        auto_now_add=True,
        help_text="Date when the article was created"
    )
    updated_date = jmodels.jDateTimeField(
        auto_now=True,
        help_text="Date when the article was last modified"
    )

    hits = models.ManyToManyField("IpAddress", through="MiddleArticleIpAddress", blank=True)
    likes = models.ManyToManyField("IpAddress", blank=True, related_name='liked_articles')

    # custom query set
    objects = ArticleManager()

    class Meta:
        ordering = ['-created_date']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

    def date_format(self, field, gregorian=False):
        """Returns date in Tehran-solar/Utc-gregorian timezone and date."""
        date = getattr(self, field)
        if gregorian:
            greg_date = date.togregorian()
            return greg_date.strftime('%Y-%m-%d at %H:%M:%S UTC')
        return date.strftime('%Y-%m-%d در %H:%M:%S')

    
    def get_title(self, language_code='fa'):
        if self.has_translation(language_code):
            return self.safe_translation_getter('title', language_code=language_code, default="")
        return ""

    def get_body(self, language_code='fa'):
        if self.has_translation(language_code):
            return self.safe_translation_getter('body', language_code=language_code, default="")
        return ""

    def __str__(self):
        return f"{self.get_title('en')}"

    def save(self, *args, **kwargs):
        title_en = self.get_title('en')
        slugified_title = slugify(title_en)
        if not self.slug or slugified_title != self.slug:
            self.slug = slugified_title or self.slug or uuid4()

        super().save(*args, **kwargs)


class IpAddress(models.Model):
    ip = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ip
    

class MiddleArticleIpAddress(models.Model):
    ipaddress = models.ForeignKey(IpAddress, on_delete=models.CASCADE, related_name='viewed_articles')
    article = models.ForeignKey("Article", on_delete=models.CASCADE, related_name='viewed_articles')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ipaddress} - {self.article}"


class Image(models.Model):
    image = models.ImageField(upload_to='article-images/')
    article = models.ManyToManyField(Article, related_name='article_images')

    def __str__(self) -> str:
        return f"{self.image}"
    

class Category(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=250),
        description=models.TextField(),
    )
    image=models.ImageField(upload_to='categories/', null=True, blank=True, max_length=850)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        title_en = self.safe_translation_getter("name", language_code='en', default="")
        slugified_title = slugify(title_en)
        if not self.slug or slugified_title != self.slug:
            self.slug = slugified_title or self.slug or uuid4()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class Team(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(_("name"), max_length=250),
    )
    image = models.ImageField(upload_to='team_pictures/', null=True, blank=True)
    slug = models.SlugField(max_length=250, unique=True, blank=True)

    def get_name(self, language_code='fa'):
        if self.has_translation(language_code):
            return self.safe_translation_getter('name', language_code=language_code, default="")
        return ""

    def save(self, *args, **kwargs):
        title_en = self.safe_translation_getter("name", language_code='en', default="")
        slugified_title = slugify(title_en)
        if not self.slug or slugified_title != self.slug:
            self.slug = slugified_title or self.slug or uuid4()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

from rest_framework import serializers
from blog.models.article import Article, Team, Image
from django.db.models import Count
from accounts.models import Profile
from django.utils.html import strip_tags
from django.utils import timezone
from datetime import datetime
# from celery import current_app


class BilingualArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article model with language selection support
    """
    title = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()
    hits_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    updated_date = serializers.SerializerMethodField()
    created_date = serializers.SerializerMethodField()
    # scheduled_publish_at = serializers.DateTimeField(required=False, allow_null=True)
    # remaining_time = serializers.SerializerMethodField()
    title_fa = serializers.SerializerMethodField()
    title_en = serializers.SerializerMethodField()
    body_fa = serializers.SerializerMethodField()
    body_en = serializers.SerializerMethodField()
    video_url = serializers.URLField(required=False, allow_null=True)
    main_image = serializers.SerializerMethodField()
    slideshow_images = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'title_fa', 'title_en', 'body_fa', 'body_en', 'status', 'type', 'team', 'team_id',
                    'hits_count', 'likes_count', 'updated_date', 'created_date', 'video_url', 'main_image', 'slideshow_images']
    
    def get_title(self, obj):
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return title in the requested language
        if search_language == 'en':
            # Try to get English translation, fallback to any available translation
            if obj.has_translation('en'):
                return obj.safe_translation_getter('title', language_code='en', default="")
            return obj.safe_translation_getter('title', any_language=True)
        else:
            # Default to Persian
            if obj.has_translation('fa'):
                return obj.safe_translation_getter('title', language_code='fa', default="")
            return obj.safe_translation_getter('title', any_language=True)
    
    def get_title_fa(self, obj):
        return obj.get_title(language_code='fa')
    
    def get_title_en(self, obj):
        return obj.get_title(language_code='en')
    
    def get_body_fa(self, obj):
        return obj.get_body(language_code='fa')
    
    def get_body_en(self, obj):
        return obj.get_body(language_code='en')
    
    def get_team(self, obj):
        if not obj.team:
            return None
        
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return team name in the requested language
        if search_language == 'en':
            if obj.team.has_translation('en'):
                return obj.team.safe_translation_getter('name', language_code='en', default="")
            return obj.team.safe_translation_getter('name', any_language=True)
        else:
            if obj.team.has_translation('fa'):
                return obj.team.safe_translation_getter('name', language_code='fa', default="")
            return obj.team.safe_translation_getter('name', any_language=True)
    
    def get_team_id(self, obj):
        return obj.team.id if obj.team else None
    
    def get_hits_count(self, obj):
        return obj.hits.count()
    
    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_updated_date(self, obj):
        return obj.updated_date.strftime('%Y-%m-%d')
    
    def get_created_date(self, obj):
        return obj.created_date.strftime('%Y-%m-%d')
    
    # def get_remaining_time(self, obj):
    #     """
    #     Calculate and return the remaining time until scheduled publication
    #     """
    #     if not obj.scheduled_publish_at or obj.status != Article.Status.DRAFT:
    #         return None
        
    #     now = timezone.now()
    #     if obj.scheduled_publish_at <= now:
    #         return "0"
        
    #     # Calculate the time difference
    #     time_diff = obj.scheduled_publish_at - now
    #     days = time_diff.days
    #     hours, remainder = divmod(time_diff.seconds, 3600)
    #     minutes, _ = divmod(remainder, 60)
        
    #     if days > 0:
    #         return f"{days} روز و {hours} ساعت و {minutes} دقیقه"
    #     elif hours > 0:
    #         return f"{hours} ساعت و {minutes} دقیقه"
    #     else:
    #         return f"{minutes} دقیقه"
    
    def get_main_image(self, obj):
        """Get the main image URL for the article"""
        images = obj.article_images.all()
        if images.exists():
            return images.first().image.url
        return None
    
    def get_slideshow_images(self, obj):
        """Get all slideshow images URLs and IDs for the article"""
        # Ensure 'request' is in context for `build_absolute_uri`
        if 'request' not in self.context:
            return [] # Or handle error appropriately

        images = obj.article_images.all()
        if images.count() > 0:
            main_image_url = None
            # Assuming the first image linked to the article is the main image
            # This logic needs to be robust. If main image is explicitly stored, use that.
            # Otherwise, assuming `article_images` first element is main_image.
            first_linked_image = obj.article_images.first()
            if first_linked_image:
                main_image_url = self.context['request'].build_absolute_uri(first_linked_image.image.url)

            slideshow_data = []
            for img_obj in images:
                img_url = self.context['request'].build_absolute_uri(img_obj.image.url)
                # Ensure we don't include the main image in the slideshow images list if it's distinct
                if img_url != main_image_url:
                    slideshow_data.append({
                        'id': img_obj.id,
                        'url': img_url
                    })
            return slideshow_data
        return []


class CreateArticleSerializer(serializers.Serializer):
    """
    Serializer for creating a new Article with bilingual support
    """
    title_fa = serializers.CharField(max_length=250, required=True)
    title_en = serializers.CharField(max_length=250, required=True)
    body_fa = serializers.CharField(required=True)
    body_en = serializers.CharField(required=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), required=True)
    status = serializers.ChoiceField(choices=Article.Status.choices, required=True)
    type = serializers.ChoiceField(choices=Article.Type.choices, required=True)
    video_url = serializers.URLField(required=False, allow_blank=True)
    author = serializers.IntegerField(required=False)  # Will be set in the view
    main_image = serializers.ImageField(required=True)  # Main image for all article types
    slideshow_image_count = serializers.IntegerField(required=False, default=0)  # Number of slideshow images
    # scheduled_publish_at = serializers.DateTimeField(required=False, allow_null=True)  # Scheduled publishing time
    
    def validate(self, data):
        """
        Validate that both language titles are unique and bodies are not empty.
        Also validate the scheduled_publish_at date if provided.
        """
        # Check if Persian title exists
        fa_title_exists = False
        for article in Article.objects.all():
            if article.has_translation('fa') and article.safe_translation_getter('title', language_code='fa') == data['title_fa']:
                fa_title_exists = True
                break
        
        # Check if English title exists
        en_title_exists = False
        for article in Article.objects.all():
            if article.has_translation('en') and article.safe_translation_getter('title', language_code='en') == data['title_en']:
                en_title_exists = True
                break
        
        # Check if content is empty (strip HTML tags for comparison)
        if not strip_tags(data['body_fa']).strip():
            raise serializers.ValidationError({"body_fa": "متن مقاله فارسی نمی‌تواند خالی باشد."})
            
        if not strip_tags(data['body_en']).strip():
            raise serializers.ValidationError({"body_en": "متن مقاله انگلیسی نمی‌تواند خالی باشد."})
                
        if fa_title_exists:
            raise serializers.ValidationError({"title_fa": "مقاله‌ای با این عنوان فارسی در سیستم موجود است."})
        
        if en_title_exists:
            raise serializers.ValidationError({"title_en": "مقاله‌ای با این عنوان انگلیسی در سیستم موجود است."})
        
        # Validate slideshow images for slideshow type articles
        if data['type'] == Article.Type.SLIDE_SHOW and data.get('slideshow_image_count', 0) < 1:
            raise serializers.ValidationError({"slideshow_images": "لطفا حداقل یک تصویر برای اسلایدشو انتخاب کنید."})
        
        # # Validate scheduled_publish_at if provided
        # if data.get('scheduled_publish_at') and data.get('status') == Article.Status.DRAFT:
        #     # Ensure the scheduled date is in the future
        #     if data['scheduled_publish_at'] <= timezone.now():
        #         raise serializers.ValidationError({"scheduled_publish_at": "زمان انتشار باید در آینده باشد."})
            
        return data
    
    def create(self, validated_data):
        """
        Create a new article with translations
        """
        # Extract translations
        title_fa = validated_data.pop('title_fa')
        title_en = validated_data.pop('title_en')
        body_fa = validated_data.pop('body_fa')
        body_en = validated_data.pop('body_en')
        
        # Extract images
        main_image = validated_data.pop('main_image')
        slideshow_image_count = validated_data.pop('slideshow_image_count', 0)
        
        # # Extract scheduled_publish_at if present
        # scheduled_publish_at = validated_data.pop('scheduled_publish_at', None)
        
        # Create the article instance
        article = Article(
            team=validated_data.get('team'),
            status=validated_data.get('status'),
            type=validated_data.get('type'),
            video_url=validated_data.get('video_url', ''),
            author=Profile.objects.get(user=self.context['request'].user),
            # scheduled_publish_at=scheduled_publish_at
        )
        
        # Save without translations first
        article.save()
        
        # Set Persian translations
        article.set_current_language('fa')
        article.title = title_fa
        article.body = body_fa
        article.save()
        
        # Set English translations
        article.set_current_language('en')
        article.title = title_en
        article.body = body_en
        article.save()
        
        # Save main image
        main_image_obj = Image.objects.create(image=main_image)
        main_image_obj.article.add(article)
        
        # Extract and save slideshow images if present
        slideshow_images = []
        for i in range(slideshow_image_count):
            if f'slideshow_image_{i}' in self.context['request'].FILES:
                slideshow_image = self.context['request'].FILES[f'slideshow_image_{i}']
                slideshow_image_obj = Image.objects.create(image=slideshow_image)
                slideshow_image_obj.article.add(article)
                slideshow_images.append(slideshow_image_obj)
        
        # # Schedule publication if needed
        # if scheduled_publish_at and article.status == Article.Status.DRAFT:
        #     from blog.tasks import publish_scheduled_article
        #     result = publish_scheduled_article.apply_async(
        #         args=[article.id],
        #         eta=scheduled_publish_at
        #     )
        #     article.scheduled_task_id = result.id
        #     article.save()
        
        return article


class ArticleUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating an existing Article with bilingual support
    """
    title_fa = serializers.CharField(max_length=250, required=False)
    title_en = serializers.CharField(max_length=250, required=False)
    body_fa = serializers.CharField(required=False)
    body_en = serializers.CharField(required=False)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), required=False)
    status = serializers.ChoiceField(choices=Article.Status.choices, required=False)
    type = serializers.ChoiceField(choices=Article.Type.choices, required=False)
    video_url = serializers.URLField(required=False, allow_blank=True)
    main_image = serializers.ImageField(required=False)
    slideshow_image_count = serializers.IntegerField(required=False, default=0)
    deleted_image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True
    )
    # scheduled_publish_at = serializers.DateTimeField(required=False, allow_null=True)
    
    def validate(self, data):
        """
        Validate that both language titles are unique (except for this article)
        and bodies are not empty if provided.
        Also validate the scheduled_publish_at date if provided.
        """
        instance = self.context.get('article_instance')
        
        # Check if instance exists
        if not instance:
            raise serializers.ValidationError({"error": "مقاله مورد نظر یافت نشد."})
        
        # Check if Persian title exists in other articles
        if 'title_fa' in data:
            fa_title_exists = False
            for article in Article.objects.exclude(id=instance.id):
                if article.has_translation('fa') and article.safe_translation_getter('title', language_code='fa') == data['title_fa']:
                    fa_title_exists = True
                    break
            
            if fa_title_exists:
                raise serializers.ValidationError({"title_fa": "مقاله‌ای با این عنوان فارسی در سیستم موجود است."})
            
            # Check if content is empty (strip HTML tags for comparison)
            if not strip_tags(data['title_fa']).strip():
                raise serializers.ValidationError({"title_fa": "عنوان مقاله فارسی نمی‌تواند خالی باشد."})
        
        # Check if English title exists in other articles
        if 'title_en' in data:
            en_title_exists = False
            for article in Article.objects.exclude(id=instance.id):
                if article.has_translation('en') and article.safe_translation_getter('title', language_code='en') == data['title_en']:
                    en_title_exists = True
                    break
            
            if en_title_exists:
                raise serializers.ValidationError({"title_en": "مقاله‌ای با این عنوان انگلیسی در سیستم موجود است."})
            
            # Check if content is empty (strip HTML tags for comparison)
            if not strip_tags(data['title_en']).strip():
                raise serializers.ValidationError({"title_en": "عنوان مقاله انگلیسی نمی‌تواند خالی باشد."})
        
        # Check if body content is empty if provided
        if 'body_fa' in data and not strip_tags(data['body_fa']).strip():
            raise serializers.ValidationError({"body_fa": "متن مقاله فارسی نمی‌تواند خالی باشد."})
            
        if 'body_en' in data and not strip_tags(data['body_en']).strip():
            raise serializers.ValidationError({"body_en": "متن مقاله انگلیسی نمی‌تواند خالی باشد."})
        
        # Validate slideshow images for slideshow type articles
        article_type = data.get('type', self.context.get('article_instance').type)
        if article_type == Article.Type.SLIDE_SHOW:
            # Get existing slideshow images that are not marked for deletion
            existing_slideshow_images_kept = self.context.get('article_instance').article_images.exclude(
                id__in=data.get('deleted_image_ids', [])
            )
            # Filter out the main image from `existing_slideshow_images_kept` if it's there
            # Assuming main image is the first one.
            main_image_obj = self.context.get('article_instance').article_images.first()
            if main_image_obj:
                existing_slideshow_images_kept = existing_slideshow_images_kept.exclude(id=main_image_obj.id)
                
            new_slideshow_image_count = data.get('slideshow_image_count', 0)
            
            if new_slideshow_image_count == 0 and existing_slideshow_images_kept.count() == 0:
                raise serializers.ValidationError({"slideshow_images": "لطفا حداقل یک تصویر برای اسلایدشو انتخاب کنید."})
        
        # # Removed scheduled_publish_at validation from here, it will be handled in update method
            
        return data
    
    def update(self, instance, validated_data):
        print("*" * 20)
        print("validated_data: {}".format(validated_data))
        print("*" * 20)
        """
        Update an existing article with translations
        """
        # Update basic fields if provided
        if 'team' in validated_data:
            instance.team = validated_data.get('team')
        
        if 'status' in validated_data:
            instance.status = validated_data.get('status')
        
        if 'type' in validated_data:
            instance.type = validated_data.get('type')
        
        if 'video_url' in validated_data:
            instance.video_url = validated_data.get('video_url', '')
        
        # # Handle scheduled_publish_at and schedule Celery task
        # scheduled_publish_at_changed = False
        # if 'scheduled_publish_at' in validated_data:
        #     scheduled_publish_at = validated_data.get('scheduled_publish_at')
        #     # If scheduled_publish_at is provided, check if it's in the future and schedule the task
        #     if scheduled_publish_at and (validated_data.get('status', instance.status) == Article.Status.DRAFT):
        #         if scheduled_publish_at <= timezone.now():
        #             raise serializers.ValidationError({"scheduled_publish_at": "زمان انتشار باید در آینده باشد."})
        #         # If scheduled_publish_at changed or was not set before, revoke previous task
        #         if instance.scheduled_task_id:
        #             try:
        #                 current_app.control.revoke(instance.scheduled_task_id, terminate=True)
        #             except Exception:
        #                 pass
        #         instance.scheduled_publish_at = scheduled_publish_at
        #         # Schedule new task
        #         from blog.tasks import publish_scheduled_article
        #         result = publish_scheduled_article.apply_async(
        #             args=[instance.id],
        #             eta=scheduled_publish_at
        #         )
        #         instance.scheduled_task_id = result.id
        #         scheduled_publish_at_changed = True
        #     else:
        #         # If scheduled_publish_at is removed or status changed, revoke previous task
        #         if instance.scheduled_task_id:
        #             try:
        #                 current_app.control.revoke(instance.scheduled_task_id, terminate=True)
        #             except Exception:
        #                 pass
        #             instance.scheduled_task_id = None
        #         instance.scheduled_publish_at = None
        # elif instance.scheduled_publish_at and (validated_data.get('status', instance.status) != Article.Status.DRAFT):
        #     # If existing scheduled_publish_at is present but status changed from DRAFT, clear it and revoke
        #     if instance.scheduled_task_id:
        #         try:
        #             current_app.control.revoke(instance.scheduled_task_id, terminate=True)
        #         except Exception:
        #             pass
        #         instance.scheduled_task_id = None
        #     instance.scheduled_publish_at = None
        
        # Update translations if provided
        if 'title_fa' in validated_data or 'body_fa' in validated_data:
            instance.set_current_language('fa')
            if 'title_fa' in validated_data:
                instance.title = validated_data.get('title_fa')
            if 'body_fa' in validated_data:
                instance.body = validated_data.get('body_fa')
            instance.save()
        
        if 'title_en' in validated_data or 'body_en' in validated_data:
            instance.set_current_language('en')
            if 'title_en' in validated_data:
                instance.title = validated_data.get('title_en')
            if 'body_en' in validated_data:
                instance.body = validated_data.get('body_en')
            instance.save()
        
        # Update main image if provided
        if 'main_image' in validated_data:
            main_image = validated_data.get('main_image')
            # Get the first image (main image) or create a new one
            main_image_obj = instance.article_images.first()
            if main_image_obj:
                # Update existing main image
                main_image_obj.image = main_image
                main_image_obj.save()
            else:
                # Create new main image
                main_image_obj = Image.objects.create(image=main_image)
                main_image_obj.article.add(instance)
        
        # Handle deleted slideshow images
        deleted_image_ids = validated_data.pop('deleted_image_ids', [])
        for img_id in deleted_image_ids:
            try:
                image_obj = Image.objects.get(id=img_id)
                instance.article_images.remove(image_obj) # Remove the ManyToMany relationship
                # Optionally, delete the Image object itself if it's no longer linked to any article
                if image_obj.article.count() == 0:
                    image_obj.delete() # This deletes the file from storage
            except Image.DoesNotExist:
                pass # Image already deleted or never existed

        # Add new slideshow images (files sent via request.FILES)
        new_slideshow_image_count = validated_data.get('slideshow_image_count', 0)
        for i in range(new_slideshow_image_count):
            file_key = f'slideshow_image_{i}'
            if file_key in self.context['request'].FILES:
                slideshow_image_file = self.context['request'].FILES[file_key]
                slideshow_image_obj = Image.objects.create(image=slideshow_image_file)
                slideshow_image_obj.article.add(instance)
        
        # Save the instance
        instance.save()
        
        return instance

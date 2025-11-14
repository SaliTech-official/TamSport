from rest_framework import serializers
from blog.models.partial import Player
from blog.models.article import Team



class BilingualPlayerSerializer(serializers.ModelSerializer):
    """
    Serializer for Player model with language selection support
    """
    name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    
    class Meta:
        model = Player
        fields = ['id', 'name', 'image', 'number', 'position', 'goals', 'games']
    
    def get_name(self, obj):
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return name in the requested language
        if search_language == 'en':
            # Try to get English translation, fallback to any available translation
            if obj.has_translation('en'):
                return obj.safe_translation_getter('name', language_code='en', default="")
            return obj.safe_translation_getter('name', any_language=True)
        else:
            # Default to Persian
            if obj.has_translation('fa'):
                return obj.safe_translation_getter('name', language_code='fa', default="")
            return obj.safe_translation_getter('name', any_language=True)
    
    def get_position(self, obj):
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return position in the requested language
        for choice_key, choice_value in Player.Positions.choices:
            if choice_key == obj.position:
                if search_language == 'en':
                    # Return English position (the choice key)
                    return choice_key
                else:
                    # Return Persian position (the choice display value)
                    return choice_value
        
        # Fallback to the raw position value
        return obj.position


class BilingualTeamSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = Team
        fields = ['id', 'name', 'image', 'slug']
    def get_name(self, obj):
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        if search_language == 'en':
            if obj.has_translation('en'):
                return obj.safe_translation_getter('name', language_code='en', default="")
            return obj.safe_translation_getter('name', any_language=True)
        else:
            if obj.has_translation('fa'):
                return obj.safe_translation_getter('name', language_code='fa', default="")
            return obj.safe_translation_getter('name', any_language=True)


class PlayerCreateSerializer(serializers.Serializer):
    """
    Serializer for creating a new Player with bilingual support
    """
    name_fa = serializers.CharField(max_length=250, required=True)
    name_en = serializers.CharField(max_length=250, required=True)
    image = serializers.ImageField(required=True)
    number = serializers.IntegerField(required=True)
    position = serializers.ChoiceField(choices=Player.Positions.choices, required=True)
    goals = serializers.IntegerField(required=True)
    games = serializers.IntegerField(required=True)
    
    def validate_number(self, value):
        """
        Validate that player number is between 1 and 99 inclusive.
        """
        if value < 1 or value > 99:
            raise serializers.ValidationError("Player number must be between 1 and 99.")
        return value
    
    def validate(self, data):
        """
        Validate that both language names are unique
        """
        # Check if Persian name exists
        fa_exists = False
        for player in Player.objects.all():
            if player.has_translation('fa') and player.safe_translation_getter('name', language_code='fa') == data['name_fa']:
                fa_exists = True
                break
        
        # Check if English name exists
        en_exists = False
        for player in Player.objects.all():
            if player.has_translation('en') and player.safe_translation_getter('name', language_code='en') == data['name_en']:
                en_exists = True
                break
                
        if fa_exists:
            raise serializers.ValidationError({"name_fa": "بازیکنی با این نام فارسی در سیستم موجود است."})
        
        if en_exists:
            raise serializers.ValidationError({"name_en": "بازیکنی با این نام انگلیسی در سیستم موجود است."})
            
        return data
    
    def create(self, validated_data):
        """
        Create a new player with translations
        """
        # Extract name translations
        name_fa = validated_data.pop('name_fa')
        name_en = validated_data.pop('name_en')
        
        # Create the player instance
        player = Player(
            image=validated_data.get('image'),
            number=validated_data.get('number'),
            position=validated_data.get('position'),
            goals=validated_data.get('goals'),
            games=validated_data.get('games')
        )
        
        # Save without translations first
        player.save()
        
        # Set translations
        player.set_current_language('fa')
        player.name = name_fa
        player.save()
        
        player.set_current_language('en')
        player.name = name_en
        player.save()
        
        return player


class PlayerDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving detailed player information including translations
    """
    name_fa = serializers.SerializerMethodField()
    name_en = serializers.SerializerMethodField()
    
    class Meta:
        model = Player
        fields = ['id', 'name_fa', 'name_en', 'image', 'number', 'position', 'goals', 'games']
    
    def get_name_fa(self, obj):
        if obj.has_translation('fa'):
            return obj.safe_translation_getter('name', language_code='fa', default="")
        return obj.safe_translation_getter('name', any_language=True)
    
    def get_name_en(self, obj):
        if obj.has_translation('en'):
            return obj.safe_translation_getter('name', language_code='en', default="")
        return obj.safe_translation_getter('name', any_language=True)


class PlayerUpdateSerializer(PlayerCreateSerializer):
    """
    Serializer for updating an existing Player with bilingual support
    """
    image = serializers.ImageField(required=False)  # Image is optional during update
        
    def validate(self, data):
        """
        Override validate to check name uniqueness excluding the current instance
        """
        # Get the current instance being updated
        instance = self.context.get('player_instance')
        
        # Check if Persian name exists for other players
        fa_exists = False
        if 'name_fa' in data:
            for player in Player.objects.exclude(id=instance.id):
                if player.has_translation('fa') and player.safe_translation_getter('name', language_code='fa') == data['name_fa']:
                    fa_exists = True
                    break
        
        # Check if English name exists for other players
        en_exists = False
        if 'name_en' in data:
            for player in Player.objects.exclude(id=instance.id):
                if player.has_translation('en') and player.safe_translation_getter('name', language_code='en') == data['name_en']:
                    en_exists = True
                    break
                
        if fa_exists:
            raise serializers.ValidationError({"name_fa": "بازیکنی با این نام فارسی در سیستم موجود است."})
        
        if en_exists:
            raise serializers.ValidationError({"name_en": "بازیکنی با این نام انگلیسی در سیستم موجود است."})
            
        return data
    
    def update(self, instance, validated_data):
        """
        Update an existing player with translations
        """
        # Extract name translations if provided
        name_fa = validated_data.pop('name_fa', None)
        name_en = validated_data.pop('name_en', None)
        
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Save without translations first
        instance.save()
        
        # Update translations if provided
        if name_fa:
            instance.set_current_language('fa')
            instance.name = name_fa
            instance.save()
        
        if name_en:
            instance.set_current_language('en')
            instance.name = name_en
            instance.save()
        
        return instance


class TeamCreateSerializer(serializers.Serializer):
    name_fa = serializers.CharField(max_length=250, required=True)
    name_en = serializers.CharField(max_length=250, required=True)
    image = serializers.ImageField(required=True)

    def validate(self, data):
        from blog.models.article import Team
        # Check if Persian name exists
        fa_exists = False
        for team in Team.objects.all():
            if team.has_translation('fa') and team.safe_translation_getter('name', language_code='fa') == data['name_fa']:
                fa_exists = True
                break
        # Check if English name exists
        en_exists = False
        for team in Team.objects.all():
            if team.has_translation('en') and team.safe_translation_getter('name', language_code='en') == data['name_en']:
                en_exists = True
                break
        if fa_exists:
            raise serializers.ValidationError({"name_fa": "تیمی با این نام فارسی در سیستم موجود است."})
        if en_exists:
            raise serializers.ValidationError({"name_en": "تیمی با این نام انگلیسی در سیستم موجود است."})
        return data

    def create(self, validated_data):
        from blog.models.article import Team
        name_fa = validated_data.pop('name_fa')
        name_en = validated_data.pop('name_en')
        team = Team(
            image=validated_data.get('image')
        )
        team.save()
        team.set_current_language('fa')
        team.name = name_fa
        team.save()
        team.set_current_language('en')
        team.name = name_en
        team.save()
        return team


class TeamDetailSerializer(serializers.ModelSerializer):
    name_fa = serializers.SerializerMethodField()
    name_en = serializers.SerializerMethodField()
    class Meta:
        model = Team
        fields = ['id', 'name_fa', 'name_en', 'image']
    def get_name_fa(self, obj):
        if obj.has_translation('fa'):
            return obj.safe_translation_getter('name', language_code='fa', default="")
        return obj.safe_translation_getter('name', any_language=True)
    def get_name_en(self, obj):
        if obj.has_translation('en'):
            return obj.safe_translation_getter('name', language_code='en', default="")
        return obj.safe_translation_getter('name', any_language=True)


class TeamUpdateSerializer(TeamCreateSerializer):
    """
    Serializer for updating an existing Team with bilingual support
    """
    image = serializers.ImageField(required=False)  # Image is optional during update

    def validate(self, data):
        from blog.models.article import Team
        # Get the current instance being updated
        instance = self.context.get('team_instance')
        # Check if Persian name exists for other teams
        fa_exists = False
        if 'name_fa' in data:
            for team in Team.objects.exclude(id=instance.id):
                if team.has_translation('fa') and team.safe_translation_getter('name', language_code='fa') == data['name_fa']:
                    fa_exists = True
                    break
        # Check if English name exists for other teams
        en_exists = False
        if 'name_en' in data:
            for team in Team.objects.exclude(id=instance.id):
                if team.has_translation('en') and team.safe_translation_getter('name', language_code='en') == data['name_en']:
                    en_exists = True
                    break
        if fa_exists:
            raise serializers.ValidationError({"name_fa": "تیمی با این نام فارسی در سیستم موجود است."})
        if en_exists:
            raise serializers.ValidationError({"name_en": "تیمی با این نام انگلیسی در سیستم موجود است."})
        return data

    def update(self, instance, validated_data):
        # Extract name translations if provided
        name_fa = validated_data.pop('name_fa', None)
        name_en = validated_data.pop('name_en', None)
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # Save without translations first
        instance.save()
        # Update translations if provided
        if name_fa:
            instance.set_current_language('fa')
            instance.name = name_fa
            instance.save()
        if name_en:
            instance.set_current_language('en')
            instance.name = name_en
            instance.save()
        return instance





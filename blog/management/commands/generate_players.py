import random
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from faker import Faker
from blog.models import Player
from django.utils.text import slugify


class Command(BaseCommand):
    help = 'Generates dummy players'

    def handle(self, *args, **kwargs):
        Player.objects.all().delete()
        fake_en = Faker('en_US')
        fake_fa = Faker('fa_IR')

        player_positions = [choice[0] for choice in Player.Positions.choices]
        
        self.stdout.write(self.style.SUCCESS('Generating 25 players...'))

        for _ in range(25):
            en_name = fake_en.name()
            fa_name = fake_fa.name()

            player = Player(
                position=random.choice(player_positions),
                number=random.randint(1, 99),
                goals=random.randint(0, 50),
                games=random.randint(5, 150)
            )
            
            # Set translations
            player.set_current_language('en')
            player.name = en_name
            
            player.set_current_language('fa')
            player.name = fa_name

            # Handle image
            dummy_content = b'dummy image data'
            image_file = ContentFile(dummy_content, name=f'{slugify(en_name)}.jpg')
            player.image.save(image_file.name, image_file, save=False)

            player.save()
            
            self.stdout.write(self.style.SUCCESS(f'Successfully created player: {en_name} / {fa_name}'))

        self.stdout.write(self.style.SUCCESS('Finished generating players.')) 
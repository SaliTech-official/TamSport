import random
from django.core.management.base import BaseCommand
from ...models import *


class Command(BaseCommand):
    """
    deprecated for now
    """
    help = 'Generates dummy image for Article, Player and Team model'



    def handle(self, *args, **kwargs):
        
        self.stdout.write(self.style.SUCCESS(f'Successfully image assinged'))

        self.stdout.write(self.style.SUCCESS('Finished assining image.')) 
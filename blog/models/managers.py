from django.db import models
from parler.managers import TranslatableManager

class ArticleManager(TranslatableManager):

    def accepted(self):
        return self.filter(status='AC')
    

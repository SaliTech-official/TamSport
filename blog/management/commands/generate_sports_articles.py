from django.core.management.base import BaseCommand
from blog.models import Article, Category, Image
from django.utils.text import slugify
from faker import Faker
import random
from django.utils.translation import activate
from accounts.models import User, Profile
from django.core.files.base import ContentFile
from ...models import Team


# Create Faker instances for both languages
fake_en = Faker('en')
fake_fa = Faker('fa_IR')

class Command(BaseCommand):
    help = 'Generates 100 sports news articles'

    def handle(self, *args, **kwargs):
        Article.objects.all().delete()
        # Define categories with their translations
        category_data = {
            'youth-team': {
                'en': {
                    'name': 'Youth Team',
                    'description': 'News and updates about the youth team'
                },
                'fa': {
                    'name': 'تیم جوانان',
                    'description': 'اخبار و به‌روزرسانی‌های تیم جوانان'
                }
            },
            'women-team': {
                'en': {
                    'name': 'Women Team',
                    'description': 'News and updates about the women team'
                },
                'fa': {
                    'name': 'تیم بانوان',
                    'description': 'اخبار و به‌روزرسانی‌های تیم بانوان'
                }
            },
            'first-team': {
                'en': {
                    'name': 'First Team',
                    'description': 'News and updates about the first team'
                },
                'fa': {
                    'name': 'تیم اصلی',
                    'description': 'اخبار و به‌روزرسانی‌های تیم اصلی'
                }
            }
        }

        # Get or create categories
        categories = []
        for slug, translations in category_data.items():
            try:
                category = Category.objects.get(slug=slug)
                self.stdout.write(
                    self.style.SUCCESS(f'Using existing category: {category.name}')
                )
            except Category.DoesNotExist:
                category = Category(slug=slug)
                
                # Set English translation
                category.set_current_language('en')
                category.name = translations['en']['name']
                category.description = translations['en']['description']
                
                # Set Persian translation
                category.set_current_language('fa')
                category.name = translations['fa']['name']
                category.description = translations['fa']['description']
                
                # Create a simple dummy image file for category
                dummy_content = b'dummy image data for category'
                image_file = ContentFile(dummy_content, name=f'{slug}.jpg')
                category.image.save(image_file.name, image_file, save=False)
                
                category.save()
                self.stdout.write(
                    self.style.SUCCESS(f'Created new category: {translations["en"]["name"]}')
                )
            
            categories.append(category)



        # List of sports-related topics in both languages
        sports_topics = {
            'en': [
                'Football', 'Basketball', 'Tennis', 'Swimming', 'Athletics',
                'Volleyball', 'Handball', 'Rugby', 'Cricket', 'Baseball',
                'Golf', 'Boxing', 'MMA', 'Formula 1', 'Cycling'
            ],
            'fa': [
                'فوتبال', 'بسکتبال', 'تنیس', 'شنا', 'دو و میدانی',
                'والیبال', 'هندبال', 'راگبی', 'کریکت', 'بیسبال',
                'گلف', 'بوکس', 'ام‌ام‌ای', 'فرمول یک', 'دوچرخه‌سواری'
            ]   
        }

        # Generate 100 articles
        for i in range(100):
            # Randomly select article type
            article_type = random.choice(list(Article.Type.choices))[0]
            
            # Generate title and body in both languages
            sport_en = random.choice(sports_topics['en'])
            sport_fa = sports_topics['fa'][sports_topics['en'].index(sport_en)]
            
            title_en = f"{sport_en} News: {fake_en.sentence()}"
            title_fa = f"اخبار {sport_fa}: {fake_fa.sentence()}"
            
            body_en = fake_en.paragraph(nb_sentences=25)
            body_fa = fake_fa.paragraph(nb_sentences=25)
            
            slug = slugify(title_en)
            
            # Create article instance but don't save yet
            article = Article(
                type=article_type,
                status="PB",
                video_url=fake_en.url() if article_type == Article.Type.VIDEO else None,
                slug=slug
            )
            
            # Set English translation
            article.set_current_language('en')
            article.title = title_en
            article.body = body_en
            
            # Set Persian translation
            article.set_current_language('fa')
            article.title = title_fa
            article.body = body_fa

            user = None
            if not User.objects.filter(phone_number='09133333333').exists():
                user = User.objects.create_superuser(phone_number='09133333333', password='1234')
            else:
                user = User.objects.get(phone_number='09133333333')
            
            # Get or create profile for the user
            profile = Profile.objects.get_or_create(user=user)[0]
            article.author = profile
            
            random_team = random.choice(Team.objects.all())
            article.team = random_team
            # Save the article first
            article.save()
            
            # Comment out category assignment as requested
            # random_category = random.choice(categories)
            # article.category.add(random_category)

            # Now add the Team after article is saved
            

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created article:\n'
                    f'EN: "{title_en}"\n'
                    f'FA: "{title_fa}"\n'
                    f'Team: "{random_team.name}"'
                )
            )
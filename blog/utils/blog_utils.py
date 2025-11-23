from datetime import datetime
from django.utils import timezone
from humanize import naturaltime
from django.utils.translation import get_language


def persian_digits(number: int) -> str:
    """Convert English digits to Persian digits"""
    persian_digits_map = {
        '0': '۰',
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹'
    }
    return ''.join(persian_digits_map[digit] for digit in str(number))


def get_persian_date(date_obj):
    """Persian style: 25 اسفند 1402"""
    if hasattr(date_obj, 'created_date'):
        months = {
            1: 'فروردین',
            2: 'اردیبهشت', 
            3: 'خرداد',
            4: 'تیر',
            5: 'مرداد',
            6: 'شهریور',
            7: 'مهر',
            8: 'آبان',
            9: 'آذر',
            10: 'دی',
            11: 'بهمن',
            12: 'اسفند'
        }
        day = date_obj.created_date.day
        month = months[date_obj.created_date.month]
        year = date_obj.created_date.year
        return f"{persian_digits(day)} {month} {persian_digits(year)}"
    return None


def filter_vocabulary(text: str, length: int) -> str:
    """Filter the vocabulary of the text to the length"""
    filterd_text = text.split(' ')
    return ' '.join(filterd_text[:length]) + '...' if len(filterd_text) > length else text

    

def get_time_ago(date_obj):
    """Returns a human readable time difference in Persian"""
    gregorian_date = None

    if (date:=getattr(date_obj, 'scheduled_publish_at')):
        gregorian_date = date

    else :
        gregorian_date = date_obj.created_date.togregorian()
    
    

    lang = get_language()
    
    # Get current time in UTC
    now = timezone.now()
    
    # Convert jalali to gregorian and set the timezone
    
    diff = now - gregorian_date
    return naturaltime(diff) if lang == 'en' else time_ago_persian_format(naturaltime(diff))



def time_ago_persian_format(time_string: str) -> str:
    """Returns a human readable time difference in Persian"""
    time_format = time_string[:2].replace("an", "1").replace("a", "1") + time_string[2:]


    persian_time_vocabulary = {
        'seconds': 'ثانیه',
        'minutes': 'دقیقه',
        'hours': 'ساعت',
        'days': 'روز',
        'months': 'ماه',
        'years': 'سال',
        'second': 'ثانیه',
        'minute': 'دقیقه',
        'hour': 'ساعت',
        'day': 'روز',
        'month': 'ماه',
        'year': 'سال'
    }


    for key, value in persian_time_vocabulary.items():
        if key in time_format:
            return  f"{persian_digits(int(time_format.split(' ')[0]))} {value} پیش"

        
    raise ValueError(f"Unknown naturaltime format! {time_string}")


def get_localization_position(position, language_code):
    position_keys = [
        'DEFENDER',
        'MIDFIELDER',
        'FORWARD',
        'GOALKEEPER',
    ]
    position_english_values = [
        'Defender',
        'Midfielder',
        'Forward',
        'Goalkeeper',
    ]
    position_persian_vlaues = [
        'مدافع',
        'هافبک',
        'مهاجم',
        'دروازه‌بان',
    ]
    
    if language_code == 'en':
        for index, pos in enumerate(position_keys):
            if position == pos:
                return position_english_values[index]
            
    elif language_code == 'fa':
        for index, pos in enumerate(position_keys):
            if position == pos:
                return position_persian_vlaues[index]
    

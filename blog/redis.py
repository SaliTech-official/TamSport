from django.core.cache import cache


class RedisService:
    def __init__(self, request):
        self.request = request
        

    def add_article_view(self, article_id):
        # Get user IP address
        ip_address = (
            self.request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0]
            or self.request.META.get('REMOTE_ADDR')
        )

        # Cache key for unique IPs for this article
        unique_ip_key = f"article:{article_id}:ips"
        
        # Get existing IPs from cache or initialize empty set
        unique_ips = cache.get(unique_ip_key, set())
        
        # Add new IP if not present
        if ip_address not in unique_ips:
            unique_ips.add(ip_address)
            # Store updated set in cache
            cache.set(unique_ip_key, unique_ips)

    def get_article_view_count(self, article_id):
        unique_ip_key = f"article:{article_id}:ips"
        unique_ips = cache.get(unique_ip_key, {})
        return len(unique_ips)
        
        
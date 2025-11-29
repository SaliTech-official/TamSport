FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gettext \
    gcc \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY ./backend/tam_website/ .

EXPOSE 8000

# Create non-root user
RUN useradd -m appuser
USER appuser

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3"]

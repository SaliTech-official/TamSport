FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gettext \
    gcc \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project code
COPY ./ .

EXPOSE 8000

# Create non-root user
RUN useradd -m appuser
USER appuser

# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

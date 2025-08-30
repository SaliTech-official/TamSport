FROM python:3.10-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y  \
    libpq-dev \
    gettext \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY ./backend/tam_website/ .

# --- Final image ---
FROM python:3.10-slim

WORKDIR /app

# Install runtime dependencies for psycopg2
RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

EXPOSE 8000

# Create non-root user
RUN useradd -m appuser
USER appuser

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install numpy first to ensure correct version
RUN pip install numpy==1.24.3

# Copy requirements and install dependencies
COPY requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the backend code
COPY . backend/

EXPOSE 5000

# Use the correct path to run Flask
CMD ["python", "-m", "flask", "--app", "backend/app", "run", "--host=0.0.0.0"]
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY backend/ backend/
WORKDIR /app/backend

# Expose port
EXPOSE 8081

# Command to run the application
CMD ["python", "main.py"]
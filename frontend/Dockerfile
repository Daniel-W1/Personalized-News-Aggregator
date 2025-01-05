FROM node:20

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application
COPY frontend/ ./

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
# Use the official Puppeteer Docker image which has Node.js and Google Chrome pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Set environment variables
ENV PORT=5000
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory inside the container
WORKDIR /app

# Copy package definition files
COPY package*.json ./

# Switch to root to run npm install with correct permissions
USER root
RUN npm ci

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

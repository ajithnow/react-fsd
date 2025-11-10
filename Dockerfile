FROM ubuntu:22.04

# Install system dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    net-tools \
    iputils-ping \
    wget \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js 22, update npm, and install serve globally
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest serve && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Fail if package-lock.json is missing
RUN test -f package-lock.json || (echo "Error: package-lock.json is missing" && exit 1)

# Install dependencies
RUN npm ci || npm install

# Copy application source code
COPY . .

# Build the application (TypeScript and Vite build)
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Serve static files from 'dist' directory
CMD ["serve", "-s", "dist", "-l", "3000"]

# ===================================================
# Empyrict-AI Full-Stack Production Dockerfile
# ===================================================
FROM node:18-bullseye-slim

# Install Python 3 and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copy Python ML dependencies and install
COPY ml/requirements.txt ./ml/requirements.txt
RUN pip3 install --no-cache-dir -r ml/requirements.txt

# 2. Copy root and subfolder package configs
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# 3. Install NPM dependencies
RUN npm install
RUN npm --prefix server install
RUN npm --prefix client install

# 4. Copy application source code
COPY . .

# 5. Build React frontend for production
RUN npm --prefix client run build

# 6. Expose default ports (Node: 5000, FastAPI: 8000)
EXPOSE 5000 8000

ENV NODE_ENV=production
ENV PORT=5000

# Start services using root concurrently script
CMD ["npm", "run", "dev"]

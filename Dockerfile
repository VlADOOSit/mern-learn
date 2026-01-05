# Use a slim Node.js image for production
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (leverages Docker layer cache)
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY src ./src
# Copy reference env file into the image for documentation/debug purposes
COPY .env.example ./.env.example

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "src/server.js"]

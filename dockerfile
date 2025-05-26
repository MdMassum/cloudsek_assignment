# Dockerfile.dev
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install dev dependencies globally
RUN npm install -g @nestjs/cli

# Expose NestJS port
EXPOSE 3000

CMD ["npm", "run", "start:dev"]

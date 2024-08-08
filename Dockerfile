# Build stage
FROM node:18 AS build
WORKDIR /app

# Copy package.json, package-lock.json, and TypeScript config
COPY package*.json tsconfig*.json ./

# Install dependencies with verbose logging
RUN npm ci --verbose

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build the React App
# We use Node 24 to match your local environment
FROM node:24-alpine AS build
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx (Lightweight Web Server)
FROM nginx:alpine
# Copy the built files from Stage 1 to Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom nginx config (prevents 404s on refresh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
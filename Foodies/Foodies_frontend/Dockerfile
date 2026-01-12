# Stage 1: Build the React App
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built React files
COPY --from=build /app/dist /usr/share/nginx/html

# 🟢 FIX: Copy the real config file instead of creating a fake one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
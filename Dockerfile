# # Stage 1: Build the React app
# FROM node:18-alpine AS build

# WORKDIR /app

# # Copy package.json and install deps first (better caching)
# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# # Copy rest of the code
# COPY . .

# # Build optimized production files
# RUN npm run build

# # Stage 2: Serve using Nginx
# FROM nginx:alpine

# # Copy build output to nginx html folder
# COPY --from=build /app/build /usr/share/nginx/html

# # Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port
# EXPOSE 80

# # Run nginx
# CMD ["nginx", "-g", "daemon off;"]



FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

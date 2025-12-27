# ======================
# Build Stage
# ======================
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ======================
# Production Stage
# ======================
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Runtime env generator
COPY env.sh /docker-entrypoint.d/40-env-gen.sh
RUN chmod +x /docker-entrypoint.d/40-env-gen.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]





# # Build Stage
# FROM node:20

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci

# COPY . .
# RUN npm run build

# # Production Stage
# FROM nginx:alpine

# # Copy built assets from build stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy env script
# COPY env.sh /docker-entrypoint.d/40-env-gen.sh
# RUN chmod +x /docker-entrypoint.d/40-env-gen.sh

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

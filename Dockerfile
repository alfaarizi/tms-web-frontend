## STAGE 1
# Build the React app using Node.js
FROM node:22-bookworm AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Clear npm cache and install dependencies using npm ci for a clean install
RUN npm cache clean --force && npm ci

# Copy the rest of the application source code
COPY . .

# Copy docker specific environment override file to its place
RUN cp docker/.env.docker ./.env.production.local

# Build the app for production
RUN npm run build:dynamic

## STAGE 2
# Serve the production build with Apache
FROM httpd:alpine

# Install envsubst in Alpine
RUN apk add --no-cache envsubst

# Copy the production build from the previous stage to Apache's document root
COPY --chown=www-data:www-data --from=build /app/dist /usr/local/apache2/htdocs/

# Enable Apache modules required for reverse proxy
RUN apk add --no-cache apache2-utils && \
    sed -i '/LoadModule proxy_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/LoadModule proxy_http_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

# Add reverse proxy configuration for the backend
COPY docker/reverse-proxy.conf /usr/local/apache2/conf/extra/reverse-proxy.conf

# Include the reverse proxy config in the main Apache config
RUN echo "Include /usr/local/apache2/conf/extra/reverse-proxy.conf" >> /usr/local/apache2/conf/httpd.conf

# Default values for runtime environment variables
ENV VITE_LOGIN_METHOD=ldap
ENV VITE_API_BASE_URL=/api
ENV VITE_THEME=dark
ENV VITE_GOOGLE_ANALYTICS_ID=-

# Inject runtime environment variables and start Apache
CMD envsubst < /usr/local/apache2/htdocs/index.html > /usr/local/apache2/htdocs/temp.html  && \
    mv /usr/local/apache2/htdocs/temp.html /usr/local/apache2/htdocs/index.html  && \
    httpd-foreground

## STAGE 1
# Build the React app using Node.js
FROM node:18 AS build

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
RUN npm run build

## STAGE 2
# Serve the production build with Apache
FROM httpd:alpine

# Install Node and NPM in Alpine
RUN apk add --no-cache nodejs npm

# Copy the production build from the previous stage to Apache's document root
COPY --chown=www-data:www-data --from=build /app/build /usr/local/apache2/htdocs/

# Enable Apache modules required for reverse proxy
RUN apk add --no-cache apache2-utils && \
    sed -i '/LoadModule proxy_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/LoadModule proxy_http_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

# Add reverse proxy configuration for the backend
COPY docker/reverse-proxy.conf /usr/local/apache2/conf/extra/reverse-proxy.conf

# Include the reverse proxy config in the main Apache config
RUN echo "Include /usr/local/apache2/conf/extra/reverse-proxy.conf" >> /usr/local/apache2/conf/httpd.conf

# Inject runtime environment variables and start Apache
CMD REACT_APP_API_BASEURL="${REACT_APP_API_BASEURL:-/api}" \
    REACT_APP_THEME="${REACT_APP_THEME:-dark}" \
    REACT_APP_LOGIN_METHOD="${REACT_APP_LOGIN_METHOD:-LDAP}" \
    REACT_APP_GOOGLE_ANALYTICS_ID="${REACT_APP_GOOGLE_ANALYTICS_ID:-}" \
    npx react-inject-env set -d /usr/local/apache2/htdocs/ && \
    httpd-foreground

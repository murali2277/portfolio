# Use a lightweight web server
FROM nginx:alpine

# Copy static files to the web server's public directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]

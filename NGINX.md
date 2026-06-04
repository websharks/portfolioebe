# Nginx Configuration (Alternative to .htaccess)

If your hosting uses **Nginx** instead of Apache, use this configuration:

## Installation

Add this configuration to your Nginx server block (usually in `/etc/nginx/sites-available/your-domain`):

```nginx
# =============================================================================
# Nginx Configuration for Portfolio
# =============================================================================

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (uncomment when HTTPS is ready)
    # return 301 https://$server_name$request_uri;

    root /var/www/portfolio-responsive-complete-main;
    index index.html index.htm;

    # =============================================================================
    # Compression
    # =============================================================================
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # =============================================================================
    # Cache Control for Static Assets
    # =============================================================================
    
    # Cache images for 30 days
    location ~ \.(jpg|jpeg|png|gif|svg|ico|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # Cache fonts for 365 days
    location ~ \.(woff|woff2|ttf|otf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Cache CSS for 7 days
    location ~ \.css$ {
        expires 7d;
        add_header Cache-Control "public, must-revalidate";
        add_header Content-Type "text/css; charset=UTF-8";
    }

    # Cache JavaScript for 7 days
    location ~ \.js$ {
        expires 7d;
        add_header Cache-Control "public, must-revalidate";
        add_header Content-Type "application/javascript; charset=UTF-8";
    }

    # Don't cache HTML files (always fetch fresh)
    location ~ \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # =============================================================================
    # Security Headers
    # =============================================================================
    
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Content Security Policy (optional, adjust as needed)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' unpkg.com cdnjs.cloudflare.com cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.jsdelivr.net;" always;

    # =============================================================================
    # Block Access to Sensitive Files
    # =============================================================================
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ^/(package\.json|package-lock\.json|README\.md|\.env|\.htaccess)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # =============================================================================
    # Default File Serving
    # =============================================================================
    
    location / {
        try_files $uri $uri/ =404;
        # If you want to use router, use: try_files $uri $uri/ /index.html;
    }

    # =============================================================================
    # Error Pages
    # =============================================================================
    
    error_page 404 /index.html;
    error_page 500 502 503 504 /index.html;

    # =============================================================================
    # Logging
    # =============================================================================
    
    access_log /var/log/nginx/portfolio_access.log;
    error_log /var/log/nginx/portfolio_error.log;
}

# =============================================================================
# HTTPS Configuration (Enable after getting SSL certificate)
# =============================================================================

# Uncomment and configure after SSL certificate is ready

# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name your-domain.com www.your-domain.com;

#     # SSL Certificate paths (from Let's Encrypt or your provider)
#     ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

#     # SSL Security settings
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers HIGH:!aNULL:!MD5;
#     ssl_prefer_server_ciphers on;

#     # Include all settings from above (server block content)
#     # ... (copy everything from the HTTP server block above)
# }
```

## Testing Configuration

After updating Nginx configuration:

```bash
# Test configuration syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Verify images are loading with proper cache headers
curl -I https://your-domain.com/assets/img/ebe1.jpeg

# Check cache headers
curl -I https://your-domain.com/assets/css/styles.css
```

## Verification

Expected response headers:

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
Cache-Control: public, immutable
Expires: [future date]
```

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md)

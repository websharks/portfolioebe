# Deployment & Hosting Setup Guide

## Project Configuration

This portfolio website is optimized for deployment with proper image serving and relative path configuration. All images are stored locally within the project structure and referenced using relative paths, ensuring seamless functionality across different hosting environments.

---

## Folder Structure

```
portfolio-responsive-complete-main/
├── index.html              (Main page - entry point)
├── .htaccess               (Apache server configuration)
├── DEPLOYMENT.md           (This file)
├── README.md               (Project documentation)
├── assets/
│   ├── css/
│   │   └── styles.css      (Main stylesheet)
│   ├── js/
│   │   └── main.js         (JavaScript functionality)
│   └── img/
│       ├── ebe1.jpeg       (Hero section image)
│       ├── Ebe.jpeg        (About section image)
│       ├── about.jpg       (Secondary about image)
│       ├── perfil.png      (Profile image)
│       └── work[1-6].jpg   (Project showcase images)
└── Ebe.jpeg, ebe1.jpeg, ebenezer.jpeg  (Root - for backward compatibility)
```

---

## Image Path Configuration

### Current Image References

All images are now referenced using **relative paths** from the `assets/img/` folder:

| Section | Image | Path | Status |
|---------|-------|------|--------|
| Hero    | ebe1.jpeg | `assets/img/ebe1.jpeg` | ✅ Fixed |
| About   | Ebe.jpeg | `assets/img/Ebe.jpeg` | ✅ Fixed |
| Projects | External (Unsplash) | HTTPS URLs | ✅ No changes needed |

### Why Relative Paths?

- ✅ **Portability**: Works on any domain without configuration
- ✅ **No Breaking Links**: Images load correctly after deployment
- ✅ **Local Development**: Works seamlessly in development and production
- ✅ **SEO Friendly**: Proper asset organization improves site structure
- ✅ **Performance**: Enables caching optimization at server level

---

## Hosting Deployment Instructions

### Prerequisites

- Apache server (or equivalent web server supporting `.htaccess`)
- PHP 7.2+ (optional, for future server-side features)
- HTTPS enabled (recommended for security)

### Step 1: Upload Files to Hosting

1. Connect to your hosting via FTP/SFTP or file manager
2. Upload the entire `portfolio-responsive-complete-main` folder to your domain root
3. **Important**: Maintain the exact folder structure:
   ```
   your-domain.com/
   ├── index.html
   ├── assets/
   │   ├── css/styles.css
   │   ├── js/main.js
   │   └── img/
   │       ├── ebe1.jpeg
   │       └── Ebe.jpeg
   ├── .htaccess
   └── DEPLOYMENT.md
   ```

### Step 2: Verify File Permissions

Set proper permissions on your hosting server:

```bash
# Set folder permissions
chmod 755 /public_html/assets
chmod 755 /public_html/assets/img
chmod 755 /public_html/assets/css
chmod 755 /public_html/assets/js

# Set file permissions
chmod 644 /public_html/index.html
chmod 644 /public_html/.htaccess
chmod 644 /public_html/assets/img/*.jpeg
chmod 644 /public_html/assets/css/styles.css
chmod 644 /public_html/assets/js/main.js
```

### Step 3: Enable Apache Modules (if needed)

Contact your hosting provider to ensure these modules are enabled:

- `mod_rewrite` - For URL rewriting
- `mod_deflate` - For gzip compression
- `mod_expires` - For cache control
- `mod_headers` - For security headers

Most hosting providers have these enabled by default.

### Step 4: Verify .htaccess Configuration

The `.htaccess` file includes:

- ✅ **Cache Control**: Optimized caching for images (30 days), CSS/JS (7 days)
- ✅ **Compression**: GZIP compression for text-based assets
- ✅ **Security Headers**: XSS protection, MIME type sniffing prevention
- ✅ **MIME Types**: Proper types for web fonts, images, and media
- ✅ **Access Control**: Prevents listing of directories and sensitive files

---

## Testing & Verification

### 1. Check Image Loading

After deployment, verify all images load correctly:

```
✅ Hero Image: https://your-domain.com/assets/img/ebe1.jpeg
✅ About Image: https://your-domain.com/assets/img/Ebe.jpeg
```

Open the browser DevTools (F12) and check:
- **Network Tab**: All images return HTTP 200 (successful)
- **Console Tab**: No 404 errors for missing images
- **Coverage Tab**: Assets are being cached

### 2. Performance Check

Test your site with:

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

Expected improvements:
- ✅ Images cached for 30 days
- ✅ CSS/JS cached for 7 days
- ✅ GZIP compression enabled
- ✅ Load time < 2 seconds

### 3. Security Check

Verify security headers are present:

```bash
# Linux/Mac
curl -I https://your-domain.com

# Check for headers:
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# X-Frame-Options: SAMEORIGIN
```

### 4. Responsive Testing

Test on multiple devices:

- 📱 Mobile (320px - 480px)
- 📱 Tablet (481px - 1024px)
- 💻 Desktop (1025px+)

All images should scale responsively without distortion.

---

## Troubleshooting

### Images Not Loading (404 Error)

**Problem**: Images return 404 in browser console

**Solution**:
1. Verify folder structure matches exactly
2. Check file permissions (should be 644 for files)
3. Check for typos in image filenames (case-sensitive on Linux)
4. Ensure `assets/img/` folder exists on server

### Slow Load Times

**Problem**: Pages load slowly despite caching rules

**Solution**:
1. Verify GZIP compression is enabled:
   ```bash
   curl -I -H "Accept-Encoding: gzip" https://your-domain.com/assets/css/styles.css
   ```
2. Check image file sizes - compress if > 500KB
3. Enable browser caching via `.htaccess`
4. Consider a CDN for faster asset delivery

### .htaccess Errors

**Problem**: "500 Internal Server Error"

**Solution**:
1. Contact hosting provider to enable `mod_rewrite`
2. Temporarily rename `.htaccess` to test if it's the cause
3. Check hosting logs for specific error messages
4. Some shared hosts may restrict `.htaccess` modifications

### HTTPS Issues

**Problem**: Images don't load over HTTPS

**Solution**:
1. Update external image URLs to HTTPS (already done with Unsplash)
2. Uncomment HTTPS redirect in `.htaccess`:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```
3. Ensure SSL certificate is valid

---

## Environment-Specific Setup

### Development (Local)

- ✅ All relative paths work without modification
- ✅ No server configuration needed
- Open `index.html` directly or use local server:
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Node.js (with http-server)
  npx http-server
  ```

### Staging (Testing)

- ✅ Use same `.htaccess` configuration
- ✅ Test on staging domain before production
- ✅ Verify all links and images work
- ✅ Test form submissions

### Production (Live)

- ✅ Deploy exactly as described in "Step 1-4"
- ✅ Enable HTTPS (update .htaccess if needed)
- ✅ Monitor performance with Google Analytics
- ✅ Set up monitoring/uptime alerts

---

## Content Delivery Network (CDN) - Optional

For even faster image delivery, optionally use a CDN:

1. **Cloudflare**: Free tier includes caching and optimization
2. **AWS CloudFront**: Good for high-traffic sites
3. **Bunny CDN**: Affordable option with global coverage

No code changes needed - CDN works transparently with relative paths.

---

## Security Considerations

### Files Protected by .htaccess

The following files are blocked from public access:

- `.htaccess` itself (configuration protection)
- `.env` files (if added later)
- `package.json` and lock files
- Documentation (`.md` files)
- Hidden files (starting with `.`)

### Best Practices

1. ✅ **HTTPS Only**: Force HTTPS in `.htaccess` (uncomment line)
2. ✅ **Regular Backups**: Backup site files monthly
3. ✅ **Update Dependencies**: Keep FontAwesome, ScrollReveal updated
4. ✅ **Monitor Logs**: Check for unusual access patterns
5. ✅ **Disable Directory Listing**: Already configured in `.htaccess`

---

## Maintenance & Updates

### Updating Images

To replace or add new images:

1. Upload new images to `assets/img/` folder
2. Update image references in `index.html`:
   ```html
   <img src="assets/img/new-image.jpeg" alt="Description">
   ```
3. No changes needed to `.htaccess` or other configuration files
4. Clear browser cache (Ctrl+Shift+Del) to see changes

### Updating Stylesheets or Scripts

1. Modify `assets/css/styles.css` or `assets/js/main.js`
2. Clear browser cache to see changes
3. `.htaccess` will handle caching automatically

### Version Control

For Git repositories, consider adding to `.gitignore`:

```
node_modules/
.env
.DS_Store
*.log
```

But **DO include** in version control:
- `index.html`
- `assets/` folder (with all images)
- `.htaccess`
- `DEPLOYMENT.md`

---

## Support & Additional Resources

- **Apache .htaccess Guide**: https://httpd.apache.org/docs/current/howto/htaccess.html
- **Web Hosting Best Practices**: https://developer.mozilla.org/en-US/docs/Learn/Common_questions
- **Image Optimization**: https://web.dev/performance/
- **Security Guidelines**: https://owasp.org/www-project-secure-coding-practices/

---

## Deployment Checklist

Use this checklist before going live:

- [ ] All files uploaded to hosting
- [ ] Folder structure maintained (assets/img/)
- [ ] File permissions set correctly (755 folders, 644 files)
- [ ] `.htaccess` is present and Apache modules enabled
- [ ] All images loading (network tab shows 200 status)
- [ ] No console errors (DevTools)
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Links working (all navigation links functional)
- [ ] Contact form submission working
- [ ] External links (LinkedIn, GitHub, HackerOne) functional
- [ ] PageSpeed Insights score > 80
- [ ] Security headers present (curl -I check)
- [ ] HTTPS enabled (if available)
- [ ] Backup of production files created

---

**Last Updated**: December 25, 2025  
**Status**: Ready for Production Deployment

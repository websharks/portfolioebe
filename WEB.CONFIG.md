# web.config Configuration (for IIS Hosting)

If your hosting uses **Microsoft IIS** (Windows servers), use this configuration.

## Installation

1. Upload `web.config` to the root of your domain (same level as `index.html`)
2. No additional changes needed - IIS will automatically apply the settings

## Configuration File

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        
        <!-- ===================================================================== -->
        <!-- Default Document -->
        <!-- ===================================================================== -->
        <defaultDocument>
            <files>
                <clear />
                <add value="index.html" />
            </files>
        </defaultDocument>

        <!-- ===================================================================== -->
        <!-- URL Rewriting (Optional - for clean URLs) -->
        <!-- ===================================================================== -->
        <rewrite>
            <rules>
                <!-- Remove trailing slash -->
                <rule name="RemoveTrailingSlash" stopProcessing="true">
                    <match url="(.*)/$" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                    </conditions>
                    <action type="Redirect" url="{R:1}" />
                </rule>
            </rules>
        </rewrite>

        <!-- ===================================================================== -->
        <!-- MIME Types (Ensure proper types for all files) -->
        <!-- ===================================================================== -->
        <staticContent>
            <mimeMap fileExtension=".woff" mimeType="application/x-font-woff" />
            <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
            <mimeMap fileExtension=".ttf" mimeType="application/x-font-ttf" />
            <mimeMap fileExtension=".otf" mimeType="application/x-font-opentype" />
            <mimeMap fileExtension=".eot" mimeType="application/vnd.ms-fontobject" />
            <mimeMap fileExtension=".svg" mimeType="image/svg+xml" />
            <mimeMap fileExtension=".webp" mimeType="image/webp" />
            <mimeMap fileExtension=".json" mimeType="application/json" />
        </staticContent>

        <!-- ===================================================================== -->
        <!-- HTTP Compression (GZIP) -->
        <!-- ===================================================================== -->
        <httpCompression directory="%SystemDrive%\inetpub\temp\IIS Temporary Compressed Files">
            <scheme name="gzip" dll="%Windir%\system32\inetsrv\gzip.dll" staticCompressionLevel="9" />
            <dynamicTypes>
                <add mimeType="text/html" enabled="true" />
                <add mimeType="text/plain" enabled="true" />
                <add mimeType="text/css" enabled="true" />
                <add mimeType="text/javascript" enabled="true" />
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="application/json" enabled="true" />
                <add mimeType="application/xml" enabled="true" />
            </dynamicTypes>
            <staticTypes>
                <add mimeType="text/css" enabled="true" />
                <add mimeType="text/javascript" enabled="true" />
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="text/xml" enabled="true" />
                <add mimeType="application/xml" enabled="true" />
            </staticTypes>
        </httpCompression>
        <urlCompression doStaticCompression="true" doDynamicCompression="true" />

        <!-- ===================================================================== -->
        <!-- Cache Control Headers -->
        <!-- ===================================================================== -->
        <httpProtocol>
            <customHeaders>
                <!-- Security Headers -->
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-XSS-Protection" value="1; mode=block" />
                <add name="X-Frame-Options" value="SAMEORIGIN" />
                <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
                <add name="Permissions-Policy" value="geolocation=(), microphone=(), camera=()" />
                
                <!-- Cache Headers (set per file type below) -->
            </customHeaders>
        </httpProtocol>

        <!-- ===================================================================== -->
        <!-- Static File Caching Rules -->
        <!-- ===================================================================== -->
        <staticContent clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="2592000" />
        
        <!-- Cache images for 30 days -->
        <location path="assets/img">
            <staticContent clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="2592000" />
        </location>

        <!-- Cache CSS/JS for 7 days -->
        <location path="assets/css">
            <staticContent clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="604800" />
        </location>

        <location path="assets/js">
            <staticContent clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="604800" />
        </location>

        <!-- Don't cache HTML -->
        <location path="index.html">
            <staticContent clientCache cacheControlMode="DisableCache" />
        </location>

        <!-- ===================================================================== -->
        <!-- Request Filtering (Security) -->
        <!-- ===================================================================== -->
        <security>
            <requestFiltering>
                <!-- Hide hidden files and directories -->
                <hiddenSegments>
                    <add segment=".git" />
                    <add segment=".env" />
                    <add segment="web.config" />
                </hiddenSegments>
                
                <!-- Deny access to specific file types -->
                <fileExtensions>
                    <add fileExtension=".md" allowed="false" />
                    <add fileExtension=".json" allowed="false" />
                    <add fileExtension=".lock" allowed="false" />
                </fileExtensions>
            </requestFiltering>
        </security>

        <!-- ===================================================================== -->
        <!-- Directory Browsing -->
        <!-- ===================================================================== -->
        <directoryBrowse enabled="false" />

    </system.webServer>
</configuration>
```

## Key Settings Explained

| Setting | Purpose | Duration |
|---------|---------|----------|
| `clientCache` for images | Cache images on browser | 30 days |
| `clientCache` for CSS/JS | Cache stylesheets and scripts | 7 days |
| `disableCache` for HTML | Always fetch fresh HTML | N/A |
| `urlCompression` | Enable GZIP compression | Automatic |
| `customHeaders` | Add security headers | All requests |
| `requestFiltering` | Block sensitive files | Always |

## Testing

### Check Cache Headers

```powershell
# PowerShell command to verify cache headers
Invoke-WebRequest -Uri "https://your-domain.com/assets/img/ebe1.jpeg" -Method Head | Select-Object Headers
```

Expected output should show:
```
Cache-Control: max-age=2592000 (30 days for images)
Cache-Control: max-age=604800 (7 days for CSS/JS)
```

## Troubleshooting

### Images Return 404

1. Verify folder structure in IIS
2. Check if `assets` folder is properly configured as application content
3. Review IIS logs: `C:\inetpub\logs\LogFiles\`

### web.config Errors

1. Check IIS Manager > Error Pages for details
2. Verify XML syntax (no special characters)
3. Check NTFS permissions on web.config file (should be readable by IIS app pool)

### Compression Not Working

1. Verify IIS has HTTP Compression feature installed
2. Check IIS Manager > Server > Compression settings
3. Ensure dynamic/static compression is enabled

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment instructions
- [NGINX.md](NGINX.md) - Nginx configuration
- [IIS Documentation](https://learn.microsoft.com/en-us/iis/)

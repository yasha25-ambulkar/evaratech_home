# EvaraTech Dashboard - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# ThingSpeak (if using)
VITE_THINGSPEAK_CHANNEL_ID=your_channel_id
VITE_THINGSPEAK_READ_API_KEY=your_api_key
```

### 3. Start Development Server

```bash
npm run dev
```

Access at: http://localhost:5173/

## Production Build

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 2. Preview Production Build

```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

**Environment Variables:**
- Add your environment variables in Vercel dashboard
- Settings → Environment Variables

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Configuration:**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/repo-name/',
  // ... rest of config
});
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Custom Server (Apache/Nginx)

1. Build the application:
```bash
npm run build
```

2. Copy `dist/` contents to your web server

**Apache `.htaccess`:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx config:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Post-Deployment Checklist

- [ ] Test all routes work correctly
- [ ] Verify map loads with markers
- [ ] Check pipeline visualization
- [ ] Test sidebar interactions
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors
- [ ] Test environment variables are loaded
- [ ] Verify API connections (if configured)

## Performance Optimization

### Already Implemented
- ✅ Code splitting with Vite
- ✅ CSS Modules for scoped styles
- ✅ Tree-shaking enabled
- ✅ Source maps for debugging

### Additional Optimizations
- Use lazy loading for routes
- Implement image optimization
- Add service worker for caching
- Enable gzip compression on server

## Monitoring

### Recommended Tools
- **Vercel Analytics** - Built-in analytics
- **Google Analytics** - User tracking
- **Sentry** - Error monitoring
- **Lighthouse** - Performance audits

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run type-check
```

**Linting errors:**
```bash
npm run lint
```

### Runtime Errors

**Check browser console** for JavaScript errors

**Verify environment variables** are set correctly

**Check network tab** for failed API requests

## Rollback Strategy

1. Keep previous build in `dist-backup/`
2. Use Git tags for versions
3. Deploy to staging first
4. Have rollback script ready

## Security

- Never commit `.env` files
- Use environment variables for secrets
- Enable HTTPS on production
- Implement CSP headers
- Regular dependency updates

## Support

For issues or questions:
- Check the walkthrough.md documentation
- Review the implementation_plan.md
- Contact the development team

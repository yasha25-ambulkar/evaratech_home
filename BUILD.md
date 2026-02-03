# Production Build Guide

## Building for Production

### 1. Pre-build Checklist

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All ESLint errors fixed (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Environment variables configured
- [ ] All features tested
- [ ] README updated

### 2. Create Production Build

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Bundle all modules
- Minify code
- Optimize assets
- Generate source maps
- Output to `dist/` directory

### 3. Build Output

```
dist/
├── assets/
│   ├── index-[hash].js      # Main JavaScript bundle
│   ├── index-[hash].css     # Main CSS bundle
│   └── [other-assets]       # Images, fonts, etc.
└── index.html               # Entry HTML file
```

### 4. Preview Production Build

```bash
npm run preview
```

Access at: http://localhost:4173/

### 5. Build Analysis

Check bundle size:
```bash
npm run build -- --mode production
```

Look for:
- Total bundle size
- Chunk sizes
- Asset sizes

**Target Metrics:**
- Initial JS bundle: < 200KB gzipped
- Initial CSS: < 50KB gzipped
- Total page size: < 500KB gzipped

### 6. Optimization Tips

**Code Splitting:**
```typescript
// Lazy load routes
const AssetMap = lazy(() => import('./pages/AssetMap/AssetMap'));
```

**Image Optimization:**
- Use WebP format
- Compress images
- Use appropriate sizes

**CSS Optimization:**
- Remove unused styles
- Use CSS Modules
- Minimize global CSS

## Environment Variables

### Production Environment

Create `.env.production`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Build with Environment

```bash
npm run build
```

Vite automatically uses `.env.production` for production builds.

## Performance Checklist

- [x] Code splitting implemented
- [x] CSS Modules for scoped styles
- [x] Tree-shaking enabled (Vite default)
- [x] Source maps generated
- [ ] Images optimized
- [ ] Lazy loading for routes
- [ ] Service worker for caching

## Security Checklist

- [ ] No API keys in client code
- [ ] Environment variables properly set
- [ ] HTTPS enabled in production
- [ ] CSP headers configured
- [ ] Dependencies audited (`npm audit`)

## Deployment Platforms

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

### Custom Server
```bash
# Copy dist/ to server
scp -r dist/* user@server:/var/www/html/
```

## Post-Deployment

### Verify Deployment

1. **Check all routes:**
   - `/` - Home page
   - `/map` - Asset map
   - `/pipelines` - Pipeline management
   - `/details?loc=Location` - Station details

2. **Test functionality:**
   - Map loads with markers
   - Markers are clickable
   - Sidebar opens/closes
   - Pipeline visualization works
   - Navigation between pages

3. **Check performance:**
   - Run Lighthouse audit
   - Check load times
   - Verify mobile performance

4. **Monitor errors:**
   - Check browser console
   - Monitor error tracking (if configured)
   - Check server logs

## Rollback Plan

1. Keep previous build:
```bash
mv dist dist-backup-$(date +%Y%m%d)
```

2. Tag releases:
```bash
git tag -a v2.0.0 -m "Production release v2.0.0"
git push origin v2.0.0
```

3. Quick rollback:
```bash
mv dist-backup-YYYYMMDD dist
```

## Monitoring

### Recommended Tools

- **Vercel Analytics** - Page views, performance
- **Google Analytics** - User behavior
- **Sentry** - Error tracking
- **LogRocket** - Session replay

### Key Metrics to Monitor

- Page load time
- Time to interactive
- First contentful paint
- Largest contentful paint
- Cumulative layout shift
- Error rate
- User engagement

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Review analytics
- Monitor performance

**Monthly:**
- Update dependencies
- Security audit
- Performance review

**Quarterly:**
- Major version updates
- Feature review
- User feedback analysis

## Support

For production issues:
1. Check CHANGELOG.md for known issues
2. Review deployment logs
3. Check environment variables
4. Contact development team

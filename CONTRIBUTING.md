# Contributing to EvaraTech Dashboard

## Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd EvaraTech_Home
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

## Code Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type
- Use type inference where possible

### React
- Use functional components
- Use hooks for state management
- Keep components small and focused
- Use CSS Modules for styling

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- CSS Modules: `ComponentName.module.css`
- Types: `name.types.ts`

### Code Formatting
```bash
npm run format        # Format code
npm run format:check  # Check formatting
npm run lint          # Run linter
npm run type-check    # Check TypeScript
```

## Project Structure

```
src/
├── pages/          # Route-level components
├── components/     # Reusable components
│   ├── layout/    # Layout components
│   ├── ui/        # UI components
│   ├── map/       # Map-specific components
│   └── 3d/        # 3D visualization components
├── types/          # TypeScript type definitions
├── data/           # Static data and constants
├── hooks/          # Custom React hooks
├── store/          # State management (Zustand)
├── services/       # API and external services
├── utils/          # Utility functions
└── styles/         # Global styles
```

## Adding New Features

### 1. New Page
1. Create folder in `src/pages/PageName/`
2. Create `PageName.tsx` and `PageName.module.css`
3. Add route in `src/App.tsx`
4. Update navigation if needed

### 2. New Component
1. Create folder in appropriate directory
2. Create component file and CSS module
3. Export from component file
4. Document props with TypeScript interface

### 3. New API Integration
1. Add service in `src/services/`
2. Create custom hook in `src/hooks/` if needed
3. Update types in `src/types/`
4. Use in components

## Testing

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test all routes
- [ ] Test map interactions
- [ ] Test sidebar functionality
- [ ] Check console for errors
- [ ] Verify responsive design

### Before Committing
```bash
npm run type-check  # No TypeScript errors
npm run lint        # No linting errors
npm run format      # Code is formatted
npm run build       # Build succeeds
```

## Git Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/description`
- Enhancement: `enhance/description`

### Commit Messages
```
feat: Add new feature
fix: Fix bug description
docs: Update documentation
style: Format code
refactor: Refactor component
perf: Improve performance
test: Add tests
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Format and lint code
5. Create PR with description
6. Wait for review
7. Address feedback
8. Merge when approved

## Performance Guidelines

### Do's
- ✅ Use React.memo for expensive components
- ✅ Lazy load routes
- ✅ Optimize images
- ✅ Use CSS Modules
- ✅ Minimize bundle size

### Don'ts
- ❌ Don't use inline styles excessively
- ❌ Don't create unnecessary re-renders
- ❌ Don't load all data at once
- ❌ Don't ignore console warnings

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios
- Support reduced motion preferences

## Questions?

- Check the README.md
- Review the walkthrough.md
- Check implementation_plan.md
- Ask the team

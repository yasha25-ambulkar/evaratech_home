# Changelog

All notable changes to the EvaraTech Dashboard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-27

### Added
- **Complete React + TypeScript migration** from standalone HTML files
- **Vite build system** for fast development and optimized production builds
- **React Router v6** for client-side routing
- **Zustand state management** for UI and asset state
- **Leaflet map integration** with React Leaflet
- **Custom marker system** for 6 asset types (pump, sump, tank, bore, govt, sensor)
- **Interactive sidebar** for asset details
- **Pipeline visualization** with GeoJSON rendering
- **Dynamic pipeline widths** based on zoom level
- **TypeScript type system** for all data structures
- **CSS Modules** for scoped component styling
- **Reusable UI components** (Card, Button, Badge, DataRow)
- **Layout components** (Navigation, Footer, Sidebar)
- **Custom hooks** (useSensorData, useAssetData, useMapInteraction)
- **API integration layer** with axios
- **ThingSpeak service** for real-time sensor data
- **Supabase service** for database operations
- **Utility functions** (formatters, validators, helpers)
- **Responsive design** utilities and breakpoints
- **Environment variables** support
- **Prettier configuration** for code formatting
- **ESLint configuration** for code quality
- **Deployment guide** for multiple platforms
- **Contributing guidelines** for developers

### Changed
- **Migrated from HTML to React** while preserving 100% visual design
- **Centralized data management** from inline JavaScript to TypeScript files
- **Improved code organization** with clear separation of concerns
- **Enhanced type safety** with TypeScript throughout
- **Better state management** with Zustand instead of global variables
- **Modular styling** with CSS Modules instead of inline styles

### Technical Details
- **70+ assets** migrated with full data
- **20+ pipeline segments** with exact GeoJSON coordinates
- **60+ files created** in organized structure
- **339 npm packages** installed
- **3,500+ lines of code** written

### Preserved
- ✅ All original colors (#0077b6, #00b4d8, #0096c7, etc.)
- ✅ Typography and spacing
- ✅ Button and card hover effects
- ✅ Map marker styles and colors
- ✅ Sidebar slide animation
- ✅ Pipeline color coding
- ✅ All user interactions and workflows

## [1.0.0] - 2025-12-12

### Initial Release
- Basic HTML/CSS/JavaScript implementation
- Static map with markers
- Pipeline visualization
- Station details page
- Inline styles and scripts

---

## Future Releases

### [2.1.0] - Planned
- Real-time data integration with ThingSpeak
- Interactive charts with Recharts
- Asset filtering functionality
- Search capabilities
- Mobile app optimizations

### [2.2.0] - Planned
- 3D water flow visualizations with Three.js
- 3D pipeline network view
- Particle effects for water flow
- Advanced animations

### [3.0.0] - Planned
- User authentication
- Role-based access control
- Alert system
- Historical data analysis
- Export functionality
- Admin dashboard

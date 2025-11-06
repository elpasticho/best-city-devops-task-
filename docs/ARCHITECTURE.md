# BestCity Frontend Architecture

## Overview

BestCity is a modern real estate investment platform that combines traditional property investing with cryptocurrency payments and blockchain technology. The application is built with React 18, Vite, and Tailwind CSS, featuring a comprehensive dark/light theme system and 3D property visualization capabilities.

## Technology Stack

### Core Technologies
- **React 18.3.1** - UI library with functional components and hooks
- **Vite 7.1.12** - Build tool and development server
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **React Router DOM 6.3.0** - Client-side routing

### State Management
- **React Context API** - Theme management
- **Jotai 2.12.3** - Atom-based state for 3D viewer
- **Component State** - Local UI state management

### Web3 & Blockchain
- **ethers.js 5.6.9** - Ethereum interactions
- **@walletconnect/web3-provider 1.7.8** - Wallet connection

### 3D Visualization
- **Three.js 0.176.0** - 3D graphics library
- **@react-three/fiber 8.13.3** - React renderer for Three.js
- **@react-three/drei 9.75.0** - Three.js helpers and utilities
- **Leva 0.10.0** - 3D scene controls

### UI & Animation
- **Framer Motion 12.9.4** - Animation library
- **React Icons 5.5.0** - Icon library
- **Bootstrap 5.1.3** - Component framework
- **Reactstrap 9.1.1** - React Bootstrap components

### Backend Technologies (Included)
- **Express.js 4.19.2** - Web server framework
- **MongoDB/Mongoose 8.5.1** - Database and ODM
- **JWT 9.0.2** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **Socket.io 4.5.4** - Real-time communication

## Project Structure

```
frontend_test/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── layout/        # Layout components (Navbar, Footer, ThemeToggle)
│   │   └── property/      # 3D property components (Experience, Scene, Overlay)
│   ├── context/           # React Context providers (ThemeContext)
│   ├── pages/             # Page components (Home, Properties, About, etc.)
│   ├── styles/            # Global styles (index.css with utility classes)
│   ├── App.jsx            # Root component
│   └── main.jsx           # Application entry point
├── server/                # Backend server code
├── docs/                  # Documentation
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies and scripts
```

## Architecture Patterns

### 1. Component-Based Architecture

The application follows a hierarchical component structure:

```
App (ThemeProvider)
├── Navbar (with ThemeToggle)
├── Routes
│   ├── Home
│   ├── Properties
│   ├── PropertyDetail
│   ├── Property3D (with 3D Experience)
│   ├── About
│   ├── Blog
│   ├── BlogPost
│   ├── FAQ
│   ├── Privacy
│   └── NotFound
└── Footer
```

### 2. Theme System Architecture

The theme system uses a centralized Context API pattern:

**ThemeContext Provider**
- Manages global `isDarkMode` state
- Persists theme preference to localStorage
- Detects system color scheme preference
- Applies/removes `dark` class to document root

**Utility Class System**
- Centralized utility classes in `src/index.css`
- Semantic naming conventions (`.text-heading`, `.text-body`, `.text-muted`)
- Component patterns (`.card`, `.feature-card`, `.cta-primary`)
- Global transitions for smooth theme switching
- Reduces code repetition by 60-90%

### 3. Routing Architecture

Client-side SPA routing with React Router v6:

```javascript
Routes:
/ - Home page
/properties - Properties listing
/properties/:id - Property detail
/property-3d - 3D property viewer
/about - About page
/blog - Blog listing
/blog/:slug - Blog post
/faq - FAQ page
/privacy - Privacy policy
* - 404 Not Found
```

### 4. State Management Strategy

**Global State (React Context)**
- Theme state (dark/light mode)
- User authentication (planned)
- Wallet connection status (planned)

**Atom State (Jotai)**
- 3D viewer slide index
- 3D scene controls

**Local Component State**
- Form inputs
- UI toggles (filters, modals)
- Loading states

### 5. Data Flow Pattern

```
Component → Service Layer → API → Backend → Database
                ↓
           State Update
                ↓
           Re-render UI
```

**Service Layer (Planned)**
- `services/api/` - API client configuration
- `services/web3Service.js` - Web3 interactions
- `services/blockchain/` - Smart contract interactions

### 6. Styling Architecture

**Approach: Utility-First with Tailwind CSS**

**Global Utilities (`src/index.css`):**
```css
/* Section Backgrounds */
.section-light { @apply bg-secondary-50 dark:bg-secondary-800; }
.section-white { @apply bg-white dark:bg-secondary-900; }

/* Text Colors */
.text-heading { @apply text-secondary-900 dark:text-white; }
.text-body { @apply text-secondary-600 dark:text-secondary-300; }
.text-muted { @apply text-secondary-500 dark:text-secondary-400; }

/* Component Patterns */
.card { @apply bg-white dark:bg-secondary-800 rounded-lg shadow-md; }
.btn { @apply px-4 py-2 bg-primary-600 text-white rounded-md; }
```

**Benefits:**
- Consistent theming across all pages
- Minimal code repetition
- Easy maintenance
- Responsive by default

## 3D Visualization Architecture

### Three.js Integration

**Component Hierarchy:**
```
Property3D Page
└── Canvas (R3F)
    ├── Experience
    │   ├── Camera Controls
    │   ├── Environment (Lighting)
    │   └── Scene (3D Model)
    └── Overlay (UI Layer)
```

**Key Features:**
- GLB model loading
- Auto-rotating camera
- Dynamic lighting setup
- Responsive scaling
- Smooth scene transitions

### Scene Configuration

```javascript
scenes: [
  {
    path: "models/house1.glb",
    mainColor: "#c0ffe1",
    name: "Modern Villa with Pool",
    targetProfitability: 10.3,
    roi: 7.2,
    valuation: "425 ETH"
  }
]
```

## Security Architecture

### Frontend Security Measures

1. **Input Validation**
   - Validator library for user inputs
   - Form validation before submission

2. **Wallet Security**
   - WalletConnect for secure connections
   - No private key storage
   - Ethers.js for safe Web3 interactions

3. **Authentication** (Backend)
   - JWT for stateless authentication
   - bcryptjs for password hashing
   - HTTP-only cookies

4. **Environment Variables**
   - `.env` files for sensitive config
   - Vite prefix: `VITE_*` for client-side vars

## Performance Optimizations

### Build Optimizations
- Vite code splitting
- Tree shaking
- CSS minification
- Asset optimization

### Runtime Optimizations
- React.memo for expensive components
- Lazy loading with React.lazy
- Image optimization
- 3D model preloading

### Development Performance
- Fast HMR with Vite
- Instant server start
- Optimized rebuild times

## Deployment Architecture

### Build Process
```bash
npm run build → vite build → /build directory
```

### Deployment Options
1. **Vercel** (Recommended)
2. **Netlify**
3. **AWS S3 + CloudFront**
4. **Docker Container**

### Environment Configuration
```
VITE_API_BASE_URL - Backend API URL
VITE_INFURA_ID - Web3 provider
VITE_NETWORK_ID - Blockchain network
```

## Scalability Considerations

### Code Scalability
- Modular component structure
- Reusable utility classes
- Service layer abstraction
- Type safety (TypeScript recommended)

### Performance Scalability
- Code splitting by route
- Lazy loading components
- CDN for static assets
- Caching strategies

### Team Scalability
- Clear folder structure
- Documented conventions
- Reusable patterns
- Centralized configurations

## Browser Compatibility

**Production Targets:**
- >0.2% market share
- Not dead browsers
- Not Opera Mini

**Development:**
- Latest Chrome
- Latest Firefox
- Latest Safari

## Future Architecture Enhancements

1. **TypeScript Migration**
   - Add type safety
   - Better IDE support
   - Catch errors at compile time

2. **API Layer Improvements**
   - React Query for server state
   - Optimistic updates
   - Request caching

3. **Testing Infrastructure**
   - Increase test coverage (>80%)
   - E2E test suite
   - Visual regression testing

4. **Monitoring & Analytics**
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics

5. **Internationalization (i18n)**
   - Multi-language support
   - Currency localization
   - Date/time formatting

## Key Architectural Decisions

### 1. Why Vite over Create React App?
- Faster development server
- Better build performance
- Native ES modules
- Simpler configuration

### 2. Why Context API over Redux?
- Simpler API
- Less boilerplate
- Sufficient for current complexity
- Can upgrade to Redux if needed

### 3. Why Tailwind CSS?
- Rapid development
- Consistent design system
- Built-in responsive design
- Excellent dark mode support

### 4. Why Utility Classes?
- Reduces code repetition by 60-90%
- Centralized theme management
- Easy maintenance
- Consistent styling

### 5. Why React Router v6?
- Modern API
- Better TypeScript support
- Improved nested routing
- Smaller bundle size

## Documentation Standards

### Component Documentation
```javascript
/**
 * PropertyCard component displays a property investment card
 * @param {Object} property - Property data
 * @param {string} property.title - Property title
 * @param {number} property.price - Property price
 * @returns {JSX.Element}
 */
```

### File Headers
```javascript
// src/pages/Home.jsx
// Home page component - Landing page with hero, features, and CTAs
```

## Maintenance Guidelines

### Dependency Updates
- Regular security updates
- Major version updates (quarterly)
- Breaking change reviews

### Code Quality
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks

### Performance Monitoring
- Lighthouse scores
- Core Web Vitals
- Bundle size tracking

---

**Last Updated:** 2025-11-06
**Version:** 1.0.0
**Maintainers:** BestCity Development Team

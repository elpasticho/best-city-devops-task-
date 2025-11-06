# BestCity

## What is BestCity?

BestCity is a modern real estate investment platform that combines traditional property investing with cryptocurrency payments. Built with React and Tailwind CSS, it mirrors the functionality of Arrived.com while adding blockchain-based transaction capabilities.

<img src="./public/bestcity00.png" alt="Best City" style="width:100%; height:auto;" />

## Key Features

- **Notes API** - Complete RESTful CRUD API with 38 tests (85.91% coverage) ✅
- Cryptocurrency-enabled property transactions
- Mobile-responsive design
- SEO-optimized architecture
- Real-time market data integration
- Interactive 3D property visualization
- Smart contract integration for secure transactions
- **Quality Assurance** - ESLint, Vitest, Snyk, automated testing
- **Comprehensive Documentation** - 7 detailed docs in `/docs` folder

## Technical Overview

### Frontend
- **React 18** - Component-based architecture with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first responsive styling
- **React Router v6** - Client-side routing
- **Three.js** - 3D property visualizations
- **Web3.js** - Blockchain interactions

### Backend
- **Express.js** - RESTful API server
- **MongoDB/Mongoose** - Database (configuration ready)
- **JWT** - Authentication
- **In-memory storage** - Notes API demo

### Testing & Quality
- **Vitest** - 38 tests passing with 85.91% coverage
- **Supertest** - API integration testing
- **ESLint** - Code linting and standards
- **Snyk** - Security vulnerability scanning
- **madge** - Circular dependency detection
- **depcheck** - Unused dependency detection

## Core Components

1. **Home Page** - Hero Section with value proposition

- Featured Properties Grid (3 properties)
- "Why Choose Us" highlighting crypto benefits
- Investment Guide with step-by-step process
- Blog Preview with latest 3 posts
- Discord Community Section

2. **Properties Page**

- Filterable property grid
- Advanced search functionality
- Detailed property cards
- Three.js 3D visualization

3. **About Us Page**

- Company vision and mission
- Team profiles
- Platform statistics

4. **Blog Section**

- Category filtering
- Search functionality
- Author profiles
- Social sharing buttons

5. **Notes API** ✅

- Complete RESTful CRUD API
- Create, Read, Update, Delete operations
- In-memory storage for demonstration
- Fully tested (38 tests passing)
- Interactive frontend at `/notes`
- API endpoints at `/api/v1/notes`

## API Documentation

### Notes API Endpoints
- `POST /api/v1/notes` - Create a new note
- `GET /api/v1/notes` - Get all notes
- `GET /api/v1/notes/:id` - Get note by ID
- `PUT /api/v1/notes/:id` - Update note
- `DELETE /api/v1/notes/:id` - Delete note

**Full API documentation:** See [docs/API.md](./docs/API.md)

**Test documentation:** See [docs/NOTES_API_TESTS.md](./docs/NOTES_API_TESTS.md)

## Development Guidelines

1. **Component Creation**

- Follow atomic design principles
- Use TypeScript for type safety
- Implement responsive designs using Tailwind breakpoints
- Add proper comments and documentation

2. **State Management**

- Use React Context for global state
- Implement Redux for complex state management
- Keep component state minimal

3. **Security Considerations**

- Implement proper input validation
- Secure wallet connections
- Follow best practices for crypto transactions
- Regular security audits

## Learn More

- You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
- To learn React, check out the [React documentation](https://reactjs.org/).

## Contributing

Contributions are welcome! Please:

1. Create a feature branch
2. Write comprehensive tests
3. Document new features
4. Ensure code style consistency
5. Submit pull requests with clear descriptions

## Acknowledgments

Special thanks to the BestCity team for inspiration and the React/Tailwind CSS communities for their continued support and resources.

## Getting Started

### Prerequisites
- Node.js v20.x.x
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start both frontend (port 3000) and backend (port 4000)
npm start

# Or run separately
npm run dev
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Quality Checks
```bash
# Lint code
npm run lint
npm run lint:fix

# Check security
npm run audit:security

# Check unused dependencies
npm run deps:unused

# Check circular dependencies
npm run circular:check

# Run all quality checks
npm run quality:check
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api/v1
- **Notes App:** http://localhost:3000/notes
- **Test UI:** Run `npm run test:ui`

### Documentation
- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Notes API Tests](./docs/NOTES_API_TESTS.md)
- [Quality Tools Guide](./docs/QUALITY_TOOLS_GUIDE.md)
- [Security Audit](./docs/SECURITY_AUDIT.md)


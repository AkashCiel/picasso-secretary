# Project Architecture

## Overview

This project follows a clear separation between frontend and backend concerns, with shared code for common functionality.

## Directory Structure

```
picassos-secretary/
├── frontend/                    # 🎨 Next.js Frontend Application
│   ├── pages/                   # Next.js pages and API routes
│   │   ├── _app.js             # App wrapper
│   │   ├── index.js            # Home page
│   │   └── api/                # API routes (Next.js convention)
│   │       └── generate-image.js
│   ├── components/              # React components
│   │   ├── QuoteForm.js        # Main form component
│   │   └── ImagePreview.js     # Image preview component
│   ├── styles/                  # CSS styles
│   │   └── globals.css         # Global styles
│   ├── services/                # Frontend services
│   │   └── download-service.js  # Client-side download logic
│   └── config/                  # Frontend configuration
│       └── constants.js         # Frontend-specific constants
│
├── backend/                     # ⚙️ Backend Services
│   ├── services/                # Business logic services
│   │   ├── image-generator.js   # Core image generation
│   │   ├── template-service.js  # Template management
│   │   └── text-processing-service.js # Text parsing and formatting
│   ├── utils/                   # Backend utilities
│   │   └── character-width-cache.js # Font measurement cache
│   ├── config/                  # Backend configuration
│   │   └── typography.js        # Typography settings
│   └── errors/                  # Error handling
│       └── error-handler.js     # Centralized error handling
│
├── shared/                      # 🔄 Shared Code
│   └── constants/               # Shared constants
│       └── index.js             # Common constants (colors, dimensions, etc.)
│
├── public/                      # 📁 Static Assets
│   ├── fonts/                   # Font files
│   ├── templates/               # Template images
│   └── images/                  # Other static images
│
└── docs/                        # 📚 Documentation
    ├── README.md
    └── architecture.md
```

## Key Principles

### 1. Clear Separation of Concerns
- **Frontend**: User interface, client-side logic, user interactions
- **Backend**: Business logic, data processing, server-side operations
- **Shared**: Common code used by both frontend and backend

### 2. Self-Explanatory Structure
- **Question**: "Is there a frontend and a backend?" → **Answer**: Yes, clearly separated in `/frontend/` and `/backend/`
- **Question**: "Why are service files inside lib?" → **Answer**: They're now properly organized by purpose in `/backend/services/`

### 3. Next.js Framework Benefits
- API routes remain in `frontend/pages/api/` (Next.js convention)
- Automatic code splitting and optimizations
- Single deployment unit
- Built-in SSR capabilities

## File Responsibilities

### Frontend (`/frontend/`)
- **Components**: React UI components
- **Pages**: Next.js pages and API routes
- **Services**: Client-side services (downloads, API calls)
- **Styles**: CSS and styling
- **Config**: Frontend-specific configuration

### Backend (`/backend/`)
- **Services**: Business logic and core functionality
- **Utils**: Server-side utilities and helpers
- **Config**: Backend configuration and settings
- **Errors**: Error handling and custom error classes

### Shared (`/shared/`)
- **Constants**: Common values used across frontend and backend
- **Types**: Type definitions (for future TypeScript migration)

## Import Patterns

### Frontend Imports
```javascript
// Frontend components
import QuoteForm from '../components/QuoteForm.js'

// Backend services (from frontend)
import TemplateService from '../../backend/services/template-service.js'

// Shared constants
import { API } from '../config/constants.js'
```

### Backend Imports
```javascript
// Backend services
import TemplateService from './template-service.js'

// Backend utilities
import { getCharacterWidthCache } from '../utils/character-width-cache.js'

// Shared constants
import { CANVAS_CONFIG } from '../../shared/constants/index.js'
```

## Development Workflow

1. **Frontend Development**: Work in `/frontend/` directory
2. **Backend Development**: Work in `/backend/` directory
3. **Shared Code**: Update `/shared/` for common functionality
4. **API Routes**: Located in `/frontend/pages/api/` (Next.js convention)

## Benefits

- **Maintainability**: Clear boundaries between client and server code
- **Scalability**: Easy to add new features in appropriate directories
- **Team Collaboration**: Different developers can work on frontend/backend independently
- **Testing**: Easier to test frontend and backend separately
- **Deployment**: Single deployment unit with clear separation of concerns

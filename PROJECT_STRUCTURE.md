# DrinkMate Project Structure

## Overview

DrinkMate is a full-stack e-commerce platform built with Next.js (frontend) and Node.js/Express (backend).

## Directory Structure

```
DRINKMATE-new/
├── drinkmate-main/          # Next.js Frontend Application
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes (Next.js API routes)
│   │   ├── shop/            # Product pages
│   │   ├── account/         # User account pages
│   │   ├── checkout/        # Checkout flow
│   │   └── ...
│   ├── components/          # React components
│   │   ├── ui/              # UI components (shadcn/ui)
│   │   ├── chat/            # Chat components
│   │   ├── cart/            # Shopping cart components
│   │   ├── layout/          # Layout components
│   │   └── ...
│   ├── lib/                 # Utilities and libraries
│   │   ├── contexts/        # React contexts
│   │   ├── api/             # API client utilities
│   │   ├── services/        # Service layer
│   │   └── utils/           # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── public/              # Static assets
│   └── styles/              # Global styles
│
├── server/                  # Node.js Backend Application
│   ├── Controller/          # Route controllers (business logic)
│   ├── Models/              # Mongoose database models
│   ├── Router/              # Express route definitions
│   ├── Middleware/          # Express middleware
│   ├── Services/            # Business logic services
│   ├── Utils/               # Utility functions
│   ├── config/              # Configuration files
│   │   ├── env.template     # Environment variables template
│   │   └── security.example # Security config example
│   ├── tests/               # Test files
│   │   ├── arb/             # ARB payment gateway tests
│   │   ├── integration/     # Integration tests
│   │   └── unit/            # Unit tests
│   ├── scripts/             # Utility scripts
│   └── server.js            # Application entry point
│
├── docs/                    # Documentation
│   ├── integrations/        # Integration guides (ARB, Aramex)
│   ├── deployment/          # Deployment guides
│   └── api/                 # API documentation
│
├── deployment/              # Deployment scripts and configs
│   ├── *.sh                 # Deployment scripts
│   ├── nginx.conf           # Nginx configuration
│   └── ecosystem.config.js  # PM2 configuration
│
├── assets/                  # Project assets
│   ├── docs/                # PDFs and documentation files
│   └── integrations/        # Integration sample code
│
└── README.md                # Main project README
```

## Architecture Layers

### Frontend (drinkmate-main/)

1. **Pages Layer** (`app/`)
   - Next.js App Router pages
   - Route handlers
   - Server and client components

2. **Components Layer** (`components/`)
   - Reusable UI components
   - Feature-specific components
   - Layout components

3. **Business Logic Layer** (`lib/`)
   - API clients
   - Service layer
   - Context providers
   - Utility functions

### Backend (server/)

1. **Route Layer** (`Router/`)
   - Express route definitions
   - Route grouping

2. **Controller Layer** (`Controller/`)
   - Request handling
   - Response formatting
   - Input validation

3. **Service Layer** (`Services/`)
   - Business logic
   - External API integrations
   - Data processing

4. **Data Layer** (`Models/`)
   - Mongoose schemas
   - Database models
   - Data validation

5. **Middleware Layer** (`Middleware/`)
   - Authentication
   - Authorization
   - Security
   - Logging

## Key Conventions

### Naming Conventions

- **Files**: kebab-case (e.g., `arb-controller.js`)
- **Classes**: PascalCase (e.g., `ArbService`)
- **Functions/Variables**: camelCase (e.g., `processPayment`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ARB_BASE_URL`)

### File Organization

- One class/feature per file
- Related files grouped in directories
- Tests mirror source structure
- Configuration files in `config/`

### Code Organization

- Controllers: Handle HTTP requests/responses
- Services: Contain business logic
- Models: Define data structures
- Middleware: Cross-cutting concerns
- Utils: Pure utility functions

## Environment Configuration

### Backend (.env)
- Database connection
- API keys and secrets
- Payment gateway credentials
- Email configuration
- Server URLs

### Frontend (.env.local)
- API endpoints
- Public site URL
- Feature flags

## Testing

- **Unit Tests**: `server/tests/unit/`
- **Integration Tests**: `server/tests/integration/`
- **Payment Tests**: `server/tests/arb/`

## Documentation

- **Integration Guides**: `docs/integrations/`
- **Deployment Guides**: `docs/deployment/`
- **API Documentation**: `docs/api/`

## Best Practices

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **DRY Principle**: Reusable components and utilities
3. **Error Handling**: Consistent error handling across layers
4. **Security**: All sensitive data in environment variables
5. **Testing**: Tests for critical functionality
6. **Documentation**: Keep documentation up to date

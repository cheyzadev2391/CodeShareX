# Overview

MinuslarDev is a complete, functional Turkish code sharing platform designed for the Discord developer community. The platform features a dark green theme with gradient backgrounds, modern Monaco Editor integration, and comprehensive code management functionality. Built with React/TypeScript frontend and Express/Node.js backend, it provides a professional-grade experience for developers to share, discover, and interact with code snippets.

## Recent Changes (January 2025)
- Fixed all Select component errors by replacing empty string values with "all"
- Implemented full Turkish localization for all UI elements
- Enhanced dark green gradient theme as requested
- All functionality is operational: code sharing, gallery filtering, search, and navigation
- Resolved LSP diagnostics and type safety issues

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Code Editor**: Monaco Editor integration for syntax highlighting and code editing

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints for CRUD operations on code snippets
- **Data Storage**: Dual storage approach with in-memory storage for development and Drizzle ORM for production database operations
- **Request Handling**: Structured route handlers with validation using Zod schemas
- **Development Server**: Vite middleware integration for hot module replacement in development

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Single table design for code snippets with fields for title, code, language, category, tags, visibility settings, and engagement metrics
- **Validation**: Zod schemas for runtime type validation of API requests and responses

## Component Structure
- **Layout Components**: Header with navigation, footer with links and branding
- **Feature Components**: Code editor with Monaco integration, code cards for snippet display
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, buttons, and data display components
- **Page Components**: Home landing page, code sharing form, gallery view, and search functionality

## Styling and Theming
- **Design System**: Custom CSS variables for colors, spacing, and typography
- **Theme**: Dark theme with green accent colors (MinuslarDev branding)
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Typography**: Multiple font families including Inter, Georgia, and Menlo for different use cases

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database via `@neondatabase/serverless`
- **Drizzle Kit**: Database migration and schema management tools

## UI and Styling
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide Icons**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

## Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date formatting and manipulation utilities
- **Class Variance Authority**: Utility for managing component variants
- **Wouter**: Lightweight routing library

## Code Editor
- **Monaco Editor**: VS Code editor integration for code editing experience
- **Syntax Highlighting**: Language-specific highlighting for multiple programming languages

## Session Management
- **Connect-pg-simple**: PostgreSQL session store for Express sessions
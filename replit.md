# FirebrandIQ - AI-Powered Brand Intelligence Platform

## Overview

FirebrandIQ is a comprehensive brand intelligence and monitoring platform that combines AI-powered insights with social media management, content generation, and competitor analysis. The application is built as a full-stack solution with React frontend, Express.js backend, and PostgreSQL database, focusing on helping agencies and brands monitor their online presence, analyze sentiment, and optimize their digital marketing strategies.

The platform offers real-time brand monitoring, AI-driven content generation with enhanced readability and post selection, social media analytics, competitor tracking, and automated reporting capabilities. It integrates psychology-driven UX principles to present insights in an optimized, user-friendly manner with improved content formatting and user control over generated posts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: React Query for server state management and caching
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Pattern**: RESTful API design with structured error handling
- **File Structure**: Monorepo structure with shared types and schemas between client and server

### Data Storage Solutions
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Database Tables**: Users, profiles, clients, social connections, and agency management tables
- **Connection**: Neon serverless PostgreSQL with WebSocket support for real-time features

### Authentication and Authorization
- **Auth Provider**: Supabase for user authentication and session management
- **Session Management**: Express sessions with PostgreSQL store
- **User Profiles**: Separate profiles table linked to auth users for extended user information
- **Role-Based Access**: Agency roles (owner, admin, manager, analyst, member) for team management

### External Dependencies

**Core Infrastructure**:
- Neon Database for PostgreSQL hosting with serverless scaling
- Supabase for authentication, real-time subscriptions, and edge functions

**AI and Content Services**:
- OpenAI API integration for content generation and sentiment analysis
- Custom psychology engine for personalized user experience optimization

**Social Media Integrations**:
- Twitter/X API for social media monitoring and posting
- Instagram Graph API for Instagram analytics and content management
- LinkedIn API for professional network insights
- Facebook Graph API for Facebook page management
- Google Business API for review management

**Development and Deployment**:
- Replit for development environment with custom plugins
- Vite plugins for development experience enhancement
- PostCSS and Autoprefixer for CSS processing

**UI and Styling**:
- Radix UI primitives for accessible component foundations
- Lucide React for consistent iconography
- React Hook Form with Zod validation for form management
- Recharts for data visualization and analytics charts

**Utilities and Tools**:
- date-fns for date manipulation and formatting
- class-variance-authority and clsx for dynamic styling
- nanoid for unique ID generation
- ws for WebSocket connections

The application uses a service-oriented architecture with separate services for AI processing, social media management, content generation, and analytics. The codebase is structured to support both agency management (multi-client) and individual brand management use cases.

## Recent Changes

**January 14, 2025**
- ✅ Completed comprehensive social media API integration with real authentication flows
- ✅ Implemented full database schema with social_connections, social_posts, and social_metrics tables
- ✅ Created REST API endpoints for social media connection management, testing, and data fetching
- ✅ Built comprehensive social media dashboard with publishing, analytics, and connection management
- ✅ Enhanced content generation with improved readability and individual post selection
- ✅ Created modern landing page inspired by Flatpack theme with hero sections, features, testimonials, and pricing
- ✅ Ready for production deployment with real API credentials (Twitter, LinkedIn, Instagram, Facebook APIs required)
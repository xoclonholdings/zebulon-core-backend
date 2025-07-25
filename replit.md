# Project Overview

**ZED** is an enhanced AI assistant that combines OpenAI's conversational capabilities with Julius AI-style document processing in a seamless chat interface. This full-stack application allows users to upload files, have intelligent conversations with the AI assistant, and manage multiple analysis sessions. ZED fulfills the four essential functions of an AI agent: Input Handling, Task Interpretation, Action Execution, and Feedback Response.

## User Preferences

- **Agent Name**: ZED (not Julius AI)
- **Communication Style**: Simple, everyday language
- **Core Functionality**: Enhanced AI assistant with document processing capabilities

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and React hooks for local state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Style**: RESTful API with streaming support for chat responses
- **File Processing**: Multer for file uploads with support for multiple file types
- **Development**: Hot reloading with Vite integration

### Database & ORM
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Validation**: Zod schemas for type validation

## Key Components

### Data Models
- **Users**: Authentication and user management
- **Conversations**: Chat sessions with titles and metadata
- **Messages**: Individual chat messages with role-based content
- **Files**: Uploaded files with processing status and extracted content
- **Sessions**: Active conversation sessions

### Core Features
1. **Intelligent Chat Interface**: Real-time streaming conversations with ZED AI assistant
2. **Advanced File Processing**: Support for documents, images, spreadsheets, and text files up to 32GB
3. **Document Analysis**: Extract content, generate insights, and analyze data from uploaded files
4. **Session Management**: Track active conversations, file processing, and usage statistics
5. **Multi-Modal Capabilities**: Text analysis, image processing, and structured data interpretation
6. **Export & Sharing**: Export conversations and analysis results

### UI Components
- **ChatArea**: Main chat interface with ZED AI assistant and streaming responses
- **ChatSidebar**: Conversation history with ZED branding and navigation
- **SessionPanel**: File management, usage statistics, and quick actions
- **FileUpload**: Advanced drag-and-drop file upload supporting large files up to 32GB
- **ChatMessage**: Enhanced message display with file analysis results and code previews

## Data Flow

1. **User Interaction**: Users interact through the React frontend
2. **API Requests**: Frontend makes REST API calls to Express backend
3. **Database Operations**: Backend uses Drizzle ORM to interact with PostgreSQL
4. **File Processing**: Uploaded files are processed and analyzed
5. **AI Integration**: OpenAI API provides chat responses and file analysis
6. **Real-time Updates**: Streaming responses for chat messages
7. **State Management**: TanStack Query manages API state and caching

## External Dependencies

### Core Dependencies
- **AI Service**: OpenAI API (GPT-4) for intelligent conversations and document analysis
- **Database**: PostgreSQL (Neon Database) for data persistence (currently using in-memory storage)
- **File Processing**: Advanced file processing supporting multiple formats up to 32GB
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible interface

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Development server and build tool
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production build optimization

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot reloading for frontend development
- **Express Server**: Backend API with automatic restarts
- **Database**: Connection to PostgreSQL via environment variables
- **File Processing**: Local file uploads to uploads directory

### Production Build
- **Frontend**: Vite builds optimized React bundle to dist/public
- **Backend**: ESBuild bundles Express server to dist/index.js
- **Static Serving**: Express serves built frontend assets
- **Environment**: Production configuration via NODE_ENV

### Configuration Requirements
- `OPENAI_API_KEY`: OpenAI API access token (✅ Configured)
- File upload directory with support for large files (up to 32GB)
- In-memory storage for development (upgradeable to PostgreSQL)
- Session tracking for conversation management

### Recent Updates (January 25, 2025)
- ✅ Rebranded application from Julius AI to **ZED**
- ✅ Updated all UI components to reflect ZED branding
- ✅ Enhanced welcome messages and placeholder text
- ✅ Configured OpenAI API key for AI functionality
- ✅ Fixed TypeScript type issues in storage and components
- ✅ Updated project documentation and architecture details
- ✅ Removed all payment and plan references for clean AI assistant focus
- ✅ **Redesigned with unique cyberpunk aesthetic** featuring dark theme, animated gradients, and glassmorphism effects
- ✅ **Added social media feed integration** for Instagram, X (Twitter), Snapchat, and Flip.shop
- ✅ **Implemented collapsible sidebar** with clean minimal design
- ✅ **Enhanced visual elements** with morphing borders, pulse glows, and floating animations
- ✅ **Created distinctive ZED branding** with purple-cyan-pink gradient color scheme

The application uses a monorepo structure with shared TypeScript types and schemas between frontend and backend, ensuring type safety across the entire stack.
# ZED Interaction Logging REST API Documentation

## Overview
Complete REST API implementation for logging user interactions with ZED AI assistant using Express.js and Prisma with PostgreSQL Oracle database.

## Database Schema

### interaction_log Table
```sql
CREATE TABLE interaction_log (
  id         VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    VARCHAR NOT NULL REFERENCES users(id),
  prompt     TEXT NOT NULL,
  response   TEXT NOT NULL,
  timestamp  TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata   JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_interaction_log_user_id ON interaction_log(user_id);
CREATE INDEX idx_interaction_log_timestamp ON interaction_log(timestamp);
```

## API Endpoints

### 1. POST /api/log - Log User Interaction

**Purpose**: Store a new user-ZED interaction in the Oracle database

**Authentication**: Required (session-based)

**Request Body**:
```json
{
  "prompt": "How do I create REST API routes in ZED?",
  "response": "You can create REST API routes using Express.js with Prisma for database operations...",
  "metadata": {
    "response_time": 1500,
    "model": "gpt-4o",
    "session_id": "session_123",
    "category": "development"
  }
}
```

**Response (Success 201)**:
```json
{
  "success": true,
  "logId": "log_abc123xyz",
  "timestamp": "2025-07-26T04:35:00.000Z",
  "message": "Interaction logged successfully"
}
```

**Response (Error 400)**:
```json
{
  "error": "Both prompt and response are required"
}
```

**Response (Error 401)**:
```json
{
  "error": "User not authenticated"
}
```

### 2. GET /api/logs/:userId - Fetch User Interaction History

**Purpose**: Retrieve interaction logs for memory previews and admin dashboards

**Authentication**: Required (users can only access their own logs unless admin)

**URL Parameters**:
- `userId`: Target user ID

**Query Parameters**:
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)
- `dateFrom`: Start date filter (ISO format)
- `dateTo`: End date filter (ISO format)

**Example Request**:
```
GET /api/logs/user_001?limit=20&offset=0&dateFrom=2025-07-26T00:00:00Z
```

**Response (Success 200)**:
```json
{
  "success": true,
  "userId": "user_001",
  "logs": [
    {
      "id": "log_abc123",
      "prompt": "How do I create REST API routes?",
      "response": "You can create REST API routes using Express.js...",
      "timestamp": "2025-07-26T04:35:00.000Z",
      "metadata": {
        "response_time": 1500,
        "model": "gpt-4o"
      },
      "user": {
        "email": "admin@zed.local",
        "name": "ZED Admin"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "filters": {
    "dateFrom": "2025-07-26T00:00:00Z",
    "dateTo": null
  }
}
```

**Response (Error 403)**:
```json
{
  "error": "Access denied. You can only view your own interaction logs"
}
```

### 3. GET /api/logs/:userId/stats - User Interaction Statistics

**Purpose**: Get statistics for admin dashboard and memory management

**Authentication**: Required (user-scoped access)

**Query Parameters**:
- `days`: Number of days to analyze (default: 30)

**Example Request**:
```
GET /api/logs/user_001/stats?days=7
```

**Response (Success 200)**:
```json
{
  "success": true,
  "userId": "user_001",
  "period_days": 7,
  "statistics": {
    "total_interactions": 23,
    "daily_breakdown": [
      {
        "date": "2025-07-26",
        "interaction_count": 5,
        "avg_prompt_length": 67.2,
        "avg_response_length": 234.8
      }
    ],
    "recent_prompts": [
      {
        "prompt": "How do I create REST API routes in ZED? I need to implement logging functionality...",
        "timestamp": "2025-07-26T04:35:00.000Z"
      }
    ]
  }
}
```

## Implementation Details

### Authentication Middleware
```javascript
// Uses existing ZED authentication system
app.post("/api/log", isAuthenticated, async (req, res) => {
  const userId = req.session.user?.id;
  // Implementation...
});
```

### Security Features
- **User-scoped access**: Users can only view their own logs
- **Admin override**: Admin users can access all logs
- **Session validation**: All endpoints require valid authenticated sessions
- **Input validation**: Required fields validated before database operations

### Error Handling
- **Database connection errors**: Proper error responses with details
- **Validation errors**: Clear messages for missing/invalid data
- **Authentication errors**: Unauthorized access prevention
- **Permission errors**: Access denied for restricted operations

### Performance Optimizations
- **Database indexes**: Optimized queries on user_id and timestamp
- **Pagination**: Prevents large data transfers
- **Connection management**: Proper Prisma client lifecycle
- **Query optimization**: Efficient joins and filtering

## Usage Examples

### Frontend Integration
```javascript
// Log an interaction from React component
const logInteraction = async (prompt, response) => {
  try {
    const result = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        response,
        metadata: {
          response_time: Date.now() - startTime,
          model: 'gpt-4o',
          session_id: sessionId
        }
      })
    });
    
    if (result.ok) {
      console.log('Interaction logged successfully');
    }
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
};
```

### Backend Service Integration
```javascript
// Log from ZED response generation
import { PrismaClient } from '@prisma/client';

const logUserInteraction = async (userId, prompt, response, metadata = {}) => {
  const prisma = new PrismaClient();
  
  try {
    await prisma.interaction_log.create({
      data: {
        user_id: userId,
        prompt,
        response,
        metadata,
        timestamp: new Date()
      }
    });
  } finally {
    await prisma.$disconnect();
  }
};
```

### Admin Dashboard Query
```javascript
// Fetch user logs for admin dashboard
const getUserLogs = async (userId, limit = 50) => {
  const response = await fetch(`/api/logs/${userId}?limit=${limit}`);
  const data = await response.json();
  
  return {
    logs: data.logs,
    totalInteractions: data.pagination.total,
    hasMore: data.pagination.hasMore
  };
};
```

## Database Relationships

```sql
-- Foreign key relationships
interaction_log.user_id → users.id
```

## Monitoring & Analytics

- **Real-time logging**: All interactions captured immediately
- **Memory management**: Supports ZED's memory preview system
- **Performance tracking**: Response times and interaction patterns
- **Usage analytics**: Daily/weekly interaction statistics
- **Admin oversight**: Comprehensive dashboard capabilities

## Security Considerations

1. **Data Privacy**: User-scoped access prevents unauthorized data viewing
2. **Input Sanitization**: All inputs validated before database operations
3. **Session Security**: Relies on ZED's secure session management
4. **Error Handling**: No sensitive information leaked in error responses
5. **Rate Limiting**: Consider implementing for high-traffic scenarios

This REST API provides complete interaction logging capabilities for ZED's Oracle database integration with robust security, performance optimization, and comprehensive analytics features.
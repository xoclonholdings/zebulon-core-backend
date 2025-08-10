# ZED Query Logging CRUD API Documentation

## Overview
The ZED Query Logging API provides comprehensive CRUD operations for tracking user queries, ZED responses, and interaction analytics using PostgreSQL via Prisma.

## Authentication
All endpoints require authentication via session cookies or Prisma auth middleware.

## API Endpoints

### 1. CREATE - Log Query Interaction
**POST** `/api/query-logs`

**Purpose**: Log a new query-response interaction between user and ZED

**Request Body**:
```json
{
  "query": "How do I connect to PostgreSQL database?",
  "response": "You can connect using Prisma client with DATABASE_URL...",
  "conversationId": "conv_abc123",
  "model": "gpt-4o",
  "duration": 1500,
  "metadata": {
    "query_type": "database",
    "complexity": "medium"
  }
}
```

**Response**:
```json
{
  "success": true,
  "logId": "log_xyz789",
  "message": "Query interaction logged successfully"
}
```

### 2. READ - Get Query Logs
**GET** `/api/query-logs`

**Purpose**: Retrieve query logs with filtering options

**Query Parameters**:
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)
- `conversationId`: Filter by conversation
- `dateFrom`: Start date filter (ISO format)
- `dateTo`: End date filter (ISO format)
- `model`: Filter by AI model
- `includeAll`: Admin only - see all users' logs

**Response**:
```json
{
  "logs": [
    {
      "id": "log_xyz789",
      "event_data": {
        "query": "How do I...",
        "response": "You can...",
        "model": "gpt-4o"
      },
      "duration": 1500,
      "created_at": "2025-07-26T04:30:00Z",
      "users": {
        "email": "user@example.com",
        "firstName": "John"
      }
    }
  ],
  "total": 1,
  "filters": {...}
}
```

### 3. READ - Get User Statistics
**GET** `/api/query-logs/stats`

**Purpose**: Get user's query interaction statistics

**Query Parameters**:
- `days`: Number of days to analyze (default: 30)
- `targetUserId`: Admin only - check other user's stats

**Response**:
```json
{
  "userId": "user_001",
  "stats": {
    "total_queries": 45,
    "avg_duration": 1250.5,
    "total_duration": 56275,
    "period_days": 30,
    "daily_stats": [...],
    "model_distribution": [...]
  }
}
```

### 4. READ - Get Top Queries
**GET** `/api/query-logs/top`

**Purpose**: Get recent or top queries for analysis

**Query Parameters**:
- `limit`: Number of results (default: 10)
- `includeAll`: Admin only - include all users

**Response**:
```json
{
  "queries": [
    {
      "query": "How do I...",
      "response_preview": "You can...",
      "user_email": "user@example.com",
      "duration": 1500,
      "timestamp": "2025-07-26T04:30:00Z"
    }
  ],
  "limit": 10
}
```

### 5. READ - Search Queries
**GET** `/api/query-logs/search`

**Purpose**: Search query content by text

**Query Parameters**:
- `q`: Search term (required)
- `limit`: Number of results (default: 20)
- `includeAll`: Admin only - search all users

**Response**:
```json
{
  "results": [...],
  "searchTerm": "database",
  "count": 5
}
```

### 6. UPDATE - Batch Operations
**PATCH** `/api/query-logs/batch`

**Purpose**: Perform batch updates on query logs

**Request Body**:
```json
{
  "action": "update_metadata",
  "logIds": ["log_1", "log_2"],
  "metadata": {
    "reviewed": true,
    "category": "technical"
  }
}
```

**Actions**:
- `update_metadata`: Update metadata for logs
- `delete`: Delete multiple logs

### 7. DELETE - Cleanup Old Logs
**DELETE** `/api/query-logs/cleanup`

**Purpose**: Remove old query logs (admin operation)

**Request Body**:
```json
{
  "daysToKeep": 90
}
```

## Database Schema

The API uses the `analytics` table with the following structure:

```sql
analytics:
- id (varchar, primary key)
- user_id (varchar, foreign key to users)
- event_type (varchar) = 'query_interaction'
- event_data (json) = {query, response, model, lengths}
- session_id (varchar, optional)
- conversation_id (varchar, foreign key to conversations)
- duration (integer, milliseconds)
- metadata (json, additional data)
- created_at (timestamp)
```

## Usage Examples

### Logging a Query in Application Code
```javascript
import { QueryLogger } from './services/queryLogger';

// After ZED generates a response
await QueryLogger.logQuery({
  userId: user.id,
  query: userInput,
  response: zedResponse,
  conversationId: currentConversation.id,
  model: 'gpt-4o',
  duration: responseTime,
  metadata: {
    query_type: 'analysis',
    file_uploaded: hasFiles
  }
});
```

### Frontend Integration
```javascript
// Log query from React component
const logQueryInteraction = async (query, response) => {
  await fetch('/api/query-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      response,
      conversationId: currentConversation.id,
      model: 'gpt-4o',
      duration: Date.now() - startTime
    })
  });
};
```

## Analytics Features

1. **Query Tracking**: Every user query and ZED response is logged
2. **Performance Metrics**: Response times and duration tracking
3. **Usage Statistics**: Daily, weekly, monthly usage patterns
4. **Search Capabilities**: Find queries by content or metadata
5. **User Analytics**: Individual and aggregate user statistics
6. **Data Retention**: Configurable cleanup of old logs
7. **Batch Operations**: Bulk updates and deletions

## Security & Privacy

- All endpoints require authentication
- Users can only access their own logs (unless admin)
- Admin users can view system-wide analytics
- Automatic cleanup of old data
- Sensitive information can be filtered from logs

## Performance Considerations

- Indexed on user_id, event_type, created_at for fast queries
- JSON fields for flexible metadata storage
- Pagination support for large datasets
- Efficient aggregation queries for statistics
- Background cleanup processes

This CRUD API provides comprehensive logging and analytics for ZED's query interactions while maintaining security and performance standards.
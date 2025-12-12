# View Counter Implementation

This document explains the athlete profile view counter implementation for TrackWrapped.

## Architecture

### Backend (Vercel Serverless)
- **Endpoint**: `/api/view.js`
- **Database**: Vercel Postgres
- **Table**: `athlete_views(athlete_id TEXT PRIMARY KEY, views INT DEFAULT 0, created_at TIMESTAMP, updated_at TIMESTAMP)`

### Frontend
- **Service**: `src/services/viewTrackingService.ts`
- **Integration**: Called when athlete wrapped view is loaded in `src/components/StorySlides.vue`

## Setup Instructions

### 1. Database Setup (Vercel)

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the connection string: `POSTGRES_URL` or `POSTGRES_URLPGSQL_URL_NON_POOLING`
4. Add to your `.env.local`:

```bash
POSTGRES_URLPGSQL_URL_NON_POOLING=postgres://user:password@host:5432/db
```

### 2. Environment Configuration

The API route will automatically create the table on first use if it doesn't exist. No manual schema setup needed.

### 3. Deployment

Push your code to Vercel. The API route will be available at `https://yourdomain.com/api/view`.

## API Usage

### POST /api/view

**Request:**
```json
{
  "athleteId": "12345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "athleteId": "12345",
  "views": 1
}
```

**Response (Error):**
```json
{
  "error": "Invalid athleteId"
}
```

## Frontend Integration

The view tracking is automatically integrated into the StorySlides component:

```typescript
import { trackAthleteView } from '@/services/viewTrackingService'

// When athlete wrapped is loaded:
trackAthleteView(athleteId) // Fire and forget, doesn't block UI
```

### Features
- **Non-blocking**: View tracking happens asynchronously without affecting user experience
- **Error handling**: Failed requests are logged but don't disrupt the app
- **Type-safe**: Full TypeScript support

## Database Schema

```sql
CREATE TABLE athlete_views (
  athlete_id TEXT PRIMARY KEY,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Behavior

1. **First View**: Creates a new row with `views = 1`
2. **Subsequent Views**: Increments the `views` count by 1
3. **Upsert Strategy**: Uses PostgreSQL `ON CONFLICT` clause for atomic operations

## Monitoring

To check view counts from Vercel Postgres:

```sql
SELECT athlete_id, views, updated_at 
FROM athlete_views 
ORDER BY views DESC 
LIMIT 10;
```

## Future Enhancements

- [ ] Add GET endpoint to retrieve view count
- [ ] Add view analytics dashboard
- [ ] Track additional metrics (time spent, slides viewed, etc.)
- [ ] Add rate limiting to prevent spam
- [ ] Export view statistics

## Troubleshooting

### Views not being tracked
1. Check that `.env.local` has the correct Postgres URL
2. Verify the API route is deployed on Vercel
3. Check browser console for errors
4. Check Vercel function logs

### Database connection errors
1. Verify Postgres URL is correct
2. Check that Vercel project is connected to Postgres database
3. Ensure environment variable name matches exactly: `POSTGRES_URLPGSQL_URL_NON_POOLING`

### CORS issues
The API is same-origin, so CORS shouldn't be an issue. If problems occur, ensure the fetch URL is `/api/view` (relative path).

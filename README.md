# Task Manager Backend

Express.js + TypeScript backend deployed on Firebase Cloud Functions Gen 2.

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: Firebase Firestore
- **Validation**: Zod
- **Deployment**: Firebase Cloud Functions Gen 2

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Firestore data access
│   ├── routes/          # API route definitions
│   ├── types/           # TypeScript types and schemas
│   ├── middleware/      # Express middleware
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Cloud Function entry point
├── lib/                 # Compiled JavaScript (generated)
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

## Development

Run the Firebase emulator:
```bash
npm run serve
```

This will start the functions emulator at `http://localhost:5001`.

## API Endpoints

### Authentication
- `POST /auth/check` - Check if email exists
  - Body: `{ email: string }`
  - Response: `{ exists: boolean, user?: User, tokenL token }`

- `POST /auth/register` - Register new user
  - Body: `{ email: string }`
  - Response: `{ user: User }`

### Tasks
All task endpoints require the `x-user-id` header.

- `GET /tasks` - Get all tasks for user
  - Response: `{ tasks: Task[] }`

- `POST /tasks` - Create new task
  - Body: `{ title: string, description?: string }`
  - Response: `{ task: Task }`

- `PUT /tasks/:id` - Update task
  - Body: `{ title?: string, description?: string, completed?: boolean }`
  - Response: `{ task: Task }`

- `DELETE /tasks/:id` - Delete task
  - Response: `{ success: boolean }`

## Deployment

Deploy to Firebase:
```bash
npm run deploy
```

This deploys the Cloud Function to Firebase with Gen 2 configuration:
- Memory: 256MiB
- Timeout: 30 seconds
- Region: us-central1
- Min instances: 0 (development)

## Environment

Update the Firebase project ID in your Firebase configuration before deploying.

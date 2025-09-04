# Task Manager Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing tasks with user authentication, featuring calendar integration and time-based reminders.

## Features

- User registration and login with JWT authentication
- CRUD operations for tasks
- User-specific task management
- Password hashing with bcrypt
- Input validation with express-validator
- MongoDB Atlas integration
- Task due dates and reminder times
- Task priority levels (low, medium, high)
- Production-ready deployment configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task (with dueDate, reminderTime, priority)
- `PUT /api/tasks/:id` - Update a task (with dueDate, reminderTime, priority)
- `DELETE /api/tasks/:id` - Delete a task

## Setup Instructions

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update MONGODB_URI in .env

### Deployment on Render

1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Set environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy!

## API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task (Protected)
```bash
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "reminderTime": "2024-01-15T09:00:00.000Z",
  "priority": "high"
}
```

### Get Tasks (Protected)
```bash
GET /api/tasks
Authorization: Bearer <jwt_token>
```

### Update Task (Protected)
```bash
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "completed",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "reminderTime": "2024-01-20T10:00:00.000Z",
  "priority": "medium"
}
```

### Delete Task (Protected)
```bash
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

## Data Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  userId: ObjectId (required, ref: 'User'),
  title: String (required, max 100 chars),
  description: String (max 500 chars),
  status: String (enum: ['pending', 'completed'], default: 'pending'),
  dueDate: Date (optional),
  reminderTime: Date (optional),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  notificationId: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Task Creation/Update
- `title`: Required, 1-100 characters
- `description`: Optional, max 500 characters
- `dueDate`: Optional, valid ISO8601 date
- `reminderTime`: Optional, valid ISO8601 date
- `priority`: Optional, must be 'low', 'medium', or 'high'

### User Registration
- `username`: Required, unique
- `email`: Required, unique, valid email format
- `password`: Required, minimum 6 characters

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Protected routes with middleware
- Input validation and sanitization
- CORS protection
- Environment variable protection

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `express-validator`: Input validation
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

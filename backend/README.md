# Task Manager Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing tasks with user authentication.

## Features

- User registration and login with JWT authentication
- CRUD operations for tasks
- User-specific task management
- Password hashing with bcrypt
- Input validation
- MongoDB Atlas integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Setup Instructions

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```
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
  "description": "Finish the task manager app"
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
  "status": "completed"
}
```

### Delete Task (Protected)
```bash
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

# 📱 Full Stack Task Manager App

A complete cross-platform mobile task management application built with **React Native (Expo)** and **Node.js + Express** backend, featuring calendar integration, time-based reminders, and push notifications.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- ✅ JWT Authentication (Register/Login)
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CRUD operations for tasks
- ✅ User-specific task management
- ✅ Input validation with express-validator
- ✅ MongoDB Atlas integration
- ✅ Task due dates and reminder times
- ✅ Task priority levels (low, medium, high)
- ✅ Ready for Render deployment

### Mobile App (React Native + Expo)
- ✅ Cross-platform (iOS & Android)
- ✅ Authentication screens with validation
- ✅ JWT token management with AsyncStorage
- ✅ Task CRUD operations
- ✅ Calendar integration with date pickers
- ✅ Time-based reminder scheduling
- ✅ Push notifications with background support
- ✅ Task priority management
- ✅ Clean, intuitive UI with reusable components
- ✅ Pull-to-refresh functionality
- ✅ Logout functionality
- ✅ Production-ready builds with EAS

## 📁 Project Structure

```
task-manager/
├── backend/                      # Node.js + Express API
│   ├── middleware/               # JWT auth middleware
│   │   └── auth.js
│   ├── models/                   # Mongoose models
│   │   ├── Task.js               # Enhanced with dueDate, reminderTime, priority
│   │   └── User.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   └── tasks.js              # Enhanced with validation
│   ├── server.js                 # Server entry
│   ├── package.json              # Backend dependencies/scripts
│   └── README.md                 # Backend docs
│
├── mobile-app/                   # React Native (Expo) app
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Button.js
│   │   │   ├── InputField.js
│   │   │   └── TaskCard.js       # Enhanced with due date & priority display
│   │   ├── config/               # API configuration
│   │   │   └── config.js         # Uses environment variables
│   │   ├── context/              # Auth context
│   │   │   └── AuthContext.js
│   │   ├── navigation/           # Navigation setup
│   │   │   └── AppNavigator.js
│   │   ├── screens/              # Screens
│   │   │   ├── AddTaskScreen.js  # Enhanced with date/time pickers
│   │   │   ├── EditTaskScreen.js # Enhanced with date/time pickers
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── TaskListScreen.js
│   │   └── services/             # API & notifications
│   │       ├── api.js            # Enhanced with notification scheduling
│   │       └── notificationService.js # Production-ready notification system
│   ├── assets/                   # Icons & splash
│   │   ├── adaptive-icon.png
│   │   ├── favicon.png
│   │   ├── icon.png
│   │   └── splash-icon.png
│   ├── App.js                    # App entry with notification setup
│   ├── index.js                  # Web entry
│   ├── app.json                  # Expo config with notification settings
│   ├── app.config.js             # Environment variable loader
│   ├── eas.json                  # EAS build configuration
│   ├── package.json              # Mobile dependencies/scripts
│   └── README.md                 # Mobile docs
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- Git

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd task-manager

# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies
cd ../mobile-app
npm install
```

### 2. Backend Setup

1. **Create MongoDB Atlas Database:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create a database user
   - Whitelist your IP (or use 0.0.0.0/0 for development)
   - Get your connection string

2. **Configure Environment Variables:**
   ```bash
   cd backend
   # Create .env file with your values
   ```
   
   Update `.env` with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NODE_ENV=development
   ```

3. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   
   The API will be available at `http://localhost:5000`

### 3. Mobile App Setup

1. **Configure Environment Variables:**
   ```bash
   cd mobile-app
   # Create .env file
   ```
   
   Add to `.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Start Expo Development Server:**
   ```bash
   npx expo start
   ```

3. **Run on Device/Simulator:**
   - **iOS:** Press `i` in terminal or scan QR code with Camera app
   - **Android:** Press `a` in terminal or scan QR code with Expo Go app
   - **Web:** Press `w` in terminal

### 4. Deployment

#### Backend Deployment (Render)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Connect your GitHub repo to [Render](https://render.com)
   - Set environment variables in Render dashboard:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `NODE_ENV`: `production`
   - Deploy!

3. **Update Mobile App:**
   - Update `EXPO_PUBLIC_API_URL` in `mobile-app/.env` with your Render URL

#### Mobile App Deployment

1. **Build for Production:**
   ```bash
   cd mobile-app
   eas build --profile production --platform android
   eas build --profile production --platform ios
   ```

2. **Publish to App Stores:**
   - Follow Expo's [app store deployment guide](https://docs.expo.dev/distribution/app-stores/)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task (with dueDate, reminderTime, priority)
- `PUT /api/tasks/:id` - Update task (with dueDate, reminderTime, priority)
- `DELETE /api/tasks/:id` - Delete task

## 📱 App Screens

1. **Authentication Flow:**
   - Login Screen
   - Register Screen

2. **Main App Flow:**
   - Task List Screen (with logout)
   - Add Task Screen (with date/time pickers)
   - Edit Task Screen (with date/time pickers)

## 🎯 Key Features Implemented

- ✅ **Full Authentication System** - JWT-based with secure storage
- ✅ **CRUD Operations** - Complete task management
- ✅ **Calendar Integration** - Date pickers for due dates
- ✅ **Time-based Reminders** - Time pickers for reminder scheduling
- ✅ **Push Notifications** - Background notification support
- ✅ **Task Priorities** - Low, medium, high priority levels
- ✅ **Real-time Updates** - Instant UI updates after API calls
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Cross-platform** - iOS, Android, and Web support
- ✅ **Production Ready** - EAS builds and deployment configurations

## 🧪 Testing the App

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Mobile App:** `cd mobile-app && npx expo start`
3. **Test Flow:**
   - Register a new account
   - Login with credentials
   - Create tasks with due dates and reminders
   - Test notification scheduling
   - Edit task priorities
   - Test push notifications
   - Delete tasks

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT tokens with 7-day expiration
- Protected API routes with middleware
- Input validation and sanitization
- Secure token storage with AsyncStorage
- CORS protection
- Environment variable protection

## 🚨 Common Issues & Solutions

1. **MongoDB Connection Issues:**
   - Ensure IP is whitelisted in MongoDB Atlas
   - Check connection string format
   - Verify database user permissions

2. **Mobile App Can't Connect to Backend:**
   - Check environment variables in `.env`
   - For Android emulator, use `10.0.2.2:5000` instead of `localhost:5000`
   - Ensure backend server is running

3. **Push Notifications Not Working:**
   - Check app permissions
   - Test on physical device (not simulator for full functionality)
   - Verify notification channels are configured

4. **Date/Time Picker Issues:**
   - Ensure `@react-native-community/datetimepicker` is installed
   - Test on physical device for best experience

## 📈 Future Enhancements

- Task categories and tags
- Recurring tasks
- Task sharing and collaboration
- Dark mode support
- Offline functionality
- Task statistics and analytics
- Calendar view integration
- Task templates

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

**Built with ❤️ using React Native, Node.js, and MongoDB**

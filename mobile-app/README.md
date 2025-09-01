# 📱 Task Manager Mobile App

React Native + Expo mobile application for task management.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update API URL:**
   - Open `src/services/api.js`
   - Update `BASE_URL` to point to your backend server

3. **Start development server:**
   ```bash
   npx expo start
   ```

4. **Run on device:**
   - iOS: Press `i` or scan QR with Camera
   - Android: Press `a` or scan QR with Expo Go
   - Web: Press `w`

## 📱 Features

- 🔐 User authentication (Login/Register)
- ✅ Task CRUD operations
- 🔄 Pull-to-refresh
- 📢 Push notifications
- 💾 Offline auth state persistence
- 🎨 Clean, intuitive UI
- 📱 Cross-platform support

## 🏗️ Architecture

```
src/
├── components/         # Reusable UI components
│   ├── Button.js      # Custom button component
│   ├── InputField.js  # Form input component
│   └── TaskCard.js    # Task display component
├── screens/           # App screens
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── TaskListScreen.js
│   ├── AddTaskScreen.js
│   └── EditTaskScreen.js
├── navigation/        # Navigation setup
│   └── AppNavigator.js
├── context/           # React context
│   └── AuthContext.js # Authentication state
└── services/          # External services
    ├── api.js         # API client
    └── notificationService.js
```

## 🎨 UI Components

### Button
```jsx
<Button
  title="Click me"
  onPress={handlePress}
  variant="primary" // primary, secondary, danger
  loading={false}
/>
```

### InputField
```jsx
<InputField
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  error={emailError}
/>
```

### TaskCard
```jsx
<TaskCard
  task={taskObject}
  onToggleStatus={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## 🔧 Configuration

### API Configuration
Update `src/services/api.js`:
```javascript
const BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-backend-url.com/api';
```

### Notifications
The app uses Expo Notifications for:
- Task completion celebrations
- Future: Task reminders and due date alerts

## 🧪 Development Tips

1. **Hot Reloading:** Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
2. **Debug Menu:** Access via shake gesture or debug menu
3. **Console Logs:** Use `npx expo logs` or check Metro bundler
4. **State Management:** Auth state managed via React Context

## 📦 Build & Deploy

### Development Build
```bash
npx expo build:android
npx expo build:ios
```

### Production Build
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

### EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npx expo r -c  # Clear cache and restart
   ```

2. **Android network issues:**
   - Use `10.0.2.2:5000` for emulator
   - Use your computer's IP for physical device

3. **iOS simulator network issues:**
   - Use `localhost:5000` or your computer's IP

4. **Navigation issues:**
   - Ensure all screens are properly imported
   - Check navigation parameter passing

### Debug Commands
```bash
# Clear cache
npx expo r -c

# View logs
npx expo logs

# Check for issues
npx expo doctor
```

## 📱 Supported Platforms

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phone & Tablet)
- ✅ Web (responsive design)

---

**Happy coding! 🚀**

# 📱 Task Manager Mobile App

React Native + Expo mobile application for task management with calendar integration, time-based reminders, and push notifications.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```

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
- 📅 Calendar integration with date pickers
- ⏰ Time-based reminder scheduling
- 🔔 Push notifications with background support
- 🎯 Task priority management (low, medium, high)
- 🔄 Pull-to-refresh
- 💾 Offline auth state persistence
- 🎨 Clean, intuitive UI
- 📱 Cross-platform support
- 🚀 Production-ready builds with EAS

## 🏗️ Architecture

```
src/
├── components/         # Reusable UI components
│   ├── Button.js      # Custom button component
│   ├── InputField.js  # Form input component
│   └── TaskCard.js    # Task display component (enhanced with due date & priority)
├── screens/           # App screens
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── TaskListScreen.js
│   ├── AddTaskScreen.js    # Enhanced with date/time pickers
│   └── EditTaskScreen.js   # Enhanced with date/time pickers
├── navigation/        # Navigation setup
│   └── AppNavigator.js
├── context/           # React context
│   └── AuthContext.js # Authentication state
├── config/            # Configuration
│   └── config.js      # API configuration (uses environment variables)
└── services/          # External services
    ├── api.js         # API client (enhanced with notification scheduling)
    └── notificationService.js # Production-ready notification system
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

## 📅 Calendar & Time Features

### Date Picker (Due Date)
- Date-only selection for task due dates
- Prevents past dates
- Quick action buttons (e.g., "Due today")

### Time Picker (Reminder Time)
- Time-only selection for reminder scheduling
- Allows any minute selection
- Quick action buttons (e.g., "Remind at 9:00 AM")

### Priority Selection
- Three priority levels: Low, Medium, High
- Visual indicators in task cards
- Color-coded priority display

## 🔔 Notification System

### Features
- Background notification support
- Scheduled reminders based on due date + reminder time
- Hybrid scheduling (Expo native + setTimeout fallback)
- App restart recovery
- Android notification channels
- iOS background modes

### Configuration
The notification system is configured in:
- `app.json`: Notification plugin settings
- `App.js`: Background notification handler
- `notificationService.js`: Core notification logic

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### API Configuration
The app automatically uses environment variables via `src/config/config.js`:
```javascript
import Constants from 'expo-constants';

export const getApiUrl = () => {
  return Constants.expoConfig?.extra?.apiUrl || 'https://default-url.com/api';
};
```

## 🧪 Development Tips

1. **Hot Reloading:** Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
2. **Debug Menu:** Access via shake gesture or debug menu
3. **Console Logs:** Use `npx expo logs` or check Metro bundler
4. **State Management:** Auth state managed via React Context
5. **Date/Time Testing:** Test on physical device for best date picker experience
6. **Notification Testing:** Use physical device for full notification functionality

## 📦 Build & Deploy

### Development Build
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Preview Build
```bash
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

### Production Build
```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Local Development
```bash
npx expo start --dev-client
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

4. **Date/Time picker issues:**
   - Ensure `@react-native-community/datetimepicker` is installed
   - Test on physical device for best experience

5. **Notification issues:**
   - Check app permissions
   - Test on physical device (not simulator)
   - Verify notification channels are configured

6. **Build issues:**
   - Ensure all dependencies are installed
   - Check EAS configuration in `eas.json`
   - Verify environment variables are set

### Debug Commands
```bash
# Clear cache
npx expo r -c

# View logs
npx expo logs

# Check for issues
npx expo doctor

# Test notifications
npx expo start --dev-client
```

## 📱 Supported Platforms

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phone & Tablet)
- ✅ Web (responsive design)

## 🔒 Security Features

- JWT token authentication
- Secure token storage with AsyncStorage
- Environment variable protection
- Input validation
- Error handling

## 📈 Performance Features

- Optimized re-renders with React Context
- Efficient API calls with axios interceptors
- Background notification processing
- App state persistence
- Memory-efficient notification scheduling

---

**Happy coding! 🚀**

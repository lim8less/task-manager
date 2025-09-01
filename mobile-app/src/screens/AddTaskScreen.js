// In AddTaskScreen.js - Fixed version
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const AddTaskScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    reminderTime: null,
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Fix: Separate state for picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date'); // 'date' or 'time'

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.dueDate && formData.reminderTime && formData.reminderTime >= formData.dueDate) {
      newErrors.reminderTime = 'Reminder must be before due date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await ApiService.createTask(formData);
      if (response.success) {
        Alert.alert('Success', 'Task created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Create task error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create task';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Fix: Proper date picker handling
  const handleDateChange = (event, selectedDate) => {
    // Always hide the picker first
    setShowDatePicker(false);
    setShowReminderPicker(false);
    
    // Only update if user didn't cancel
    if (event.type === 'set' && selectedDate) {
      if (pickerMode === 'date') {
        updateField('dueDate', selectedDate);
      } else if (pickerMode === 'time') {
        updateField('reminderTime', selectedDate);
      }
    }
  };

  // Fix: Separate functions for date and time
  const showDueDatePicker = () => {
    setPickerMode('date');
    setShowDatePicker(true);
  };

  const showReminderTimePicker = () => {
    setPickerMode('time');
    setShowReminderPicker(true);
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString();
  };

  const formatTime = (date) => {
    if (!date) return 'Not set';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const priorities = [
    { value: 'low', label: 'Low', color: '#44AA44' },
    { value: 'medium', label: 'Medium', color: '#FFAA00' },
    { value: 'high', label: 'High', color: '#FF4444' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>Create a task with reminders</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Title"
            value={formData.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Enter task title"
            error={errors.title}
          />

          <InputField
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Enter task description (optional)"
            multiline
            numberOfLines={3}
            error={errors.description}
          />

          {/* Priority Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityButton,
                    formData.priority === priority.value && styles.priorityButtonActive,
                    { borderColor: priority.color }
                  ]}
                  onPress={() => updateField('priority', priority.value)}
                >
                  <Text style={[
                    styles.priorityText,
                    formData.priority === priority.value && styles.priorityTextActive,
                    { color: priority.color }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDueDatePicker}
            >
              <Ionicons name="calendar" size={20} color="#007AFF" />
              <Text style={styles.dateButtonText}>
                {formatDate(formData.dueDate)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reminder Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showReminderTimePicker}
            >
              <Ionicons name="alarm" size={20} color="#007AFF" />
              <Text style={styles.dateButtonText}>
                {formatTime(formData.reminderTime)}
              </Text>
            </TouchableOpacity>
            {errors.reminderTime && (
              <Text style={styles.errorText}>{errors.reminderTime}</Text>
            )}
          </View>

          <Button
            title="Create Task"
            onPress={handleCreateTask}
            loading={loading}
            style={styles.createButton}
          />
        </View>
      </ScrollView>

      {/* Fix: Single DateTimePicker with proper mode */}
      {(showDatePicker || showReminderPicker) && (
        <DateTimePicker
          value={pickerMode === 'date' ? (formData.dueDate || new Date()) : (formData.reminderTime || new Date())}
          mode={pickerMode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={pickerMode === 'date' ? new Date() : undefined}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#f0f8ff',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityTextActive: {
    fontWeight: 'bold',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    marginTop: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AddTaskScreen;
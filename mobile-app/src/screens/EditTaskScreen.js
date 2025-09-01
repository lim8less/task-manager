import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import ApiService from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const EditTaskScreen = ({ navigation, route }) => {
  const { task } = route.params;
  
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateTask = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await ApiService.updateTask(task._id, formData);
      if (response.success) {
        Alert.alert('Success', 'Task updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Update task error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = () => {
    const newStatus = formData.status === 'pending' ? 'completed' : 'pending';
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Task</Text>
          <Text style={styles.subtitle}>Update your task details</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Task Title *"
            value={formData.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Enter task title"
            error={errors.title}
            maxLength={100}
          />

          <InputField
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Enter task description (optional)"
            multiline
            error={errors.description}
            maxLength={500}
          />

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status</Text>
            <Button
              title={`Mark as ${formData.status === 'pending' ? 'Completed' : 'Pending'}`}
              onPress={toggleStatus}
              variant={formData.status === 'completed' ? 'secondary' : 'primary'}
              style={styles.statusButton}
            />
            <Text style={styles.currentStatus}>
              Current status: {formData.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Update Task"
              onPress={handleUpdateTask}
              loading={loading}
              style={styles.updateButton}
            />

            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 60,
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
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusButton: {
    marginBottom: 8,
  },
  currentStatus: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    marginTop: 0,
  },
});

export default EditTaskScreen;

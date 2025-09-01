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

const AddTaskScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
          <Text style={styles.title}>Add New Task</Text>
          <Text style={styles.subtitle}>Create a new task to track your progress</Text>
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

          <View style={styles.buttonContainer}>
            <Button
              title="Create Task"
              onPress={handleCreateTask}
              loading={loading}
              style={styles.createButton}
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
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
  createButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    marginTop: 0,
  },
});

export default AddTaskScreen;

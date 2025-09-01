import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task._id) }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.card, task.status === 'completed' && styles.completedCard]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => onToggleStatus(task._id, task.status === 'pending' ? 'completed' : 'pending')}
        >
          <View style={[
            styles.checkbox,
            task.status === 'completed' && styles.checkboxCompleted
          ]}>
            {task.status === 'completed' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
          <Text style={[
            styles.title,
            task.status === 'completed' && styles.completedText
          ]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={[
              styles.description,
              task.status === 'completed' && styles.completedText
            ]}>
              {task.description}
            </Text>
          ) : null}
          <Text style={styles.date}>
            Created: {formatDate(task.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusButton: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  editText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TaskCard;

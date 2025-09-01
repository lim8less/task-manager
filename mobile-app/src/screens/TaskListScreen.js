import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import NotificationService from '../services/notificationService';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { logout, user } = useAuth();

  // Fetch tasks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTasks();
      if (response.success) {
        setTasks(response.tasks);
      } else {
        Alert.alert('Error', 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    try {
      const response = await ApiService.updateTask(taskId, { status: newStatus });
      if (response.success) {
        const updatedTask = tasks.find(task => task._id === taskId);
        
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );

        // Send notification when task is completed
        if (newStatus === 'completed' && updatedTask) {
          await NotificationService.sendTaskCompletedNotification(updatedTask.title);
        }
      } else {
        Alert.alert('Error', 'Failed to update task status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleEditTask = (task) => {
    navigation.navigate('EditTask', { task });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await ApiService.deleteTask(taskId);
      if (response.success) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      } else {
        Alert.alert('Error', 'Failed to delete task');
      }
    } catch (error) {
      console.error('Delete task error:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const renderTask = ({ item }) => (
    <TaskCard
      task={item}
      onToggleStatus={handleToggleStatus}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
    />
  );

  const EmptyTaskList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No tasks yet!</Text>
      <Text style={styles.emptySubtitle}>
        Create your first task to get started
      </Text>
      <Button
        title="Add Your First Task"
        onPress={() => navigation.navigate('AddTask')}
        style={styles.firstTaskButton}
      />
    </View>
  );

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.username}!</Text>
          <Text style={styles.taskCount}>
            {pendingTasks.length} pending, {completedTasks.length} completed
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Add Task Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="+ Add New Task"
          onPress={() => navigation.navigate('AddTask')}
          style={styles.addButton}
        />
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item._id}
        contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? EmptyTaskList : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  addButtonContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  addButton: {
    backgroundColor: '#34C759',
  },
  list: {
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  firstTaskButton: {
    backgroundColor: '#34C759',
  },
});

export default TaskListScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Clock, Zap, Trash2, Edit2, CheckCircle, Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { Task } from '@/types';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, updateTask, deleteTask, completeTask, uncompleteTask } = useTaskStore();
  const { getSessionsByTaskId } = useFocusStore();
  
  const task = getTaskById(id);
  const sessions = getSessionsByTaskId(id);
  
  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const handleStartFocus = () => {
    router.push({
      pathname: '/focus/session',
      params: { taskId: id }
    });
  };
  
  const handleEditTask = () => {
    // Navigate to edit task screen
    router.push({
      pathname: '/task/new',
      params: { id }
    });
  };
  
  const handleDeleteTask = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteTask(id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleToggleComplete = () => {
    if (task.completed) {
      uncompleteTask(id);
    } else {
      completeTask(id);
    }
  };
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return Colors.light.error;
      case 'medium':
        return Colors.light.warning;
      case 'low':
        return Colors.light.success;
      default:
        return Colors.light.subtext;
    }
  };
  
  const getEnergyColor = () => {
    switch (task.energyRequired) {
      case 'high':
        return Colors.light.error;
      case 'medium':
        return Colors.light.warning;
      case 'low':
        return Colors.light.success;
      default:
        return Colors.light.subtext;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  
  const totalFocusTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: task.title,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Edit"
                variant="text"
                onPress={handleEditTask}
                style={styles.headerButton}
              />
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.light.subtext} />
              <Text style={styles.metaText}>{task.estimatedMinutes} min</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Zap size={16} color={getEnergyColor()} />
              <Text style={[styles.metaText, { color: getEnergyColor() }]}>
                {task.energyRequired} energy
              </Text>
            </View>
            
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>
                {task.priority} priority
              </Text>
            </View>
          </View>
        </View>
        
        {task.description ? (
          <Card style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{task.description}</Text>
          </Card>
        ) : null}
        
        <View style={styles.actionsContainer}>
          <Button
            title={task.completed ? "Mark Incomplete" : "Mark Complete"}
            variant={task.completed ? "outline" : "primary"}
            onPress={handleToggleComplete}
            style={styles.actionButton}
            icon={task.completed ? undefined : <CheckCircle size={18} color="#fff" />}
          />
          
          {!task.completed && (
            <Button
              title="Start Focus"
              variant="secondary"
              onPress={handleStartFocus}
              style={styles.actionButton}
              icon={<Play size={18} color="#fff" />}
            />
          )}
        </View>
        
        {sessions.length > 0 && (
          <View style={styles.sessionsContainer}>
            <Text style={styles.sectionTitle}>Focus Sessions</Text>
            <Text style={styles.sessionsSummary}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} • {Math.round(totalFocusTime)} minutes total
            </Text>
            
            {sessions.map((session) => (
              <Card key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionDate}>{formatDate(session.startTime)}</Text>
                  <Text style={styles.sessionDuration}>{Math.round(session.duration)} min</Text>
                </View>
                
                {session.distractions.length > 0 && (
                  <Text style={styles.distractionCount}>
                    {session.distractions.length} distraction{session.distractions.length !== 1 ? 's' : ''}
                  </Text>
                )}
                
                {session.notes && (
                  <Text style={styles.sessionNotes}>{session.notes}</Text>
                )}
              </Card>
            ))}
          </View>
        )}
        
        <Button
          title="Delete Task"
          variant="outline"
          onPress={handleDeleteTask}
          style={styles.deleteButton}
          textStyle={{ color: Colors.light.error }}
          icon={<Trash2 size={18} color={Colors.light.error} />}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 6,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  descriptionCard: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sessionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sessionsSummary: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 16,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    color: Colors.light.text,
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  distractionCount: {
    fontSize: 14,
    color: Colors.light.error,
    marginBottom: 8,
  },
  sessionNotes: {
    fontSize: 14,
    color: Colors.light.subtext,
    fontStyle: 'italic',
  },
  deleteButton: {
    borderColor: Colors.light.error,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 8,
  },
});
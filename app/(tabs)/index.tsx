import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Plus, Zap, Brain } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TaskItem from '@/components/TaskItem';
import EnergySelector from '@/components/EnergySelector';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useUserStore } from '@/store/useUserStore';
import { getTaskSuggestions, getFocusTips } from '@/utils/aiHelpers';
import { EnergyLevel, Task } from '@/types';

export default function DashboardScreen() {
  const [currentEnergy, setCurrentEnergy] = useState<EnergyLevel>('medium');
  const [focusTip, setFocusTip] = useState('');
  
  const { tasks, completeTask, getIncompleteTasks } = useTaskStore();
  const { getDailyFocusTime } = useFocusStore();
  const { preferences } = useUserStore();
  
  const incompleteTasks = getIncompleteTasks();
  const suggestedTasks = getTaskSuggestions(incompleteTasks, currentEnergy).slice(0, 3);
  const dailyFocusTime = getDailyFocusTime();
  
  useEffect(() => {
    // Get a random focus tip on component mount
    setFocusTip(getFocusTips());
  }, []);
  
  const handleTaskPress = (task: Task) => {
    router.push(`/task/${task.id}`);
  };
  
  const handleAddTask = () => {
    router.push('/task/new');
  };
  
  const handleStartFocus = (taskId?: string) => {
    if (taskId) {
      router.push({
        pathname: '/focus/session',
        params: { taskId }
      });
    } else {
      router.push('/focus');
    }
  };
  
  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {preferences.name || 'there'}!
        </Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {incompleteTasks.length}
            </Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
        </Card>
        
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {formatFocusTime(dailyFocusTime)}
            </Text>
            <Text style={styles.statLabel}>Focus Time</Text>
          </View>
        </Card>
      </View>
      
      <EnergySelector value={currentEnergy} onChange={setCurrentEnergy} />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested Tasks</Text>
        <TouchableOpacity onPress={handleAddTask}>
          <Plus size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
      
      {suggestedTasks.length > 0 ? (
        <View style={styles.taskList}>
          {suggestedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onPress={handleTaskPress}
              onComplete={completeTask}
            />
          ))}
        </View>
      ) : (
        <Card variant="outlined" style={styles.emptyCard}>
          <Text style={styles.emptyText}>No tasks yet. Add some to get started!</Text>
          <Button 
            title="Add Task" 
            onPress={handleAddTask}
            style={styles.emptyButton}
          />
        </Card>
      )}
      
      <View style={styles.focusSection}>
        <Card variant="elevated" style={styles.focusCard}>
          <View style={styles.focusCardContent}>
            <View style={styles.focusIconContainer}>
              <Brain size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.focusTextContainer}>
              <Text style={styles.focusTipTitle}>Focus Tip</Text>
              <Text style={styles.focusTipText}>{focusTip}</Text>
            </View>
          </View>
        </Card>
        
        <Button
          title="Start Focus Session"
          style={styles.focusButton}
          onPress={() => handleStartFocus()}
          icon={<Zap size={18} color="#fff" />}
        />
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  taskList: {
    marginBottom: 24,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 120,
  },
  focusSection: {
    marginBottom: 24,
  },
  focusCard: {
    marginBottom: 16,
  },
  focusCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  focusTextContainer: {
    flex: 1,
  },
  focusTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  focusTipText: {
    fontSize: 14,
    color: Colors.light.subtext,
    lineHeight: 20,
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
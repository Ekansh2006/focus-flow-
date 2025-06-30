import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Clock, Zap, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onPress: (task: Task) => void;
  onComplete: (id: string) => void;
}

export default function TaskItem({ task, onPress, onComplete }: TaskItemProps) {
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        onPress={() => onComplete(task.id)}
      >
        {task.completed && <Check size={16} color="#fff" />}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text 
          style={[styles.title, task.completed && styles.completedText]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {task.description ? (
          <Text 
            style={styles.description}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        ) : null}
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors.light.subtext} />
            <Text style={styles.metaText}>{task.estimatedMinutes} min</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Zap size={14} color={getEnergyColor()} />
            <Text style={[styles.metaText, { color: getEnergyColor() }]}>
              {task.energyRequired}
            </Text>
          </View>
          
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>
              {task.priority}
            </Text>
          </View>
        </View>
      </View>
      
      <ChevronRight size={20} color={Colors.light.subtext} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.light.primary,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.light.subtext,
  },
  description: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Plus, Filter, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import TaskItem from '@/components/TaskItem';
import Button from '@/components/Button';
import { useTaskStore } from '@/store/useTaskStore';
import { Task, TaskPriority, EnergyLevel } from '@/types';

type FilterType = 'all' | 'priority' | 'energy';
type SortType = 'newest' | 'oldest' | 'priority' | 'energy';

export default function TasksScreen() {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null);
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel | null>(null);
  const [sortType, setSortType] = useState<SortType>('newest');
  const [showCompleted, setShowCompleted] = useState(false);
  
  const { 
    tasks, 
    completeTask, 
    uncompleteTask,
    getCompletedTasks,
    getIncompleteTasks,
    getTasksByPriority,
    getTasksByEnergy,
  } = useTaskStore();
  
  const handleAddTask = () => {
    router.push('/task/new');
  };
  
  const handleTaskPress = (task: Task) => {
    router.push(`/task/${task.id}`);
  };
  
  const getFilteredTasks = () => {
    let filteredTasks: Task[] = [];
    
    if (showCompleted) {
      filteredTasks = getCompletedTasks();
    } else {
      if (filterType === 'all') {
        filteredTasks = getIncompleteTasks();
      } else if (filterType === 'priority' && priorityFilter) {
        filteredTasks = getTasksByPriority(priorityFilter);
      } else if (filterType === 'energy' && energyFilter) {
        filteredTasks = getTasksByEnergy(energyFilter);
      } else {
        filteredTasks = getIncompleteTasks();
      }
    }
    
    // Sort tasks
    return sortTasks(filteredTasks);
  };
  
  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityValues = { high: 3, medium: 2, low: 1 };
          return priorityValues[b.priority] - priorityValues[a.priority];
        case 'energy':
          const energyValues = { high: 3, medium: 2, low: 1 };
          return energyValues[b.energyRequired] - energyValues[a.energyRequired];
        default:
          return 0;
      }
    });
  };
  
  const togglePriorityFilter = (priority: TaskPriority) => {
    if (priorityFilter === priority) {
      setPriorityFilter(null);
      setFilterType('all');
    } else {
      setPriorityFilter(priority);
      setFilterType('priority');
      setEnergyFilter(null);
    }
  };
  
  const toggleEnergyFilter = (energy: EnergyLevel) => {
    if (energyFilter === energy) {
      setEnergyFilter(null);
      setFilterType('all');
    } else {
      setEnergyFilter(energy);
      setFilterType('energy');
      setPriorityFilter(null);
    }
  };
  
  const toggleSort = (sort: SortType) => {
    setSortType(sort);
  };
  
  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };
  
  const filteredTasks = getFilteredTasks();
  
  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            showCompleted && styles.activeFilterChip,
          ]}
          onPress={toggleShowCompleted}
        >
          <CheckCircle 
            size={16} 
            color={showCompleted ? '#fff' : Colors.light.subtext} 
          />
          <Text 
            style={[
              styles.filterChipText,
              showCompleted && styles.activeFilterChipText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            priorityFilter === 'high' && styles.activeFilterChip,
            priorityFilter === 'high' && { backgroundColor: Colors.light.error },
          ]}
          onPress={() => togglePriorityFilter('high')}
        >
          <Text 
            style={[
              styles.filterChipText,
              priorityFilter === 'high' && styles.activeFilterChipText,
            ]}
          >
            High Priority
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            priorityFilter === 'medium' && styles.activeFilterChip,
            priorityFilter === 'medium' && { backgroundColor: Colors.light.warning },
          ]}
          onPress={() => togglePriorityFilter('medium')}
        >
          <Text 
            style={[
              styles.filterChipText,
              priorityFilter === 'medium' && styles.activeFilterChipText,
            ]}
          >
            Medium Priority
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            priorityFilter === 'low' && styles.activeFilterChip,
            priorityFilter === 'low' && { backgroundColor: Colors.light.success },
          ]}
          onPress={() => togglePriorityFilter('low')}
        >
          <Text 
            style={[
              styles.filterChipText,
              priorityFilter === 'low' && styles.activeFilterChipText,
            ]}
          >
            Low Priority
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            energyFilter === 'high' && styles.activeFilterChip,
            energyFilter === 'high' && { backgroundColor: Colors.light.error },
          ]}
          onPress={() => toggleEnergyFilter('high')}
        >
          <Text 
            style={[
              styles.filterChipText,
              energyFilter === 'high' && styles.activeFilterChipText,
            ]}
          >
            High Energy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            energyFilter === 'medium' && styles.activeFilterChip,
            energyFilter === 'medium' && { backgroundColor: Colors.light.warning },
          ]}
          onPress={() => toggleEnergyFilter('medium')}
        >
          <Text 
            style={[
              styles.filterChipText,
              energyFilter === 'medium' && styles.activeFilterChipText,
            ]}
          >
            Medium Energy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            energyFilter === 'low' && styles.activeFilterChip,
            energyFilter === 'low' && { backgroundColor: Colors.light.success },
          ]}
          onPress={() => toggleEnergyFilter('low')}
        >
          <Text 
            style={[
              styles.filterChipText,
              energyFilter === 'low' && styles.activeFilterChipText,
            ]}
          >
            Low Energy
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTask}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {renderFilterChips()}
      
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onPress={handleTaskPress}
              onComplete={item.completed ? uncompleteTask : completeTask}
            />
          )}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {showCompleted
              ? "You haven't completed any tasks yet."
              : "No tasks found. Add some to get started!"}
          </Text>
          {!showCompleted && (
            <Button
              title="Add Task"
              onPress={handleAddTask}
              style={styles.emptyButton}
            />
          )}
        </View>
      )}
    </View>
  );
}

// Add ScrollView import
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.light.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeFilterChip: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  activeFilterChipText: {
    color: '#fff',
  },
  taskList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    minWidth: 120,
  },
});
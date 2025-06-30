import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Battery, BatteryMedium, BatteryFull } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskPriority, EnergyLevel } from '@/types';

export default function NewTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, addTask, updateTask } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [energyRequired, setEnergyRequired] = useState<EnergyLevel>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState('25');
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (isEditing) {
      const task = getTaskById(id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setEnergyRequired(task.energyRequired);
        setEstimatedMinutes(task.estimatedMinutes.toString());
      }
    }
  }, [isEditing, id, getTaskById]);
  
  const handleSave = () => {
    if (!title.trim()) {
      // Show error or validation message
      return;
    }
    
    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      energyRequired,
      estimatedMinutes: parseInt(estimatedMinutes, 10) || 25,
    };
    
    if (isEditing) {
      updateTask(id, taskData);
    } else {
      addTask(taskData);
    }
    
    router.back();
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Edit Task' : 'New Task' }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need to do?"
            placeholderTextColor={Colors.light.subtext}
            autoFocus
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about this task..."
            placeholderTextColor={Colors.light.subtext}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.optionsContainer}>
            <Button
              title="Low"
              variant={priority === 'low' ? 'primary' : 'outline'}
              style={[
                styles.optionButton,
                priority === 'low' && { backgroundColor: Colors.light.success }
              ]}
              onPress={() => setPriority('low')}
            />
            <Button
              title="Medium"
              variant={priority === 'medium' ? 'primary' : 'outline'}
              style={[
                styles.optionButton,
                priority === 'medium' && { backgroundColor: Colors.light.warning }
              ]}
              onPress={() => setPriority('medium')}
            />
            <Button
              title="High"
              variant={priority === 'high' ? 'primary' : 'outline'}
              style={[
                styles.optionButton,
                priority === 'high' && { backgroundColor: Colors.light.error }
              ]}
              onPress={() => setPriority('high')}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Energy Required</Text>
          <View style={styles.optionsContainer}>
            <Button
              title="Low"
              variant={energyRequired === 'low' ? 'primary' : 'outline'}
              style={[
                styles.optionButton,
                energyRequired === 'low' && { backgroundColor: Colors.light.success }
              ]}
              icon={<Battery size={16} color={energyRequired === 'low' ? '#fff' : Colors.light.text} />}
              onPress={() => setEnergyRequired('low')}
            />
            <Button
              title="Medium"
              variant={energyRequired === 'medium' ? 'primary' : 'outline'}
              style={[
                styles.optionButton,
                energyRequired === 'medium' && { backgroundColor: Colors.light.warning }
              ]}
              icon={<BatteryMedium size={16} color={energyRequired === 'medium' ? '#fff' : Colors.light.text} />}
              onPress={() => setEnergyRequired('medium')}
            />
            <Button
              title="High"
              variant={energyRequired === 'high' ? 'primary' : 'outline'}
              style={[
                styles.optionButton,
                energyRequired === 'high' && { backgroundColor: Colors.light.error }
              ]}
              icon={<BatteryFull size={16} color={energyRequired === 'high' ? '#fff' : Colors.light.text} />}
              onPress={() => setEnergyRequired('high')}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Estimated Time (minutes)</Text>
          <TextInput
            style={[styles.input, styles.timeInput]}
            value={estimatedMinutes}
            onChangeText={setEstimatedMinutes}
            keyboardType="number-pad"
            placeholder="25"
            placeholderTextColor={Colors.light.subtext}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={styles.button}
          />
          <Button
            title={isEditing ? "Update" : "Create"}
            onPress={handleSave}
            style={styles.button}
            disabled={!title.trim()}
          />
        </View>
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeInput: {
    width: '30%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
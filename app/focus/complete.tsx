import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useFocusStore } from '@/store/useFocusStore';
import { useTaskStore } from '@/store/useTaskStore';
import { getBreakActivities } from '@/utils/aiHelpers';
import { useUserStore } from '@/store/useUserStore';

export default function SessionCompleteScreen() {
  const [notes, setNotes] = useState('');
  const [breakActivities, setBreakActivities] = useState<string[]>([]);
  
  const { currentSession, endSession } = useFocusStore();
  const { getTaskById, completeTask } = useTaskStore();
  const { preferences } = useUserStore();
  
  const task = currentSession?.taskId ? getTaskById(currentSession.taskId) : null;
  
  const handleComplete = () => {
    if (currentSession) {
      endSession(notes);
      
      // Optionally mark the task as completed
      if (task && !task.completed) {
        completeTask(task.id);
      }
      
      router.replace('/(tabs)/focus');
    }
  };
  
  const handleShowBreakActivities = () => {
    setBreakActivities(getBreakActivities(preferences.breakDuration));
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Session Complete" }} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <CheckCircle size={40} color={Colors.light.success} />
          </View>
          <Text style={styles.title}>Great job!</Text>
          <Text style={styles.subtitle}>
            You completed a {currentSession?.duration ? Math.round(currentSession.duration) : preferences.focusDuration} minute focus session
            {task ? ` on "${task.title}"` : ''}
          </Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Session Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="How did this session go? What did you accomplish?"
            placeholderTextColor={Colors.light.subtext}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <Text style={styles.breakTitle}>Take a {preferences.breakDuration} minute break</Text>
        
        {breakActivities.length > 0 ? (
          <View style={styles.breakActivitiesContainer}>
            {breakActivities.map((activity, index) => (
              <View key={index} style={styles.breakActivityItem}>
                <Text style={styles.breakActivityText}>• {activity}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Button
            title="Show Break Activities"
            variant="outline"
            onPress={handleShowBreakActivities}
            style={styles.breakButton}
          />
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Complete Session"
            onPress={handleComplete}
            style={styles.button}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    lineHeight: 24,
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
    minHeight: 120,
  },
  breakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  breakActivitiesContainer: {
    marginBottom: 24,
  },
  breakActivityItem: {
    marginBottom: 12,
  },
  breakActivityText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  breakButton: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  button: {
    width: '100%',
  },
});
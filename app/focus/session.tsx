import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, X, AlertCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import FocusTimer from '@/components/FocusTimer';
import Button from '@/components/Button';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useUserStore } from '@/store/useUserStore';
import { getFocusTips } from '@/utils/aiHelpers';

export default function FocusSessionScreen() {
  const { taskId, sessionId } = useLocalSearchParams<{ taskId?: string, sessionId?: string }>();
  const { getTaskById } = useTaskStore();
  const { 
    startSession, 
    endSession, 
    pauseSession, 
    resumeSession, 
    currentSession,
    isSessionActive,
  } = useFocusStore();
  const { preferences } = useUserStore();
  
  const [focusTip, setFocusTip] = useState('');
  
  const task = taskId ? getTaskById(taskId) : null;
  
  useEffect(() => {
    // Start a new session or resume current session
    if (!currentSession && taskId) {
      startSession(taskId);
    } else if (currentSession && !isSessionActive) {
      resumeSession();
    }
    
    // Get a random focus tip
    setFocusTip(getFocusTips());
  }, [taskId, currentSession, isSessionActive, startSession, resumeSession]);
  
  const handleComplete = () => {
    if (currentSession) {
      endSession();
      router.replace('/focus/complete');
    }
  };
  
  const handlePause = () => {
    pauseSession();
  };
  
  const handleResume = () => {
    resumeSession();
  };
  
  const handleDistraction = () => {
    router.push('/focus/distraction');
  };
  
  const handleClose = () => {
    if (currentSession) {
      Alert.alert(
        "End Session",
        "Are you sure you want to end this focus session?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "End Session", 
            onPress: () => {
              endSession();
              router.replace('/(tabs)/focus');
            }
          }
        ]
      );
    } else {
      router.back();
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Session</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <FocusTimer
          duration={task?.estimatedMinutes || preferences.focusDuration}
          onComplete={handleComplete}
          onPause={handlePause}
          onResume={handleResume}
          onDistraction={handleDistraction}
          isActive={isSessionActive}
          taskName={task?.title}
        />
        
        <View style={styles.tipContainer}>
          <View style={styles.tipIconContainer}>
            <AlertCircle size={20} color={Colors.light.primary} />
          </View>
          <Text style={styles.tipText}>{focusTip}</Text>
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Focus Tips:</Text>
          <Text style={styles.instructionText}>• Put your phone on silent mode</Text>
          <Text style={styles.instructionText}>• Close unnecessary apps and tabs</Text>
          <Text style={styles.instructionText}>• Take deep breaths if you feel distracted</Text>
          <Text style={styles.instructionText}>• Stay hydrated during your session</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
    alignItems: 'flex-start',
  },
  tipIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 24,
  },
});
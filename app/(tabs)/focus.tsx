import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Play, Clock, History, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useUserStore } from '@/store/useUserStore';
import { getBreakActivities } from '@/utils/aiHelpers';

export default function FocusScreen() {
  const [breakActivities, setBreakActivities] = useState<string[]>([]);
  
  const { getIncompleteTasks } = useTaskStore();
  const { 
    sessions, 
    currentSession, 
    isSessionActive,
    getDailyFocusTime,
    getWeeklyFocusTime,
  } = useFocusStore();
  const { preferences } = useUserStore();
  
  const incompleteTasks = getIncompleteTasks();
  const recentSessions = sessions.slice(0, 5);
  const dailyFocusTime = getDailyFocusTime();
  const weeklyFocusTime = getWeeklyFocusTime();
  
  const handleStartFocus = (taskId?: string) => {
    if (taskId) {
      router.push({
        pathname: '/focus/session',
        params: { taskId }
      });
    } else {
      // If no task selected, let user pick a task or start a general focus session
      router.push('/focus/session');
    }
  };
  
  const handleContinueSession = () => {
    if (currentSession) {
      router.push({
        pathname: '/focus/session',
        params: { sessionId: currentSession.id }
      });
    }
  };
  
  const handleShowBreakActivities = () => {
    setBreakActivities(getBreakActivities(preferences.breakDuration));
  };
  
  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Time</Text>
      </View>
      
      {currentSession && isSessionActive ? (
        <Card variant="elevated" style={styles.activeSessionCard}>
          <Text style={styles.activeSessionTitle}>Session in Progress</Text>
          <Text style={styles.activeSessionTask}>
            {incompleteTasks.find(t => t.id === currentSession.taskId)?.title || 'Focus Session'}
          </Text>
          <Button
            title="Continue Session"
            onPress={handleContinueSession}
            style={styles.continueButton}
          />
        </Card>
      ) : (
        <Card variant="elevated" style={styles.startFocusCard}>
          <View style={styles.startFocusContent}>
            <View style={styles.focusIconContainer}>
              <Zap size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.focusTextContainer}>
              <Text style={styles.startFocusTitle}>Ready to focus?</Text>
              <Text style={styles.startFocusText}>
                Start a {preferences.focusDuration}-minute focus session to boost your productivity.
              </Text>
            </View>
          </View>
          <Button
            title="Start Focus Session"
            onPress={() => handleStartFocus()}
            style={styles.startButton}
          />
        </Card>
      )}
      
      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <Clock size={20} color={Colors.light.primary} />
            <Text style={styles.statValue}>{formatFocusTime(dailyFocusTime)}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </Card>
        
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statContent}>
            <History size={20} color={Colors.light.primary} />
            <Text style={styles.statValue}>{formatFocusTime(weeklyFocusTime)}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </Card>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Tasks</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickTasksContainer}
      >
        {incompleteTasks.slice(0, 5).map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.quickTaskCard}
            onPress={() => handleStartFocus(task.id)}
          >
            <Text style={styles.quickTaskTitle} numberOfLines={2}>
              {task.title}
            </Text>
            <View style={styles.quickTaskMeta}>
              <Text style={styles.quickTaskTime}>{task.estimatedMinutes} min</Text>
              <View style={styles.startIconContainer}>
                <Play size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {incompleteTasks.length === 0 && (
          <Card variant="outlined" style={styles.emptyQuickTaskCard}>
            <Text style={styles.emptyText}>No tasks available</Text>
            <Button
              title="Add Task"
              size="small"
              onPress={() => router.push('/task/new')}
              style={styles.emptyButton}
            />
          </Card>
        )}
      </ScrollView>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Break Activities</Text>
      </View>
      
      {breakActivities.length > 0 ? (
        <View style={styles.breakActivitiesContainer}>
          {breakActivities.map((activity, index) => (
            <Card key={index} style={styles.breakActivityCard}>
              <Text style={styles.breakActivityText}>{activity}</Text>
            </Card>
          ))}
        </View>
      ) : (
        <Button
          title="Generate Break Activities"
          variant="outline"
          onPress={handleShowBreakActivities}
          style={styles.generateButton}
        />
      )}
      
      {recentSessions.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
          </View>
          
          <View style={styles.recentSessionsContainer}>
            {recentSessions.map((session) => {
              const task = incompleteTasks.find(t => t.id === session.taskId);
              return (
                <Card key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionTitle} numberOfLines={1}>
                      {task?.title || 'Focus Session'}
                    </Text>
                    <Text style={styles.sessionDuration}>
                      {Math.round(session.duration)} min
                    </Text>
                  </View>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.startTime)}
                  </Text>
                  {session.distractions.length > 0 && (
                    <Text style={styles.distractionCount}>
                      {session.distractions.length} distraction{session.distractions.length !== 1 ? 's' : ''}
                    </Text>
                  )}
                </Card>
              );
            })}
          </View>
        </>
      )}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  activeSessionCard: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderColor: Colors.light.primary,
    borderWidth: 1,
  },
  activeSessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  activeSessionTask: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  continueButton: {
    marginTop: 8,
  },
  startFocusCard: {
    padding: 20,
    marginBottom: 20,
  },
  startFocusContent: {
    flexDirection: 'row',
    marginBottom: 16,
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
  startFocusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  startFocusText: {
    fontSize: 14,
    color: Colors.light.subtext,
    lineHeight: 20,
  },
  startButton: {
    marginTop: 8,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  quickTasksContainer: {
    paddingBottom: 8,
  },
  quickTaskCard: {
    width: 160,
    height: 100,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  quickTaskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickTaskTime: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  startIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyQuickTaskCard: {
    width: 160,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 100,
  },
  breakActivitiesContainer: {
    marginBottom: 24,
  },
  breakActivityCard: {
    marginBottom: 8,
    padding: 16,
  },
  breakActivityText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 22,
  },
  generateButton: {
    marginBottom: 24,
  },
  recentSessionsContainer: {
    marginBottom: 24,
  },
  sessionCard: {
    marginBottom: 8,
    padding: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  sessionDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  sessionDate: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  distractionCount: {
    fontSize: 12,
    color: Colors.light.error,
  },
});
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import InsightCard from '@/components/InsightCard';
import { useFocusStore } from '@/store/useFocusStore';
import { useTaskStore } from '@/store/useTaskStore';
import { generateWeeklyInsights } from '@/utils/aiHelpers';

export default function InsightsScreen() {
  const [insights, setInsights] = useState<string[]>([]);
  
  const { 
    sessions, 
    getTotalFocusTime, 
    getWeeklyFocusTime,
    getDailyFocusTime,
  } = useFocusStore();
  
  const { 
    tasks,
    getCompletedTasks,
  } = useTaskStore();
  
  const completedTasks = getCompletedTasks();
  const totalFocusTime = getTotalFocusTime();
  const weeklyFocusTime = getWeeklyFocusTime();
  const dailyFocusTime = getDailyFocusTime();
  
  // Calculate metrics using useMemo to prevent recalculations on every render
  const { tasksCompletedThisWeek, averageSessionLength, commonDistractions } = useMemo(() => {
    // Calculate tasks completed this week
    const tasksThisWeek = completedTasks.filter(task => {
      const completedDate = new Date(task.completedAt || '');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return completedDate >= oneWeekAgo;
    }).length;
    
    // Calculate average session length
    const avgSessionLength = sessions.length > 0
      ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length
      : 0;
    
    // Get common distractions
    const distractionCounts: Record<string, number> = {};
    sessions.forEach(session => {
      session.distractions.forEach(distraction => {
        const type = distraction.type;
        distractionCounts[type] = (distractionCounts[type] || 0) + 1;
      });
    });
    
    const distractions = Object.entries(distractionCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
      
    return {
      tasksCompletedThisWeek: tasksThisWeek,
      averageSessionLength: avgSessionLength,
      commonDistractions: distractions
    };
  }, [completedTasks, sessions]); // Only recalculate when these dependencies change
  
  useEffect(() => {
    // Generate insights based on data
    const generatedInsights = generateWeeklyInsights(
      tasksCompletedThisWeek,
      weeklyFocusTime,
      averageSessionLength,
      commonDistractions
    );
    
    setInsights(generatedInsights);
  }, [tasksCompletedThisWeek, weeklyFocusTime, averageSessionLength, commonDistractions]);
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  // Calculate week-over-week changes (mock data for now)
  const focusTimeChange = 15; // 15% increase
  const tasksCompletedChange = 8; // 8% increase
  const productivityChange = 12; // 12% increase
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Insights</Text>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>
      
      <View style={styles.insightCardsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insightCardsScroll}
        >
          <InsightCard
            title="Focus Time"
            value={formatTime(weeklyFocusTime)}
            type="time"
            subtitle="This week"
            change={focusTimeChange}
          />
          
          <InsightCard
            title="Tasks Completed"
            value={tasksCompletedThisWeek}
            type="tasks"
            subtitle="This week"
            change={tasksCompletedChange}
          />
          
          <InsightCard
            title="Avg. Session"
            value={`${Math.round(averageSessionLength)}m`}
            type="energy"
            subtitle="Per focus session"
          />
          
          <InsightCard
            title="Productivity"
            value={`${Math.round(tasksCompletedThisWeek / (weeklyFocusTime / 60) * 10) / 10 || 0}`}
            type="trend"
            subtitle="Tasks per hour"
            change={productivityChange}
          />
        </ScrollView>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
      </View>
      
      <Card variant="elevated" style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Focus Time</Text>
          <Text style={styles.summaryValue}>{formatTime(dailyFocusTime)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tasks Completed</Text>
          <Text style={styles.summaryValue}>
            {completedTasks.filter(task => {
              const completedDate = new Date(task.completedAt || '');
              const today = new Date();
              return completedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
            }).length}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Focus Sessions</Text>
          <Text style={styles.summaryValue}>
            {sessions.filter(session => {
              const sessionDate = new Date(session.startTime);
              const today = new Date();
              return sessionDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
            }).length}
          </Text>
        </View>
      </Card>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weekly Recommendations</Text>
      </View>
      
      {insights.map((insight, index) => (
        <Card key={index} style={styles.insightCard}>
          <Text style={styles.insightText}>{insight}</Text>
        </Card>
      ))}
      
      {commonDistractions.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Common Distractions</Text>
          </View>
          
          <Card variant="elevated" style={styles.distractionsCard}>
            {commonDistractions.map((distraction, index) => (
              <View key={index} style={styles.distractionItem}>
                <View style={styles.distractionBar}>
                  <View 
                    style={[
                      styles.distractionBarFill, 
                      { 
                        width: `${Math.min(100, (distraction.count / (commonDistractions[0]?.count || 1)) * 100)}%`,
                        backgroundColor: index === 0 
                          ? Colors.light.error 
                          : index === 1 
                            ? Colors.light.warning 
                            : Colors.light.primary
                      }
                    ]} 
                  />
                </View>
                <View style={styles.distractionLabels}>
                  <Text style={styles.distractionType}>{distraction.type}</Text>
                  <Text style={styles.distractionCount}>{distraction.count}x</Text>
                </View>
              </View>
            ))}
          </Card>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
  },
  insightCardsContainer: {
    marginBottom: 24,
  },
  insightCardsScroll: {
    paddingRight: 16,
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
  summaryCard: {
    marginBottom: 24,
    padding: 0,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  insightCard: {
    marginBottom: 12,
    padding: 16,
  },
  insightText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  distractionsCard: {
    marginBottom: 24,
    padding: 16,
  },
  distractionItem: {
    marginBottom: 16,
  },
  distractionBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  distractionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  distractionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distractionType: {
    fontSize: 14,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  distractionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.subtext,
  },
});
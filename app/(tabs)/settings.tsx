import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Moon, Sun, Bell, Clock, Trash2, LogOut, HelpCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';

export default function SettingsScreen() {
  const { preferences, setPreferences, resetPreferences } = useUserStore();
  const { clearCompletedTasks } = useTaskStore();
  const { getSessions } = useFocusStore();
  
  const [focusDuration, setFocusDuration] = useState(preferences.focusDuration);
  const [breakDuration, setBreakDuration] = useState(preferences.breakDuration);
  
  const handleThemeToggle = () => {
    setPreferences({
      theme: preferences.theme === 'light' ? 'dark' : 'light',
    });
  };
  
  const handleReminderTypeChange = (type: 'notification' | 'sound' | 'vibration' | 'none') => {
    setPreferences({
      reminderType: type,
    });
  };
  
  const handleFocusDurationChange = (value: number) => {
    setFocusDuration(value);
    setPreferences({
      focusDuration: value,
    });
  };
  
  const handleBreakDurationChange = (value: number) => {
    setBreakDuration(value);
    setPreferences({
      breakDuration: value,
    });
  };
  
  const handleClearCompletedTasks = () => {
    Alert.alert(
      "Clear Completed Tasks",
      "Are you sure you want to delete all completed tasks? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          onPress: () => clearCompletedTasks(),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "Are you sure you want to reset the app? This will delete all your data and preferences.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => {
            resetPreferences();
            router.replace('/onboarding');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const totalSessions = getSessions().length;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              {preferences.theme === 'dark' ? (
                <Moon size={20} color={Colors.light.text} />
              ) : (
                <Sun size={20} color={Colors.light.text} />
              )}
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={preferences.theme === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus Settings</Text>
        <Card style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Clock size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Focus Duration</Text>
            </View>
            <View style={styles.durationControls}>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleFocusDurationChange(Math.max(5, focusDuration - 5))}
              >
                <Text style={styles.durationButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.durationValue}>{focusDuration} min</Text>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleFocusDurationChange(Math.min(60, focusDuration + 5))}
              >
                <Text style={styles.durationButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Clock size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Break Duration</Text>
            </View>
            <View style={styles.durationControls}>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleBreakDurationChange(Math.max(1, breakDuration - 1))}
              >
                <Text style={styles.durationButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.durationValue}>{breakDuration} min</Text>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => handleBreakDurationChange(Math.min(30, breakDuration + 1))}
              >
                <Text style={styles.durationButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleReminderTypeChange('notification')}
          >
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <View style={styles.radioButton}>
              {preferences.reminderType === 'notification' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleReminderTypeChange('sound')}
          >
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Sound</Text>
            </View>
            <View style={styles.radioButton}>
              {preferences.reminderType === 'sound' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleReminderTypeChange('vibration')}
          >
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <View style={styles.radioButton}>
              {preferences.reminderType === 'vibration' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleReminderTypeChange('none')}
          >
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={Colors.light.text} />
              <Text style={styles.settingLabel}>None</Text>
            </View>
            <View style={styles.radioButton}>
              {preferences.reminderType === 'none' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearCompletedTasks}
          >
            <View style={styles.settingLabelContainer}>
              <Trash2 size={20} color={Colors.light.error} />
              <Text style={[styles.settingLabel, { color: Colors.light.error }]}>
                Clear Completed Tasks
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetApp}
          >
            <View style={styles.settingLabelContainer}>
              <LogOut size={20} color={Colors.light.error} />
              <Text style={[styles.settingLabel, { color: Colors.light.error }]}>
                Reset App
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Total Focus Sessions: {totalSessions}
        </Text>
        <Text style={styles.statsText}>
          App Version: 1.0.0
        </Text>
      </View>
      
      <TouchableOpacity style={styles.helpButton}>
        <HelpCircle size={20} color={Colors.light.primary} />
        <Text style={styles.helpText}>Help & Support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  card: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginHorizontal: 12,
    minWidth: 60,
    textAlign: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  statsContainer: {
    marginTop: 'auto',
    marginBottom: 16,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginBottom: 4,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  helpText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.primary,
    marginLeft: 8,
  },
});
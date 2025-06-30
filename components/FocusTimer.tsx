import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause, SkipForward, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';

interface FocusTimerProps {
  duration: number; // in minutes
  onComplete: () => void;
  onPause: () => void;
  onResume: () => void;
  onDistraction: () => void;
  isActive: boolean;
  taskName?: string;
}

export default function FocusTimer({
  duration,
  onComplete,
  onPause,
  onResume,
  onDistraction,
  isActive,
  taskName,
}: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isPaused, setIsPaused] = useState(!isActive);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    setIsPaused(!isActive);
  }, [isActive]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (isPaused && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, timeLeft, onComplete]);
  
  useEffect(() => {
    const progress = 1 - timeLeft / (duration * 60);
    
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, duration, progressAnimation]);
  
  const togglePause = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
    setIsPaused(!isPaused);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressInterpolate = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const progressStyle = {
    transform: [{ rotate: progressInterpolate }],
  };
  
  return (
    <View style={styles.container}>
      {taskName && (
        <Text style={styles.taskName} numberOfLines={1}>
          {taskName}
        </Text>
      )}
      
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.progressCircle, progressStyle]} />
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.labelText}>remaining</Text>
        </View>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={togglePause}
        >
          {isPaused ? (
            <Play size={32} color={Colors.light.primary} />
          ) : (
            <Pause size={32} color={Colors.light.primary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onComplete}
        >
          <SkipForward size={32} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
      
      <Button
        title="I'm Distracted"
        variant="outline"
        style={styles.distractionButton}
        onPress={onDistraction}
        icon={<AlertCircle size={16} color={Colors.light.primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  timerContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderLeftWidth: 8,
    borderTopWidth: 8,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: Colors.light.primary,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.text,
  },
  labelText: {
    fontSize: 14,
    color: Colors.light.subtext,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  distractionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
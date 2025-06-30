import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Battery, BatteryMedium, BatteryFull } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { EnergyLevel } from '@/types';

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
}

export default function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Energy Level</Text>
      
      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.option,
            value === 'low' && styles.selectedOption,
            { backgroundColor: value === 'low' ? 'rgba(231, 76, 60, 0.1)' : undefined }
          ]}
          onPress={() => onChange('low')}
        >
          <Battery 
            size={24} 
            color={value === 'low' ? Colors.light.error : Colors.light.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              value === 'low' && styles.selectedText,
              { color: value === 'low' ? Colors.light.error : Colors.light.subtext }
            ]}
          >
            Low
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            value === 'medium' && styles.selectedOption,
            { backgroundColor: value === 'medium' ? 'rgba(243, 156, 18, 0.1)' : undefined }
          ]}
          onPress={() => onChange('medium')}
        >
          <BatteryMedium 
            size={24} 
            color={value === 'medium' ? Colors.light.warning : Colors.light.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              value === 'medium' && styles.selectedText,
              { color: value === 'medium' ? Colors.light.warning : Colors.light.subtext }
            ]}
          >
            Medium
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            value === 'high' && styles.selectedOption,
            { backgroundColor: value === 'high' ? 'rgba(46, 204, 113, 0.1)' : undefined }
          ]}
          onPress={() => onChange('high')}
        >
          <BatteryFull 
            size={24} 
            color={value === 'high' ? Colors.light.success : Colors.light.subtext} 
          />
          <Text 
            style={[
              styles.optionText,
              value === 'high' && styles.selectedText,
              { color: value === 'high' ? Colors.light.success : Colors.light.subtext }
            ]}
          >
            High
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedOption: {
    borderColor: 'transparent',
  },
  optionText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    fontWeight: '600',
  },
});
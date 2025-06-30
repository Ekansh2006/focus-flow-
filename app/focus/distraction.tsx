import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useFocusStore } from '@/store/useFocusStore';
import { getFocusTips } from '@/utils/aiHelpers';

const DISTRACTION_TYPES = [
  'social media',
  'noise',
  'notifications',
  'people',
  'fatigue',
  'procrastination',
  'thoughts',
  'hunger',
  'other',
];

export default function DistractionScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [notes, setNotes] = useState('');
  const [focusTip, setFocusTip] = useState('');
  
  const { addDistraction } = useFocusStore();
  
  const handleSelectType = (type: string) => {
    setSelectedType(type);
    // Get a specific tip for this distraction type
    setFocusTip(getFocusTips(type));
  };
  
  const handleSubmit = () => {
    if (selectedType) {
      addDistraction(selectedType, notes);
      router.back();
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "What distracted you?" }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Tracking distractions helps you understand and overcome them.
        </Text>
        
        <View style={styles.typesContainer}>
          {DISTRACTION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.selectedTypeButton,
              ]}
              onPress={() => handleSelectType(type)}
            >
              <Text 
                style={[
                  styles.typeButtonText,
                  selectedType === type && styles.selectedTypeButtonText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="What specifically distracted you?"
            placeholderTextColor={Colors.light.subtext}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
        
        {focusTip && (
          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>Focus Tip:</Text>
            <Text style={styles.tipText}>{focusTip}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Skip"
            variant="outline"
            onPress={() => router.back()}
            style={styles.button}
          />
          <Button
            title="Log Distraction"
            onPress={handleSubmit}
            style={styles.button}
            disabled={!selectedType}
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
  subtitle: {
    fontSize: 16,
    color: Colors.light.subtext,
    marginBottom: 24,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedTypeButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedTypeButtonText: {
    color: '#fff',
    fontWeight: '600',
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
    minHeight: 100,
  },
  tipContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
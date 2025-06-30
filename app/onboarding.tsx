import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    peakFocusTime: 'morning' as 'morning' | 'afternoon' | 'evening' | 'night',
    commonDistractions: [] as string[],
    reminderType: 'notification' as 'notification' | 'sound' | 'vibration' | 'none',
  });
  const { setPreferences } = useUserStore();

  const steps = [
    {
      title: "Welcome to FocusFlow",
      description: "Work with your brain, not against it. Let's set up your personalized focus experience.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "When are you most focused?",
      description: "Understanding your natural energy patterns helps schedule important tasks at the right time.",
      options: [
        { label: "Morning", value: "morning" },
        { label: "Afternoon", value: "afternoon" },
        { label: "Evening", value: "evening" },
        { label: "Night", value: "night" },
      ],
      key: "peakFocusTime",
    },
    {
      title: "What distracts you most?",
      description: "Select all that apply. We'll help you manage these distractions.",
      options: [
        { label: "Social Media", value: "social media" },
        { label: "Noise", value: "noise" },
        { label: "Notifications", value: "notifications" },
        { label: "Colleagues/Family", value: "people" },
        { label: "Fatigue", value: "fatigue" },
        { label: "Procrastination", value: "procrastination" },
      ],
      key: "commonDistractions",
      multiSelect: true,
    },
    {
      title: "How do you want to be reminded?",
      description: "Choose your preferred way to receive focus reminders and alerts.",
      options: [
        { label: "Notifications", value: "notification" },
        { label: "Sound", value: "sound" },
        { label: "Vibration", value: "vibration" },
        { label: "None", value: "none" },
      ],
      key: "reminderType",
    },
    {
      title: "You're all set!",
      description: "Your personalized focus environment is ready. Let's start being productive together.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setPreferences({
        ...answers,
        onboardingCompleted: true,
        name: "User", // Default name
      });
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (key: string, value: string) => {
    if (currentStepData.multiSelect) {
      setAnswers((prev) => {
        const currentValues = prev[key as keyof typeof prev] as string[];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [key]: currentValues.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [key]: [...currentValues, value],
          };
        }
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const isOptionSelected = (key: string, value: string) => {
    if (currentStepData.multiSelect) {
      return (answers[key as keyof typeof answers] as string[]).includes(value);
    } else {
      return answers[key as keyof typeof answers] === value;
    }
  };

  const renderOptions = () => {
    if (!currentStepData.options) return null;

    return (
      <View style={styles.optionsContainer}>
        {currentStepData.options.map((option) => (
          <Button
            key={option.value}
            title={option.label}
            variant={isOptionSelected(currentStepData.key!, option.value) ? "primary" : "outline"}
            style={styles.optionButton}
            onPress={() => handleOptionSelect(currentStepData.key!, option.value)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {currentStepData.image && (
          <Image
            source={{ uri: currentStepData.image }}
            style={[styles.image, { width: width - 40 }]}
            resizeMode="cover"
          />
        )}

        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.description}>{currentStepData.description}</Text>

        {renderOptions()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <Button
            title="Back"
            variant="outline"
            style={styles.backButton}
            onPress={handleBack}
          />
        )}
        <Button
          title={currentStep === steps.length - 1 ? "Get Started" : "Next"}
          style={styles.nextButton}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: Colors.light.primary,
    width: 16,
  },
  image: {
    height: 200,
    borderRadius: 16,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 2,
  },
});
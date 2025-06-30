import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import Colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const { preferences } = useUserStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { preferences } = useUserStore();
  const initialRoute = preferences.onboardingCompleted ? "(tabs)" : "onboarding";

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTintColor: Colors.light.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: Colors.light.background,
        },
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="task/[id]" 
        options={{ 
          title: "Task Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="task/new" 
        options={{ 
          title: "New Task",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="focus/session" 
        options={{ 
          title: "Focus Session",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="focus/distraction" 
        options={{ 
          title: "Distraction",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="focus/complete" 
        options={{ 
          title: "Session Complete",
          presentation: "modal",
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}
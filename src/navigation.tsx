import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useStore } from './models/store';

import { HomeScreen } from './screens/HomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PrepareVisitScreen } from './screens/PrepareVisitScreen';
import { WhyVisitsScreen } from './screens/WhyVisitsScreen';
import { VisitFlowScreen } from './screens/VisitFlowScreen';
import { HowToPrepScreen } from './screens/HowToPrepScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { VisitScreen } from './screens/VisitScreen';
import { VisitModeScreen } from './screens/VisitModeScreen';

// The "Their Story" tab (LifeStory / Facts / Memories / Songs / QuestionBank) is
// hidden for now. Those screen files stay in the codebase but are no longer
// referenced anywhere in navigation. With only Home left, the bottom tab bar is
// dropped and Home is the root screen. To restore: bring back a bottom-tab
// navigator with a StoryStack of those five screens and swap it in for the Home
// screen registered below.

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const store = useStore();

  if (!store.ready) return null;

  if (!store.hasOnboarded) {
    return (
      <NavigationContainer>
        <OnboardingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <Stack.Screen name="Visit" component={VisitModeScreen} />
          {/* Old card-deck visit mode — kept reachable but no longer the default. */}
          <Stack.Screen name="VisitLegacy" component={VisitScreen} />
          <Stack.Screen name="PrepareVisit" component={PrepareVisitScreen} />
          <Stack.Screen name="WhyVisits" component={WhyVisitsScreen} />
          <Stack.Screen name="VisitFlow" component={VisitFlowScreen} />
          <Stack.Screen name="HowToPrep" component={HowToPrepScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

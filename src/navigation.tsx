import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useStore } from './models/store';
import { colors } from './theme';

import { FactsScreen } from './screens/FactsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LifeStoryScreen } from './screens/LifeStoryScreen';
import { MemoriesScreen } from './screens/MemoriesScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { QuestionBankScreen } from './screens/QuestionBankScreen';
import { SongsScreen } from './screens/SongsScreen';
import { VisitScreen } from './screens/VisitScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoryHome" component={LifeStoryScreen} />
      <Stack.Screen name="Facts" component={FactsScreen} />
      <Stack.Screen name="Memories" component={MemoriesScreen} />
      <Stack.Screen name="Songs" component={SongsScreen} />
      <Stack.Screen name="QuestionBank" component={QuestionBankScreen} />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.tertiary,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={route.name === 'Home' ? 'heart' : 'book'}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Their Story"
        component={StoryStack}
        options={{ tabBarLabel: 'Their Story' }}
      />
    </Tab.Navigator>
  );
}

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
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <Stack.Screen name="Visit" component={VisitScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

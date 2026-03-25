import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1d4ed8' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          contentStyle: { backgroundColor: '#f1f5f9' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Événements' }} />
        <Stack.Screen name="event/[id]" options={{ title: 'Détail' }} />
        <Stack.Screen name="signin" options={{ title: 'Connexion', headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: 'Inscription', headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

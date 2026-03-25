import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Événements' }} />
        <Stack.Screen name="event/[id]" options={{ title: 'Détail' }} />
        <Stack.Screen name="signin" options={{ title: 'Connexion' }} />
        <Stack.Screen name="signup" options={{ title: 'Inscription' }} />
      </Stack>
    </AuthProvider>
  );
}
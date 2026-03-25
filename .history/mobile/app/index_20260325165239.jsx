import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/api';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const { user, signout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(r => r.json())
      .then(setEvents);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user ? (
          <View style={styles.row}>
            <Text style={styles.welcome}>👋 {user.name}</Text>
            <TouchableOpacity onPress={signout}>
              <Text style={styles.link}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={styles.link}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.link}>Inscription</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/event/${item.id}`)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{item.location} — {new Date(item.date).toLocaleDateString('fr-FR')}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { fontWeight: '600', fontSize: 16 },
  link: { color: '#3b82f6', fontWeight: '600', marginLeft: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sub: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
  desc: { color: '#9ca3af', fontSize: 13 },
});
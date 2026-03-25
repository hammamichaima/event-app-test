import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants/api';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(r => r.json())
      .then(data => setEvent(data.find(e => e.id == id)));
  }, [id]);

  const handleRegister = async () => {
    if (!user) return Alert.alert('Non connecté', 'Connecte-toi pour t\'inscrire.');
    const res = await fetch(`${API_URL}/events/${id}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    });
    if (res.ok) Alert.alert('✅ Inscrit !', 'Tu es inscrit à cet événement.');
    else Alert.alert('Déjà inscrit', 'Tu es déjà inscrit à cet événement.');
  };

  if (!event) return <View style={styles.center}><Text>Chargement...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>📍 {event.location}</Text>
      <Text style={styles.meta}>📅 {new Date(event.date).toLocaleDateString('fr-FR', { dateStyle: 'full' })}</Text>
      <Text style={styles.desc}>{event.description}</Text>
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>S'inscrire à cet événement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  meta: { fontSize: 15, color: '#6b7280', marginBottom: 6 },
  desc: { fontSize: 15, color: '#374151', marginTop: 16, lineHeight: 22 },
  btn: { backgroundColor: '#3b82f6', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 32 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
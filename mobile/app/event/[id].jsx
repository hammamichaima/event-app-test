import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../constants/api';
import { useResponsive } from '../../hooks/useResponsive';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const { contentWidth, padding, fontSize, isTablet } = useResponsive();

  useEffect(() => {
    fetch(`${API_URL}/events/${id}`)
      .then(r => r.json())
      .then(setEvent)
      .catch(() =>
        fetch(`${API_URL}/events`)
          .then(r => r.json())
          .then(data => setEvent(data.find(e => e.id == id)))
      );
  }, [id]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`${API_URL}/events/${id}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 201) setMessage({ type: 'success', text: 'Vous êtes bien inscrit à cet événement.' });
    else if (res.status === 409) setMessage({ type: 'warning', text: 'Vous êtes déjà inscrit à cet événement.' });
    else setMessage({ type: 'error', text: data.error || 'Une erreur est survenue.' });
  };

  if (!event) return <View style={styles.center}><ActivityIndicator size="large" color="#1d4ed8" /></View>;

  const date = new Date(event.date);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { padding, alignItems: 'center' }]}>
      <View style={{ width: contentWidth }}>
        <TouchableOpacity style={styles.backLink} onPress={() => router.push('/')}>
          <Text style={[styles.backText, { fontSize: fontSize.sm }]}>← Retour aux événements</Text>
        </TouchableOpacity>

        <View style={[styles.hero, isTablet && styles.heroTablet]}>
          <Text style={[styles.heroDate, { fontSize: fontSize.sm }]}>
            {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          <Text style={[styles.heroTitle, { fontSize: fontSize.xl }]}>{event.title}</Text>
          {event.location ? <Text style={[styles.heroLocation, { fontSize: fontSize.sm }]}>{event.location}</Text> : null}
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={[styles.infoValue, { fontSize: fontSize.md }]}>{date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Heure</Text>
              <Text style={[styles.infoValue, { fontSize: fontSize.md }]}>{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>
        </View>

        {event.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={[styles.desc, { fontSize: fontSize.md }]}>{event.description}</Text>
          </View>
        ) : null}

        {message && (
          <View style={[styles.message, styles[`message_${message.type}`]]}>
            <Text style={[styles.messageText, styles[`messageText_${message.type}`], { fontSize: fontSize.sm }]}>{message.text}</Text>
          </View>
        )}

        {user ? (
          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { fontSize: fontSize.md }]}>S'inscrire à cet événement</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.authPrompt}>
            <Text style={[styles.authPromptText, { fontSize: fontSize.sm }]}>Vous devez être connecté pour vous inscrire.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => router.push('/signin')}>
              <Text style={[styles.btnText, { fontSize: fontSize.md }]}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/signup')}>
              <Text style={[styles.btnOutlineText, { fontSize: fontSize.md }]}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  backLink: { marginBottom: 16 },
  backText: { color: '#1d4ed8', fontWeight: '600' },
  hero: { backgroundColor: '#1d4ed8', borderRadius: 16, padding: 24, marginBottom: 16 },
  heroTablet: { padding: 32 },
  heroDate: { color: '#93c5fd', marginBottom: 8, textTransform: 'capitalize' },
  heroTitle: { fontWeight: '800', color: '#fff', marginBottom: 8, lineHeight: 32 },
  heroLocation: { color: '#bfdbfe' },
  section: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12 },
  infoRow: { flexDirection: 'row', gap: 12 },
  infoBox: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 10, padding: 12 },
  infoLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontWeight: '700', color: '#0f172a' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: 10 },
  desc: { color: '#334155', lineHeight: 24 },
  message: { borderRadius: 10, padding: 14, marginBottom: 12 },
  message_success: { backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#86efac' },
  message_warning: { backgroundColor: '#fef9c3', borderWidth: 1, borderColor: '#fde047' },
  message_error: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5' },
  messageText: { fontWeight: '500', textAlign: 'center' },
  messageText_success: { color: '#16a34a' },
  messageText_warning: { color: '#ca8a04' },
  messageText_error: { color: '#dc2626' },
  btn: { backgroundColor: '#1d4ed8', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 10, elevation: 3 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700' },
  btnOutline: { borderWidth: 1.5, borderColor: '#1d4ed8', borderRadius: 14, padding: 16, alignItems: 'center' },
  btnOutlineText: { color: '#1d4ed8', fontWeight: '700' },
  authPrompt: { gap: 10, marginTop: 8 },
  authPromptText: { textAlign: 'center', color: '#64748b', marginBottom: 4 },
});

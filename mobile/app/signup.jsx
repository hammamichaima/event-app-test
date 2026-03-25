import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../constants/api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = width >= 768 ? Math.min(480, width - 64) : width - 32;

  const handleSignUp = async () => {
    if (!name || !email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || 'Une erreur est survenue.');
    } catch {
      setError('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.navBack}>
          <Text style={styles.navBackText}>← Événements</Text>
        </TouchableOpacity>
        <Text style={styles.navBrand}>EventManager</Text>
        <View style={{ width: 90 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { width: cardWidth }]}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez-nous pour vous inscrire aux événements</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>Compte créé avec succès</Text>
              <Text style={styles.successText}>Vous pouvez maintenant vous connecter.</Text>
              <TouchableOpacity style={styles.btn} onPress={() => router.replace('/signin')}>
                <Text style={styles.btnText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Nom complet</Text>
                  <TextInput style={styles.input} placeholder="Jean Dupont"
                    placeholderTextColor="#94a3b8" value={name} onChangeText={setName} />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Adresse email</Text>
                  <TextInput style={styles.input} placeholder="exemple@email.com"
                    placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail}
                    keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <TextInput style={styles.input} placeholder="••••••••"
                    placeholderTextColor="#94a3b8" value={password} onChangeText={setPassword} secureTextEntry />
                </View>
              </View>

              <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSignUp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Créer mon compte</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchLink} onPress={() => router.push('/signin')}>
                <Text style={styles.switchText}>Déjà un compte ? <Text style={styles.switchBold}>Se connecter</Text></Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  navbar: {
    backgroundColor: '#1d4ed8', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14,
  },
  navBack: { width: 90 },
  navBackText: { color: '#bfdbfe', fontSize: 13, fontWeight: '600' },
  navBrand: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16, paddingVertical: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 28,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  errorBox: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  successBox: { alignItems: 'center', gap: 10, paddingVertical: 12 },
  successTitle: { fontSize: 18, fontWeight: '700', color: '#16a34a' },
  successText: { fontSize: 14, color: '#64748b', marginBottom: 8, textAlign: 'center' },
  form: { gap: 16, marginBottom: 24 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, fontSize: 15, color: '#0f172a', backgroundColor: '#f8fafc' },
  btn: { backgroundColor: '#1d4ed8', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 3, width: '100%' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  switchLink: { marginTop: 20, alignItems: 'center' },
  switchText: { fontSize: 14, color: '#64748b' },
  switchBold: { color: '#1d4ed8', fontWeight: '700' },
});

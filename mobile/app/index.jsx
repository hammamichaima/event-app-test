import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/api';
import { useResponsive } from '../hooks/useResponsive';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, signout } = useAuth();
  const handleSignout = () => { signout(); router.replace('/signin'); };
  const router = useRouter();
  const { contentWidth, padding, cardPadding, fontSize, isTablet } = useResponsive();

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  const onRefresh = () => { setRefreshing(true); fetchEvents(); };
  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1d4ed8" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={[styles.navBrand, { fontSize: fontSize.md }]}>EventManager</Text>
        {user ? (
          <View style={styles.navRight}>
            <Text style={[styles.navUser, { fontSize: fontSize.sm }]} numberOfLines={1}>{user.name}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={handleSignout}>
              <Text style={styles.navBtnText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navRight}>
            <TouchableOpacity style={[styles.navBtn, styles.navBtnOutline]} onPress={() => router.push('/signin')}>
              <Text style={[styles.navBtnText, styles.navBtnTextOutline]}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/signup')}>
              <Text style={styles.navBtnText}>Inscription</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[styles.list, { padding, alignItems: 'center' }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1d4ed8']} />}
        ListHeaderComponent={null}
        ListEmptyComponent={
          <View style={[styles.empty, { width: contentWidth }]}>
            <Text style={[styles.emptyTitle, { fontSize: fontSize.lg }]}>Aucun événement</Text>
            <Text style={[styles.emptyText, { fontSize: fontSize.sm }]}>Revenez plus tard.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: contentWidth, padding: cardPadding }]}
            onPress={() => router.push(`/event/${item.id}`)}
            activeOpacity={0.85}
          >
            <View style={[styles.cardBadge, isTablet && styles.cardBadgeTablet]}>
              <Text style={[styles.cardBadgeDay, { fontSize: isTablet ? 22 : 18 }]}>{new Date(item.date).getDate()}</Text>
              <Text style={[styles.cardBadgeMon, { fontSize: isTablet ? 12 : 10 }]}>{new Date(item.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { fontSize: fontSize.lg }]} numberOfLines={1}>{item.title}</Text>
              {item.location ? <Text style={[styles.cardLocation, { fontSize: fontSize.sm }]}>{item.location}</Text> : null}
              <Text style={[styles.cardDate, { fontSize: fontSize.sm }]}>{formatDate(item.date)}</Text>
              {item.description ? <Text style={[styles.cardDesc, { fontSize: fontSize.sm }]} numberOfLines={2}>{item.description}</Text> : null}
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1d4ed8', paddingVertical: 14, paddingHorizontal: 16 },
  navBrand: { color: '#fff', fontWeight: '800', letterSpacing: 0.5 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navUser: { color: '#bfdbfe', fontWeight: '500', maxWidth: 120 },
  navBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  navBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fff' },
  navBtnText: { color: '#1d4ed8', fontSize: 13, fontWeight: '700' },
  navBtnTextOutline: { color: '#fff' },
  list: { gap: 12, paddingBottom: 32 },
  listHeader: { marginBottom: 8, marginTop: 8 },
  listTitle: { fontWeight: '800', color: '#0f172a' },
  listSub: { color: '#94a3b8', marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  cardBadge: { backgroundColor: '#eff6ff', borderRadius: 12, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  cardBadgeTablet: { width: 64, height: 64, borderRadius: 14 },
  cardBadgeDay: { fontWeight: '800', color: '#1d4ed8', lineHeight: 24 },
  cardBadgeMon: { fontWeight: '700', color: '#93c5fd' },
  cardBody: { flex: 1 },
  cardTitle: { fontWeight: '700', color: '#0f172a', marginBottom: 3 },
  cardLocation: { color: '#64748b', marginBottom: 2 },
  cardDate: { color: '#94a3b8' },
  cardDesc: { color: '#64748b', marginTop: 4, lineHeight: 18 },
  cardArrow: { fontSize: 24, color: '#cbd5e1' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontWeight: '700', color: '#334155', marginBottom: 6 },
  emptyText: { color: '#94a3b8' },
});

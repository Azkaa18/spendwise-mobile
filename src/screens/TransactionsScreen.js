import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { colors, money, ui } from '../theme';
import TransactionRow from '../components/TransactionRow';

const FILTERS = ['all', 'expense', 'income'];

export default function TransactionsScreen({ navigation }) {
  const { state } = useStore();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const sections = useMemo(() => {
    const list = state.transactions
      .filter((t) => (filter === 'all' || t.type === filter) && `${t.note} ${t.category}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const groups = {};
    list.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      (groups[key] = groups[key] || []).push(t);
    });
    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
      net: data.reduce((a, t) => a + (t.type === 'income' ? t.amount : -t.amount), 0),
    }));
  }, [state.transactions, filter, q]);

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <View style={[ui.pad, { marginTop: 8 }]}>
        <Text style={ui.h1}>Activity</Text>
        <TextInput style={[ui.input, { marginTop: 14 }]} placeholder="Search notes or categories" placeholderTextColor={colors.muted} value={q} onChangeText={setQ} />
        <View style={styles.segment}>
          {FILTERS.map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.segBtn, filter === f && styles.segActive]}>
              <Text style={[styles.segText, filter === f && { color: colors.primary }]}>{f[0].toUpperCase() + f.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={[ui.row, ui.between, { marginTop: 18, marginBottom: 4 }]}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={[styles.sectionTitle, { color: section.net >= 0 ? colors.income : colors.muted }]}>
              {section.net >= 0 ? '+' : '−'}
              {money(Math.abs(section.net), state.currency)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => <TransactionRow tx={item} currency={state.currency} onPress={() => navigation.navigate('TransactionDetail', { id: item.id })} />}
        ListEmptyComponent={<Text style={[ui.muted, { textAlign: 'center', marginTop: 40 }]}>No transactions found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: colors.primarySoft, borderRadius: 14, padding: 4, marginTop: 12 },
  segBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  segActive: { backgroundColor: colors.surface },
  segText: { fontWeight: '700', color: colors.muted },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
});

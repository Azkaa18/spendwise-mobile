import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { monthSummary, useStore } from '../store';
import { CATEGORIES, colors, money, ui } from '../theme';
import TransactionRow from '../components/TransactionRow';
import ProgressBar from '../components/ProgressBar';

export default function HomeScreen({ navigation }) {
  const { state } = useStore();
  const { income, expense, balance, byCategory } = monthSummary(state.transactions);
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const overBudget = Object.entries(state.budgets).filter(([c, limit]) => (byCategory[c] || 0) > limit);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[ui.pad, ui.row, ui.between, { marginTop: 8 }]}>
          <View>
            <Text style={ui.muted}>{greet},</Text>
            <Text style={ui.h1}>{state.name} 👋</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>{state.name?.[0]}</Text>
          </View>
        </View>

        <View style={[ui.pad, { marginTop: 18 }]}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Balance this month</Text>
            <Text style={styles.heroValue}>{money(balance, state.currency)}</Text>
            <View style={[ui.row, { marginTop: 18, gap: 12 }]}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>↓ Income</Text>
                <Text style={styles.pillValue}>{money(income, state.currency)}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>↑ Spent</Text>
                <Text style={styles.pillValue}>{money(expense, state.currency)}</Text>
              </View>
            </View>
          </View>
        </View>

        {overBudget.length > 0 && (
          <View style={[ui.pad, { marginTop: 14 }]}>
            <View style={[ui.card, { backgroundColor: colors.warnSoft, borderColor: '#fed7aa' }]}>
              <Text style={{ color: colors.warn, fontWeight: '700' }}>⚠ Over budget: {overBudget.map(([c]) => c).join(', ')}</Text>
            </View>
          </View>
        )}

        <View style={[ui.pad, { marginTop: 20 }]}>
          <Text style={ui.h2}>Top spending</Text>
          <View style={[ui.card, { marginTop: 10, gap: 14 }]}>
            {top.length === 0 && <Text style={ui.muted}>No expenses yet this month.</Text>}
            {top.map(([cat, amt]) => (
              <View key={cat}>
                <View style={[ui.row, ui.between, { marginBottom: 6 }]}>
                  <Text style={{ fontWeight: '600', color: colors.text }}>
                    {CATEGORIES[cat]?.icon} {cat}
                  </Text>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{money(amt, state.currency)}</Text>
                </View>
                <ProgressBar value={expense ? amt / expense : 0} color={CATEGORIES[cat]?.color} />
              </View>
            ))}
          </View>
        </View>

        <View style={[ui.pad, ui.row, ui.between, { marginTop: 22 }]}>
          <Text style={ui.h2}>Recent activity</Text>
          <Pressable onPress={() => navigation.navigate('Activity')}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>See all</Text>
          </Pressable>
        </View>
        <View style={[ui.pad]}>
          <View style={[ui.card, { marginTop: 10, paddingVertical: 4 }]}>
            {state.transactions.slice(0, 5).map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={state.currency} onPress={() => navigation.navigate('TransactionDetail', { id: tx.id })} />
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={{ color: '#fff', fontSize: 30, lineHeight: 32 }}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  hero: { backgroundColor: colors.primaryDark, borderRadius: 26, padding: 22 },
  heroLabel: { color: '#f9a8d4', fontWeight: '600' },
  heroValue: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 6, letterSpacing: -1 },
  pill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 12 },
  pillLabel: { color: '#fbcfe8', fontSize: 12, fontWeight: '600' },
  pillValue: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

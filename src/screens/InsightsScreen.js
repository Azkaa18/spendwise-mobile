import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { monthSummary, useStore } from '../store';
import { CATEGORIES, colors, money, ui } from '../theme';

export default function InsightsScreen() {
  const { state } = useStore();
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const cur = monthSummary(state.transactions, now);
  const prev = monthSummary(state.transactions, last);
  const change = prev.expense ? Math.round(((cur.expense - prev.expense) / prev.expense) * 100) : 0;
  const savingsRate = cur.income ? Math.round((cur.balance / cur.income) * 100) : 0;

  // Last 7 days of spending
  const week = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    return {
      label: d.toLocaleDateString('en-GB', { weekday: 'narrow' }),
      value: state.transactions.filter((t) => t.type === 'expense' && new Date(t.date).toDateString() === key).reduce((a, t) => a + t.amount, 0),
    };
  });
  const max = Math.max(1, ...week.map((w) => w.value));
  const cats = Object.entries(cur.byCategory).sort((a, b) => b[1] - a[1]);
  const biggest = state.transactions.filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth()).sort((a, b) => b.amount - a.amount)[0];

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 14 }}>
        <Text style={ui.h1}>Insights</Text>

        <View style={[ui.row, { gap: 12 }]}>
          <View style={[ui.card, { flex: 1 }]}>
            <Text style={ui.label}>Savings rate</Text>
            <Text style={styles.big}>{savingsRate}%</Text>
            <Text style={[ui.muted, { fontSize: 12 }]}>of income kept</Text>
          </View>
          <View style={[ui.card, { flex: 1 }]}>
            <Text style={ui.label}>vs last month</Text>
            <Text style={[styles.big, { color: change > 0 ? colors.expense : colors.income }]}>
              {change > 0 ? '▲' : '▼'} {Math.abs(change)}%
            </Text>
            <Text style={[ui.muted, { fontSize: 12 }]}>spending</Text>
          </View>
        </View>

        <View style={ui.card}>
          <Text style={ui.h2}>Last 7 days</Text>
          <View style={styles.chart}>
            {week.map((w, i) => (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: `${(w.value / max) * 100}%`, backgroundColor: i === 6 ? colors.primary : '#f9a8d4' }]} />
                <Text style={styles.barLabel}>{w.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={ui.card}>
          <Text style={ui.h2}>Where your money went</Text>
          <View style={styles.stack}>
            {cats.map(([c, v]) => (
              <View key={c} style={{ flex: v, backgroundColor: CATEGORIES[c]?.color }} />
            ))}
          </View>
          {cats.map(([c, v]) => (
            <View key={c} style={[ui.row, ui.between, { paddingVertical: 6 }]}>
              <View style={[ui.row, { gap: 8 }]}>
                <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: CATEGORIES[c]?.color }} />
                <Text style={{ color: colors.text, fontWeight: '600' }}>{c}</Text>
              </View>
              <Text style={ui.muted}>
                {money(v, state.currency)} · {Math.round((v / cur.expense) * 100)}%
              </Text>
            </View>
          ))}
        </View>

        {biggest && (
          <View style={[ui.card, { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark }]}>
            <Text style={{ color: '#f9a8d4', fontWeight: '700' }}>💡 Biggest expense this month</Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 6 }}>
              {biggest.note} — {money(biggest.amount, state.currency)}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 28, fontWeight: '800', color: colors.text, marginVertical: 4 },
  chart: { flexDirection: 'row', height: 150, alignItems: 'flex-end', gap: 10, marginTop: 16 },
  barCol: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '100%', borderRadius: 8, minHeight: 4 },
  barLabel: { fontSize: 11, color: colors.muted, marginTop: 6, fontWeight: '600' },
  stack: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginVertical: 14 },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, colors, money } from '../theme';

export default function TransactionRow({ tx, currency, onPress }) {
  const cat = CATEGORIES[tx.category] || CATEGORIES.Other;
  const isIncome = tx.type === 'income';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <View style={[styles.icon, { backgroundColor: `${cat.color}22` }]}>
        <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {tx.note || tx.category}
        </Text>
        <Text style={styles.sub}>
          {tx.category} · {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.text }]}>
        {isIncome ? '+' : '−'}
        {money(tx.amount, currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700' },
});

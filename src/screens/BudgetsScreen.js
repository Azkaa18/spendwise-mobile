import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { monthSummary, useStore } from '../store';
import { CATEGORIES, colors, EXPENSE_CATS, money, ui } from '../theme';
import ProgressBar from '../components/ProgressBar';

export default function BudgetsScreen() {
  const { state, dispatch } = useStore();
  const { byCategory } = monthSummary(state.transactions);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState('');

  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const totalSpent = Object.keys(state.budgets).reduce((a, c) => a + (byCategory[c] || 0), 0);
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate() + 1;

  const open = (cat) => {
    setEditing(cat);
    setValue(state.budgets[cat] ? String(state.budgets[cat]) : '');
  };
  const save = () => {
    dispatch({ type: 'setBudget', category: editing, amount: Number(value) || 0 });
    setEditing(null);
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={ui.h1}>Budgets</Text>
        <Text style={[ui.muted, { marginTop: 4 }]}>{daysLeft} days left this month</Text>

        <View style={[ui.card, { marginTop: 16, backgroundColor: colors.primarySoft, borderColor: '#fbcfe8' }]}>
          <Text style={{ color: colors.primaryDark, fontWeight: '700' }}>Monthly budget</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 4 }}>
            {money(totalSpent, state.currency)} <Text style={{ fontSize: 15, color: colors.muted }}>/ {money(totalBudget, state.currency)}</Text>
          </Text>
          <View style={{ marginTop: 12 }}>
            <ProgressBar value={totalBudget ? totalSpent / totalBudget : 0} height={10} />
          </View>
          <Text style={[ui.muted, { marginTop: 10 }]}>
            Safe to spend: <Text style={{ fontWeight: '700', color: colors.text }}>{money(Math.max(0, (totalBudget - totalSpent) / daysLeft), state.currency)}/day</Text>
          </Text>
        </View>

        <View style={{ marginTop: 20, gap: 12 }}>
          {EXPENSE_CATS.map((cat) => {
            const limit = state.budgets[cat];
            const spent = byCategory[cat] || 0;
            const ratio = limit ? spent / limit : 0;
            const tone = ratio > 1 ? colors.expense : ratio > 0.8 ? colors.warn : CATEGORIES[cat].color;
            return (
              <Pressable key={cat} onPress={() => open(cat)} style={ui.card}>
                <View style={[ui.row, ui.between]}>
                  <View style={[ui.row, { gap: 10 }]}>
                    <Text style={{ fontSize: 22 }}>{CATEGORIES[cat].icon}</Text>
                    <View>
                      <Text style={{ fontWeight: '700', color: colors.text }}>{cat}</Text>
                      <Text style={[ui.muted, { fontSize: 12 }]}>{limit ? `${money(spent, state.currency)} of ${money(limit, state.currency)}` : 'No budget — tap to set'}</Text>
                    </View>
                  </View>
                  {limit ? <Text style={{ fontWeight: '800', color: tone }}>{Math.round(ratio * 100)}%</Text> : <Text style={{ color: colors.primary, fontWeight: '700' }}>Set</Text>}
                </View>
                {!!limit && (
                  <View style={{ marginTop: 10 }}>
                    <ProgressBar value={ratio} color={tone} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={!!editing} transparent animationType="slide" onRequestClose={() => setEditing(null)}>
        <Pressable style={styles.backdrop} onPress={() => setEditing(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={ui.h2}>
              {CATEGORIES[editing]?.icon} {editing} budget
            </Text>
            <TextInput style={[ui.input, { marginTop: 14, fontSize: 22, fontWeight: '700' }]} keyboardType="numeric" value={value} onChangeText={setValue} placeholder="0" autoFocus />
            <Pressable style={[ui.btn, { marginTop: 16 }]} onPress={save}>
              <Text style={ui.btnText}>Save budget</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(42,19,32,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
});

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { newId, useStore } from '../store';
import { CATEGORIES, colors, EXPENSE_CATS, INCOME_CATS, ui } from '../theme';

export default function AddTransactionScreen({ navigation }) {
  const { state, dispatch } = useStore();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [daysAgo, setDaysAgo] = useState(0);
  const [error, setError] = useState('');

  const cats = type === 'expense' ? EXPENSE_CATS : INCOME_CATS;

  const switchType = (t) => {
    setType(t);
    setCategory(t === 'expense' ? 'Food' : 'Salary');
  };

  const save = () => {
    const value = Number(amount.replace(/,/g, ''));
    if (!value || value <= 0) return setError('Enter an amount greater than zero');
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    dispatch({ type: 'add', payload: { id: newId(), type, amount: value, category, note: note.trim(), date: date.toISOString() } });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={ui.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.segment}>
          {['expense', 'income'].map((t) => (
            <Pressable key={t} onPress={() => switchType(t)} style={[styles.segBtn, type === t && { backgroundColor: t === 'expense' ? colors.primary : colors.income }]}>
              <Text style={[styles.segText, type === t && { color: '#fff' }]}>{t === 'expense' ? 'Expense' : 'Income'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={ui.label}>Amount ({state.currency})</Text>
          <TextInput
            style={styles.amount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.border}
            value={amount}
            onChangeText={(v) => {
              setAmount(v);
              setError('');
            }}
            autoFocus
          />
          {!!error && <Text style={{ color: colors.expense, fontWeight: '600' }}>{error}</Text>}
        </View>

        <View>
          <Text style={ui.label}>Category</Text>
          <View style={styles.grid}>
            {cats.map((c) => (
              <Pressable key={c} onPress={() => setCategory(c)} style={[styles.cat, category === c && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}>
                <Text style={{ fontSize: 22 }}>{CATEGORIES[c].icon}</Text>
                <Text style={styles.catText}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={ui.label}>When</Text>
          <View style={[ui.row, { gap: 8 }]}>
            {[
              [0, 'Today'],
              [1, 'Yesterday'],
              [2, '2 days ago'],
            ].map(([d, l]) => (
              <Pressable key={d} onPress={() => setDaysAgo(d)} style={[styles.chip, daysAgo === d && { backgroundColor: colors.text }]}>
                <Text style={{ fontWeight: '600', color: daysAgo === d ? '#fff' : colors.muted }}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={ui.label}>Note</Text>
          <TextInput style={ui.input} placeholder="What was it for?" placeholderTextColor={colors.muted} value={note} onChangeText={setNote} />
        </View>

        <Pressable style={ui.btn} onPress={save}>
          <Text style={ui.btnText}>Save {type}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: colors.primarySoft, borderRadius: 16, padding: 4 },
  segBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  segText: { fontWeight: '700', color: colors.muted },
  amount: { fontSize: 46, fontWeight: '800', color: colors.text, textAlign: 'center', minWidth: 200 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cat: { width: '22%', aspectRatio: 1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 4 },
  catText: { fontSize: 11, fontWeight: '600', color: colors.text },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});

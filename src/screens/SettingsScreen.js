import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { colors, ui } from '../theme';

const CURRENCIES = ['PKR', 'AED', 'USD', 'GBP', 'EUR'];

const confirm = (title, msg, onYes) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (window.confirm(`${title}\n${msg}`)) onYes();
    return;
  }
  Alert.alert(title, msg, [{ text: 'Cancel', style: 'cancel' }, { text: 'Yes', style: 'destructive', onPress: onYes }]);
};

export default function SettingsScreen() {
  const { state, dispatch } = useStore();

  const exportCsv = () => {
    const csv = ['date,type,category,amount,note', ...state.transactions.map((t) => `${t.date},${t.type},${t.category},${t.amount},"${(t.note || '').replace(/"/g, '""')}"`)].join('\n');
    if (Platform.OS === 'web') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'spendwise.csv';
      a.click();
    } else {
      Alert.alert('Export', `${state.transactions.length} transactions ready. Hook this up to expo-sharing to share the CSV.`);
    }
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <Text style={ui.h1}>Settings</Text>

        <View style={ui.card}>
          <Text style={ui.label}>Your name</Text>
          <TextInput style={ui.input} value={state.name} onChangeText={(name) => dispatch({ type: 'settings', payload: { name } })} />
        </View>

        <View style={ui.card}>
          <Text style={ui.label}>Currency</Text>
          <View style={[ui.row, { gap: 8, flexWrap: 'wrap' }]}>
            {CURRENCIES.map((c) => (
              <Pressable key={c} onPress={() => dispatch({ type: 'settings', payload: { currency: c } })} style={[styles.chip, state.currency === c && styles.chipActive]}>
                <Text style={{ fontWeight: '700', color: state.currency === c ? '#fff' : colors.muted }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[ui.card, { paddingVertical: 4 }]}>
          <Pressable style={styles.item} onPress={exportCsv}>
            <Text style={styles.itemText}>⬇ Export transactions (CSV)</Text>
          </Pressable>
          <Pressable style={styles.item} onPress={() => confirm('Load sample data?', 'This replaces your current data.', () => dispatch({ type: 'reset' }))}>
            <Text style={styles.itemText}>↺ Load sample data</Text>
          </Pressable>
          <Pressable style={[styles.item, { borderBottomWidth: 0 }]} onPress={() => confirm('Delete everything?', 'All transactions and budgets will be removed.', () => dispatch({ type: 'clear' }))}>
            <Text style={[styles.itemText, { color: colors.expense }]}>🗑 Clear all data</Text>
          </Pressable>
        </View>

        <Text style={[ui.muted, { textAlign: 'center', fontSize: 12 }]}>SpendWise v1.0.0 · data stays on your device</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 99, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  item: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemText: { fontSize: 15, fontWeight: '600', color: colors.text },
});

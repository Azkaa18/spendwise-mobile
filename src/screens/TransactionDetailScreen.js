import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { useStore } from '../store';
import { CATEGORIES, colors, money, ui } from '../theme';

export default function TransactionDetailScreen({ route, navigation }) {
  const { state, dispatch } = useStore();
  const tx = state.transactions.find((t) => t.id === route.params?.id);
  if (!tx) return <View style={ui.screen} />;
  const cat = CATEGORIES[tx.category] || CATEGORIES.Other;
  const isIncome = tx.type === 'income';

  const del = () => {
    const go = () => {
      dispatch({ type: 'remove', id: tx.id });
      navigation.goBack();
    };
    // eslint-disable-next-line no-alert
    if (Platform.OS === 'web') return window.confirm('Delete this transaction?') && go();
    Alert.alert('Delete transaction?', 'This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: go }]);
  };

  return (
    <View style={[ui.screen, { padding: 20 }]}>
      <View style={[ui.card, { alignItems: 'center', paddingVertical: 30 }]}>
        <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: `${cat.color}22`, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 34 }}>{cat.icon}</Text>
        </View>
        <Text style={{ fontSize: 34, fontWeight: '800', color: isIncome ? colors.income : colors.text, marginTop: 14 }}>
          {isIncome ? '+' : '−'}
          {money(tx.amount, state.currency)}
        </Text>
        <Text style={[ui.muted, { marginTop: 4 }]}>{tx.note || tx.category}</Text>
      </View>
      <View style={[ui.card, { marginTop: 14, gap: 14 }]}>
        {[
          ['Type', isIncome ? 'Income' : 'Expense'],
          ['Category', tx.category],
          ['Date', new Date(tx.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })],
        ].map(([k, v]) => (
          <View key={k} style={[ui.row, ui.between]}>
            <Text style={ui.muted}>{k}</Text>
            <Text style={{ fontWeight: '700', color: colors.text }}>{v}</Text>
          </View>
        ))}
      </View>
      <Pressable style={[ui.btn, { marginTop: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.expense }]} onPress={del}>
        <Text style={[ui.btnText, { color: colors.expense }]}>Delete transaction</Text>
      </Pressable>
    </View>
  );
}

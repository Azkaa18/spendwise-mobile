import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#fff7f8',
  surface: '#ffffff',
  text: '#2a1320',
  muted: '#8f7482',
  border: '#f3dde5',
  primary: '#be185d',
  primaryDark: '#831843',
  primarySoft: '#fce7f0',
  income: '#15803d',
  incomeSoft: '#dcfce7',
  expense: '#be123c',
  warn: '#c2410c',
  warnSoft: '#ffedd5',
};

export const CATEGORIES = {
  Food: { icon: '🍔', color: '#f97316' },
  Transport: { icon: '🚌', color: '#8b5cf6' },
  Shopping: { icon: '🛍️', color: '#ec4899' },
  Bills: { icon: '💡', color: '#eab308' },
  Health: { icon: '💊', color: '#10b981' },
  Entertainment: { icon: '🎬', color: '#f43f5e' },
  Education: { icon: '📚', color: '#a16207' },
  Salary: { icon: '💼', color: '#15803d' },
  Freelance: { icon: '🧑‍💻', color: '#0f766e' },
  Other: { icon: '✨', color: '#94a3b8' },
};

export const EXPENSE_CATS = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other'];
export const INCOME_CATS = ['Salary', 'Freelance', 'Other'];

export const money = (n, currency = 'PKR') => `${currency} ${Math.round(n).toLocaleString('en-US')}`;

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  pad: { paddingHorizontal: 20 },
  h1: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 17, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { justifyContent: 'space-between' },
  btn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  label: { fontSize: 12, fontWeight: '700', color: colors.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
});

import { createContext, createElement, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleData } from './sampleData';

const KEY = 'spendwise-state-v1';
const StoreContext = createContext(null);

const initial = { ready: false, currency: 'PKR', name: 'Azka', transactions: [], budgets: {} };

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, ready: true };
    case 'add':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'remove':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.id) };
    case 'setBudget':
      return { ...state, budgets: { ...state.budgets, [action.category]: action.amount } };
    case 'settings':
      return { ...state, ...action.payload };
    case 'reset':
      return { ...state, ...sampleData(), ready: true };
    case 'clear':
      return { ...state, transactions: [], budgets: {} };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => dispatch({ type: 'hydrate', payload: raw ? JSON.parse(raw) : sampleData() }))
      .catch(() => dispatch({ type: 'hydrate', payload: sampleData() }));
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    const { ready, ...persist } = state;
    AsyncStorage.setItem(KEY, JSON.stringify(persist)).catch(() => {});
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return createElement(StoreContext.Provider, { value }, children);
}

export const useStore = () => useContext(StoreContext);

/* ---------- selectors ---------- */
export const isThisMonth = (iso, ref = new Date()) => {
  const d = new Date(iso);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
};

export function monthSummary(transactions, ref = new Date()) {
  const month = transactions.filter((t) => isThisMonth(t.date, ref));
  const income = month.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = month.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const byCategory = {};
  month
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
  return { income, expense, balance: income - expense, byCategory, count: month.length };
}

export const newId = () => Math.random().toString(36).slice(2, 10);

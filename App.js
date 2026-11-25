import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from './src/store';
import { colors } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import BudgetsScreen from './src/screens/BudgetsScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary } };

const icon = (glyph) =>
  function TabIcon({ color }) {
    return <Text style={{ fontSize: 18, color }}>{glyph}</Text>;
  };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 6, borderTopColor: colors.border },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('⌂') }} />
      <Tab.Screen name="Activity" component={TransactionsScreen} options={{ tabBarIcon: icon('☰') }} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} options={{ tabBarIcon: icon('◉') }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ tabBarIcon: icon('▤') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: icon('⚙') }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{ presentation: 'modal', title: 'New transaction', headerTintColor: colors.primary }}
            />
            <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: 'Transaction', headerTintColor: colors.primary }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

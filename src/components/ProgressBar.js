import { View } from 'react-native';
import { colors } from '../theme';

export default function ProgressBar({ value, color = colors.primary, height = 8 }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ height, borderRadius: height, backgroundColor: colors.primarySoft, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

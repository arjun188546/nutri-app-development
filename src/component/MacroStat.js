import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MacroStat = ({ label, value, unit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  unit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#AAA',
    textTransform: 'lowercase',
  },
});

export default MacroStat;

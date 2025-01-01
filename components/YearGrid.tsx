import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_IN_MONTH = 31; // We'll show max 31 days for simplicity

export function YearGrid() {
  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        {/* Month labels column */}
        <View style={styles.monthColumn}>
          {MONTHS.map((month) => (
            <View key={month} style={styles.cell}>
              <ThemedText>{month}</ThemedText>
            </View>
          ))}
        </View>

        {/* Days grid */}
        {[...Array(DAYS_IN_MONTH)].map((_, dayIndex) => (
          <View key={dayIndex} style={styles.dayColumn}>
            {MONTHS.map((month) => (
              <View key={`${month}-${dayIndex}`} style={styles.pixel} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  monthColumn: {
    marginRight: 5,
  },
  dayColumn: {
    width: 20,
  },
  cell: {
    height: 20,
    justifyContent: 'center',
  },
  pixel: {
    height: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
  },
}); 
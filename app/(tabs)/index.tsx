import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { YearGrid } from '../../components/YearGrid';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.title}>VibeGrid</ThemedText>
      <YearGrid />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

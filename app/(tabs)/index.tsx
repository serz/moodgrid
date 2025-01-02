import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { MoodGrid } from '../../components/MoodGrid';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.title}>MoodGrid</ThemedText>
      <MoodGrid />
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

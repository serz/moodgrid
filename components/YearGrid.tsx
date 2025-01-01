import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Animated, Dimensions, TextInput } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_IN_MONTH = 31;

// Days in each month (non-leap year)
const MONTH_DAYS = {
  Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30,
  Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31
};

const isValidDay = (month: string, day: number) => {
  return day <= MONTH_DAYS[month];
};

const MOODS = {
  GREAT: { label: 'Great', color: '#7CBD1E', emoji: '🤩' },  // Star eyes emoji
  GOOD: { label: 'Good', color: '#B3D89C', emoji: '😊' },    // Smiling face
  OKAY: { label: 'Okay', color: '#FFD700', emoji: '😐' },    // Neutral face
  BAD: { label: 'Bad', color: '#FF9999', emoji: '😞' },      // Sad face
  AWFUL: { label: 'Awful', color: '#FF4444', emoji: '😢' },   // Crying face
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type DayData = {
  mood: string;
  note: string;
};

export function YearGrid() {
  const [selectedCell, setSelectedCell] = useState<{month: string, day: number} | null>(null);
  const [moodData, setMoodData] = useState<{[key: string]: DayData}>({});
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [currentNote, setCurrentNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleCellPress = (month: string, day: number) => {
    if (isValidDay(month, day)) {
      setSelectedCell({ month, day });
      const key = `${month}-${day}`;
      setCurrentNote(moodData[key]?.note || '');
      setSelectedMood(moodData[key]?.mood || null);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMoodSelect = (mood: string) => {
    if (selectedCell) {
      setSelectedMood(mood);
      const key = `${selectedCell.month}-${selectedCell.day}`;
      setMoodData({ 
        ...moodData, 
        [key]: { 
          mood,
          note: currentNote 
        } 
      });
    }
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedCell(null);
      setCurrentNote('');
      setSelectedMood(null);
    });
  };

  // Update the pixel rendering to show indication of notes
  const renderPixel = (month: string, dayIndex: number) => {
    const key = `${month}-${dayIndex + 1}`;
    const dayData = moodData[key];
    return (
      <Pressable 
        key={key}
        onPress={() => handleCellPress(month, dayIndex + 1)}
      >
        <View 
          style={[
            styles.pixel,
            !isValidDay(month, dayIndex + 1) && styles.invalidPixel,
            dayData?.mood && { backgroundColor: MOODS[dayData.mood].color },
            dayData?.note && styles.pixelWithNote
          ]} 
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View style={styles.monthColumn}>
            <View style={styles.dayHeader} />
            {MONTHS.map((month) => (
              <View key={month} style={styles.cell}>
                <ThemedText>{month}</ThemedText>
              </View>
            ))}
          </View>

          {[...Array(DAYS_IN_MONTH)].map((_, dayIndex) => (
            <View key={dayIndex} style={styles.dayColumn}>
              <View style={styles.dayHeader}>
                <ThemedText style={styles.dayText}>{dayIndex + 1}</ThemedText>
              </View>
              {MONTHS.map((month) => {
                const key = `${month}-${dayIndex + 1}`;
                const dayData = moodData[key];
                return (
                  <Pressable 
                    key={key}
                    onPress={() => handleCellPress(month, dayIndex + 1)}
                  >
                    <View 
                      style={[
                        styles.pixel,
                        !isValidDay(month, dayIndex + 1) && styles.invalidPixel,
                        dayData?.mood && { backgroundColor: MOODS[dayData.mood].color },
                        dayData?.note && styles.pixelWithNote
                      ]} 
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <Animated.View 
        style={[styles.moodSelector, {
          transform: [{ translateY: slideAnim }],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }]}
      >
        <View style={styles.moodSelectorHeader}>
          <View style={styles.moodSelectorHandle} />
          <Pressable 
            onPress={handleClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </Pressable>
        </View>

        {!selectedMood ? (
          // Step 1: Mood Selection
          <>
            <ThemedText style={styles.moodTitle}>
              How was your day on {selectedCell?.month} {selectedCell?.day}?
            </ThemedText>
            <View style={styles.moodOptions}>
              {Object.entries(MOODS).map(([key, { label, color, emoji }]) => (
                <Pressable
                  key={key}
                  style={[styles.moodButton, { backgroundColor: color }]}
                  onPress={() => handleMoodSelect(key)}
                >
                  <ThemedText style={styles.moodButtonText}>
                    {emoji}{'\n'}{label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          // Step 2: Notes Input
          <>
            <ThemedText style={styles.moodTitle}>
              Add notes for {selectedCell?.month} {selectedCell?.day}
            </ThemedText>
            <TextInput
              style={styles.noteInput}
              placeholder="Add notes for this day..."
              value={currentNote}
              onChangeText={setCurrentNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  monthColumn: {
    marginRight: 10,
  },
  dayColumn: {
    width: 40,
  },
  cell: {
    height: 40,
    justifyContent: 'center',
  },
  dayHeader: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
  },
  pixel: {
    height: 40,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  invalidPixel: {
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  moodSelector: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodSelectorHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  moodTitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'column',
    gap: 8,
  },
  moodButton: {
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  moodButtonText: {
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
  },
  noteInput: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 80,
    backgroundColor: '#f9f9f9',
  },
  pixelWithNote: {
    borderWidth: 2,  // Thicker border to indicate there's a note
  },
  moodSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -10,
    padding: 10,
  },
}); 
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Animated, Dimensions, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
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

const isValidDay = (month: keyof typeof MONTH_DAYS, day: number) => {
  return day <= MONTH_DAYS[month];
};

const MOODS = {
  GREAT: { label: 'Great', color: '#7CBD1E', emoji: '🤩' },  // Star eyes emoji
  GOOD: { label: 'Good', color: '#B3D89C', emoji: '😊' },    // Smiling face
  OKAY: { label: 'Okay', color: '#FFD700', emoji: '😐' },    // Neutral face
  BAD: { label: 'Bad', color: '#FF9999', emoji: '😞' },      // Sad face
  AWFUL: { label: 'Awful', color: '#FF4444', emoji: '😢' },   // Crying face
};

const MOOD_PLACEHOLDERS = {
  GREAT: [
    "What made your day amazing? Highlight the best moments!",
    "Reflect on your day: what made it special, challenging, or insightful?"
  ],
  GOOD: [
    "What made your day good? Celebrate the wins!",
    "What brought a smile to your face today? Anything worth remembering?",
    "What went well today? Who or what contributed to your happiness?"
  ],
  OKAY: [
    "What was a quiet win today? Anything worth noting?",
    "Reflect on your day: what made it special, challenging, or insightful?"
  ],
  BAD: [
    "What made today challenging? It's okay to express it here.",
    "Reflect on your day: what made it special, challenging, or insightful?"
  ],
  AWFUL: [
    "What made today tough? Writing can help process it.",
    "What didn't go as planned? It's okay to let it out here.",
    "What's on your mind? Remember, even hard days pass.",
    "What happened today? Reflecting might bring some clarity."
  ]
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type MoodKey = keyof typeof MOODS;

type DayData = {
  mood: MoodKey;
  note: string;
};

type Month = keyof typeof MONTH_DAYS;

const getCurrentDate = () => {
  const today = new Date();
  return {
    month: MONTHS[today.getMonth()] as Month,
    day: today.getDate()
  };
};

export function YearGrid() {
  const [selectedCell, setSelectedCell] = useState<{month: Month, day: number} | null>(null);
  const [moodData, setMoodData] = useState<{[key: string]: DayData}>({});
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [currentNote, setCurrentNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleCellPress = (month: Month, day: number) => {
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

  const getRandomPlaceholder = (mood: MoodKey) => {
    const placeholders = MOOD_PLACEHOLDERS[mood];
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  };

  const triggerAnimation = (key: string) => {
    setAnimatingCell(key);
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 2,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setAnimatingCell(null));
  };

  const handleMoodSelect = (mood: MoodKey) => {
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
      triggerAnimation(key);
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

  const handleSave = () => {
    if (selectedCell && selectedMood) {
      const key = `${selectedCell.month}-${selectedCell.day}`;
      setMoodData({
        ...moodData,
        [key]: {
          mood: selectedMood,
          note: currentNote
        }
      });
      handleClose();
    }
  };

  const renderPixel = (month: Month, dayIndex: number) => {
    const key = `${month}-${dayIndex + 1}`;
    const dayData = moodData[key];
    const currentDate = getCurrentDate();
    const isCurrentDay = month === currentDate.month && (dayIndex + 1) === currentDate.day;
    const isAnimating = animatingCell === key;

    return (
      <Pressable 
        key={key}
        onPress={() => handleCellPress(month, dayIndex + 1)}
      >
        <View 
          style={[
            styles.pixel,
            !isValidDay(month, dayIndex + 1) && styles.invalidPixel,
            isCurrentDay && !dayData?.mood && { backgroundColor: '#E3F2FD' },
            dayData?.mood && { backgroundColor: MOODS[dayData.mood].color },
            dayData?.note && styles.pixelWithNote,
          ]} 
        >
          {isAnimating && (
            <Animated.Text 
              style={[
                styles.pixelEmoji,
                {
                  position: 'absolute',
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }
              ]}
            >
              {MOODS[dayData.mood].emoji}
            </Animated.Text>
          )}
        </View>
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
                return renderPixel(month as Month, dayIndex);
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View 
          style={[
            styles.moodSelector, 
            {
              transform: [
                { translateY: Animated.add(slideAnim, keyboardHeight.interpolate({
                  inputRange: [0, 1000],
                  outputRange: [0, -1000]
                })) }
              ],
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        >
          <View style={styles.moodSelectorHeader}>
            <View style={styles.moodSelectorHandle} />
            {!selectedMood && (
              <Pressable 
              onPress={() => {
                if (selectedCell) {
                  const key = `${selectedCell.month}-${selectedCell.day}`;
                  const newMoodData = { ...moodData };
                  delete newMoodData[key];
                  setMoodData(newMoodData);
                  handleClose();
                }
              }}
              style={styles.resetButton}
            >
              <Ionicons name="refresh" size={24} color="#666" />
            </Pressable>
            )}
            {selectedMood && (
              <Pressable 
                onPress={() => setSelectedMood(null)}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#666" />
              </Pressable>
            )}
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
              <View style={styles.moodTitleContainer}>
                <ThemedText style={styles.moodTitle}>
                  How was your day on {selectedCell?.month} {selectedCell?.day}?
                </ThemedText>
              </View>
              <View style={styles.moodOptions}>
                {Object.entries(MOODS).map(([key, { label, color, emoji }]) => (
                  <Pressable
                    key={key}
                    style={[styles.moodButton, { backgroundColor: color }]}
                    onPress={() => handleMoodSelect(key as MoodKey)}
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
                placeholder={selectedMood ? getRandomPlaceholder(selectedMood) : "Add notes for this day..."}
                value={currentNote}
                onChangeText={setCurrentNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Pressable 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </Pressable>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',  // Allow emoji to animate outside the cell
  },
  invalidPixel: {
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  moodSelector: {
    padding: 20,
    paddingBottom: 40,
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
    flex: 1,
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
  backButton: {
    position: 'absolute',
    left: 0,
    top: -10,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  moodTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 15,
  },
  resetButton: {
    position: 'absolute',
    left: 0,
    top: -10,
    padding: 10,
  },
  pixelEmoji: {
    fontSize: 16,
  },
});

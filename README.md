# Year in Pixels

A mood tracking app that helps you visualize your year through colors and reflections. Track your daily moods and add personal notes to capture the moments that shaped each day.

## Features

### Mood Tracking
- Visual yearly overview with a color-coded grid
- Each day can be marked with one of five moods:
  - 🤩 Great (Bright Green)
  - 😊 Good (Light Green)
  - 😐 Okay (Yellow)
  - 😞 Bad (Light Red)
  - 😢 Awful (Red)

### Daily Notes
- Add personal reflections for each day
- Dynamic prompts based on selected mood
- Visual indicator (thicker border) for days with notes

### User Interface
- Monthly rows and daily columns layout
- Scrollable horizontal view for all days
- Bottom sheet modal for mood selection and notes
- Two-step input process:
  1. Select mood
  2. Add optional notes

## Technical Details

### Built With
- React Native
- Expo
- TypeScript

### Key Components

#### YearGrid
Main component handling the visualization and interaction:
- Grid layout with months and days
- Mood selection interface
- Notes input
- Animation handling

### Data Structure

## TODO

### Features to Implement
1. **Current Day Highlighting**
   - Visual indicator for today's date in the grid
   - Easy navigation to current day
   - Different border or background style for current date

2. **Mood Reset Functionality**
   - Add ability to reset/remove mood from a day
   - Option to clear both mood and notes
   - Confirmation dialog for data removal

3. **Notes Navigation**
   - Add back button to return from notes to mood selection
   - Preserve selected mood when returning
   - Option to change mood without losing notes

4. **Mood Selection Animation**
   - Smooth transitions between mood states
   - Visual feedback when selecting moods
   - Animation for color changes in grid

5. **Notes Management**
   - Add Save button to confirm note entry
   - Skip button to close without saving
   - Auto-save functionality consideration
   - Unsaved changes warning

### Future Enhancements
- Data persistence
- Data export functionality
- Monthly/yearly mood statistics
- Customizable mood colors
- Multiple years support

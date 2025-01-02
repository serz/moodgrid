# MoodGrid

A React Native application that helps users track their daily moods throughout the year in a visual calendar format.

## Features

- Year-view calendar grid showing all months and days
- Daily mood tracking with 5 different mood states:
  - Great 🤩
  - Good 😊
  - Okay 😐
  - Bad 😞
  - Awful 😢
- Add personal notes for each day
- Visual indicators:
  - Color-coded cells based on mood
  - Current day highlighting
  - Note indicators
  - Smooth animations when selecting moods
- Interactive UI:
  - Slide-up mood selection panel
  - Keyboard-aware note input
  - Reset functionality for removing entries
  - Back navigation between screens

## Technical Features

- Built with React Native and Expo
- TypeScript for type safety
- Animated transitions and effects
- Responsive layout supporting different screen sizes
- Platform-specific keyboard handling
- Custom themed components

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npx expo start
```
## Project Structure

- `/components`
  - `YearGrid.tsx` - Main calendar grid component
  - `ThemedText.tsx` - Themed text component
- `/app`
  - Navigation and screen components

## Future Improvements

- Data persistence
- Statistics and mood trends
- Export functionality
- Theme customization
- Additional mood customization options

## TODO

### High Priority
- [x] Implement data persistence using AsyncStorage
- [ ] Add year selection/navigation
- [ ] Add month view mode
- [ ] Implement data backup/restore functionality
- [ ] Add haptic feedback for interactions

### UI/UX Improvements
- [ ] Add dark mode support
- [ ] Implement custom color themes
- [ ] Add zoom gestures for grid navigation
- [ ] Improve accessibility features
- [ ] Add loading states and animations

### Features
- [ ] Add mood statistics and trends
- [ ] Implement mood streaks
- [ ] Add reminders/notifications
- [ ] Enable data export (CSV/PDF)
- [ ] Add presets for mood entries
- [ ] Enable photo attachments to entries

### Technical Debt
- [ ] Add unit tests
- [ ] Implement error boundaries
- [ ] Add logging system
- [ ] Optimize performance for large datasets

### Future Considerations
- [ ] Multi-language support
- [ ] Cloud sync functionality
- [ ] Social sharing features
- [ ] Widget support
- [ ] Apple Watch/WearOS companion app

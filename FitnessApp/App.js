import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,    // 1. For typing
  Pressable, 
  FlatList,     // 2. For scrolling lists
  Keyboard      // 3. To dismiss keyboard
} from 'react-native';
import { useState } from 'react';

export default function App() {
  const [workout, setWorkout] = useState(''); // Store current typing
  const [logs, setLogs] = useState([]);       // Store list of workouts

  // Function to add workout
  const handleAddWorkout = () => {
    if (!workout) return; // Don't add empty
    
    // Add new object to array (Standard React)
    setLogs([...logs, { id: Date.now().toString(), title: workout }]);
    setWorkout(''); // Clear input
    Keyboard.dismiss(); // Close the mobile keyboard
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gym Tracker 💪</Text>

      {/* INPUT SECTION */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="e.g. Bench Press 50kg"
          value={workout}
          onChangeText={(text) => setWorkout(text)} // No e.target.value! Just 'text'
        />
        <Pressable style={styles.addButton} onPress={handleAddWorkout}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      {/* LIST SECTION */}
      <View style={styles.listContainer}>
        {/* FlatList is better than .map() for mobile */}
        <FlatList 
          data={logs} 
          keyExtractor={(item) => item.id} // Like key={id} in web
          renderItem={({ item }) => (
            // This logic runs for EVERY item in your list
            <View style={styles.workoutItem}>
              <Text style={styles.workoutText}>{item.title}</Text>
            </View>
          )}
          // Custom Empty State Component
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workouts logged yet.</Text>
          }
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

// STYLES (The "CSS")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Move down from status bar
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row', // Row = Side by side
    marginBottom: 20,
  },
  input: {
    flex: 1, // Take up all available space
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1, // Fill the rest of the screen
  },
  workoutItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10, // Spacing between items
  },
  workoutText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  }
});
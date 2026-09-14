import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, SafeAreaView } from 'react-native';

export default function App() {
  // 1. Memory / State: stores what the user types and what gets calculated
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [category, setCategory] = useState('');

  // 2. The calculation triggered by the button
  const calculateBMI = () => {
    // Check if empty
    if (!weight || !height) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to meters

    // Check if input is a valid number
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      Alert.alert('Error', 'Please enter valid numbers.');
      return;
    }

    // Formula: weight / (height * height)
    const result = w / (h * h);
    setBmi(result.toFixed(1));

    // Determine category
    if (result < 18.5) {
      setCategory('Underweight');
    } else if (result <= 24.9) {
      setCategory('Normal');
    } else if (result <= 29.9) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  // 3. The UI components displayed on screen
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <Text>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 65"
        value={weight}
        onChangeText={setWeight}
      />

      <Text>Height (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 170"
        value={height}
        onChangeText={setHeight}
      />

      <Button title="Calculate" onPress={calculateBMI} />

      {/* Only show result if bmi is calculated */}
      {bmi !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your Result: {bmi}</Text>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  resultContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 18,
    color: 'green',
    marginTop: 6,
  },
});
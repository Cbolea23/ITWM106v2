import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    if (!weight || !height || isNaN(weight) || isNaN(height)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers.');
      return;
    }

    const weightNum = Number(weight);
    const heightNum = Number(height);

    if (weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Invalid Values', 'Use values greater than 0.');
      return;
    }

    const heightInMeters = heightNum / 100;
    const result = weightNum / (heightInMeters * heightInMeters);

    setBmi(result.toFixed(1));

    if (result < 18.5) {
      setCategory('Underweight');
    } else if (result < 25) {
      setCategory('Normal');
    } else if (result < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {bmi !== '' && (
        <View style={styles.result}>
          <Text>BMI: {bmi}</Text>
          <Text>Category: {category}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  result: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
});
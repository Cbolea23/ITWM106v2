import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, SafeAreaView } from 'react-native';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    if (!weight || !height) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      Alert.alert('Error', 'Please enter valid numbers.');
      return;
    }

    const result = w / (h * h);
    setBmi(result.toFixed(1));

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
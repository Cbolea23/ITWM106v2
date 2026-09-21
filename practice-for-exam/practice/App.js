import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    if (!weight.trim() || !height.trim() || isNaN(Number(weight)) || isNaN(Number(height))) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for weight and height.');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Invalid Values', 'Weight and height must be greater than zero.');
      return;
    }

    const heightInMeters = heightNum / 100;
    const computedBMI = weightNum / (heightInMeters * heightInMeters);
    const roundedBMI = computedBMI.toFixed(1);

    setBmi(roundedBMI);

    if (computedBMI < 18.5) {
      setCategory('Underweight');
    } else if (computedBMI < 25) {
      setCategory('Normal');
    } else if (computedBMI < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>BMI Calculator</Text>

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="65"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        placeholder="170"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {bmi !== '' && (
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>Your Result</Text>
          <Text style={styles.bmiValue}>{bmi}</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{category}</Text>
          </View>

          <Text style={styles.formulaNote}>BMI = weight ÷ (height in m)²</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  button: {
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  resultCard: {
    marginTop: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  badge: {
    marginTop: 12,
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  formulaNote: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 13,
  },
});

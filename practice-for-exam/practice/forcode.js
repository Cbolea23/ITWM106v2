import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    if (
      !weight.trim() ||
      !height.trim() ||
      isNaN(Number(weight)) ||
      isNaN(Number(height))
    ) {
      Alert.alert('Invalid Input');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Invalid Values');
      return;
    }

    const heightInMeters = heightNum / 100;
    const computedBMI = weightNum / (heightInMeters * heightInMeters);

    setBmi(computedBMI.toFixed(1));

    if (computedBMI < 18.5) {
      setCategory('Underweight');
    } else if (computedBMI >= 18.5 && computedBMI <= 24.9) {
      setCategory('Normal');
    } else if (computedBMI >= 25.0 && computedBMI <= 29.9) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  return (
    <View style={styles.container}>
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
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#F8F9FA',
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B71CA',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  resultHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B71CA',
  },
  badge: {
    backgroundColor: '#DDEBFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  badgeText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  formulaNote: {
    marginTop: 12,
    color: '#6C757D',
    fontSize: 13,
  },
});
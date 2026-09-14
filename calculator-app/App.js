import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

const CalcButton = ({ label, onPress, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyle]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [isNewNumber, setIsNewNumber] = useState(false);

  const handleNumber = (num) => {
    if (display === '0' || isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    setPrevValue(parseFloat(display));
    setOperator(op);
    setIsNewNumber(true);
  };

  const handleCalculate = () => {
    if (operator === null || prevValue === null) return;

    const current = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+':
        result = prevValue + current;
        break;
      case '-':
        result = prevValue - current;
        break;
      case '*':
        result = prevValue * current;
        break;
      case '/':
        result = current !== 0 ? prevValue / current : 'Error';
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setIsNewNumber(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calculatorWrapper}>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </View>

        <View style={styles.keypadContainer}>
          <View style={styles.row}>
            <CalcButton label="7" onPress={() => handleNumber('7')} />
            <CalcButton label="8" onPress={() => handleNumber('8')} />
            <CalcButton label="9" onPress={() => handleNumber('9')} />
            <CalcButton 
              label="+" 
              onPress={() => handleOperator('+')} 
              buttonStyle={styles.operatorButton} 
              textStyle={styles.operatorText} 
            />
          </View>

          <View style={styles.row}>
            <CalcButton label="4" onPress={() => handleNumber('4')} />
            <CalcButton label="5" onPress={() => handleNumber('5')} />
            <CalcButton label="6" onPress={() => handleNumber('6')} />
            <CalcButton 
              label="-" 
              onPress={() => handleOperator('-')} 
              buttonStyle={styles.operatorButton} 
              textStyle={styles.operatorText} 
            />
          </View>

          <View style={styles.row}>
            <CalcButton label="1" onPress={() => handleNumber('1')} />
            <CalcButton label="2" onPress={() => handleNumber('2')} />
            <CalcButton label="3" onPress={() => handleNumber('3')} />
            <CalcButton 
              label="*" 
              onPress={() => handleOperator('*')} 
              buttonStyle={styles.operatorButton} 
              textStyle={styles.operatorText} 
            />
          </View>

          <View style={styles.row}>
            <CalcButton label="0" onPress={() => handleNumber('0')} />
            <CalcButton 
              label="C" 
              onPress={handleClear} 
              buttonStyle={styles.clearButton} 
              textStyle={styles.clearText} 
            />
            <CalcButton 
              label="=" 
              onPress={handleCalculate} 
              buttonStyle={styles.equalsButton} 
              textStyle={styles.operatorText} 
            />
            <CalcButton 
              label="/" 
              onPress={() => handleOperator('/')} 
              buttonStyle={styles.operatorButton} 
              textStyle={styles.operatorText} 
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculatorWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#F5F5F7',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  displayText: {
    fontSize: 54,
    fontWeight: '300',
    color: '#1C1C1E',
  },
  keypadContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#F5F5F7',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  operatorButton: {
    backgroundColor: '#007AFF',
  },
  operatorText: {
    color: '#FFFFFF',
  },
  equalsButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  clearText: {
    color: '#FFFFFF',
  },
});
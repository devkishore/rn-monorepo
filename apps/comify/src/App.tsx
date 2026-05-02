import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Button, getInitials, formatString, COLORS } from '@rn-monorepo/common';

export const App: React.FC = () => {
  const [pressed, setPressed] = useState(false);
  const userName = 'John Doe';
  const userInitials = getInitials(userName);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Comify</Text>
        <Text style={styles.subtitle}>Using common components from @rn-monorepo/common</Text>

        <View style={styles.section}>
          <Text style={styles.label}>User: {userName}</Text>
          <Text style={styles.label}>Initials: {userInitials}</Text>
          <Text style={styles.label}>Formatted: {formatString(' HELLO WORLD ')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Primary Button" onPress={() => setPressed(!pressed)} variant="primary" />
          <Button
            title="Secondary Button"
            onPress={() => setPressed(!pressed)}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>

        {pressed && <Text style={styles.statusText}>Button was pressed!</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    gap: 12,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    color: COLORS.darkGray,
    fontSize: 14,
    marginBottom: 8,
  },
  secondaryButton: {
    marginTop: 8,
  },
  section: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 24,
    padding: 16,
  },
  statusText: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.mediumGray,
    fontSize: 16,
    marginBottom: 24,
  },
  title: {
    color: COLORS.black,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

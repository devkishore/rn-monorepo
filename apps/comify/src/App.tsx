import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Button, getInitials, formatString } from '@rn-monorepo/common';

export const App: React.FC = () => {
  const [pressed, setPressed] = useState(false);
  const userName = 'John Doe';
  const userInitials = getInitials(userName);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Comify</Text>
        <Text style={styles.subtitle}>
          Using common components from @rn-monorepo/common
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>User: {userName}</Text>
          <Text style={styles.label}>Initials: {userInitials}</Text>
          <Text style={styles.label}>
            Formatted: {formatString(' HELLO WORLD ')}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Primary Button"
            onPress={() => setPressed(!pressed)}
            variant="primary"
          />
          <Button
            title="Secondary Button"
            onPress={() => setPressed(!pressed)}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>

        {pressed && (
          <Text style={styles.statusText}>Button was pressed!</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  secondaryButton: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 16,
    textAlign: 'center',
  },
});

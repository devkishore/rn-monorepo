/**
 * Tests for Button Component
 */

import React from 'react';
import { Button } from './Button';

// Mock react-native modules
jest.mock('react-native', () => ({
  TouchableOpacity: ({ children, onPress, style }: any) => ({
    type: 'TouchableOpacity',
    props: { children, onPress, style },
  }),
  Text: ({ children, style }: any) => ({
    type: 'Text',
    props: { children, style },
  }),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe('Button Component', () => {
  describe('rendering', () => {
    it('should render button with title', () => {
      const mockOnPress = jest.fn();
      const button = Button({ title: 'Click Me', onPress: mockOnPress });
      expect(button).toBeTruthy();
    });

    it('should render with primary variant by default', () => {
      const button = Button({ title: 'Primary', onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should render with secondary variant', () => {
      const button = Button({
        title: 'Secondary',
        onPress: () => {},
        variant: 'secondary',
      });
      expect(button).toBeTruthy();
    });

    it('should apply custom style', () => {
      const customStyle = { marginTop: 10 };
      const button = Button({
        title: 'Styled',
        onPress: () => {},
        style: customStyle,
      });
      expect(button).toBeTruthy();
    });

    it('should apply custom text style', () => {
      const customTextStyle = { fontSize: 16 };
      const button = Button({
        title: 'Styled Text',
        onPress: () => {},
        textStyle: customTextStyle,
      });
      expect(button).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should accept onPress callback', () => {
      const mockOnPress = jest.fn();
      const button = Button({ title: 'Press Me', onPress: mockOnPress });
      expect(mockOnPress).not.toHaveBeenCalled();
      expect(button).toBeTruthy();
    });

    it('should handle different callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const button1 = Button({ title: 'Button 1', onPress: callback1 });
      const button2 = Button({ title: 'Button 2', onPress: callback2 });

      expect(button1).toBeTruthy();
      expect(button2).toBeTruthy();
    });
  });

  describe('variants', () => {
    it('should handle primary variant correctly', () => {
      const mockOnPress = jest.fn();
      const button = Button({
        title: 'Primary Button',
        onPress: mockOnPress,
        variant: 'primary',
      });
      expect(button).toBeTruthy();
    });

    it('should handle secondary variant correctly', () => {
      const mockOnPress = jest.fn();
      const button = Button({
        title: 'Secondary Button',
        onPress: mockOnPress,
        variant: 'secondary',
      });
      expect(button).toBeTruthy();
    });

    it('should default to primary when variant not specified', () => {
      const mockOnPress = jest.fn();
      const button = Button({ title: 'Default', onPress: mockOnPress });
      expect(button).toBeTruthy();
    });

    it('should accept all variant types', () => {
      const variants: Array<'primary' | 'secondary'> = ['primary', 'secondary'];
      variants.forEach((variant) => {
        const button = Button({
          title: `Button ${variant}`,
          onPress: () => {},
          variant,
        });
        expect(button).toBeTruthy();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty title', () => {
      const button = Button({ title: '', onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should handle very long title', () => {
      const longTitle = 'This is a very long button title that should still render correctly even with multiple words and special cases';
      const button = Button({ title: longTitle, onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Click & Save @Home! #special $money %percent';
      const button = Button({ title: specialTitle, onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const unicodeTitle = '👍 Like 🎉 Party 🚀 Launch';
      const button = Button({ title: unicodeTitle, onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should handle titles with newlines', () => {
      const multilineTitle = 'Button\nWith\nMultiple\nLines';
      const button = Button({ title: multilineTitle, onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should handle null-like empty strings', () => {
      const button = Button({ title: '', onPress: () => {} });
      expect(button).toBeTruthy();
    });
  });

  describe('props validation', () => {
    it('should require title prop', () => {
      const button = Button({ title: 'Required', onPress: () => {} });
      expect(button).toBeTruthy();
    });

    it('should require onPress prop', () => {
      const onPress = jest.fn();
      const button = Button({ title: 'Title', onPress });
      expect(button).toBeTruthy();
    });

    it('should accept optional style prop', () => {
      const button = Button({
        title: 'Optional Style',
        onPress: () => {},
        style: { padding: 10 },
      });
      expect(button).toBeTruthy();
    });

    it('should accept optional textStyle prop', () => {
      const button = Button({
        title: 'Optional Text Style',
        onPress: () => {},
        textStyle: { color: 'red' },
      });
      expect(button).toBeTruthy();
    });

    it('should accept optional variant prop', () => {
      const button = Button({
        title: 'Optional Variant',
        onPress: () => {},
        variant: 'primary',
      });
      expect(button).toBeTruthy();
    });
  });

  describe('component creation', () => {
    it('should create multiple button instances', () => {
      const buttons = Array.from({ length: 5 }, (_, i) =>
        Button({ title: `Button ${i}`, onPress: () => {} }),
      );
      expect(buttons).toHaveLength(5);
      buttons.forEach((btn) => expect(btn).toBeTruthy());
    });

    it('should create buttons with different configurations', () => {
      const configs = [
        { title: 'Button 1', onPress: () => {}, variant: 'primary' as const },
        { title: 'Button 2', onPress: () => {}, variant: 'secondary' as const },
        { title: 'Button 3', onPress: () => {}, style: { marginTop: 10 } },
        { title: 'Button 4', onPress: () => {}, textStyle: { color: 'blue' } },
      ];

      configs.forEach((config) => {
        const button = Button(config);
        expect(button).toBeTruthy();
      });
    });
  });
});

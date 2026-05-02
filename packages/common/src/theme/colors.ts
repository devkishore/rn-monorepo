/**
 * Centralized color definitions for the application
 * Using this ensures consistency across all components and enables easy theming
 */

export const COLORS = {
  // Primary Colors
  primary: '#097AFF',
  primaryLight: '#E5E5EA',

  // Neutral Colors
  white: '#FFF0FF',
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightGray: '#F5F5F5',
} as const;

export type ColorKey = keyof typeof COLORS;

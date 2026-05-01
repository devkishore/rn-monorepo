/**
 * Common utility functions
 */

export const formatString = (str: string): string => {
  return str.trim().toLowerCase();
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

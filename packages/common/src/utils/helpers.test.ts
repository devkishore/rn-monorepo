import { formatString, getInitials, delay } from './helpers';

describe('Helper Functions', () => {
  describe('formatString', () => {
    it('should trim and lowercase a string', () => {
      const result = formatString('  HELLO WORLD  ');
      expect(result).toBe('hello world');
    });

    it('should handle already lowercase strings', () => {
      const result = formatString('hello');
      expect(result).toBe('hello');
    });

    it('should handle empty strings', () => {
      const result = formatString('   ');
      expect(result).toBe('');
    });

    it('should handle mixed case with spaces', () => {
      const result = formatString('  HeLLo WoRLd  ');
      expect(result).toBe('hello world');
    });
  });

  describe('getInitials', () => {
    it('should extract initials from a full name', () => {
      const result = getInitials('John Doe');
      expect(result).toBe('JD');
    });

    it('should handle single word names', () => {
      const result = getInitials('Alice');
      expect(result).toBe('A');
    });

    it('should handle three word names', () => {
      const result = getInitials('John Michael Doe');
      expect(result).toBe('JMD');
    });

    it('should handle lowercase names', () => {
      const result = getInitials('john doe');
      expect(result).toBe('JD');
    });

    it('should handle names with extra spaces', () => {
      const result = getInitials('  John    Doe  ');
      expect(result).toBe('JD');
    });
  });

  describe('delay', () => {
    it('should resolve after specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(100);
      expect(elapsed).toBeLessThan(200);
    });

    it('should return a promise', () => {
      const result = delay(50);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle zero delay', async () => {
      const result = await delay(0);
      expect(result).toBeUndefined();
    });
  });
});

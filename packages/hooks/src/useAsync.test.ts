import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  describe('with immediate execution (automatic)', () => {
    it('should execute function immediately when immediate=true', () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      renderHook(() => useAsync(asyncFn, true));
      expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    it('should set data on successful auto-execution', async () => {
      const mockData = { id: 1, name: 'Test' };
      const asyncFn = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useAsync(asyncFn, true));

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      }, { timeout: 5000 });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should default to immediate=true', () => {
      const asyncFn = jest.fn().mockResolvedValue('data');
      renderHook(() => useAsync(asyncFn));
      expect(asyncFn).toHaveBeenCalled();
    });
  });

  describe('with lazy execution (manual)', () => {
    it('should not execute when immediate=false', () => {
      const asyncFn = jest.fn().mockResolvedValue('data');
      renderHook(() => useAsync(asyncFn, false));
      expect(asyncFn).not.toHaveBeenCalled();
    });

    it('should execute when manually called', async () => {
      const mockData = { result: 'success' };
      const asyncFn = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toEqual(mockData);
    });

    it('should handle multiple manual executions', async () => {
      const asyncFn = jest.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(asyncFn).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.execute();
      });

      expect(asyncFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('execute function return value', () => {
    it('should return resolved data', async () => {
      const mockData = { id: 1 };
      const asyncFn = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() => useAsync(asyncFn, false));

      const returnedData = await act(async () => {
        return result.current.execute();
      });

      expect(returnedData).toEqual(mockData);
    });

    it('should throw on execution failure', async () => {
      const mockError = new Error('Failed');
      const asyncFn = jest.fn().mockRejectedValue(mockError);
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await expect(
        act(async () => {
          return result.current.execute();
        }),
      ).rejects.toThrow('Failed');
    });
  });

  describe('state management', () => {
    it('should transition through pending to success', async () => {
      const asyncFn = jest.fn().mockResolvedValue('data');
      const { result } = renderHook(() => useAsync(asyncFn, true));

      expect(['idle', 'pending']).toContain(result.current.status);

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
    });

    it('should clear data between executions', async () => {
      const asyncFn = jest.fn()
        .mockResolvedValueOnce('data1')
        .mockResolvedValueOnce('data2');

      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBe('data1');

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBe('data2');
    });

    it('should handle error state', async () => {
      const asyncFn = jest.fn().mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // Error is expected
        }
      });

      expect(result.current.status).toBe('error');
      expect(result.current.error?.message).toBe('Test error');
    });

    it('should recover from error to success', async () => {
      const asyncFn = jest.fn()
        .mockRejectedValueOnce(new Error('First failed'))
        .mockResolvedValueOnce('Now succeeds');

      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.status).toBe('error');

      await act(async () => {
        return result.current.execute();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toBe('Now succeeds');
      expect(result.current.error).toBeNull();
    });
  });

  describe('error conversion', () => {
    it('should convert string rejections to Error', async () => {
      const asyncFn = jest.fn().mockRejectedValue('string error');
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // Expected
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
      });

      expect(result.current.error?.message).toBe('string error');
    });

    it('should handle numeric rejections', async () => {
      const asyncFn = jest.fn().mockRejectedValue(404);
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          // Expected
        }
      });

      await waitFor(() => {
        expect(result.current.error?.message).toBe('404');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null resolved value', async () => {
      const asyncFn = jest.fn().mockResolvedValue(null);
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toBeNull();
    });

    it('should handle complex nested objects', async () => {
      const complexData = { user: { id: 1, nested: { data: [1, 2, 3] } } };
      const asyncFn = jest.fn().mockResolvedValue(complexData);
      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(complexData);
    });
  });
});


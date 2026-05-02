import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  describe('with immediate execution', () => {
    it('should start with pending state', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');

      const { result } = renderHook(() => useAsync(asyncFn, true));

      expect(result.current.status).toBe('pending');

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
    });

    it('should set data on successful execution', async () => {
      const mockData = { id: 1, name: 'Test' };
      const asyncFn = jest.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useAsync(asyncFn, true));

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should call the async function on mount', async () => {
      const asyncFn = jest.fn().mockResolvedValue('data');

      renderHook(() => useAsync(asyncFn, true));

      expect(asyncFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('with lazy execution', () => {
    it('should not execute immediately when immediate is false', () => {
      const asyncFn = jest.fn().mockResolvedValue('data');

      renderHook(() => useAsync(asyncFn, false));

      expect(asyncFn).not.toHaveBeenCalled();
    });

    it('should execute when execute is called', async () => {
      const mockData = { result: 'success' };
      const asyncFn = jest.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toEqual(mockData);
    });

    it('should handle multiple executions', async () => {
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

  describe('execute function', () => {
    it('should return the data from successful execution', async () => {
      const mockData = { id: 1 };
      const asyncFn = jest.fn().mockResolvedValue(mockData);

      const { result } = renderHook(() => useAsync(asyncFn, false));

      const returnedData = await act(async () => {
        return result.current.execute();
      });

      expect(returnedData).toEqual(mockData);
    });

    it('should throw error on failed execution', async () => {
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

  describe('state transitions', () => {
    it('should transition from pending to success', async () => {
      const asyncFn = jest.fn().mockResolvedValue('data');

      const { result } = renderHook(() => useAsync(asyncFn, true));

      expect(result.current.status).toBe('pending');

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });
    });

    it('should clear data on new execution', async () => {
      const asyncFn = jest
        .fn()
        .mockResolvedValueOnce('data1')
        .mockRejectedValueOnce(new Error('Error'));

      const { result } = renderHook(() => useAsync(asyncFn, false));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBe('data1');

      await act(async () => {
        await result.current.execute().catch(() => {});
      });

      expect(result.current.data).toBeNull();
    });
  });
});

import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should debounce string values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'hello', delay: 500 },
      },
    );

    expect(result.current).toBe('hello');

    rerender({ value: 'hello world', delay: 500 });
    expect(result.current).toBe('hello');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('hello world');
  });

  it('should debounce number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 1, delay: 300 },
      },
    );

    expect(result.current).toBe(1);

    rerender({ value: 2, delay: 300 });
    expect(result.current).toBe(1);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(2);
  });

  it('should debounce object values', () => {
    const initialObj = { name: 'John' };
    const updatedObj = { name: 'Jane' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 500 },
      },
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj, delay: 500 });
    expect(result.current).toEqual(initialObj);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it('should use default delay of 500ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'test' },
      },
    );

    rerender({ value: 'test updated' });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('test updated');
  });

  it('should cancel previous debounce on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'a', delay: 500 },
      },
    );

    rerender({ value: 'b', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'c', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('c');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      },
    );

    rerender({ value: 'updated', delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 200 });

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    rerender({ value: 'updated', delay: 500 });

    unmount();

    expect(jest.getTimerCount()).toBe(0);
  });
});

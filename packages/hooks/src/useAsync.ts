import { useEffect, useState } from 'react';

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

/**
 * Hook for handling async operations
 */
export function useAsync<T>(asyncFunction: () => Promise<T>, immediate: boolean = true) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const response = await asyncFunction();
      setState({ status: 'success', data: response, error: null });
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ status: 'error', data: null, error: err });
      throw err;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { ...state, execute };
}

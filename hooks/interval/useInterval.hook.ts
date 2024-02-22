import { useCallback, useEffect, useRef } from 'react';

const useInterval = (fn: () => void, timeout: number = 0) => {
  const timerRef = useRef(0);

  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    timerRef.current = window.setInterval(
      () => {
        fnRef.current();
      },
      timeout < 0 ? 0 : timeout
    );

    return () => {
      window.clearInterval(timerRef.current);
    };
  }, [timeout]);

  const clearIntervalHook = useCallback(() => {
    window.clearInterval(timerRef.current);
  }, []);

  const startTime = () => {
    timerRef.current = window.setInterval(
      () => {
        fnRef.current();
      },
      timeout < 0 ? 0 : timeout
    );
  };

  return { clearIntervalHook, startTime };
};

export default useInterval;

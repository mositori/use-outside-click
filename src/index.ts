import { useRef, useCallback, useEffect } from 'react';

export type OutsideClickConfig = {
  callback: () => void;
  enable?: boolean;
  capture?: boolean;
};

export default function useOnOutsideClick<T extends HTMLElement>({
  callback,
  enable = true,
  capture = false,
}: OutsideClickConfig) {
  const ref = useRef<T>(null);
  const handler = useCallback(
    (e: MouseEvent) => {
      // if ref is not provided, then fire callback whenever window is clicked.
      // if provided, then always check if the clicked element is a descendant.
      if (!ref.current || !ref.current?.contains(e.target as Node)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    if (enable) document.addEventListener('click', handler, capture);

    return () => {
      if (enable) document.removeEventListener('click', handler, capture);
    };
  }, [handler, enable]);

  return [ref] as const;
}

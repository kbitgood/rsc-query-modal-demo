import { useEffect } from "react";

type EventType = keyof WindowEventMap;

export function useWindowListener<Type extends EventType>(
  event: Type,
  callback: (this: Window, event: WindowEventMap[Type]) => void,
) {
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => {
      window.removeEventListener(event, callback);
    };
  }, [event, callback]);
}

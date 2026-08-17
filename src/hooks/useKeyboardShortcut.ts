import { useEffect } from 'react';

export function useKeyboardShortcut(key: string, callback: () => void, metaOrCtrl = false) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMetaKey = event.metaKey || event.ctrlKey;
      if (metaOrCtrl) {
        if (isMetaKey && event.key.toLowerCase() === key.toLowerCase()) {
          event.preventDefault();
          callback();
        }
      } else if (event.key.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, metaOrCtrl]);
}

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.shiftKey === event.shiftKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
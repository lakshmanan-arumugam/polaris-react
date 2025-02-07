import { useState, useEffect } from 'react';
import { Key } from '../../types.js';

const KONAMI_CODE = [Key.UpArrow, Key.UpArrow, Key.DownArrow, Key.DownArrow, Key.LeftArrow, Key.RightArrow, Key.LeftArrow, Key.RightArrow, Key.KeyB, Key.KeyA];
function KonamiCode({
  handler
}) {
  const keyEvent = 'keydown';
  const [position, setPosition] = useState(0);

  const handleKeyEvent = event => {
    const key = event.keyCode;
    const requiredKey = KONAMI_CODE[position];

    if (key === requiredKey) {
      if (position === KONAMI_CODE.length - 1) {
        handler(event);
        setPosition(0);
      } else {
        setPosition(position + 1);
      }
    } else {
      setPosition(0);
    }
  };

  useEffect(() => {
    document.addEventListener(keyEvent, handleKeyEvent);
    return () => {
      document.removeEventListener(keyEvent, handleKeyEvent);
    };
  });
  return null;
}

export { KONAMI_CODE, KonamiCode };

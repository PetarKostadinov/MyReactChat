import { useEffect } from 'react';

const VIEWPORT_HEIGHT_PROPERTY = '--app-height';
const KEYBOARD_INSET_PROPERTY = '--keyboard-inset';

export const useVisualViewportHeight = (): void => {
  useEffect(() => {
    const updateHeight = () => {
      const layoutHeight = window.innerHeight;
      const visualViewport = window.visualViewport;
      const viewportInset = visualViewport
        ? Math.max(0, layoutHeight - visualViewport.height - visualViewport.offsetTop)
        : 0;
      const keyboardInset = viewportInset > 100 ? viewportInset : 0;

      document.documentElement.style.setProperty(VIEWPORT_HEIGHT_PROPERTY, `${layoutHeight}px`);
      document.documentElement.style.setProperty(KEYBOARD_INSET_PROPERTY, `${keyboardInset}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
      document.documentElement.style.removeProperty(VIEWPORT_HEIGHT_PROPERTY);
      document.documentElement.style.removeProperty(KEYBOARD_INSET_PROPERTY);
    };
  }, []);
};

import { useEffect } from 'react';

const VIEWPORT_HEIGHT_PROPERTY = '--app-height';

export const useVisualViewportHeight = (): void => {
  useEffect(() => {
    const updateHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty(VIEWPORT_HEIGHT_PROPERTY, `${height}px`);
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
    };
  }, []);
};

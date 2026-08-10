import { useEffect } from 'react';

const VIEWPORT_HEIGHT_PROPERTY = '--app-height';
const VIEWPORT_TOP_PROPERTY = '--app-top';

export const useVisualViewportHeight = (): void => {
  useEffect(() => {
    const updateHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      const offsetTop = window.visualViewport?.offsetTop ?? 0;
      document.documentElement.style.setProperty(VIEWPORT_HEIGHT_PROPERTY, `${height}px`);
      document.documentElement.style.setProperty(VIEWPORT_TOP_PROPERTY, `${offsetTop}px`);
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
      document.documentElement.style.removeProperty(VIEWPORT_TOP_PROPERTY);
    };
  }, []);
};

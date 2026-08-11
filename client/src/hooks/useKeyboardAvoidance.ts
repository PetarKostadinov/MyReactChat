import { type RefObject, useEffect } from 'react';

const COMPOSER_GAP = 12;

export const useKeyboardAvoidance = (containerRef: RefObject<HTMLElement>): void => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let currentLift = 0;
    let animationFrame: number | undefined;
    const focusTimers: number[] = [];

    const reset = () => {
      currentLift = 0;
      container.style.transform = '';
    };

    const updatePosition = () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const activeElement = document.activeElement;
        if (!activeElement || !container.contains(activeElement)) {
          reset();
          return;
        }

        const viewport = window.visualViewport;
        const visibleBottom = viewport
          ? viewport.offsetTop + viewport.height
          : window.innerHeight;
        const naturalBottom = container.getBoundingClientRect().bottom + currentLift;
        currentLift = Math.max(0, Math.ceil(naturalBottom - visibleBottom + COMPOSER_GAP));
        container.style.transform = currentLift > 0 ? `translateY(-${currentLift}px)` : '';
      });
    };

    const keepFocusedControlVisible = () => {
      updatePosition();
      [100, 300, 600].forEach((delay) => {
        focusTimers.push(window.setTimeout(() => {
          updatePosition();
          const activeElement = document.activeElement;
          if (activeElement instanceof HTMLElement && container.contains(activeElement)) {
            activeElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          }
        }, delay));
      });
    };

    const handleFocusOut = () => requestAnimationFrame(() => {
      if (!container.contains(document.activeElement)) reset();
    });

    container.addEventListener('focusin', keepFocusedControlVisible);
    container.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);
    navigator.virtualKeyboard?.addEventListener('geometrychange', updatePosition);

    return () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      focusTimers.forEach(window.clearTimeout);
      container.removeEventListener('focusin', keepFocusedControlVisible);
      container.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
      navigator.virtualKeyboard?.removeEventListener('geometrychange', updatePosition);
      reset();
    };
  }, [containerRef]);
};

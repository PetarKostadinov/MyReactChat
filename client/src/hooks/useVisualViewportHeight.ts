import { useEffect } from 'react';

const VIEWPORT_HEIGHT_PROPERTY = '--app-height';
const KEYBOARD_INSET_PROPERTY = '--keyboard-inset';
const KEYBOARD_FALLBACK_RATIO = 0.42;
const KEYBOARD_FALLBACK_MAX = 420;

const isKeyboardAvoidanceTargetFocused = (): boolean =>
  document.activeElement instanceof HTMLElement &&
  Boolean(document.activeElement.closest('[data-keyboard-avoid]'));

export const useVisualViewportHeight = (): void => {
  useEffect(() => {
    const animationTimers = new Set<number>();

    const updateHeight = () => {
      const layoutHeight = window.innerHeight;
      const visualViewport = window.visualViewport;
      const virtualKeyboardHeight = navigator.virtualKeyboard?.boundingRect.height ?? 0;
      const viewportInset = visualViewport
        ? Math.max(0, layoutHeight - visualViewport.height - visualViewport.offsetTop)
        : 0;
      const measuredKeyboardInset = virtualKeyboardHeight > 0
        ? virtualKeyboardHeight
        : viewportInset > 100 ? viewportInset : 0;
      const keyboardInset = measuredKeyboardInset > 0
        ? measuredKeyboardInset
        : isKeyboardAvoidanceTargetFocused()
          ? Math.min(layoutHeight * KEYBOARD_FALLBACK_RATIO, KEYBOARD_FALLBACK_MAX)
          : 0;

      document.documentElement.style.setProperty(VIEWPORT_HEIGHT_PROPERTY, `${layoutHeight}px`);
      document.documentElement.style.setProperty(KEYBOARD_INSET_PROPERTY, `${keyboardInset}px`);
    };

    const updateDuringKeyboardAnimation = () => {
      updateHeight();
      [150, 350].forEach((delay) => {
        const timer = window.setTimeout(() => {
          animationTimers.delete(timer);
          updateHeight();
        }, delay);
        animationTimers.add(timer);
      });
    };

    if (navigator.virtualKeyboard) {
      navigator.virtualKeyboard.overlaysContent = true;
    }

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);
    navigator.virtualKeyboard?.addEventListener('geometrychange', updateHeight);
    document.addEventListener('focusin', updateDuringKeyboardAnimation);
    document.addEventListener('focusout', updateDuringKeyboardAnimation);

    return () => {
      animationTimers.forEach(window.clearTimeout);
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
      navigator.virtualKeyboard?.removeEventListener('geometrychange', updateHeight);
      document.removeEventListener('focusin', updateDuringKeyboardAnimation);
      document.removeEventListener('focusout', updateDuringKeyboardAnimation);
      document.documentElement.style.removeProperty(VIEWPORT_HEIGHT_PROPERTY);
      document.documentElement.style.removeProperty(KEYBOARD_INSET_PROPERTY);
    };
  }, []);
};

import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');
const EMPTY_SELECTORS = [];

function isFocusable(element) {
  if (!element || !(element instanceof HTMLElement)) return false;
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  return element.getClientRects().length > 0;
}

function getFocusableNodes(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusable);
}

function focusWithin(container, preferredRef) {
  const preferredNode = preferredRef?.current;
  if (isFocusable(preferredNode)) {
    preferredNode.focus();
    return;
  }

  const nodes = getFocusableNodes(container);
  if (nodes.length > 0) {
    nodes[0].focus();
    return;
  }

  container.focus();
}

function setBackgroundInert(selectors, enabled) {
  if (typeof document === 'undefined' || !selectors?.length) return () => {};

  const cleanupEntries = selectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector)).map((element) => {
      const previousAriaHidden = element.getAttribute('aria-hidden');
      const previousInert = element.inert;

      if (enabled) {
        element.inert = true;
        element.setAttribute('aria-hidden', 'true');
      }

      return () => {
        element.inert = previousInert;
        if (previousAriaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', previousAriaHidden);
        }
      };
    }),
  );

  return () => {
    cleanupEntries.forEach((restore) => restore());
  };
}

export function useDialogAccessibility({
  isOpen,
  containerRef,
  initialFocusRef,
  returnFocusRef,
  onClose,
  inertSelectors,
  lockScroll = true,
}) {
  const selectors = inertSelectors ?? EMPTY_SELECTORS;

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const previousFocusedElement =
      returnFocusRef?.current instanceof HTMLElement
        ? returnFocusRef.current
        : document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

    const hadTabIndex = container.hasAttribute('tabindex');
    if (!hadTabIndex) {
      container.setAttribute('tabindex', '-1');
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverscroll = document.documentElement.style.overscrollBehavior;

    if (lockScroll) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
    }

    const restoreInert = setBackgroundInert(selectors, true);
    const rafId = window.requestAnimationFrame(() => focusWithin(container, initialFocusRef));

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const nodes = getFocusableNodes(container);
      if (nodes.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === firstNode || !container.contains(activeElement)) {
          event.preventDefault();
          lastNode.focus();
        }
        return;
      }

      if (activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', onKeyDown);
      restoreInert();

      if (lockScroll) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overscrollBehavior = previousRootOverscroll;
      }

      if (!hadTabIndex) {
        container.removeAttribute('tabindex');
      }

      if (previousFocusedElement?.isConnected) {
        previousFocusedElement.focus();
      }
    };
  }, [
    containerRef,
    initialFocusRef,
    isOpen,
    lockScroll,
    onClose,
    returnFocusRef,
    selectors,
  ]);
}

export default useDialogAccessibility;

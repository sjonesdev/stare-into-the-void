import { type RefObject, useEffect } from "react";

/**
 * Will respond to updates to elementRef, but not close. Note
 * absolute positioning on the target element may require setting
 * a z-index to ensure it is above the element that should trigger close.
 *
 * @param elementRef The most parent element that should not trigger close.
 * @param close The function to be called to close the element.
 */
export default function useCloseOnClickAway(
  elementRef: RefObject<Element>,
  close: () => void
) {
  useEffect(() => {
    const listener = (ev: MouseEvent) => {
      let target: HTMLElement | null = ev.target as HTMLElement;
      while (target) {
        if (target === elementRef.current) return;
        target = target.parentElement;
      }
      close();
    };
    globalThis.addEventListener("click", listener);
    return () => globalThis.removeEventListener("click", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef]);
}

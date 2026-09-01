import { useRef } from "react";

/** Controlled dialogs open from several buttons, rather than one Radix Trigger. */
export function useDialogReturnFocus() {
  const previous = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus() {
      previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    },
    onCloseAutoFocus(event: Event) {
      if (!previous.current?.isConnected) return;
      event.preventDefault();
      previous.current.focus();
    },
  };
}

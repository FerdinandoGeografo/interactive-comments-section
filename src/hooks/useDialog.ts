import { useEffect, useRef } from "react";

const CLOSING_CLS = "is-closing";

export function useDialog(isOpen: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      return;
    }

    if (!dialog.open) return;

    dialog.classList.add(CLOSING_CLS);

    const handleAnimationEnd = () => {
      dialog.classList.remove(CLOSING_CLS);
      dialog.close();
    };

    dialog.addEventListener("animationend", handleAnimationEnd);

    return () => {
      dialog.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [isOpen]);

  return ref;
}

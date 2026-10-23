export const COMMENTS_HEADING_ID = "comments-heading";
export const MAIN_COMMENT_TEXTAREA_ID = "add-comment";

function isAvailable(element: HTMLElement) {
  if (
    !element.isConnected ||
    element.matches(":disabled, [aria-disabled='true'], [data-disabled]") ||
    element.closest("[inert], [hidden], [aria-hidden='true']") ||
    element.getClientRects().length === 0
  )
    return false;

  for (
    let node: HTMLElement | null = element;
    node;
    node = node.parentElement
  ) {
    const style = getComputedStyle(node);
    if (style.visibility !== "visible" || style.opacity === "0") return false;
  }
  return true;
}

function entryAction(entry: Element) {
  const action = entry.querySelector<HTMLElement>(
    ":scope > article [data-comment-action]",
  );
  return action && isAvailable(action) ? action : null;
}

export function focusAfterDelete(article: HTMLElement | null) {
  const entry = article?.closest("li");
  if (!entry) return;

  let destination: HTMLElement | null = null;
  for (const direction of [
    "nextElementSibling",
    "previousElementSibling",
  ] as const) {
    for (
      let sibling = entry[direction];
      sibling;
      sibling = sibling[direction]
    ) {
      destination = entryAction(sibling);
      if (destination) break;
    }
    if (destination) break;
  }

  const parentEntry = entry.parentElement?.closest("li");
  if (!destination && parentEntry) destination = entryAction(parentEntry);
  if (!destination) {
    const textarea = document.getElementById(MAIN_COMMENT_TEXTAREA_ID);
    if (textarea && isAvailable(textarea)) destination = textarea;
  }
  if (!destination) return;

  // A pointer-confirmed deletion also needs a visible focus indicator.
  destination.setAttribute("data-focus-after-delete", "");
  destination.addEventListener(
    "blur",
    () => destination.removeAttribute("data-focus-after-delete"),
    { once: true },
  );
  destination.focus({ preventScroll: true });
  const rect = destination.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > window.innerHeight)
    destination.scrollIntoView({ block: "nearest", behavior: "instant" });
}

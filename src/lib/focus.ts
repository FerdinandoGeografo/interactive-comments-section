export const MAIN_COMMENT_TEXTAREA_ID = "add-comment";

function entryAction(entry: Element | null | undefined) {
  if (!entry || entry.closest("[inert]")) return null;
  return entry.querySelector<HTMLElement>(
    ":scope > article [data-comment-action]",
  );
}

// Where focus goes once an entry is deleted: Reply or Edit on the next entry,
// the previous one, the parent comment, or the main form for an empty list.
export function findFocusAfterDelete(entry: Element | null | undefined) {
  for (const direction of [
    "nextElementSibling",
    "previousElementSibling",
  ] as const) {
    for (
      let sibling = entry?.[direction];
      sibling;
      sibling = sibling[direction]
    ) {
      const action = entryAction(sibling);
      if (action) return action;
    }
  }
  return (
    entryAction(entry?.parentElement?.closest("li")) ??
    document.getElementById(MAIN_COMMENT_TEXTAREA_ID)
  );
}

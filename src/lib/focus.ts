export const COMMENTS_HEADING_ID = "comments-heading";

// Stable focus target used when the element that had focus is removed,
// e.g. after deleting the comment that owned the delete trigger.
export function focusCommentsHeading() {
  document.getElementById(COMMENTS_HEADING_ID)?.focus();
}

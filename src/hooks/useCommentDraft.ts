import { useState } from "react";
import { isValidContent, normalizeContent } from "@/utils/comment.utils";

export function useCommentDraft(initialContent = "") {
  const [content, setContent] = useState(initialContent);
  const canSubmit = isValidContent(content);

  const handleSubmit =
    (onValid: (content: string) => void) => (e: React.SubmitEvent) => {
      e.preventDefault();
      if (canSubmit) onValid(normalizeContent(content));
    };

  return { content, setContent, canSubmit, handleSubmit };
}

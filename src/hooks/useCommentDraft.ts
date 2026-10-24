import { useState } from "react";
import {
  isValidContent,
  mentionPrefix,
  stripMention,
} from "@/utils/comment.utils";

export function useCommentDraft(initialContent = "", replyingTo?: string) {
  const [content, setContent] = useState(
    replyingTo ? mentionPrefix(replyingTo) + initialContent : initialContent,
  );
  const canSubmit = isValidContent(stripMention(content, replyingTo));

  const handleSubmit =
    (onValid: (content: string) => void) => (e: React.SubmitEvent) => {
      e.preventDefault();
      if (canSubmit) onValid(stripMention(content, replyingTo));
    };

  return { content, setContent, canSubmit, handleSubmit };
}

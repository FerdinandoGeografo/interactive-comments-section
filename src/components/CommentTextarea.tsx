import { useEffect, useId, useRef, type ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";

interface CommentTextareaProps extends ComponentProps<typeof Textarea> {
  label: string;
}

export default function CommentTextarea({
  label,
  id,
  rows = 3,
  autoFocus,
  ...props
}: CommentTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Native autofocus leaves the caret at the start; place it after the
  // prefilled mention or the text being edited instead.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!autoFocus || !textarea) return;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [autoFocus]);

  return (
    <>
      <label htmlFor={textareaId} className="sr-only">
        {label}
      </label>
      <Textarea ref={textareaRef} id={textareaId} rows={rows} {...props} />
    </>
  );
}

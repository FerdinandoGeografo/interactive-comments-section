import { useId, type ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";

interface CommentTextareaProps extends ComponentProps<typeof Textarea> {
  label: string;
}

export default function CommentTextarea({
  label,
  id,
  rows = 3,
  ...props
}: CommentTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <>
      <label htmlFor={textareaId} className="sr-only">
        {label}
      </label>
      <Textarea id={textareaId} rows={rows} {...props} />
    </>
  );
}

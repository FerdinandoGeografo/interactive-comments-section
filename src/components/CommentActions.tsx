import type { Ref } from "react";
import { Button } from "@/components/ui/button";

interface CommentActionsProps {
  isAuthor: boolean;
  isReplying: boolean;
  isEditing: boolean;
  replyTriggerRef: Ref<HTMLButtonElement>;
  editTriggerRef: Ref<HTMLButtonElement>;
  onDelete: () => void;
  onEdit: () => void;
  onReply: () => void;
}

export default function CommentActions({
  isAuthor,
  isReplying,
  isEditing,
  replyTriggerRef,
  editTriggerRef,
  onDelete,
  onEdit,
  onReply,
}: CommentActionsProps) {
  return (
    <div className="col-start-2 -col-end-1 ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:col-start-3 sm:row-start-1 sm:self-center">
      {isAuthor ? (
        <>
          <Button
            variant="ghost-destructive"
            size="inline"
            aria-haspopup="dialog"
            onClick={onDelete}
          >
            <svg className="h-3.5 w-2.75" aria-hidden="true">
              <use href="/icons.svg#delete"></use>
            </svg>
            <span>Delete</span>
          </Button>
          <Button
            ref={editTriggerRef}
            variant="ghost"
            size="inline"
            aria-expanded={isEditing}
            onClick={onEdit}
          >
            <svg className="size-3" aria-hidden="true">
              <use href="/icons.svg#edit"></use>
            </svg>
            <span>Edit</span>
          </Button>
        </>
      ) : (
        <Button
          ref={replyTriggerRef}
          variant="ghost"
          size="inline"
          aria-expanded={isReplying}
          onClick={onReply}
        >
          <svg className="size-3" aria-hidden="true">
            <use href="/icons.svg#reply"></use>
          </svg>
          <span>Reply</span>
        </Button>
      )}
    </div>
  );
}

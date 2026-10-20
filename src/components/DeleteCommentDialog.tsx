import Button from "@/components/Button";
import { useDialog } from "@/hooks/useDialog";

interface DeleteCommentDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCommentDialog({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteCommentDialogProps) {
  const ref = useDialog(isOpen);

  return (
    <dialog
      ref={ref}
      className="flex flex-col gap-4 rounded-lg bg-white px-6.75 py-6"
      onCancel={onCancel}
    >
      <h2 className="text-2xl leading-6 font-medium text-gray-700">
        Delete comment
      </h2>
      <p className="leading-6 text-gray-600">
        Are you sure you want to delete this comment? This will remove the
        comment and can’t be undone.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={onCancel}>
          <span>No, cancel</span>
        </Button>
        <Button variation="danger" onClick={onConfirm}>
          <span>Yes, delete</span>
        </Button>
      </div>
    </dialog>
  );
}

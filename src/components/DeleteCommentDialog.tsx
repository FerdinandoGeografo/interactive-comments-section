import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { focusCommentsHeading } from "@/lib/focus";

interface DeleteCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteCommentDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteCommentDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const isConfirmedRef = useRef(false);

  function handleConfirm() {
    isConfirmedRef.current = true;
    onOpenChange(false);
  }

  function handleOpenChangeComplete(isOpen: boolean) {
    if (isOpen || !isConfirmedRef.current) return;
    isConfirmedRef.current = false;
    focusCommentsHeading();
    onConfirm();
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <AlertDialogContent
        initialFocus={cancelRef}
        finalFocus={() => !isConfirmedRef.current}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete comment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this comment? This will remove the
            comment and can’t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>No, cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

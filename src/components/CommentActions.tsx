import Button from "./Button";

interface CommentActionsProps {
  isAuthor: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onReply: () => void;
}

export default function CommentActions({
  isAuthor,
  onDelete,
  onEdit,
  onReply,
}: CommentActionsProps) {
  return (
    <div className="col-start-2 -col-end-1 ml-auto flex items-center gap-4 sm:col-start-3 sm:row-start-1 sm:self-center">
      {isAuthor ? (
        <>
          <Button outlined variation="danger" onClick={onDelete}>
            <svg
              className="h-3.5 w-2.75"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#delete"></use>
            </svg>
            <span>Delete</span>
          </Button>
          <Button outlined onClick={onEdit}>
            <svg className="size-3" role="presentation" aria-hidden="true">
              <use href="/icons.svg#edit"></use>
            </svg>
            <span>Edit</span>
          </Button>
        </>
      ) : (
        <Button outlined onClick={onReply}>
          <svg className="size-3" role="presentation" aria-hidden="true">
            <use href="/icons.svg#reply"></use>
          </svg>
          <span>Reply</span>
        </Button>
      )}
    </div>
  );
}

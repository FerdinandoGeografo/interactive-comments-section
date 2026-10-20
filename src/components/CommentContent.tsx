interface CommentContentProps {
  content: string;
  replyingTo: string;
}

export default function CommentContent({
  content,
  replyingTo,
}: CommentContentProps) {
  return (
    <p className="leading-6 wrap-anywhere text-gray-600">
      {replyingTo && (
        <span className="font-medium text-blue-500">@{replyingTo} </span>
      )}
      {content}
    </p>
  );
}

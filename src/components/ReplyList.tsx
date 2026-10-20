import type { ReactNode } from "react";
import type { Reply } from "@/models/comment.interface";
import Comment from "@/components/Comment";

interface ReplyListProps {
  replies: Reply[];
  parentId: number;
  replyForm: ReactNode;
}

export default function ReplyList({
  replies,
  parentId,
  replyForm,
}: ReplyListProps) {
  return (
    <div className="flex flex-col gap-4 border-l border-l-gray-200 pl-4 sm:ml-10.75 sm:gap-5 sm:pl-10.75">
      <ul className="contents">
        {replies.map((reply) => (
          <Comment comment={reply} parentId={parentId} key={reply.id} />
        ))}
      </ul>
      {replyForm}
    </div>
  );
}

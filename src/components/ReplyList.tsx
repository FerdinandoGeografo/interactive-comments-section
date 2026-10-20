import type { Reply } from "@/models/comment.interface";
import Comment from "@/components/Comment";

interface ReplyListProps {
  replies: Reply[];
  threadId: string;
}

export default function ReplyList({ replies, threadId }: ReplyListProps) {
  return (
    <ul className="flex flex-col gap-4 border-l border-l-gray-200 pl-4 sm:ml-10.75 sm:gap-5 sm:pl-10.75">
      {replies.map((reply) => (
        <Comment
          entry={reply}
          target={{ kind: "reply", threadId, id: reply.id }}
          key={reply.id}
        />
      ))}
    </ul>
  );
}

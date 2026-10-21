import type { Ref } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { Reply } from "@/models/comment.interface";
import Comment from "@/components/Comment";
import { entryMotion, transitions } from "@/lib/motion";

interface ReplyListProps {
  replies: Reply[];
  threadId: string;
  ref?: Ref<HTMLUListElement>;
}

export default function ReplyList({ replies, threadId, ref }: ReplyListProps) {
  return (
    <m.ul
      ref={ref}
      layout="position"
      {...entryMotion}
      transition={{ layout: transitions.layout }}
      className="relative flex flex-col gap-4 border-l border-l-gray-200 pl-4 sm:ml-10.75 sm:gap-5 sm:pl-10.75"
    >
      <AnimatePresence initial={false} mode="popLayout" propagate>
        {replies.map((reply) => (
          <Comment
            entry={reply}
            target={{ kind: "reply", threadId, id: reply.id }}
            key={reply.id}
          />
        ))}
      </AnimatePresence>
    </m.ul>
  );
}

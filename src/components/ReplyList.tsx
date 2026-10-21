import type { Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Reply } from "@/models/comment.interface";
import Comment from "@/components/Comment";
import { layoutSpring } from "@/lib/motion/transitions";
import { entryMotion } from "@/lib/motion/variants";

interface ReplyListProps {
  replies: Reply[];
  threadId: string;
  ref?: Ref<HTMLUListElement>;
}

export default function ReplyList({ replies, threadId, ref }: ReplyListProps) {
  return (
    <motion.ul
      ref={ref}
      layout="position"
      {...entryMotion}
      transition={{ layout: layoutSpring }}
      className="relative flex flex-col gap-4 border-l border-l-gray-200 pl-4 sm:ml-6 sm:gap-5 sm:pl-6 md:ml-10.75 md:pl-10.75"
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
    </motion.ul>
  );
}

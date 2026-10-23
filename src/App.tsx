import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import CreateCommentForm from "@/components/CreateCommentForm";
import Comment from "@/components/Comment";
import Footer from "@/components/Footer";
import { useComments } from "@/hooks/useComments";
import { createId } from "@/lib/id";
import { COMMENTS_HEADING_ID } from "@/lib/focus";
import { layoutSpring } from "@/lib/motion/transitions";
import { entryMotion } from "@/lib/motion/variants";
import { sortRootComments } from "@/utils/comment.utils";

export default function App() {
  const { comments, dispatch } = useComments();
  const [submissionStatus, setSubmissionStatus] = useState("");

  const createComment = (content: string) => {
    dispatch({
      type: "createComment",
      payload: { id: createId(), content, createdAt: new Date().toISOString() },
    });
    setSubmissionStatus("Comment posted");
  };

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-gray-100 px-4 sm:px-6 md:px-8">
      <LayoutGroup>
        <main className="mx-auto flex w-full max-w-182.5 flex-1 flex-col gap-4 py-8 sm:gap-5 sm:py-12 md:py-16">
          <h1 id={COMMENTS_HEADING_ID} tabIndex={-1} className="sr-only">
            Comments
          </h1>

          <AnimatePresence initial={false}>
            {comments.length > 0 && (
              <motion.ul
                key="comments"
                {...entryMotion}
                className="relative flex flex-col gap-4 sm:gap-5"
              >
                <AnimatePresence initial={false} mode="popLayout" propagate>
                  {sortRootComments(comments).map((comment) => (
                    <Comment
                      entry={comment}
                      target={{ kind: "comment", id: comment.id }}
                      key={comment.id}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.div layout="position" transition={{ layout: layoutSpring }}>
            <CreateCommentForm
              label="Add a comment"
              submitLabel="send"
              onSubmit={createComment}
              onDraftChange={() => setSubmissionStatus("")}
            />
            <p role="status" aria-atomic="true" className="sr-only">
              {submissionStatus}
            </p>
          </motion.div>
        </main>

        <Footer />
      </LayoutGroup>
    </div>
  );
}

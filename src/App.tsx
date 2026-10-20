import CreateCommentForm from "@/components/CreateCommentForm";
import Comment from "@/components/Comment";
import { useComments } from "@/hooks/useComments";
import { COMMENTS_HEADING_ID } from "@/lib/focus";
import { sortRootComments } from "@/utils/comment.utils";

export default function App() {
  const { comments } = useComments();

  return (
    <div className="flex min-h-screen justify-center overflow-y-auto bg-gray-100">
      <main className="flex max-w-182.5 flex-1 flex-col gap-4 px-4 py-8 sm:gap-5 sm:px-0 sm:py-16">
        <h1 id={COMMENTS_HEADING_ID} tabIndex={-1} className="sr-only">
          Comments
        </h1>

        {comments.length > 0 && (
          <ul className="contents">
            {sortRootComments(comments).map((comment) => (
              <Comment
                entry={comment}
                target={{ kind: "comment", id: comment.id }}
                key={comment.id}
              />
            ))}
          </ul>
        )}

        <CreateCommentForm />
      </main>
    </div>
  );
}

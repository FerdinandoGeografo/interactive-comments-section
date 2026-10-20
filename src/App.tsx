import CreateCommentForm from "@/components/CreateCommentForm";
import Comment from "@/components/Comment";
import { useComments } from "@/contexts/CommentsContext";

export default function App() {
  const { comments } = useComments();

  return (
    <div className="flex min-h-screen justify-center overflow-y-auto bg-gray-100">
      <main className="flex max-w-182.5 flex-1 flex-col gap-4 px-4 py-8 sm:gap-5 sm:px-0 sm:py-16">
        {comments.length > 0 && (
          <ul className="contents">
            {comments.map((comment) => (
              <Comment comment={comment} key={comment.id} />
            ))}
          </ul>
        )}

        <CreateCommentForm />
      </main>
    </div>
  );
}

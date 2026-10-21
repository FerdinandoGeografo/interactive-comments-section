import type { User } from "@/models/user.interface";
import Avatar from "@/components/Avatar";
import { useNow } from "@/hooks/useNow";
import { formatExactDate, formatRelativeTime } from "@/utils/time.utils";

interface CommentHeaderProps {
  user: User;
  createdAt: string;
  isAuthor: boolean;
}

export default function CommentHeader({
  user,
  createdAt,
  isAuthor,
}: CommentHeaderProps) {
  const now = useNow();

  return (
    <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2 sm:col-start-2 sm:row-start-1">
      <Avatar user={user} />
      <p className="flex items-center gap-2">
        <span className="leading-4.75 font-medium text-gray-700">
          {user.username}
        </span>
        {isAuthor && (
          <span className="flex h-4.75 w-9 items-center justify-center rounded-xs bg-blue-500 text-badge text-white">
            you
          </span>
        )}
      </p>
      <time
        dateTime={createdAt}
        title={formatExactDate(createdAt)}
        className="leading-6 text-gray-600"
      >
        {formatRelativeTime(createdAt, now)}
      </time>
    </div>
  );
}

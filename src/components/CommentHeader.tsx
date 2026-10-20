import type { User } from "../models/user.interface";
import Avatar from "./Avatar";

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
  return (
    <div className="col-span-full flex items-center gap-4 sm:col-start-2 sm:row-start-1">
      <Avatar user={user} />
      <p className="flex items-center gap-2">
        <span className="leading-4.75 font-medium text-gray-700">
          {user.username}
        </span>
        {isAuthor && (
          <span className="flex h-4.75 w-9 items-center justify-center rounded-xs bg-blue-500 text-[13px] leading-3.75 text-white">
            you
          </span>
        )}
      </p>
      <p className="leading-6 text-gray-600">{createdAt}</p>
    </div>
  );
}

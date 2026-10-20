import type { User } from "../models/user.interface";

type AvatarSize = "medium" | "large";

interface AvatarProps {
  user: User;
  size?: AvatarSize;
  className?: string;
}

const AVATAR_SIZES: Record<AvatarSize, string> = {
  medium: "size-8",
  large: "size-8 sm:size-10",
};

export default function Avatar({
  user: { image, username },
  size = "medium",
  className = "",
}: AvatarProps) {
  return (
    <img
      className={`rounded-full ${AVATAR_SIZES[size]} ${className}`}
      src={image.webp}
      alt={`${username}'s avatar image`}
    />
  );
}

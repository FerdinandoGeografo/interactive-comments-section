import type { User } from "@/models/user.interface";
import { cn } from "@/lib/utils";

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

// Decorative: the username is always rendered next to it or implied by the form.
export default function Avatar({
  user: { image },
  size = "medium",
  className,
}: AvatarProps) {
  return (
    <img
      className={cn("rounded-full", AVATAR_SIZES[size], className)}
      src={image.webp}
      alt=""
      width={64}
      height={64}
    />
  );
}

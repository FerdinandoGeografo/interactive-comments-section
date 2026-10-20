export interface UserAvatar {
  png: string;
  webp: string;
}

export interface User {
  image: UserAvatar;
  username: string;
}

export const CURRENT_USER: User = {
  image: {
    png: "./avatars/image-juliusomo.png",
    webp: "./avatars/image-juliusomo.webp",
  },
  username: "juliusomo",
};

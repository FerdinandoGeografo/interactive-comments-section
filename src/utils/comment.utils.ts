import type { BaseComment, Comment, Reply } from "../models/comment.interface";

export function isComment(comment: BaseComment): comment is Comment {
  return "replies" in comment;
}

export function isReply(comment: BaseComment): comment is Reply {
  return "replyingTo" in comment;
}

interface CommentTextareaProps {
  id: string;
  placeholder?: string;
  value: string;
  setContent: (value: string) => void;
  className?: string;
  rows?: number;
}

export default function CommentTextarea({
  id,
  placeholder = "",
  value,
  setContent,
  className = "",
  rows = 3,
}: CommentTextareaProps) {
  return (
    <textarea
      id={id}
      className={`w-full resize-none rounded-lg border border-gray-200 leading-6 text-gray-700 caret-blue-500 outline-0 transition-colors duration-300 placeholder:text-gray-600 hover:border-blue-500 focus:border-blue-500 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setContent(e.target.value)}
      rows={rows}
    ></textarea>
  );
}

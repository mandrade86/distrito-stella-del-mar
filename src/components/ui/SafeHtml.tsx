import { sanitizeHtml, looksLikeHtml } from "@/lib/sanitize-html";
import { cn } from "@/lib/utils";

type Props = {
  html: string;
  className?: string;
  as?: "div" | "span" | "section";
};

export function SafeHtml({ html, className, as: Tag = "div" }: Props) {
  if (!html) return null;
  const clean = sanitizeHtml(html);
  return (
    <Tag
      className={cn("cms-html", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

/** Renders plain text or sanitized HTML depending on content. */
export function RichText({
  value,
  className,
  as = "div",
}: {
  value: string;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  if (!value) return null;
  if (looksLikeHtml(value)) {
    return <SafeHtml html={value} className={className} as={as === "p" ? "div" : as} />;
  }
  const Tag = as;
  return <Tag className={className}>{value}</Tag>;
}

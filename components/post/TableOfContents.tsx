import type { Heading } from "@/lib/posts";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  const minimumLevel = Math.min(...headings.map((heading) => heading.level));

  return (
    <nav aria-label="목차" className="table-of-contents">
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - minimumLevel) * 20}px` }}
          >
            <a href={`#${heading.id}`}>{heading.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

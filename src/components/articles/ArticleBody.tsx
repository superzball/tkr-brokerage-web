// src/components/articles/ArticleBody.tsx
// Renders the markdown article body from /content/articles. The corpus only
// uses H2/H3 headings, paragraphs, and `-` bullet lists, so a tiny block
// parser keeps us dependency-free (no remark/marked).
import type { ReactNode } from "react";

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

function parseBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("### ")) blocks.push({ type: "h3", text: t.slice(4) });
    else if (t.startsWith("## ")) blocks.push({ type: "h2", text: t.slice(3) });
    else if (t.startsWith("# ")) blocks.push({ type: "h2", text: t.slice(2) });
    else if (/^[-*] /.test(t)) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(t.slice(2));
      else blocks.push({ type: "ul", items: [t.slice(2)] });
    } else blocks.push({ type: "p", text: t });
  }
  return blocks;
}

export function ArticleBody({ markdown }: { markdown: string }) {
  const blocks = parseBlocks(markdown);
  return (
    <div className="space-y-4 text-ink-700 leading-relaxed">
      {blocks.map((b, i): ReactNode => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="pt-5 font-display font-700 text-2xl text-ink-900 tracking-tight">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-2 font-600 text-lg text-ink-900">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2 pl-1">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-2.5 size-1.5 rounded-full bg-brand-400 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
    </div>
  );
}

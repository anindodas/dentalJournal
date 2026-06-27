"use client";

import { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop TOC View */}
      <div className="hidden lg:block">
        <nav className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Table of Contents
          </p>
          <ul className="space-y-2.5 text-sm">
            {items.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
              >
                <a
                  href={`#${item.id}`}
                  className={`block py-0.5 leading-snug transition-colors hover:text-primary ${
                    activeId === item.id
                      ? "font-medium text-primary border-l-2 border-primary pl-2 -ml-2.5"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Accordion View */}
      <div className="block lg:hidden mb-8 rounded-xl border border-border bg-muted/30 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between font-serif text-lg font-medium text-primary"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Table of Contents
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-250 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <ul className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            {items.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block py-0.5 leading-snug hover:text-primary ${
                    activeId === item.id
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

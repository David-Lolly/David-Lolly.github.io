import React from "react";

const iconPaths: Record<string, string> = {
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM9 14l-1 7 4-2 4 2-1-7",
  briefcase: "M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm0 4h18M9 12v2h6v-2",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16",
  external: "M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
  github: "M12 2a10 10 0 0 0-3 19c.5.1.7-.2.7-.5v-2c-3 .7-3.6-1.4-3.6-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.4-.3-4.9-1.2-4.9-5.3 0-1.2.4-2.1 1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 1.1A10 10 0 0 1 12 5c.9 0 1.8.1 2.7.4 2.1-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.8.7.8 1 1.7 1 2.9 0 4.1-2.5 5-4.9 5.3.4.3.8 1 .8 2v3.1c0 .3.2.6.8.5A10 10 0 0 0 12 2Z",
  graduation: "M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 2 9 2 12 0v-5M12 15v7",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2 8 7 8-7",
  moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  sparkles: "M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2ZM5 14l.9 2.6L8.5 17l-2.6.9L5 20.5l-.9-2.6L1.5 17l2.6-.4L5 14ZM19 14l.9 2.6 2.6.4-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.4L19 14Z",
  star: "M12 2l3.1 6.4 6.9 1-5 4.9 1.2 6.9L12 18l-6.2 3.2L7 14.3l-5-4.9 6.9-1L12 2Z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Zm0 2H4a2 2 0 0 0 2 5h1M17 6h3a2 2 0 0 1-2 5h-1",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
};

export function Icon({ name, className = "h-5 w-5", strokeWidth = 2 }: { name: string; className?: string; strokeWidth?: number }) {
  if (!iconPaths[name]) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

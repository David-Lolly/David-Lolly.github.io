import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";

export function PaperCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-stone-900/10 bg-[#fffbe6]/75 p-6 shadow-[0_18px_60px_rgba(69,52,25,0.09)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, desc, center = false }: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={cn("mb-8", center && "text-center")}>
      {eyebrow && <div className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#8b6f47]">{eyebrow}</div>}
      <h2 className="font-serif text-3xl font-black leading-tight text-stone-950 md:text-4xl">{title}</h2>
      {desc && <p className={cn("mt-3 max-w-2xl text-base leading-8 text-stone-600", center && "mx-auto")}>{desc}</p>}
    </div>
  );
}

export const typeConfig: Record<string, { chip: string; dot: string; icon: string }> = {
  教育: {
    chip: "border-[#8a6a3f]/25 bg-[#8a6a3f]/10 text-[#6f512b]",
    dot: "bg-[#8a6a3f]",
    icon: "graduation",
  },
  竞赛: {
    chip: "border-[#9a6a23]/25 bg-[#9a6a23]/10 text-[#7c4c13]",
    dot: "bg-[#9a6a23]",
    icon: "trophy",
  },
  开源: {
    chip: "border-[#3f6f53]/25 bg-[#3f6f53]/10 text-[#315d43]",
    dot: "bg-[#3f6f53]",
    icon: "code",
  },
  工作: {
    chip: "border-[#425f78]/25 bg-[#425f78]/10 text-[#344f67]",
    dot: "bg-[#425f78]",
    icon: "briefcase",
  },
};

export function TypeChip({ type }: { type: string }) {
  const config = typeConfig[type] || typeConfig.教育;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold", config.chip)}>
      {type}
    </span>
  );
}

export function ContactLinks({ profile, compact = false }: { profile: any, compact?: boolean }) {
  const base = compact
    ? "inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/45 px-3 py-2 text-sm font-bold text-stone-700 transition hover:-translate-y-0.5 hover:bg-white"
    : "inline-flex items-center gap-2 rounded-2xl border border-stone-900/10 bg-white/45 px-4 py-3 text-sm font-bold text-stone-700 transition hover:-translate-y-0.5 hover:bg-white";

  return (
    <div className="flex flex-wrap gap-3">
      {profile.email && (
        <a className={base} href={`mailto:${profile.email}`}>
          <Icon name="mail" className="h-4 w-4" />
          {profile.email}
        </a>
      )}
      {profile.github && (
        <a className={base} href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
          <Icon name="github" className="h-4 w-4" />
          {profile.github}
        </a>
      )}
      {profile.website && (
        <a className={base} href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer">
          <Icon name="external" className="h-4 w-4" />
          {profile.website}
        </a>
      )}
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";
import { typeConfig, TypeChip } from "./shared";
import { ImageGallery, ImageProps } from "./visual-image";

export interface TimelineItem {
  id: string;
  dateText: string;
  sortDate: string;
  group: string;
  type: string;
  title: string;
  desc: string;
  featured: boolean;
  important: boolean;
  images: ImageProps[];
}

export function TimelineNode({ item, onOpenImage }: { item: TimelineItem; onOpenImage: (img: ImageProps) => void }) {
  const config = typeConfig[item.type] || typeConfig.教育;

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white/45 p-4 shadow-sm transition duration-200 motion-safe:md:hover:-translate-y-0.5 hover:bg-white/70 sm:rounded-[2rem] sm:p-5 dark:bg-[rgb(24,24,27)] dark:hover:bg-muted",
        item.important
          ? "border-[#8b6f47]/30 bg-[#fff8d6]/55 shadow-[0_18px_58px_rgba(69,52,25,0.10)] dark:border-border dark:shadow-lg"
          : "border-stone-900/10 dark:border-border"
      )}
    >
      {item.important && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(139,111,71,0.10),transparent_46%)] sm:rounded-[2rem] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_44%)]" />
      )}
      <div
        className={cn(
          "absolute -left-[2.05rem] top-8 hidden h-3.5 w-3.5 rounded-full ring-4 ring-[#f6f1cf] md:block dark:ring-black",
          config.dot
        )}
      />
      <div className="relative mb-3 flex flex-wrap items-center gap-2">
        <TypeChip type={item.type} />
        {item.important && (
          <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-black text-[#fff8d6] dark:bg-muted dark:text-foreground">
            重点节点
          </span>
        )}
      </div>
      <div className="relative text-sm font-black text-[#8b6f47] dark:text-amber-300">{item.dateText}</div>
      <h3 className="relative mt-2 font-heading text-2xl font-black leading-snug text-stone-950 dark:text-foreground">
        {item.title}
      </h3>
      <p className="relative mt-3 text-sm leading-7 text-stone-600 dark:text-muted-foreground">{item.desc}</p>

      <div className="relative">
        <ImageGallery images={item.images} onOpen={onOpenImage} important={item.important} />
      </div>
    </div>
  );
}

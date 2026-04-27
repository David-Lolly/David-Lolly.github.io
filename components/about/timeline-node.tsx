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
        "relative rounded-[2rem] border bg-white/45 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/70",
        item.important ? "border-[#8b6f47]/30" : "border-stone-900/10"
      )}
    >
      <div
        className={cn(
          "absolute -left-[2.05rem] top-8 hidden h-3.5 w-3.5 rounded-full ring-4 ring-[#f6f1cf] md:block",
          config.dot
        )}
      />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <TypeChip type={item.type} />
        {item.important && (
          <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-black text-[#fff8d6]">
            重点节点
          </span>
        )}
      </div>
      <div className="text-sm font-black text-[#8b6f47]">{item.dateText}</div>
      <h3 className="mt-2 font-serif text-2xl font-black leading-snug text-stone-950">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-stone-600">{item.desc}</p>

      <ImageGallery images={item.images} onOpen={onOpenImage} important={item.important} />
    </div>
  );
}

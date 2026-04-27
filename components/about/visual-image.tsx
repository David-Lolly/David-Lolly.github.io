import React from "react";
import { cn } from "@/lib/utils";

export interface ImageProps {
  src?: string;
  alt?: string;
  caption?: string;
  type?: string;
  label?: string;
}

export function VisualImage({
  item,
  onOpen,
  className = "",
  aspect = "aspect-[4/3]",
}: {
  item: ImageProps;
  onOpen: (item: ImageProps) => void;
  className?: string;
  aspect?: string;
}) {
  if (!item || !item.src) return null; // 不显示没图的占位符

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn("group flex h-full w-full flex-col items-start text-left", className)}
      aria-label={`查看图片：${item.alt || item.caption || "图片"}`}
    >
      <div className={cn("relative w-full overflow-hidden rounded-2xl shrink-0", aspect)}>
        <img
          src={item.src}
          alt={item.alt || item.caption || "经历图片"}
          className="absolute inset-0 h-full w-full rounded-2xl border border-stone-900/10 bg-[#fffdf3] object-contain transition duration-300 group-hover:scale-[1.025]"
        />
      </div>
      {item.caption && (
        <div className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-stone-500 w-full">
          {item.caption}
        </div>
      )}
    </button>
  );
}

export function ImageGallery({ images = [], onOpen, important = false }: { images?: ImageProps[]; onOpen: (item: ImageProps) => void; important?: boolean }) {
  const validImages = images.filter((img) => img.src);
  if (!validImages.length) return null;

  return (
    <div className={cn("mt-5 grid gap-3", important ? "md:grid-cols-2" : "sm:grid-cols-2 md:grid-cols-3")}>
      {validImages.map((image, index) => (
        <VisualImage
          key={`${image.src}-${index}`}
          item={image}
          onOpen={onOpen}
          aspect={important && index === 0 ? "aspect-[4/3]" : "aspect-[4/3]"}
        />
      ))}
    </div>
  );
}

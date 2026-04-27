import React, { useEffect } from "react";
import { ImageProps } from "./visual-image";

export function ImageModal({ image, onClose }: { image: ImageProps | null; onClose: () => void }) {
  useEffect(() => {
    if (image) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [image]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-[#fffbe6] p-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4 px-2 pt-1">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.25em] text-[#8b6f47]">
              Image Preview
            </div>
            <h3 className="mt-1 font-serif text-2xl font-black text-stone-950">
              {image.alt || image.label || "图片预览"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-bold text-[#fff8d6] transition hover:scale-105"
          >
            关闭
          </button>
        </div>

        <div className="max-h-[72vh] overflow-hidden rounded-2xl border border-stone-900/10 bg-white">
          <img
            src={image.src}
            alt={image.alt || "图片预览"}
            className="max-h-[72vh] w-full object-contain"
          />
        </div>
        {image.caption && (
          <p className="px-2 pt-3 text-sm leading-7 text-stone-600">{image.caption}</p>
        )}
      </div>
    </div>
  );
}

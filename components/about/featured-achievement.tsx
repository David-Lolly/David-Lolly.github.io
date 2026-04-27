import React from "react";
import { Icon } from "./icons";
import { ImageProps, VisualImage } from "./visual-image";

interface FeaturedAchievementProps {
  timeline: {
    id: string;
    dateText: string;
    title: string;
    desc: string;
    featured: boolean;
    images: ImageProps[];
  }[];
  featuredAchievementId?: string;
  onOpenImage: (img: ImageProps) => void;
}

export function FeaturedAchievement({ timeline, featuredAchievementId, onOpenImage }: FeaturedAchievementProps) {
  const item = timeline.find((entry) =>
    featuredAchievementId ? entry.id === featuredAchievementId : entry.featured
  );

  if (!item) return null;

  const validImages = (item.images || []).filter(img => img.src).slice(0, 2);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#242015] p-6 text-[#fff8d6] shadow-[0_20px_70px_rgba(36,32,21,0.25)] md:p-8">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#c7a75a]/25 blur-3xl" />
      <div className="relative grid gap-7 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#fff8d6]/15 bg-[#fff8d6]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em]">
            <Icon name="trophy" className="h-4 w-4" />
            Featured Achievement
          </div>
          <div className="text-sm font-black text-[#d9c481]">{item.dateText}</div>
          <h3 className="mt-3 font-serif text-3xl font-black leading-tight md:text-4xl">{item.title}</h3>
          <p className="mt-4 text-base leading-8 text-[#f7edc0]/80">{item.desc}</p>
        </div>
        {validImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {validImages.map((image, index) => (
              <VisualImage
                key={`${image.src}-${index}`}
                item={image}
                onOpen={onOpenImage}
                aspect="aspect-[4/3]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

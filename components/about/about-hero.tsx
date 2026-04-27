import React from "react";
import { PaperCard, ContactLinks } from "./shared";
import { VisualImage, ImageProps } from "./visual-image";
import { Icon } from "./icons";
import { cn } from "@/lib/utils";

interface AboutHeroProps {
  profile: {
    name: string;
    title: string;
    intro: string;
    email: string;
    github: string;
    website: string;
    avatar?: ImageProps;
  };
  metrics: { label: string; value: string; desc: string }[];
  focus: string[];
  onOpenImage: (img: ImageProps) => void;
}

function MetricGrid({ metrics, compact = false }: { metrics: AboutHeroProps["metrics"]; compact?: boolean }) {
  if (!metrics || metrics.length === 0) return null;
  return (
    <div className={cn("grid gap-4", compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
      {metrics.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-stone-900/10 bg-white/45 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-white/70"
        >
          <div
            className="font-serif font-black leading-none tracking-[-0.04em] text-stone-950"
            style={{ fontSize: "4.5rem", fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            {item.value}
          </div>
          <div className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[#8b6f47]">
            {item.label}
          </div>
          <div className="mt-1 text-sm leading-6 text-stone-500">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

export function AboutHero({ profile, metrics, focus, onOpenImage }: AboutHeroProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
      <PaperCard className="relative overflow-hidden p-8 md:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#e0ca83]/35 blur-3xl" />
        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/45 px-3 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-[#8b6f47]">
            <Icon name="sparkles" className="h-4 w-4" />
            Vintage Resume Timeline
          </div>
          <h1 className="font-serif text-5xl font-black leading-tight text-stone-950 md:text-7xl">
            关于我
          </h1>
          <p className="mt-5 max-w-3xl text-xl font-bold leading-9 text-stone-800">
            你好，我是{profile.name}。{profile.title}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-600">{profile.intro}</p>
          <div className="mt-8">
            <ContactLinks profile={profile} />
          </div>
        </div>
      </PaperCard>

      <PaperCard className="flex flex-col justify-between gap-6 p-8">
        <div className="grid gap-5 sm:grid-cols-[0.78fr_1fr] lg:grid-cols-1">
          {profile.avatar && profile.avatar.src && (
            <div>
              <VisualImage item={profile.avatar} onOpen={onOpenImage} aspect="aspect-[4/5]" />
            </div>
          )}
          <div>
            <div className="text-sm font-black uppercase tracking-[0.24em] text-[#8b6f47]">
              Current Focus
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {focus.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-stone-900/10 bg-white/50 px-3 py-1.5 text-sm font-bold text-stone-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <MetricGrid metrics={metrics} compact />
      </PaperCard>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { AboutHero } from "./about-hero";
import { FeaturedAchievement } from "./featured-achievement";
import { AboutTimeline } from "./about-timeline";
import { AboutProjects } from "./about-projects";
import { ImageModal } from "./image-preview-modal";
import { ImageProps } from "./visual-image";
import { Icon } from "./icons";

interface AboutTimelineClientProps {
  data: any; // We can type this strictly or rely on generated velite types.
}

export function AboutTimelineClient({ data }: AboutTimelineClientProps) {
  const [modalImage, setModalImage] = useState<ImageProps | null>(null);

  if (!data) return null;

  return (
    <div
      className="min-h-screen bg-[#f6f1cf] text-stone-900 pb-16"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(218, 196, 126, 0.28), transparent 28%), radial-gradient(circle at 85% 0%, rgba(255,255,255,0.62), transparent 26%), linear-gradient(rgba(91, 75, 42, 0.038) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 28px 28px",
      }}
    >
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-900 transition">
          <Icon name="arrowLeft" className="h-4 w-4" />
          返回首页
        </a>

        <div className="space-y-16">
          {/* Hero Section */}
          <AboutHero
            profile={data.profile}
            metrics={data.metrics}
            focus={data.focus}
            onOpenImage={setModalImage}
          />

          {/* Featured Achievement */}
          <section>
            <FeaturedAchievement
              timeline={data.timeline}
              featuredAchievementId={data.featuredAchievementId}
              onOpenImage={setModalImage}
            />
          </section>

          {/* The Journey Timeline */}
          <section>
            <AboutTimeline timeline={data.timeline} onOpenImage={setModalImage} />
          </section>

          {/* Open Source Projects */}
          <section>
            <AboutProjects projects={data.projects} onOpenImage={setModalImage} />
          </section>
        </div>
      </main>

      <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
    </div>
  );
}

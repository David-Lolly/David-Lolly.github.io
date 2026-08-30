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
    <div className="about-page-shell min-h-screen bg-[#f6f1cf] text-stone-900 pb-16 dark:bg-black dark:text-foreground">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12 md:py-16">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-stone-600 transition hover:text-stone-900 dark:text-muted-foreground dark:hover:text-foreground">
          <Icon name="arrowLeft" className="h-4 w-4" />
          返回首页
        </a>

        <div className="space-y-12 sm:space-y-16">
          {/* Hero Section */}
          <AboutHero
            profile={data.profile}
            metrics={data.metrics}
            focus={data.focus}
            currentStatus={data.timeline?.[0]}
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

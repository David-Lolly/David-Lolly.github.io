import React from "react";
import { PaperCard, SectionTitle } from "./shared";
import { Icon } from "./icons";
import { ImageProps, VisualImage } from "./visual-image";

interface ProjectItem {
  id: string;
  name: string;
  stars: number;
  desc: string;
  tags: string[];
  image?: ImageProps;
}

interface AboutProjectsProps {
  projects: ProjectItem[];
  onOpenImage: (img: ImageProps) => void;
}

export function AboutProjects({ projects, onOpenImage }: AboutProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <>
      <SectionTitle
        eyebrow="Projects"
        title="代表项目"
        desc="展示最具识别度的项目和功能截图。"
      />
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <PaperCard key={project.id} className="transition duration-200 hover:-translate-y-1">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#8b6f47]">
                  0{index + 1} / Open Source Project
                </div>
                <h3 className="mt-2 font-serif text-3xl font-black text-stone-950">
                  {project.name}
                </h3>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-stone-900 px-3 py-1 text-sm font-black text-[#fff8d6]">
                  <Icon name="star" className="h-4 w-4" />
                  {project.stars} Stars
                </div>
              </div>
              <Icon name="code" className="h-9 w-9 text-[#8b6f47]" />
            </div>
            {project.image && project.image.src && (
              <VisualImage item={project.image} onOpen={onOpenImage} aspect="aspect-video" />
            )}
            <p className="mt-4 text-sm leading-7 text-stone-600">{project.desc}</p>
            {project.tags && project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-900/10 bg-white/55 px-3 py-1 text-xs font-bold text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </PaperCard>
        ))}
      </div>
    </>
  );
}

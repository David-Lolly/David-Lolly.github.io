import React from "react";
import { Github } from "lucide-react";
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
      <div className="grid items-start gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <PaperCard key={project.id} className="h-fit transition duration-200 hover:-translate-y-1">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#8b6f47] dark:text-amber-300">
                  0{index + 1} / Open Source Project
                </div>
                <h3 className="mt-2 font-heading text-3xl font-black text-stone-950 dark:text-foreground">
                  {project.name}
                </h3>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-stone-900 px-3 py-1 text-sm font-black text-[#fff8d6] dark:bg-muted dark:text-foreground">
                  <Icon name="star" className="h-4 w-4" />
                  {project.stars} Stars
                </div>
              </div>
              <Github className="h-9 w-9 text-[#8b6f47] dark:text-amber-300" strokeWidth={1.8} />
            </div>
            {project.image && project.image.src && (
              <VisualImage
                item={project.image}
                onOpen={onOpenImage}
                aspect="aspect-video"
                className="h-auto"
              />
            )}
            <p className="mt-4 text-sm leading-7 text-stone-600 dark:text-muted-foreground">{project.desc}</p>
            {project.tags && project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-[#3f6f53]/18 bg-[#3f6f53]/10 px-3 py-1 text-xs font-bold text-[#315d43] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f6f53] dark:bg-emerald-300" />
                    <span className="truncate">{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </PaperCard>
        ))}
      </div>
    </>
  );
}

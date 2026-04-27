import React, { useMemo } from "react";
import { TimelineItem, TimelineNode } from "./timeline-node";
import { ImageProps } from "./visual-image";
import { SectionTitle } from "./shared";

interface AboutTimelineProps {
  timeline: TimelineItem[];
  onOpenImage: (img: ImageProps) => void;
}

function sortTimelineDesc(items: TimelineItem[]) {
  return [...items].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

function groupByYear(items: TimelineItem[]) {
  return sortTimelineDesc(items).reduce((acc, item) => {
    const group = item.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, TimelineItem[]>);
}

function compareTimelineGroupsDesc(a: string, b: string) {
  if (a === "至今") return -1;
  if (b === "至今") return 1;
  if (a === "其他") return 1;
  if (b === "其他") return -1;
  return Number(b) - Number(a);
}

export function AboutTimeline({ timeline, onOpenImage }: AboutTimelineProps) {
  const grouped = useMemo(() => groupByYear(timeline), [timeline]);
  const sortedGroups = Object.keys(grouped).sort(compareTimelineGroupsDesc);

  return (
    <>
      <SectionTitle
        eyebrow="Journey"
        title="成长历程"
        desc="高中毕业之后，我所做的一些事情以及获得的成就"
      />
      <div className="space-y-12">
        {sortedGroups.map((year) => (
          <section key={year} className="grid gap-6 md:grid-cols-[8rem_1fr]">
            <div>
              <div
                className="sticky top-40 text-5xl font-black leading-none tracking-[-0.06em] text-stone-900/20 md:text-right"
                style={{ fontFamily: "var(--font-numeric-serif)" }}
              >
                {year}
              </div>
            </div>
            <div className="relative space-y-5">
              <div className="absolute -left-[1.4rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-stone-900/15 md:block" />
              {grouped[year].map((item) => (
                <TimelineNode
                  key={`${item.id}-${item.dateText}`}
                  item={item}
                  onOpenImage={onOpenImage}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

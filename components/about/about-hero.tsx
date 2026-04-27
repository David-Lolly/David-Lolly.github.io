"use client";

import React from "react";
import { ImageProps } from "./visual-image";

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
  currentStatus?: {
    dateText?: string;
    title?: string;
    desc?: string;
  };
  onOpenImage: (img: ImageProps) => void;
}

function AvatarPanel({
  avatar,
  onOpenImage,
}: {
  avatar?: ImageProps;
  onOpenImage: (img: ImageProps) => void;
}) {
  if (!avatar?.src) return null;

  return (
    <div className="rounded-[1.55rem] border border-stone-900/10 bg-white/55 p-2 shadow-sm">
      <button
        type="button"
        onClick={() => onOpenImage(avatar)}
        className="group block w-full overflow-hidden rounded-[1.25rem] bg-[#fffdf3]/70"
        aria-label={avatar.alt || avatar.caption || "\u6253\u5f00\u4e2a\u4eba\u7167\u7247"}
      >
        <img
          src={avatar.src}
          alt={avatar.alt || avatar.caption || "\u4e2a\u4eba\u7167\u7247"}
          className="block h-auto w-full rounded-[1.25rem] transition duration-300 group-hover:scale-[1.01]"
        />
      </button>
    </div>
  );
}

function getCurrentStatus(currentStatus?: AboutHeroProps["currentStatus"]) {
  if (!currentStatus?.title && !currentStatus?.desc) return null;

  const statusTitle = currentStatus.title?.replace("\u96c6\u56e2\u80a1\u4efd\u6709\u9650\u516c\u53f8", "").trim();
  const statusSummary = currentStatus.desc
    ?.replace(/^\u4e3b\u8981\u4e1a\u52a1[:\uff1a]\s*/, "")
    .split(/[\u3002.]/)[0]
    ?.trim();
  const statusDesc =
    statusSummary === "\u7f51\u7edc\u5b89\u5168" ? "\u7f51\u7edc\u5b89\u5168\u65b9\u5411\u7814\u53d1" : statusSummary;

  return {
    dateText: currentStatus.dateText,
    desc: statusDesc,
    title: statusTitle,
  };
}

function StatusPill({ currentStatus }: { currentStatus?: AboutHeroProps["currentStatus"] }) {
  const status = getCurrentStatus(currentStatus);
  if (!status?.title) return null;

  return (
    <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-[#3f6f53]/18 bg-[#3f6f53]/10 px-4 py-2 text-sm font-black text-[#315d43] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] md:text-base">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#3f6f53]" />
      <span className="truncate">{status.title}</span>
    </div>
  );
}

function StatusMeta({ currentStatus }: { currentStatus?: AboutHeroProps["currentStatus"] }) {
  const status = getCurrentStatus(currentStatus);
  if (!status?.dateText && !status?.desc) return null;

  return (
    <p className="mt-4 text-sm font-black leading-6 text-stone-500 md:text-base">
      {[status.dateText, status.desc].filter(Boolean).join(" · ")}
    </p>
  );
}

function FocusLine({ focus }: { focus: string[] }) {
  if (!focus?.length) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-bold text-stone-600">
      {focus.map((item, index) => (
        <React.Fragment key={item}>
          <span className={index === 0 ? "text-[#8b6f47]" : undefined}>{item}</span>
          {index < focus.length - 1 && <span className="text-stone-300">{"\u00b7"}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function MetricRow({ metrics }: { metrics: AboutHeroProps["metrics"] }) {
  if (!metrics?.length) return null;

  return (
    <div className="mt-6 border-t border-stone-900/10 pt-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col items-center text-center">
            <div
              className="text-3xl font-black leading-none tracking-[-0.045em] text-stone-950"
              style={{ fontFamily: "var(--font-numeric-serif)" }}
            >
              {item.value}
            </div>
            <div className="mt-2 truncate text-[10px] font-black uppercase tracking-[0.18em] text-[#8b6f47]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutHero({ profile, metrics, focus, currentStatus, onOpenImage }: AboutHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 p-4 shadow-[0_18px_55px_rgba(48,38,20,0.08)] backdrop-blur-xl md:p-5">
      <div className="relative grid gap-5 md:grid-cols-[16rem_1fr] md:items-start xl:grid-cols-[17.5rem_1fr]">
        <AvatarPanel avatar={profile.avatar} onOpenImage={onOpenImage} />

        <div className="rounded-[1.55rem] border border-white/55 bg-[#fffdf3]/58 p-5 shadow-sm backdrop-blur md:p-6 lg:px-8">
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8b6f47]">About</div>
            <div className="mt-4 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <h1 className="font-serif text-5xl font-black leading-none tracking-[-0.055em] text-stone-950 md:text-6xl">
                {profile.name}
              </h1>
              <StatusPill currentStatus={currentStatus} />
            </div>
            <StatusMeta currentStatus={currentStatus} />
            <p className="mt-6 max-w-4xl text-[15px] leading-8 text-stone-600">{profile.intro}</p>
            <FocusLine focus={focus} />
          </div>

          <MetricRow metrics={metrics} />
        </div>
      </div>
    </section>
  );
}

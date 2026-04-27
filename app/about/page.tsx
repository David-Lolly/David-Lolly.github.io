import { Header } from "@/components/header"
import { notFound } from "next/navigation"
import { about } from "#site/content"
import { AboutTimelineClient } from "@/components/about/about-timeline-client"

export const metadata = {
  title: "关于我",
  description: "个人经历、项目、竞赛与研发记录",
}

export default function AboutPage() {
  const data = about[0]

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <AboutTimelineClient data={data!} />
    </div>
  )
}


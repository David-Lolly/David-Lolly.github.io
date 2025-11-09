import { Header } from "@/components/header"
import { ProfileCard } from "@/components/profile-card"
import { FeaturedArticles } from "@/components/featured-articles"
import { LatestArticles } from "@/components/latest-articles"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Profile */}
          <aside className="lg:col-span-3">
            <ProfileCard />
          </aside>

          {/* Main content - Featured articles */}
          <section className="lg:col-span-6">
            <FeaturedArticles />
          </section>

          {/* Right sidebar - Latest articles */}
          <aside className="lg:col-span-3">
            <LatestArticles />
          </aside>
        </div>
      </main>
    </div>
  )
}

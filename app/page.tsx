import { Header } from "@/components/header"
import { ProfileCard } from "@/components/profile-card"
import { FeaturedArticles } from "@/components/featured-articles"
import { LatestArticles } from "@/components/latest-articles"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          {/* Left sidebar - Profile */}
          <aside className="order-2 lg:order-1 lg:col-span-3">
            <ProfileCard />
          </aside>

          {/* Main content - Featured articles */}
          <section className="order-1 lg:order-2 lg:col-span-6">
            <FeaturedArticles />
          </section>

          {/* Right sidebar - Latest articles */}
          <aside className="order-3 lg:col-span-3">
            <LatestArticles />
          </aside>
        </div>
      </main>
    </div>
  )
}

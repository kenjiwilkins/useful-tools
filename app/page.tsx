import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ToolCard } from '@/components/tool-card';
import { tools, CATEGORIES } from '@/lib/tools';
import Image from 'next/image';

// Entire landing page is statically generated at build time
export const dynamic = 'force-static';

export default function Home() {
  const categoriesWithTools = CATEGORIES.filter((cat) => tools.some((t) => t.category === cat));
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-8 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
          A toolbox for everyday tasks
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
          Fast, free, and runs entirely in your browser. No accounts, no ads, no nonsense — just
          useful tools at your fingertips.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            {tools.filter((t) => t.available).length} tools available
          </span>
          <span className="text-border">|</span>
          <span>{tools.filter((t) => !t.available).length} coming soon</span>
        </div>
      </section>

      {/* Tool Grid grouped by category */}
      <main className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        {categoriesWithTools.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category);
          return (
            <section key={category} className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {category}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

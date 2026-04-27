import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { tools, getToolBySlug } from "@/lib/tools";
import { Badge } from "@/components/ui/badge";
import { StringComparison } from "@/components/tools/string-comparison";

// ── SSG ───────────────────────────────────────────────────────────────────────

export const dynamic = "force-static";

export async function generateStaticParams() {
  return tools
    .filter((t) => t.available)
    .map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.title} — Toolbox`,
    description: tool.description,
  };
}

// ── Tool renderer ─────────────────────────────────────────────────────────────

function ToolRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case "string-comparison":
      return <StringComparison />;
    default:
      return (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          This tool is not yet implemented.
        </div>
      );
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || !tool.available) notFound();

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All tools
        </Link>
        <span>/</span>
        <span className="text-foreground">{tool.title}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            {tool.title}
          </h1>
          <Badge variant="secondary">{tool.category}</Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          {tool.description}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Tool UI */}
      <ToolRenderer slug={slug} />
    </div>
  );
}

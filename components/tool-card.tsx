import Link from "next/link";
import {
  GitCompare,
  AlignLeft,
  CaseSensitive,
  Lock,
  Link as LinkIcon,
  Braces,
  TerminalSquare,
  Binary,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/tools";

const iconMap: Record<string, React.ElementType> = {
  GitCompare,
  AlignLeft,
  CaseSensitive,
  Lock,
  Link: LinkIcon,
  Braces,
  TerminalSquare,
  Binary,
};

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon] ?? Braces;

  const card = (
    <div
      className={`group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 ${
        tool.available
          ? "hover:border-primary/40 hover:shadow-md cursor-pointer"
          : "opacity-60 cursor-default"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        {!tool.available && (
          <Badge variant="outline" className="text-xs shrink-0">
            Coming soon
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-foreground leading-snug">
          {tool.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tool.description}
        </p>
      </div>
      <div className="mt-auto pt-1">
        <Badge variant="secondary" className="text-xs">
          {tool.category}
        </Badge>
      </div>
    </div>
  );

  if (!tool.available) return card;

  return <Link href={`/tools/${tool.slug}`}>{card}</Link>;
}

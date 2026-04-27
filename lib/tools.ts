export type ToolCategory = "Text" | "Numbers" | "Data" | "Encoding" | "Dev";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string; // lucide icon name
  available: boolean;
}

export const tools: Tool[] = [
  {
    slug: "string-comparison",
    title: "String Comparison",
    description:
      "Compare two strings side-by-side with diff highlighting, similarity scores, and multiple algorithm options.",
    category: "Text",
    icon: "GitCompare",
    available: true,
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs. Get reading time estimates.",
    category: "Text",
    icon: "AlignLeft",
    available: false,
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert text between camelCase, snake_case, PascalCase, kebab-case, and more.",
    category: "Text",
    icon: "CaseSensitive",
    available: false,
  },
  {
    slug: "base64",
    title: "Base64 Encode / Decode",
    description: "Encode or decode Base64 strings instantly in your browser.",
    category: "Encoding",
    icon: "Lock",
    available: false,
  },
  {
    slug: "url-encode",
    title: "URL Encode / Decode",
    description: "Percent-encode or decode URL strings for safe transmission.",
    category: "Encoding",
    icon: "Link",
    available: false,
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Prettify, minify, and validate JSON. Inspect nested structures at a glance.",
    category: "Data",
    icon: "Braces",
    available: false,
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Write and test regular expressions with live match highlighting and group capture.",
    category: "Dev",
    icon: "TerminalSquare",
    available: false,
  },
  {
    slug: "number-base",
    title: "Number Base Converter",
    description:
      "Convert integers between binary, octal, decimal, and hexadecimal.",
    category: "Numbers",
    icon: "Binary",
    available: false,
  },
];

export const CATEGORIES: ToolCategory[] = [
  "Text",
  "Numbers",
  "Data",
  "Encoding",
  "Dev",
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getAvailableTools(): Tool[] {
  return tools.filter((t) => t.available);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

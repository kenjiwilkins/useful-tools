'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';

// ── Algorithms ────────────────────────────────────────────────────────────────

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function levenshteinSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  const dist = levenshteinDistance(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/).filter(Boolean));
  const setB = new Set(b.split(/\s+/).filter(Boolean));
  if (setA.size === 0 && setB.size === 0) return 1;
  const intersection = new Set([...setA].filter((w) => setB.has(w)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 1 : intersection.size / union.size;
}

function lcsLength(a: string[], b: string[]): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function lcsSimilarity(a: string, b: string): number {
  const wordsA = a.split(/\s+/).filter(Boolean);
  const wordsB = b.split(/\s+/).filter(Boolean);
  if (wordsA.length === 0 && wordsB.length === 0) return 1;
  const lcs = lcsLength(wordsA, wordsB);
  return (2 * lcs) / (wordsA.length + wordsB.length);
}

// ── Diff ──────────────────────────────────────────────────────────────────────

type DiffToken = { text: string; type: 'equal' | 'added' | 'removed' };

function computeDiff(a: string, b: string): { left: DiffToken[]; right: DiffToken[] } {
  const wordsA = a.match(/(\S+|\s+)/g) ?? [];
  const wordsB = b.match(/(\S+|\s+)/g) ?? [];

  const m = wordsA.length;
  const n = wordsB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        wordsA[i - 1] === wordsB[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const left: DiffToken[] = [];
  const right: DiffToken[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      left.unshift({ text: wordsA[i - 1], type: 'equal' });
      right.unshift({ text: wordsB[j - 1], type: 'equal' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      right.unshift({ text: wordsB[j - 1], type: 'added' });
      j--;
    } else {
      left.unshift({ text: wordsA[i - 1], type: 'removed' });
      i--;
    }
  }

  return { left, right };
}

// ── Stat block ────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ── Diff panel ────────────────────────────────────────────────────────────────

function DiffPanel({ tokens, label }: { tokens: DiffToken[]; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="min-h-32 rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
        {tokens.length === 0 ? (
          <span className="text-muted-foreground italic">Empty</span>
        ) : (
          tokens.map((tok, idx) => {
            if (tok.type === 'equal') return <span key={idx}>{tok.text}</span>;
            if (tok.type === 'removed')
              return (
                <mark
                  key={idx}
                  className="rounded bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                >
                  {tok.text}
                </mark>
              );
            return (
              <mark
                key={idx}
                className="rounded bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              >
                {tok.text}
              </mark>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Algorithm = 'levenshtein' | 'jaccard' | 'lcs';

const ALGORITHMS: { value: Algorithm; label: string; description: string }[] = [
  {
    value: 'levenshtein',
    label: 'Levenshtein',
    description: 'Character-level edit distance',
  },
  {
    value: 'jaccard',
    label: 'Jaccard',
    description: 'Word-level set similarity',
  },
  {
    value: 'lcs',
    label: 'LCS',
    description: 'Longest common subsequence (word-level)',
  },
];

export function StringComparison() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('levenshtein');
  const [caseSensitive, setCaseSensitive] = useState(true);

  const normalize = (s: string) => (caseSensitive ? s : s.toLowerCase());

  const similarity = useMemo(() => {
    const a = normalize(textA);
    const b = normalize(textB);
    if (!a && !b) return null;
    switch (algorithm) {
      case 'levenshtein':
        return levenshteinSimilarity(a, b);
      case 'jaccard':
        return jaccardSimilarity(a, b);
      case 'lcs':
        return lcsSimilarity(a, b);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textA, textB, algorithm, caseSensitive]);

  const diff = useMemo(() => {
    const a = normalize(textA);
    const b = normalize(textB);
    if (!a && !b) return null;
    return computeDiff(a, b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textA, textB, caseSensitive]);

  const pct = similarity !== null ? `${(similarity * 100).toFixed(1)}%` : '—';

  const similarityColor =
    similarity === null
      ? 'bg-muted text-muted-foreground'
      : similarity >= 0.8
        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
        : similarity >= 0.5
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';

  const reset = () => {
    setTextA('');
    setTextB('');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Algorithm</Label>
          <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALGORITHMS.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  <span className="font-medium">{a.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{a.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pt-5">
          <Switch id="case-sensitive" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
          <Label htmlFor="case-sensitive" className="text-sm cursor-pointer">
            Case sensitive
          </Label>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          className="gap-1.5 flex items-center"
          style={{ paddingTop: undefined, marginTop: 'auto' }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="text-a" className="text-sm font-medium">
            Text A
          </Label>
          <Textarea
            id="text-a"
            placeholder="Paste or type the first string here…"
            className="min-h-40 resize-y font-mono text-sm"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
          />
          <span className="text-xs text-muted-foreground text-right">
            {textA.length} chars &middot; {textA.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="text-b" className="text-sm font-medium">
            Text B
          </Label>
          <Textarea
            id="text-b"
            placeholder="Paste or type the second string here…"
            className="min-h-40 resize-y font-mono text-sm"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
          />
          <span className="text-xs text-muted-foreground text-right">
            {textB.length} chars &middot; {textB.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          className={`col-span-2 sm:col-span-1 flex flex-col gap-0.5 rounded-lg border px-4 py-3 ${similarityColor}`}
        >
          <span className="text-xs opacity-75">Similarity</span>
          <span className="text-2xl font-bold">{pct}</span>
        </div>
        <StatCard label="Chars A" value={textA.length} />
        <StatCard label="Chars B" value={textB.length} />
        <StatCard
          label="Char delta"
          value={
            textA.length === 0 && textB.length === 0 ? '—' : Math.abs(textA.length - textB.length)
          }
        />
      </div>

      {/* Diff view */}
      {diff && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold">Diff view</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-0 text-xs">
                Removed from A
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-0 text-xs">
                Added in B
              </Badge>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <DiffPanel tokens={diff.left} label="Text A" />
            <DiffPanel tokens={diff.right} label="Text B" />
          </div>
        </div>
      )}

      {!textA && !textB && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
          <span className="text-sm">Enter text in both fields to see the comparison</span>
        </div>
      )}
    </div>
  );
}

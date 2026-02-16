'use client';

import { useState } from 'react';

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: do nothing (user can copy manually)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg bg-card px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:text-white"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}

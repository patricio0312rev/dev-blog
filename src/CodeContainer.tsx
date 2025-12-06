// src/CodeContainer.tsx
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeContainerProps {
  fileName?: string;
  codeToCopy: string;
  showCopyButton?: boolean;
  children: React.ReactNode;
}

export const CodeContainer: React.FC<CodeContainerProps> = ({
  fileName = "snippet.ts",
  codeToCopy,
  showCopyButton = true,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Failed to copy code", e);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-900 text-xs text-zinc-100 shadow-sm ring-1 ring-zinc-900/60 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="ml-3 text-[11px] text-zinc-500 truncate">
            {fileName}
          </span>
        </div>

        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300 transition-colors duration-150 hover:border-sky-500 hover:text-sky-300 dark:bg-zinc-950"
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="overflow-x-auto px-4 py-3">{children}</div>
    </div>
  );
};

import { ScanItem } from "@shared/api";
import { Link } from "react-router-dom";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export interface ScanItemCardProps {
  scan: ScanItem;
}

export default function ScanItemCard({ scan }: ScanItemCardProps) {
  const [copied, setCopied] = useState(false);

  const isUrl = (() => {
    try {
      new URL(scan.content);
      return true;
    } catch {
      return false;
    }
  })();

  const extractKeyId = (content: string): string | null => {
    try {
      const u = new URL(content);
      const parts = u.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && /key-[a-z0-9]+/i.test(last)) return last.toUpperCase();
    } catch {}
    const m = content.match(/KEY-[A-Z0-9]+/i);
    return m ? m[0].toUpperCase() : null;
  };

  const keyId = extractKeyId(scan.content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scan.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="group rounded-lg border bg-gradient-to-r from-background/50 to-background/80 p-3 hover:bg-accent/50 transition-all hover:border-primary/50 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground mb-1.5">
            {scan.created_at
              ? new Date(scan.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </div>
          {keyId ? (
            <Link
              to={`/verify/${encodeURIComponent(keyId)}`}
              className="text-sm font-mono font-semibold text-primary hover:underline break-all inline-flex items-center gap-1"
            >
              {keyId}
              <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          ) : isUrl ? (
            <a
              href={scan.content}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline break-all inline-flex items-center gap-1"
            >
              {new URL(scan.content).hostname}
              <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          ) : (
            <div className="text-sm break-all text-foreground">
              {scan.content}
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-1.5 rounded hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          title="Copy content"
        >
          <Copy
            className={`h-4 w-4 transition-colors ${copied ? "text-green-500" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

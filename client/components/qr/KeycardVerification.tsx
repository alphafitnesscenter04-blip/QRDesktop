import { KeycardItem } from "@shared/api";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export interface KeycardVerificationProps {
  verifying: boolean;
  keycard: KeycardItem | null;
  notFoundId: string | null;
}

export default function KeycardVerification({
  verifying,
  keycard,
  notFoundId,
}: KeycardVerificationProps) {
  const getStatusIcon = (status?: string | null) => {
    if (status === "active") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === "pending") return <Clock className="h-5 w-5 text-amber-500" />;
    if (status === "inactive") return <AlertCircle className="h-5 w-5 text-red-500" />;
    return null;
  };

  const getStatusColor = (status?: string | null) => {
    if (status === "active") return "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400";
    if (status === "pending") return "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400";
    if (status === "inactive") return "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400";
    return "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-400";
  };

  if (verifying) {
    return (
      <div className="space-y-4 rounded-lg border bg-gradient-to-br from-primary/5 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">Verifying...</div>
          <div className="h-2 w-32 animate-pulse rounded-full bg-primary/20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted"></div>
          <div className="h-2 w-1/2 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  if (keycard) {
    return (
      <div className="space-y-4 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link
              to={`/verify/${encodeURIComponent(keycard.unique_id)}`}
              className="text-lg font-bold text-primary hover:underline flex items-center gap-2"
            >
              {keycard.unique_id}
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </Link>
            <div className="text-xs text-muted-foreground">Keycard verified</div>
          </div>
          {keycard.is_vip && (
            <div className="flex items-center gap-1 rounded-full bg-amber-100/30 px-3 py-1 dark:bg-amber-900/30">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-400">VIP</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-background/50 p-3">
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <div className="flex items-center gap-2">
              {getStatusIcon(keycard.status)}
              <span className="text-sm font-semibold capitalize">
                {keycard.status ?? "unknown"}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-background/50 p-3">
            <div className="text-xs text-muted-foreground mb-1">Type</div>
            <div className="text-sm font-semibold capitalize">
              {keycard.type ?? "n/a"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Created</div>
            <div className="text-sm">
              {keycard.created_at
                ? new Date(keycard.created_at).toLocaleString()
                : "—"}
            </div>
          </div>
          {keycard.updated_at && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Updated</div>
              <div className="text-sm">
                {new Date(keycard.updated_at).toLocaleString()}
              </div>
            </div>
          )}
          {keycard.expires_at && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Expires</div>
              <div className="text-sm">
                {new Date(keycard.expires_at).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            to={`/verify/${encodeURIComponent(keycard.unique_id)}`}
            className="flex-1 rounded-lg bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    );
  }

  if (notFoundId) {
    return (
      <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="font-medium text-destructive">Not Found</div>
        </div>
        <div className="text-sm text-muted-foreground">
          No keycard matched <span className="font-mono font-semibold text-foreground">{notFoundId}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center">
      <div className="text-sm text-muted-foreground">
        Scan a QR code or paste a key ID to verify
      </div>
    </div>
  );
}

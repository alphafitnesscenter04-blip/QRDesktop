import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeycardLookupResponse, KeycardItem } from "@shared/api";
import { Badge } from "@/components/ui/badge";

export default function Verify() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [keycard, setKeycard] = useState<KeycardItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("No keycard ID provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/keycards/${encodeURIComponent(id)}`);
        const data = (await res.json()) as KeycardLookupResponse;
        if (data.found && data.item) {
          setKeycard(data.item);
        } else {
          setError(`Keycard not found: ${id}`);
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load keycard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="grid gap-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Keycard Verification</CardTitle>
          <CardDescription>Scan result details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}
          {error && <p className="text-destructive">{error}</p>}
          {keycard && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Unique ID</div>
                <div className="text-2xl font-bold font-mono">
                  {keycard.unique_id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge
                    className="mt-1"
                    variant={
                      keycard.status === "active" ? "default" : "secondary"
                    }
                  >
                    {keycard.status ?? "unknown"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="text-base font-medium">
                    {keycard.type ?? "n/a"}
                  </div>
                </div>
              </div>

              {keycard.is_vip && (
                <div className="rounded-lg bg-amber-100/20 border border-amber-300/30 p-3">
                  <div className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    ✨ VIP Keycard
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="text-sm">
                    {keycard.created_at
                      ? new Date(keycard.created_at).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Updated</div>
                  <div className="text-sm">
                    {keycard.updated_at
                      ? new Date(keycard.updated_at).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {keycard.expires_at && (
                <div>
                  <div className="text-sm text-muted-foreground">Expires</div>
                  <div className="text-sm">
                    {new Date(keycard.expires_at).toLocaleString()}
                  </div>
                </div>
              )}

              <div className="pt-4 text-xs text-muted-foreground">
                <div>ID: {keycard.id}</div>
                {keycard.user_id && <div>User: {keycard.user_id}</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

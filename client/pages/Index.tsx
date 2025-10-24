import { useEffect, useMemo, useState } from "react";
import Scanner from "@/components/qr/Scanner";
import KeycardVerification from "@/components/qr/KeycardVerification";
import ScanItemCard from "@/components/qr/ScanItemCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ListScansResponse,
  CreateScanResponse,
  ScanItem,
  KeycardLookupResponse,
  KeycardItem,
} from "@shared/api";
import { toast } from "sonner";

export default function Index() {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [last, setLast] = useState<string>("");
  const [manual, setManual] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [keycard, setKeycard] = useState<KeycardItem | null>(null);
  const [notFoundId, setNotFoundId] = useState<string | null>(null);

  useEffect(() => {
    void loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const res = await fetch("/api/scans");
      const data = (await res.json()) as Partial<ListScansResponse> | any;
      const items = Array.isArray(data?.items) ? data.items : [];
      setScans(items);
    } catch (err) {
      console.error(err);
      setScans([]);
    }
  };

  const extractUniqueId = (raw: string): string | null => {
    if (!raw) return null;
    try {
      const u = new URL(raw);
      const parts = u.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && /key-[a-z0-9]+/i.test(last)) return last.toUpperCase();
    } catch {}
    const m = raw.match(/KEY-[A-Z0-9]+/i);
    if (m) return m[0].toUpperCase();
    return raw.startsWith("KEY-") ? raw.toUpperCase() : null;
  };

  const verifyKeycard = async (candidate: string) => {
    setVerifying(true);
    setKeycard(null);
    setNotFoundId(null);
    try {
      const res = await fetch(`/api/keycards/${encodeURIComponent(candidate)}`);
      const data = (await res.json()) as KeycardLookupResponse;
      if (data.found && data.item) setKeycard(data.item);
      else setNotFoundId(candidate);
    } catch (e) {
      setNotFoundId(candidate);
    } finally {
      setVerifying(false);
    }
  };

  const persistScan = async (content: string) => {
    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          meta: { userAgent: navigator.userAgent },
        }),
      });
      const data = (await res.json()) as Partial<CreateScanResponse> | any;
      const item: ScanItem = data?.item ?? {
        content,
        meta: { fallback: true },
        created_at: new Date().toISOString(),
      };
      setLast(item.content);
      setScans((prev) => [item, ...prev].slice(0, 20));
      if (data?.saved) toast.success("Saved to Supabase");
      else
        toast.message(data?.message ?? "Captured", {
          description: "Data not persisted",
        });
    } catch (err: any) {
      toast.error("Failed to save scan", { description: err?.message });
      setLast(content);
      setScans((prev) => [
        {
          content,
          meta: { ephemeral: true },
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const handleDetected = async (text: string) => {
    await persistScan(text);
    const id = extractUniqueId(text);
    if (id) await verifyKeycard(id);
  };

  const lastPreview = useMemo(() => {
    if (!last) return null;
    try {
      const url = new URL(last);
      return (
        <a
          href={url.toString()}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline break-all"
        >
          {url.toString()}
        </a>
      );
    } catch {
      return <span className="break-all">{last}</span>;
    }
  }, [last]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan a QR code</CardTitle>
            <CardDescription>
              Use your webcam to scan. Works great on desktop webcams.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Scanner onDetected={handleDetected} />
            <div className="flex items-center gap-2">
              <Input
                placeholder="Or paste QR content here"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (manual.trim()) {
                    persistScan(manual.trim());
                    const id = extractUniqueId(manual.trim());
                    if (id) verifyKeycard(id);
                  }
                }}
              >
                Add
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  try {
                    const t = await navigator.clipboard.readText();
                    setManual(t);
                    toast.success("Pasted from clipboard");
                  } catch {
                    toast.error("Clipboard read failed");
                  }
                }}
              >
                Paste
              </Button>
            </div>
            {last && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">Last scan</div>
                <div className="mt-1 text-base">{lastPreview}</div>
              </div>
            )}

            <KeycardVerification
              verifying={verifying}
              keycard={keycard}
              notFoundId={notFoundId}
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent scans</CardTitle>
            <CardDescription>Latest 20 items</CardDescription>
          </CardHeader>
          <CardContent>
            {scans.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No scans yet. Try scanning a QR code or add one manually.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {scans.map((s) => (
                  <ScanItemCard
                    key={(s.id ?? "") + (s.created_at ?? "")}
                    scan={s}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

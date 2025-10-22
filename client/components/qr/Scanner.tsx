import { Scanner as QrScanner } from "@yudiel/react-qr-scanner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ScannerProps {
  onDetected: (text: string) => void;
}

export default function Scanner({ onDetected }: ScannerProps) {
  const [enabled, setEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const lastValueRef = useRef<string>("");

  const constraints = useMemo<MediaTrackConstraints>(() => ({
    ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode }),
    width: { ideal: 1280 },
    height: { ideal: 720 },
  }), [deviceId, facingMode]);

  useEffect(() => {
    const load = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const vids = list.filter((d) => d.kind === "videoinput");
        setDevices(vids);
        if (!deviceId && vids.length) setDeviceId(vids[0].deviceId);
      } catch (e) {
        // ignore
      }
    };
    load();
    navigator.mediaDevices?.addEventListener?.("devicechange", load);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", load);
  }, [deviceId]);

  const handleScan = useCallback((result: any) => {
    let value: string | null = null;
    if (!result) return;
    if (Array.isArray(result)) {
      // prefer rawValue if available
      const first = result[0];
      value = (first?.rawValue ?? first?.content ?? String(first ?? "")).toString();
    } else if (typeof result === "string") {
      value = result;
    } else if (typeof result?.rawValue === "string") {
      value = result.rawValue;
    } else if (typeof result?.content === "string") {
      value = result.content;
    }
    if (!value || value === lastValueRef.current) return;
    lastValueRef.current = value;
    onDetected(value);
  }, [onDetected]);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl border bg-card">
        <div className="absolute left-3 top-3 z-10">
          <Select value={deviceId ?? undefined} onValueChange={(v) => setDeviceId(v)} disabled={devices.length === 0}>
            <SelectTrigger className="w-56 bg-background/80 backdrop-blur">
              <SelectValue placeholder={devices.length ? "Select camera" : "No cameras"} />
            </SelectTrigger>
            <SelectContent>
              {devices.length === 0 ? (
                <SelectItem value="no-cameras" disabled>No cameras</SelectItem>
              ) : (
                devices.map((d, i) => (
                  <SelectItem key={d.deviceId || i} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <QrScanner
          onScan={handleScan}
          onError={(e: any) => {
            const msg = e?.name === "NotAllowedError" ? "Camera permission denied. Please allow access and reload." : (e?.message ?? "Camera error");
            setError(msg);
          }}
          constraints={constraints}
          scanDelay={300}
          paused={!enabled}
          styles={{ container: { width: "100%" }, video: { objectFit: "cover", width: "100%", aspectRatio: "16/9" } } as any}
        />
        {!enabled && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 text-muted-foreground">
            Camera paused
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFacingMode((m) => m === "user" ? "environment" : "user")}>Flip</Button>
          <Button variant="default" size="sm" onClick={() => setEnabled((v) => !v)}>{enabled ? "Pause" : "Resume"}</Button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}

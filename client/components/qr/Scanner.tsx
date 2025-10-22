import { QrScanner } from "@yudiel/react-qr-scanner";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export interface ScannerProps {
  onDetected: (text: string) => void;
}

export default function Scanner({ onDetected }: ScannerProps) {
  const [enabled, setEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const lastValueRef = useRef<string>("");

  const constraints = useMemo(() => ({
    facingMode,
    // prefer HD for desktop webcams
    width: { ideal: 1280 },
    height: { ideal: 720 },
  }), [facingMode]);

  const handleDecode = useCallback((result: string) => {
    if (!result || result === lastValueRef.current) return;
    lastValueRef.current = result;
    onDetected(result);
  }, [onDetected]);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl border bg-card">
        {enabled ? (
          <QrScanner
            onDecode={handleDecode}
            onError={(e) => setError(e?.message ?? "Camera error")}
            constraints={{ video: constraints }}
            scanDelay={300}
            // fancier styles
            containerStyle={{ width: "100%" }}
            videoStyle={{ objectFit: "cover", width: "100%", aspectRatio: "16/9" }}
            viewFinder
          />
        ) : (
          <div className="aspect-video grid place-items-center text-muted-foreground">
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

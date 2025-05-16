import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Button, Slider } from "@mui/material";
import { useRef, useState } from "react";
import Cookie from "js-cookie";
import { PREV_ZOOM_COOKIE } from "@/lib/cookies/cookies";

const config = { fps: 10, qrbox: 250 };
const qrCodeRegionId = "qr-reader";

export default function QrScanner({
  onScan,
}: {
  onScan: (decodedText: string) => void;
}) {
  const [active, setActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [zoomCapabilities, setZoomCapabilities] = useState<{
    max: number;
    min: number;
  } | null>(null);

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div
        id={qrCodeRegionId}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: active ? "block" : "none",
        }}
      />
      {active ? (
        <>
          {zoomCapabilities && (
            <Slider
              valueLabelDisplay="off"
              min={zoomCapabilities.min}
              max={zoomCapabilities.max}
              value={zoom}
              sx={{ width: "250px" }}
              step={0.1}
              onChange={(_, newZoom) => {
                if (
                  scannerRef.current &&
                  scannerRef.current.getState() ===
                    Html5QrcodeScannerState.SCANNING
                ) {
                  setZoom(newZoom as number);
                  scannerRef.current.applyVideoConstraints({
                    focusMode: "continuous",
                    // @ts-expect-error zoom is valid prop
                    advanced: [{ zoom: newZoom }],
                  });
                  Cookie.set(PREV_ZOOM_COOKIE, newZoom.toString());
                }
              }}
            />
          )}
          <Button
            onClick={() => {
              setActive(false);
              scannerRef.current
                ?.stop()
                .then(() => scannerRef.current?.clear());
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          variant="outlined"
          onClick={() => {
            setActive(true);
            try {
              scannerRef.current = new Html5Qrcode(qrCodeRegionId);

              scannerRef.current
                .start(
                  { facingMode: "environment" },
                  config,
                  (text) => {
                    setActive(false);
                    const code = text.split("=")[1];
                    onScan(code);
                    scannerRef.current
                      ?.stop()
                      .then(() => scannerRef.current?.clear());
                  },
                  () => {},
                )
                .then(() => {
                  console.log(
                    scannerRef.current?.getState() ===
                      Html5QrcodeScannerState.SCANNING,
                  );
                  if (scannerRef.current === null) return;
                  const capabilities =
                    scannerRef.current.getRunningTrackCapabilities();
                  if (Object.hasOwn(capabilities, "zoom")) {
                    // @ts-expect-error zoom has been confirmed to exist
                    setZoomCapabilities({ ...capabilities.zoom });

                    // use saved zoom from previous usages
                    const prevZoom = Number(Cookie.get(PREV_ZOOM_COOKIE));
                    if (!isNaN(prevZoom) && prevZoom > 0) {
                      console.log("prevZoom", prevZoom);
                      setZoom(prevZoom);
                      scannerRef.current.applyVideoConstraints({
                        focusMode: "continuous",
                        // @ts-expect-error zoom is valid prop
                        advanced: [{ zoom: prevZoom }],
                      });
                    }
                  }
                })
                .catch((e) => {
                  console.log("error", e);
                  setActive(false);
                });
            } catch (e) {
              console.log("error scanning", e);
            }
          }}
        >
          Scan
          <QrCodeScannerIcon />
        </Button>
      )}
    </div>
  );
}

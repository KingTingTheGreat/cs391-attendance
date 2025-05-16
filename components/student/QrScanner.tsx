import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Button, Slider } from "@mui/material";
import { useRef, useState } from "react";

const config = { fps: 10, qrbox: 250 };
const qrCodeRegionId = "qr-reader";

export default function QrScanner({
  onScan,
}: {
  onScan: (decodedText: string) => void;
}) {
  const [active, setActive] = useState(false);
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
              defaultValue={1}
              sx={{ width: "250px" }}
              step={0.1}
              onChange={(_, zoom) => {
                if (
                  scannerRef.current &&
                  scannerRef.current.getState() ===
                    Html5QrcodeScannerState.SCANNING
                ) {
                  scannerRef.current.applyVideoConstraints({
                    focusMode: "continuous",
                    // @ts-expect-error zoom is valid prop
                    advanced: [{ zoom }],
                  });
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
                    const newZoom = {
                      // @ts-expect-error zoom has been confirmed to exist
                      ...capabilities.zoom,
                    };
                    setZoomCapabilities(newZoom);
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

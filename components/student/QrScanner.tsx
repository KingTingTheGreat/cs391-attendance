import { Html5Qrcode } from "html5-qrcode";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Button } from "@mui/material";
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

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px" }} />
      {active ? (
        <Button
          onClick={() => {
            setActive(false);
            scannerRef.current?.stop().then(() => scannerRef.current?.clear());
          }}
        >
          Cancel
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={() => {
            setActive(true);
            try {
              scannerRef.current = new Html5Qrcode(qrCodeRegionId);

              scannerRef.current.start(
                { facingMode: "environment" },
                config,
                (text) => {
                  console.log("success", text);
                  setActive(false);
                  const code = text.split("=")[1];
                  onScan(code);
                  scannerRef.current
                    ?.stop()
                    .then(() => scannerRef.current?.clear());
                },
                () => {},
              );
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

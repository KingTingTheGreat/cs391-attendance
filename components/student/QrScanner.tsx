import { Html5Qrcode } from "html5-qrcode";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Button } from "@mui/material";
import { useState } from "react";

const config = { fps: 10, qrbox: 250 };
const qrCodeRegionId = "qr-reader";

export default function QrScanner({
  onScan,
}: {
  onScan: (decodedText: string) => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px" }} />
      {active ? (
        <Button onClick={() => setActive(false)}>Cancel</Button>
      ) : (
        <Button
          variant="outlined"
          onClick={() => {
            setActive(true);
            try {
              const scanner = new Html5Qrcode(qrCodeRegionId);

              scanner.start(
                { facingMode: "environment" },
                config,
                (text) => {
                  console.log("success", text);
                  setActive(false);
                  const code = text.split("=")[1];
                  onScan(code);
                  scanner.stop();
                  scanner.clear();
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

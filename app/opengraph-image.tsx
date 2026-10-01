import { ImageResponse } from "next/og";

export const alt = "Evently · Discover and host great events";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          color: "white",
          background: "linear-gradient(135deg, #1c1917, #57534e)",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>Evently</div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.85 }}>Discover, register for and host great events.</div>
      </div>
    ),
    size,
  );
}

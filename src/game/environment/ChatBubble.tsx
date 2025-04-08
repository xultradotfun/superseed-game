import { Html } from "@react-three/drei";

export interface ChatBubbleProps {
  message: string;
  visible: boolean;
  position?: [number, number, number];
  scale?: [number, number, number];
}

export function ChatBubble({
  message,
  visible,
  position,
  scale,
}: ChatBubbleProps) {
  if (!visible) return null;

  return (
    <Html
      position={position}
      scale={scale}
      center
      style={{
        background: "white",
        padding: "8px 12px",
        borderRadius: "12px",
        transform: "translate(-50%, -100%)",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        color: "#000000",
        fontWeight: "500",
      }}
    >
      {message}
    </Html>
  );
}

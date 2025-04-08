import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
  message: string;
  visible: boolean;
}

export function ChatBubble({ message, visible }: ChatBubbleProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (visible) {
      setOpacity(1);
      const timer = setTimeout(() => {
        setOpacity(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Html position={[0, 1.5, 0]} center>
      <div
        style={{
          opacity,
          transition: "opacity 0.3s ease-in-out",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "12px 16px",
          borderRadius: "16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          maxWidth: "300px",
          textAlign: "center",
          transform: "scale(1)",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
          pointerEvents: "none",
          width: "max-content",
          minWidth: "200px",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        {message}
      </div>
    </Html>
  );
}

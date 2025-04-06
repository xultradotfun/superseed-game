"use client";

import { useEffect, useState } from "react";

export function MobileWarning() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      window.innerWidth <= 768;

    setIsVisible(isMobile);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/95 p-4">
      <div className="bg-gradient-to-b from-cyan-950/90 to-slate-950/90 p-6 rounded-2xl border border-cyan-500/30 shadow-2xl w-full max-w-md text-center">
        <div className="text-4xl mb-4">🖥️</div>
        <h2 className="text-xl font-bold text-cyan-400 mb-3">
          Please Use Desktop
        </h2>
        <p className="text-gray-200 mb-4">
          The Superseed Garden requires a desktop browser for mouse and keyboard
          controls.
        </p>
        <div className="text-sm text-gray-400">
          Made by{" "}
          <a
            href="https://twitter.com/0x_ultra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1DA1F2] hover:underline"
          >
            0x_ultra
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({ children, onClose, maxWidth = "2xl" }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`bg-gradient-to-b from-cyan-950/90 to-slate-950/90 rounded-2xl border border-cyan-500/30 shadow-2xl w-full ${maxWidthClasses[maxWidth]} relative`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-8 [scrollbar-width:thin] [scrollbar-color:rgba(6,182,212,0.2)_transparent] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-500/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-cyan-500/30">
          {children}
        </div>
      </div>
    </div>
  );
}

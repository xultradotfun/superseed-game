"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface VictoryLink {
  text: string;
  url: string;
  description: string;
}

interface VictoryModalProps {
  title: string;
  message: string;
  links: VictoryLink[];
}

export function VictoryModal() {
  const [modalProps, setModalProps] = useState<VictoryModalProps | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleVictoryModal = (event: CustomEvent<VictoryModalProps>) => {
      setModalProps(event.detail);
      setIsVisible(true);
    };

    window.addEventListener(
      "showVictoryModal",
      handleVictoryModal as EventListener
    );
    return () => {
      window.removeEventListener(
        "showVictoryModal",
        handleVictoryModal as EventListener
      );
    };
  }, []);

  const handleClose = () => {
    gsap.to("#victory-modal", {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
        window.dispatchEvent(new Event("closeVictoryModal"));
      },
    });
  };

  useEffect(() => {
    if (isVisible && modalProps) {
      // Animate modal entrance
      gsap.fromTo(
        "#victory-modal",
        {
          scale: 0.8,
          opacity: 0,
          y: 20,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );

      // Create confetti container
      const confettiContainer = document.createElement("div");
      confettiContainer.style.position = "fixed";
      confettiContainer.style.inset = "0";
      confettiContainer.style.pointerEvents = "none";
      confettiContainer.style.zIndex = "100";
      document.body.appendChild(confettiContainer);

      // Animate confetti
      const confettiColors = ["#00ffff", "#1cd8d2", "#2dd4bf", "#ffffff"];
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.className = "absolute w-2 h-2 rounded-full";
        confetti.style.backgroundColor =
          confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-20px";
        confettiContainer.appendChild(confetti);

        gsap.to(confetti, {
          y: "120vh",
          x: `random(-200, 200)`,
          rotation: "random(-720, 720)",
          duration: "random(2, 4)",
          ease: "power1.out",
          onComplete: () => confetti.remove(),
        });
      }

      // Cleanup function
      return () => {
        confettiContainer.remove();
      };
    }
  }, [isVisible, modalProps]);

  if (!isVisible || !modalProps) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div
        id="victory-modal"
        className="bg-gradient-to-b from-cyan-950/90 to-slate-950/90 p-8 rounded-2xl border border-cyan-500/30 shadow-2xl max-w-2xl w-full mx-4 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors"
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

        <h2 className="text-3xl font-bold text-cyan-400 mb-4">
          {modalProps.title}
        </h2>
        <p className="text-gray-200 mb-8 leading-relaxed">
          {modalProps.message}
        </p>

        <div className="space-y-6">
          {modalProps.links.map((link, index) => (
            <div key={index} className="space-y-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 px-4 rounded-xl transition-all ${
                  link.text.includes("Made by")
                    ? "bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 text-[#1DA1F2] hover:border-[#1DA1F2]/50"
                    : "bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50 hover:text-cyan-200"
                }`}
              >
                {link.text}
              </a>
              <p className="text-gray-400 text-sm px-4">{link.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

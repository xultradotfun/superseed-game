"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface IntroModalProps {
  title: string;
  sections: {
    heading?: string;
    content: string[];
  }[];
  links: {
    text: string;
    url: string;
    description: string;
  }[];
}

export function IntroModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowModal = (event: CustomEvent<IntroModalProps>) => {
      setIsVisible(true);
    };

    window.addEventListener("showIntroModal", handleShowModal as EventListener);
    return () => {
      window.removeEventListener(
        "showIntroModal",
        handleShowModal as EventListener
      );
    };
  }, []);

  const handleClose = () => {
    gsap.to("#intro-modal", {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
        window.dispatchEvent(new Event("closeIntroModal"));
      },
    });
  };

  useEffect(() => {
    if (isVisible) {
      // Animate modal entrance
      gsap.fromTo(
        "#intro-modal",
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

      // Create sparkle container
      const sparkleContainer = document.createElement("div");
      sparkleContainer.style.position = "fixed";
      sparkleContainer.style.inset = "0";
      sparkleContainer.style.pointerEvents = "none";
      sparkleContainer.style.zIndex = "100";
      document.body.appendChild(sparkleContainer);

      // Animate sparkles
      const sparkleColors = ["#00ffff", "#1cd8d2", "#2dd4bf", "#ffffff"];
      for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "absolute w-1 h-1 rounded-full";
        sparkle.style.backgroundColor =
          sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.top = "-10px";
        sparkleContainer.appendChild(sparkle);

        gsap.to(sparkle, {
          y: "120vh",
          x: `random(-100, 100)`,
          rotation: "random(-360, 360)",
          duration: "random(1.5, 3)",
          ease: "power1.out",
          onComplete: () => sparkle.remove(),
        });
      }

      // Cleanup function
      return () => {
        sparkleContainer.remove();
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const modalContent: IntroModalProps = {
    title: "🌱 Welcome to the Superseed Garden! 🌟",
    sections: [
      {
        content: [
          "Welcome, brave gardener! You've entered a mystical garden where blockchain innovation blooms into reality. ✨",
        ],
      },
      {
        heading: "🎯 Your Mission",
        content: [
          "Cultivate ethereal plants inspired by Superseed - the revolutionary blockchain that brings self-repaying loans to life through Proof of Repayment.",
        ],
      },
      {
        heading: "🌿 The Journey",
        content: [
          "• Start with the mystical LuminaBloom",
          "• Master each plant's growth cycle",
          "• Unlock powerful new seed varieties",
          "• Discover the legendary SuperSeed",
        ],
      },
      {
        heading: "🎮 How to Play",
        content: [
          "• Click anywhere to plant seeds",
          "• Press SPACE while hovering to water plants",
          "• Harvest fully grown plants for seeds",
          "• Complete achievements to find prophecy pieces",
          "• Collect all pieces to unlock the Sacred SuperSeed",
        ],
      },
    ],
    links: [
      {
        text: "🌐 Learn About Superseed",
        url: "https://superseed.xyz",
        description: "Discover the future of self-repaying loans in DeFi",
      },
      {
        text: "Made by 0x_ultra",
        url: "https://twitter.com/0x_ultra",
        description: "Follow the creator on X",
      },
    ],
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div
        id="intro-modal"
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

        <h2 className="text-3xl font-bold text-cyan-400 mb-6">
          {modalContent.title}
        </h2>

        <div className="space-y-6 mb-8">
          {modalContent.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              {section.heading && (
                <h3 className="text-xl font-semibold text-cyan-300">
                  {section.heading}
                </h3>
              )}
              <div className="space-y-2">
                {section.content.map((text, i) => (
                  <p
                    key={i}
                    className={`text-gray-200 leading-relaxed ${
                      text.startsWith("•") ? "pl-4" : ""
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {modalContent.links.map((link, index) => (
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

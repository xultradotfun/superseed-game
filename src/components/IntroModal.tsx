"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { Modal } from "./shared/Modal";

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
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setIsVisible(true);
      localStorage.setItem("hasSeenIntro", "true");
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.from(".intro-content > *", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
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
    <Modal onClose={() => setIsVisible(false)} maxWidth="xl">
      <div className="intro-content space-y-6">
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
    </Modal>
  );
}

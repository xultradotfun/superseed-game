"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { Modal } from "./shared/Modal";
import { PlantType } from "@/game/state/GameState";

interface Section {
  heading: string;
  content: string;
}

interface Link {
  text: string;
  url: string;
  description?: string;
}

interface ConceptContent {
  title: string;
  sections: Section[];
  links: Link[];
}

const CONCEPT_CONTENT: Partial<Record<PlantType, ConceptContent>> = {
  EthereumEssence: {
    title: "🌟 Ethereum Essence & Proof of Repayment",
    sections: [
      {
        heading: "The PoR Cycle",
        content:
          "Proof of Repayment (PoR) is a groundbreaking mechanism that rewards borrowers for repaying their loans on time. When you repay a loan, you earn PoR tokens proportional to your repayment amount and duration.",
      },
      {
        heading: "Key Benefits",
        content:
          "• Lower interest rates for consistent repayers\n• Build a verifiable credit history on-chain\n• Earn rewards for responsible borrowing\n• Contribute to a sustainable lending ecosystem",
      },
    ],
    links: [
      {
        text: "Learn more about Proof of Repayment",
        url: "https://docs.superseed.xyz/core-concepts/proof-of-repayment",
        description: "Dive deep into the mechanics of PoR",
      },
    ],
  },
  OPStackOrchid: {
    title: "🌺 OP Stack Orchid & Supercollateral",
    sections: [
      {
        heading: "Risk Management",
        content:
          "Supercollateral is an innovative system that automatically manages yield-generating collateral. Your assets continue earning yield while serving as loan collateral, maximizing capital efficiency.",
      },
      {
        heading: "OP Stack Benefits",
        content:
          "• Fast and low-cost transactions\n• Automated yield compounding\n• Protection against liquidation risks\n• Seamless integration with DeFi protocols",
      },
    ],
    links: [
      {
        text: "Explore Supercollateral",
        url: "https://docs.superseed.xyz/core-concepts/supercollateral",
        description: "Understand how your collateral works harder for you",
      },
    ],
  },
  DeFiDandelion: {
    title: "🌼 DeFi Dandelion & CDP Protocol",
    sections: [
      {
        heading: "Core Features",
        content:
          "The CDP Protocol combines PoR and Supercollateral to create self-repaying loans. Your collateral generates yield that automatically pays down your loan, while you earn PoR tokens for each repayment.",
      },
      {
        heading: "DeFi Integration",
        content:
          "• Automated debt management\n• Yield optimization across protocols\n• Real-time loan health monitoring\n• Flexible collateral options",
      },
    ],
    links: [
      {
        text: "Discover CDP Protocol",
        url: "https://docs.superseed.xyz/core-concepts/cdp-protocol",
        description: "Learn about the future of DeFi lending",
      },
    ],
  },
};

export function ConceptModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [plantType, setPlantType] = useState<PlantType | null>(null);

  useEffect(() => {
    const handleShowModal = (event: CustomEvent<{ plantType: PlantType }>) => {
      setPlantType(event.detail.plantType);
      setIsVisible(true);
    };

    window.addEventListener(
      "showConceptModal",
      handleShowModal as EventListener
    );
    return () => {
      window.removeEventListener(
        "showConceptModal",
        handleShowModal as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.from(".concept-content > *", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [isVisible]);

  if (!isVisible || !plantType || !CONCEPT_CONTENT[plantType]) return null;

  const content = CONCEPT_CONTENT[plantType]!;

  return (
    <Modal onClose={() => setIsVisible(false)} maxWidth="xl">
      <div className="concept-content space-y-6">
        <h2 className="text-3xl font-bold text-cyan-400">{content.title}</h2>
        <div className="space-y-4">
          {content.sections.map((section: Section, index: number) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xl font-semibold text-cyan-300">
                {section.heading}
              </h3>
              <p className="text-cyan-100 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          ))}
        </div>
        {content.links && content.links.length > 0 && (
          <div className="flex flex-col gap-4 mt-8">
            {content.links.map((link: Link, index: number) => (
              <div key={index} className="space-y-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {link.text}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                {link.description && (
                  <p className="text-sm text-cyan-300/70">{link.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

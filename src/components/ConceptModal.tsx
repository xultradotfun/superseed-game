"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { PlantType } from "@/game/state/GameState";

interface ConceptModalProps {
  plantType: PlantType;
}

const CONCEPT_CONTENT: Record<
  Exclude<PlantType, "LuminaBloom" | "SuperSeed">,
  {
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
> = {
  EthereumEssence: {
    title: "🌟 Ethereum Essence & Proof of Repayment",
    sections: [
      {
        content: [
          "You've unlocked the Ethereum Essence! This mystical plant channels the power of Superseed's revolutionary Proof of Repayment (PoR) mechanism - the foundation of self-repaying loans.",
        ],
      },
      {
        heading: "💫 What is Proof of Repayment?",
        content: [
          "• A groundbreaking consensus mechanism that makes debt repayment productive",
          "• Rewards borrowers with PoR tokens for each loan repayment",
          "• Transforms traditional lending into a yield-generating activity",
          "• Ensures sustainable, long-term growth of the lending ecosystem",
        ],
      },
      {
        heading: "🔄 The PoR Cycle",
        content: [
          "• Take out a loan through Superseed's CDP Protocol",
          "• Make regular repayments on your loan",
          "• Earn PoR tokens for each successful repayment",
          "• Use PoR tokens to reduce interest rates or generate additional yield",
        ],
      },
      {
        heading: "💡 Key Benefits",
        content: [
          "• Lower effective interest rates through repayment rewards",
          "• Sustainable lending ecosystem through aligned incentives",
          "• Reduced risk of defaults and liquidations",
          "• Integration with Ethereum's security and infrastructure",
        ],
      },
    ],
    links: [
      {
        text: "📚 Learn About PoR",
        url: "https://docs.superseed.xyz/core-concepts/proof-of-repayment",
        description:
          "Dive deeper into the revolutionary Proof of Repayment mechanism",
      },
    ],
  },
  OPStackOrchid: {
    title: "🔴 OP Stack Orchid & Supercollateral",
    sections: [
      {
        content: [
          "You've unlocked the OP Stack Orchid! This ethereal flower embodies Superseed's innovative Supercollateral system, powered by Optimism's cutting-edge technology stack.",
        ],
      },
      {
        heading: "🏦 What is Supercollateral?",
        content: [
          "• A next-generation collateral system that grows over time",
          "• Automatically compounds yields from DeFi strategies",
          "• Maintains loan health through dynamic collateral management",
          "• Integrates with multiple yield sources for optimal returns",
        ],
      },
      {
        heading: "⚡ Built on OP Stack",
        content: [
          "• Leverages Optimism's proven Layer 2 technology",
          "• Benefits from Ethereum's security with faster transactions",
          "• Significantly lower gas fees for all operations",
          "• Seamless integration with Ethereum's DeFi ecosystem",
        ],
      },
      {
        heading: "🛡️ Risk Management",
        content: [
          "• Automated collateral rebalancing for optimal safety",
          "• Real-time monitoring of collateral health",
          "• Multiple layers of liquidation protection",
          "• Diversified yield strategies to minimize risk",
        ],
      },
    ],
    links: [
      {
        text: "📚 Learn About Supercollateral",
        url: "https://docs.superseed.xyz/core-concepts/supercollateral",
        description: "Explore how Supercollateral revolutionizes DeFi lending",
      },
    ],
  },
  DeFiDandelion: {
    title: "✨ DeFi Dandelion & CDP Protocol",
    sections: [
      {
        content: [
          "You've unlocked the DeFi Dandelion! This magical plant represents Superseed's innovative CDP (Collateralized Debt Position) Protocol - where PoR and Supercollateral unite.",
        ],
      },
      {
        heading: "💎 What is the CDP Protocol?",
        content: [
          "• The heart of Superseed's self-repaying loan system",
          "• Combines PoR rewards with Supercollateral's yield generation",
          "• Creates sustainable, user-friendly lending positions",
          "• Automatically manages debt and collateral ratios",
        ],
      },
      {
        heading: "🌱 Core Features",
        content: [
          "• One-click CDP creation and management",
          "• Automated yield reinvestment",
          "• Dynamic interest rate optimization",
          "• Real-time health factor monitoring",
        ],
      },
      {
        heading: "🔗 DeFi Integration",
        content: [
          "• Seamless connection with major DeFi protocols",
          "• Access to multiple yield strategies",
          "• Cross-chain compatibility through OP Stack",
          "• Composable with other DeFi primitives",
        ],
      },
      {
        heading: "📈 Benefits",
        content: [
          "• Self-repaying loans through yield generation",
          "• Reduced liquidation risk through active management",
          "• Lower effective interest rates via PoR rewards",
          "• Maximized capital efficiency through yield optimization",
        ],
      },
    ],
    links: [
      {
        text: "📚 Learn About CDP Protocol",
        url: "https://docs.superseed.xyz/core-concepts/cdp-protocol",
        description: "Master the mechanics of Superseed's CDP system",
      },
    ],
  },
};

export function ConceptModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [plantType, setPlantType] = useState<PlantType | null>(null);

  useEffect(() => {
    const handleShowModal = (event: CustomEvent<ConceptModalProps>) => {
      if (
        event.detail.plantType !== "LuminaBloom" &&
        event.detail.plantType !== "SuperSeed"
      ) {
        setPlantType(event.detail.plantType);
        setIsVisible(true);
      }
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

  const handleClose = () => {
    gsap.to("#concept-modal", {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
        setPlantType(null);
        window.dispatchEvent(new Event("closeConceptModal"));
      },
    });
  };

  useEffect(() => {
    if (isVisible && plantType) {
      // Animate modal entrance
      gsap.fromTo(
        "#concept-modal",
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
  }, [isVisible, plantType]);

  if (
    !isVisible ||
    !plantType ||
    plantType === "LuminaBloom" ||
    plantType === "SuperSeed"
  ) {
    return null;
  }

  const content = CONCEPT_CONTENT[plantType];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div
        id="concept-modal"
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
          {content.title}
        </h2>

        <div className="space-y-6 mb-8">
          {content.sections.map((section, index) => (
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
          {content.links.map((link, index) => (
            <div key={index} className="space-y-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 px-4 rounded-xl transition-all bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50 hover:text-cyan-200"
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

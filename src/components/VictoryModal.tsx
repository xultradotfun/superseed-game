"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { Modal } from "./shared/Modal";

export function VictoryModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState<{ text: string; url: string }[]>([]);

  useEffect(() => {
    const handleShowModal = (
      event: CustomEvent<{
        title: string;
        message: string;
        links: { text: string; url: string }[];
      }>
    ) => {
      setTitle(event.detail.title);
      setMessage(event.detail.message);
      setLinks(event.detail.links);
      setIsVisible(true);
    };

    window.addEventListener(
      "showVictoryModal",
      handleShowModal as EventListener
    );
    return () => {
      window.removeEventListener(
        "showVictoryModal",
        handleShowModal as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.from(".victory-content > *", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal onClose={() => setIsVisible(false)} maxWidth="xl">
      <div className="victory-content space-y-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">{title}</h2>
        <p className="text-lg text-cyan-100 leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        {links.length > 0 && (
          <div className="flex flex-col gap-4 mt-8">
            {links.map((link, index) => (
              <a
                key={index}
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
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

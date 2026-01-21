/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  type: "star" | "flower" | "heart";
  left: string;
  delay: number;
  duration: number;
  size: number;
}

export default function AnimatedBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const newElements: FloatingElement[] = [];
    const symbols = ["star", "flower", "heart"] as const;

    // Generate random floating elements
    for (let i = 0; i < 40; i++) {
      newElements.push({
        id: i,
        type: symbols[Math.floor(Math.random() * symbols.length)],
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        size: 16 + Math.random() * 24,
      });
    }
    setElements(newElements);
  }, []);

  const getSymbol = (type: string) => {
    switch (type) {
      case "star":
        return "✨";
      case "flower":
        return "🌸";
      case "heart":
        return "💕";
      default:
        return "✨";
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "star":
        return "text-yellow-300";
      case "flower":
        return "text-pink-300";
      case "heart":
        return "text-red-300";
      default:
        return "text-yellow-300";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-rose-50 to-amber-50" />

      {/* Animated elements */}
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-float"
          style={{
            left: element.left,
            top: "-50px",
            fontSize: `${element.size}px`,
            animation: `float ${element.duration}s infinite linear`,
            animationDelay: `${element.delay}s`,
            opacity: 0.6,
          }}
        >
          <span className={`${getColor(element.type)} drop-shadow-lg`}>
            {getSymbol(element.type)}
          </span>
        </div>
      ))}

      {/* Radial gradient overlays for depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-10 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-10 -z-10" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-10 -z-10" />
    </div>
  );
}

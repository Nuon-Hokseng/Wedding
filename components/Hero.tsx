"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Hero() {
  const { ref: containerRef, isVisible: containerVisible } = useScrollAnimation(
    { threshold: 0.1 },
  );
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: photoRef, isVisible: photoVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen xl:pt-20 md:pt-20 pb-10 pt-5 px-4 md:px-8 overflow-hidden"
    >
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 text-5xl opacity-40 animate-sway">
        🌸
      </div>
      <div
        className="absolute top-32 right-20 text-6xl opacity-30 animate-sway"
        style={{ animationDelay: "1s" }}
      >
        💕
      </div>
      <div
        className="absolute bottom-32 left-20 text-4xl opacity-35 animate-sway"
        style={{ animationDelay: "2s" }}
      >
        ✨
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center h-full">
        {/* Left: Invitation Text */}
        <div
          ref={textRef}
          className={`flex flex-col justify-center space-y-6 scroll-transition ${
            textVisible ? "scroll-animate-fade-left" : "scroll-hidden-left"
          }`}
        >
          <div className="space-y-4">
            <p className="text-amber-600 text-lg font-semibold tracking-widest uppercase">
              Together with their parents
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-rose-600">
              Phorn <span className="text-amber-500">&</span> Mey
            </h2>
            <p className="text-2xl text-rose-500 font-light">
              request the honor of your presence
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border-2 border-rose-200 shadow-lg space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-base leading-relaxed">
                Together with their parents
              </p>
              <p className="text-2xl text-gray-800 font-serif font-semibold">
                Phorn & Mey
              </p>
              <p className="text-gray-600">
                request the honor of your presence, dear
              </p>
              <p className="text-3xl font-serif text-rose-600 font-semibold cursor-pointer hover:text-rose-700 transition py-2">
                Nuon Hokseng
              </p>
              <p className="text-gray-600">
                at the celebration of their marriage
              </p>
            </div>

            <div className="border-t-2 border-rose-200 pt-6">
              <p className="text-center text-gray-700 font-serif space-y-2">
                <span className="block">
                  Saturday, 25th of April
                </span>
                <span className="block font-bold text-2xl">
                 2026
                </span>
                <span className="block">at 5pm</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Photo with Effects */}
        <div
          ref={photoRef}
          className={`relative h-96 md:h-[500px] rounded-2xl overflow-visible scroll-transition ${
            photoVisible ? "scroll-animate-fade-right" : "scroll-hidden-right"
          }`}
        >
          <Image
            src="/pic1.jpeg"
            alt="Phorn and Mey pre-wedding photo"
            fill
            className="object-cover rounded-2xl"
            priority
          />
          {/* Decorative flower corners */}
          <div className="absolute -top-15 -right-15 text-4xl z-10">
            <Image
              src="/TR.png"
              alt="couple picture"
              width={200}
              height={200}
            />
          </div>
          <div className="absolute -bottom-15 -left-15 text-5xl z-10">
            <Image
              src="/BL.png"
              alt="couple picture"
              width={200}
              height={200}
            />
          </div>

          {/* Gold overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 via-transparent to-transparent pointer-events-none" />

          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl border-4 border-amber-300/40 pointer-events-none shadow-lg shadow-amber-300/30" />
        </div>
      </div>
    </section>
  );
}

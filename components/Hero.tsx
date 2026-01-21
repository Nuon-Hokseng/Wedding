"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Hero({ guestName = "" }: { guestName?: string }) {
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
      className="relative w-full py-6 md:py-8 px-4 md:px-8 overflow-hidden"
    >
      <div className="flex flex-col items-center max-w-3xl mx-auto text-center gap-2">
        <svg
          viewBox="0 0 500 120"
          className="w-full max-w-lg mx-auto absolute top-1"
        >
          <path id="curve" d="M 50 80 Q 250 20 450 80" fill="transparent" />

          <text
            fill="#d97706"
            className="uppercase tracking-widest xl:text-4xl font-khmer text-4xl lg:text-2xl"
          >
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              សិរីសួស្ដីអាពាហ៏ពិពាហ៍
            </textPath>
          </text>
        </svg>
        <h2 className="xl:mt-20 md:mt-20 mt-20 text-2xl md:text-4xl lg:text-5xl font-bold text-rose-600">
          Phorn <span className="text-amber-500">&</span> Mey
        </h2>
        <br />
        <p className="text-xl md:text-lg xl:text-3xl text-rose-500 font-khmer">
          សូមគោរពអញ្ជើញលោកអ្នកចូលរួមពិធីមង្គលការរបស់ពួកយើង
        </p>
      </div>
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 text-5xl opacity-40 animate-sway">
        🌸
      </div>
      <div
        className="absolute top-20 right-10 text-6xl opacity-30 animate-sway"
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

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center mt-6">
        <div
          ref={textRef}
          className={` mt-4 mb-20 flex flex-col justify-center space-y-6 scroll-transition ${
            textVisible ? "scroll-animate-fade-left" : "scroll-hidden-left"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border-2 border-rose-200 shadow-lg space-y-6">
            <div className="text-center space-y-4 font-khmer">
              <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed">
                មេបាទាំងសងខាង​​ នឹង​​ គូរស្វាមីភរិយា​
              </p>
              <p className="text-gray-600 text-xs md:text-sm lg:text-base">
                សូមគោរពអញ្ជើញឯកឧត្តម/លោកអ្នក ជាទីគោរព
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl font-serif text-rose-600 font-semibold cursor-pointer hover:text-rose-700 transition py-2">
                {guestName}
              </p>
              <p className="text-gray-600 text-xs md:text-sm lg:text-base">
                ជាអធិបតីក្នុងពិធីមង្គលការរបស់ពួកយើង
              </p>
            </div>

            <div className="border-t-2 border-rose-200 pt-6">
              <p className="text-center text-gray-700 font-serif space-y-2 text-xs md:text-sm lg:text-base">
                <span className="block">នៅថ្ងៃទី ២៥ ខែ មេសា</span>
                <span className="block font-bold text-lg md:text-xl lg:text-2xl">
                  ២០២៦
                </span>
                <span className="block">នៅវេលាម៉ោង ៥ ល្ងាច</span>
              </p>
            </div>
            <div className="xl:hidden md:hidden absolute -bottom-13 -right-1 text-4xl z-10">
              <Image
                src="/flower1.png"
                alt="couple picture"
                width={600}
                height={600}
              />
            </div>
          </div>
        </div>

        {/* Right: Photo with Effects */}
        <div
          ref={photoRef}
          className={`relative h-96 md:h-125 rounded-2xl overflow-visible scroll-transition ${
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
          <div className="absolute inset-0 bg-linear-to-t from-amber-400/20 via-transparent to-transparent pointer-events-none" />

          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl border-4 border-amber-300/40 pointer-events-none shadow-lg shadow-amber-300/30" />
        </div>
      </div>
    </section>
  );
}

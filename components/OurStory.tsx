"use client";

import { useEffect, useRef, useState } from "react";

export default function OurStory() {
  const storyEvents = [
    {
      year: "2020",
      month: "March",
      title: "First Meeting",
      description:
        "We met at a mutual friend's birthday party. It was love at first sight with a conversation that lasted all night.",
      icon: "💫",
    },
    {
      year: "2021",
      month: "August",
      title: "First Trip Together",
      description:
        "We took our first adventure together to the mountains. Every moment with you felt like home.",
      icon: "✈️",
    },
    {
      year: "2022",
      month: "December",
      title: "Moving In Together",
      description:
        "We moved into our first home together. Building our life together has been the greatest adventure.",
      icon: "🏠",
    },
    {
      year: "2024",
      month: "June",
      title: "The Proposal",
      description:
        "On a beautiful sunset beach, I got down on one knee. You said yes, and made me the happiest person alive.",
      icon: "💍",
    },
    {
      year: "2026",
      month: "April",
      title: "Our Wedding Day",
      description:
        "Today, we celebrate our love with everyone who means the world to us. Forever starts now.",
      icon: "👰🏻‍♀️",
    },
  ];

  const [visibleMap, setVisibleMap] = useState<Record<number, number>>({});
  const [lineProgress, setLineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const eventRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!timelineRef.current) return;

    const handleProgress = () => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;
      const start = rect.top + viewportHeight * 0.15;
      const end = rect.bottom - viewportHeight * 0.15;
      const center = viewportHeight / 2;
      const ratio = Math.min(1, Math.max(0, (center - start) / (end - start)));
      setLineProgress(ratio);
    };

    handleProgress();
    window.addEventListener("scroll", handleProgress, { passive: true });
    window.addEventListener("resize", handleProgress);
    return () => {
      window.removeEventListener("scroll", handleProgress);
      window.removeEventListener("resize", handleProgress);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (Number.isNaN(index)) return;
          if (entry.isIntersecting) {
            setVisibleMap((prev) => ({
              ...prev,
              [index]: (prev[index] ?? 0) + 1,
            }));
          }
        });
      },
      { threshold: 0.35 },
    );

    eventRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="story"
      className="w-full py-20 px-4 md:px-8 bg-white scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          Our Story
        </h2>
        <p className="text-center text-lg text-gray-600 mb-16">
          A timeline of our beautiful journey together
        </p>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 h-full bg-rose-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 w-full bg-gradient-to-b from-rose-400 via-amber-300 to-rose-200 transition-[height] duration-300"
              style={{ height: `${Math.max(10, lineProgress * 100)}%` }}
            />
          </div>
          <div className="md:hidden absolute left-8 top-0 w-0.5 h-full bg-rose-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 w-full bg-gradient-to-b from-rose-400 via-amber-300 to-rose-200 transition-[height] duration-300"
              style={{ height: `${Math.max(10, lineProgress * 100)}%` }}
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {storyEvents.map((event, index) => {
              const delay = visibleMap[index] ? `${index * 140}ms` : "0ms";
              return (
                <div
                  key={`${index}-${visibleMap[index] ?? 0}`}
                  ref={(node) => {
                    eventRefs.current[index] = node;
                  }}
                  data-index={index}
                  className={`flex gap-8 md:gap-0 md:mb-12 relative ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`pt-10 w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}
                  >
                    <div
                      className={`bg-gradient-to-br from-rose-50 to-amber-50 rounded-lg p-6 border border-rose-200 transition-all duration-700 ease-out ${
                        visibleMap[index]
                          ? "opacity-100 translate-y-0 translate-x-0 shadow-lg"
                          : index % 2 === 0
                            ? "opacity-0 translate-y-6 -translate-x-6"
                            : "opacity-0 translate-y-6 translate-x-6"
                      }`}
                      style={{ transitionDelay: delay }}
                    >
                      <p className="text-rose-600 font-bold text-sm tracking-widest uppercase">
                        {event.month} {event.year}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-2 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="flex justify-center md:w-auto absolute left-2 md:static md:relative md:transform md:translate-x-0">
                    <div
                      className={`w-15 h-15 md:w-16 md:h-16 bg-white border-4 border-rose-400 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg z-10 transition-all duration-700 ease-out ${
                        visibleMap[index]
                          ? "scale-100 opacity-100 translate-x-0"
                          : index % 2 === 0
                            ? "scale-75 opacity-0 -translate-x-4"
                            : "scale-75 opacity-0 translate-x-4"
                      }`}
                      style={{ transitionDelay: delay }}
                    >
                      {event.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heart message */}
        <div className="text-center mt-16">
          <p className="text-2xl font-semibold text-rose-600 mb-2">
            Our greatest story is just beginning
          </p>
          <p className="text-gray-600">
            And you're invited to be a part of it! 💕
          </p>
        </div>
      </div>
    </section>
  );
}

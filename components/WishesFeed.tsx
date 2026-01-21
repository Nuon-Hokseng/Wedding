"use client";

import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Wish {
  id: string;
  name: string;
  message: string;
  guests: number;
  attending: boolean;
  timestamp: number;
}

export default function WishesFeed({ wishes }: { wishes: Wish[] }) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: wishesRef, isVisible: wishesVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  const [displayedWishes, setDisplayedWishes] = useState<Wish[]>([]);
  const [filter, setFilter] = useState<"all" | "attending">("all");

  useEffect(() => {
    setDisplayedWishes(wishes);
  }, [wishes]);

  const filteredWishes =
    filter === "attending"
      ? displayedWishes.filter((w) => w.attending)
      : displayedWishes;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  const attendingCount = displayedWishes.filter((w) => w.attending).length;
  const totalGuests = displayedWishes.reduce(
    (sum, w) => (w.attending ? sum + w.guests : sum),
    0,
  );

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-rose-50 via-white to-white"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          Guest Wishes
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          Love and blessings from our cherished guests
        </p>

        {/* Stats */}
        {displayedWishes.length > 0 && (
          <div
            ref={statsRef}
            className={`grid md:grid-cols-3 gap-4 mb-12 scroll-transition ${
              statsVisible ? "scroll-animate-scale" : "scroll-hidden-scale"
            }`}
          >
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-6 border border-rose-200 text-center">
              <p className="text-4xl font-bold text-rose-600">
                {displayedWishes.length}
              </p>
              <p className="text-gray-600 font-medium mt-1">Total Wishes</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 text-center">
              <p className="text-4xl font-bold text-green-600">
                {attendingCount}
              </p>
              <p className="text-gray-600 font-medium mt-1">Guests Attending</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 text-center">
              <p className="text-4xl font-bold text-blue-600">{totalGuests}</p>
              <p className="text-gray-600 font-medium mt-1">Total Guests</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {displayedWishes.length > 0 && (
          <div className="flex gap-4 justify-center mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === "all"
                  ? "bg-rose-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Wishes
            </button>
            <button
              onClick={() => setFilter("attending")}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === "attending"
                  ? "bg-rose-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Attending Only
            </button>
          </div>
        )}

        {/* Wishes Grid */}
        {filteredWishes.length > 0 ? (
          <div
            ref={wishesRef}
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-transition ${
              wishesVisible ? "scroll-animate-fade-up" : "scroll-hidden"
            }`}
          >
            {filteredWishes.map((wish) => (
              <div
                key={wish.id}
                className="bg-white rounded-xl p-6 shadow-md border border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {wish.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatTime(wish.timestamp)}
                    </p>
                  </div>
                  {wish.attending && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Attending
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="text-gray-700 leading-relaxed mb-4 text-sm line-clamp-4">
                  {wish.message}
                </p>

                {/* Guest Count */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600">
                    {wish.guests} {wish.guests === 1 ? "Guest" : "Guests"}
                  </span>
                  {wish.attending && (
                    <span className="text-2xl ml-auto">💕</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💌</p>
            <p className="text-xl text-gray-600">No wishes yet...</p>
            <p className="text-gray-500 mt-2">
              Be the first to share your wishes and confirm your attendance!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

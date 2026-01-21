"use client";

import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/lib/supabase";

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export default function WishesFeed() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: wishesRef, isVisible: wishesVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [displayedWishes, setDisplayedWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishes from Supabase
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const { data, error } = await supabase
          .from("wishes_feed")
          .select("id, name, message, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          setDisplayedWishes([]);
        } else if (data && Array.isArray(data) && data.length > 0) {
          const formattedWishes: Wish[] = data.map((wish: any) => ({
            id: String(wish.id),
            name: wish.name || "Anonymous",
            message: wish.message || "",
            timestamp: wish.created_at
              ? new Date(wish.created_at).getTime()
              : Date.now(),
          }));
          setDisplayedWishes(formattedWishes);
        } else {
          setDisplayedWishes([]);
        }
        setLoading(false);
      } catch (err) {
        setDisplayedWishes([]);
        setLoading(false);
      }
    };

    fetchWishes();

    const subscription = supabase
      .channel("wishes_feed_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes_feed" },
        () => {
          fetchWishes();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Mouse wheel horizontal scroll for desktop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Only apply horizontal scroll if scrolling vertically with mouse wheel
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

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

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 from-rose-50 via-white to-white"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg md:text-2xl lg:text-5xl font-khmer text-center mb-2 text-gray-800">
          សារជូនពររបស់ភ្ងៀវ
        </h2>
        <p className="text-center text-sm md:text-base lg:text-lg text-gray-600 mb-16 font-khmer">
          សេចក្ដីស្រឡាញ់ និងពរ ពីភ្ញៀវដ៏ល្អប្រសើររបស់យើង
        </p>

        {/* Wishes Carousel */}
        {!loading && displayedWishes.length > 0 ? (
          <div className="w-full overflow-visible relative z-10">
            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="wishes-scroll relative w-full overflow-x-auto overflow-y-visible z-10"
              style={{
                scrollBehavior: "smooth",
                msOverflowStyle: "auto",
                scrollbarWidth: "thin",
              }}
            >
              <style>{`
                .wishes-scroll::-webkit-scrollbar {
                  height: 10px;
                }
                .wishes-scroll::-webkit-scrollbar-track {
                  background: #f8f0f3;
                  border-radius: 9999px;
                }
                .wishes-scroll::-webkit-scrollbar-thumb {
                  background: linear-gradient(90deg, #fb7185, #ec4899);
                  border-radius: 9999px;
                }
                .wishes-scroll::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(90deg, #f43f5e, #db2777);
                }
              `}</style>

              <div className="flex gap-6 pb-10 px-4 md:px-6 min-w-min pt-6 overflow-visible">
                {displayedWishes.map((wish, index) => (
                  <div
                    key={wish.id}
                    className="shrink-0 w-80 md:w-96 min-h-[320px] group relative z-20"
                    style={{
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <style>{`
                      @keyframes slideIn {
                        from {
                          opacity: 0;
                          transform: translateX(20px);
                        }
                        to {
                          opacity: 1;
                          transform: translateX(0);
                        }
                      }
                    `}</style>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-rose-100 hover:border-rose-400 hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:scale-110 origin-center cursor-pointer relative z-30 hover:z-50">
                      {/* Decorative Quote Mark */}
                      <div className="text-5xl text-rose-200 mb-2 leading-none">
                        "
                      </div>

                      {/* Message - Main Content */}
                      <p className="text-gray-700 leading-relaxed text-base mb-6 flex-grow line-clamp-6 font-medium">
                        {wish.message}
                      </p>

                      {/* Divider */}
                      <div className="w-12 h-1 from-rose-300 to-rose-500 mb-4 rounded-full"></div>

                      {/* Author Info */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {wish.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {formatTime(wish.timestamp)}
                        </p>
                      </div>

                      {/* Heart Icon */}
                      <div className="mt-4 text-rose-400 text-2xl opacity-75 group-hover:opacity-100 transition">
                        💕
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Hint */}
            {displayedWishes.length > 2 && (
              <div className="mt-6 flex justify-center items-center text-gray-500 text-sm font-khmer">
                <span className="flex items-center gap-2 animate-pulse">
                  ← សូមអូស →
                </span>
              </div>
            )}

            {/* Wish Counter */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-khmer">
                មាន {displayedWishes.length} សារជូនពរ
              </p>
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">💌</p>
            <p className="text-2xl text-gray-700 font-khmer mb-3">
              មិនទាន់មានសារជូនពរទេ...
            </p>
            <p className="text-gray-500 font-khmer text-lg">
              អ្នកអាចជាមនុស្សដំបូងដែលចែករំលែកសារជូនពរដ៏ស្នេហ៏របស់អ្នក
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block">
              <p className="text-5xl mb-4 animate-bounce">✨</p>
              <p className="text-gray-600 font-khmer text-lg">
                កំពុងផ្ទុកសារជូនពរ...
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

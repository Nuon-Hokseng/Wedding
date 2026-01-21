"use client";

import { useEffect, useState } from "react";
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

  const [displayedWishes, setDisplayedWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishes from Supabase
  useEffect(() => {
    const fetchWishes = async () => {
      setLoading(true);
      try {
        console.log("🔄 Fetching wishes from wishes_feed table...");
        const { data, error } = await supabase
          .from("wishes_feed")
          .select("id, name, message, created_at")
          .order("created_at", { ascending: false });

        console.log("📊 Raw response:", { data, error });

        if (error) {
          console.error("❌ Error fetching wishes from Supabase:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          console.warn(
            "💡 Tip: Check if RLS is enabled on wishes_feed table. If so, add a public read policy or disable RLS if this is public data.",
          );
          setDisplayedWishes([]);
        } else if (data && data.length > 0) {
          console.log("✅ Successfully fetched wishes:", data.length);
          console.log("📝 Wishes data:", data);
          const formattedWishes = data.map((wish: any) => ({
            id: wish.id.toString(),
            name: wish.name || "Anonymous",
            message: wish.message || "",
            timestamp: new Date(wish.created_at).getTime(),
          }));
          setDisplayedWishes(formattedWishes);
        } else {
          console.log("ℹ️ No wishes found in the database");
          console.log("📊 Data returned:", data);
          setDisplayedWishes([]);
        }
      } catch (err) {
        console.error("❌ Unexpected error fetching wishes:", err);
        setDisplayedWishes([]);
      }
      setLoading(false);
    };

    fetchWishes();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("wishes_feed_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes_feed" },
        (payload) => {
          console.log("🔔 Real-time update received:", payload);
          fetchWishes();
        },
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    // Also poll every 5 seconds to catch any updates
    const interval = setInterval(() => {
      fetchWishes();
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
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
      className="w-full py-20 px-4 md:px-8 bg-linear-to-b from-rose-50/50 via-white/50 to-white/50"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg md:text-2xl lg:text-5xl font-khmer text-center mb-4 text-gray-800">
          សារជូនពររបស់ភ្ងៀវនឹងបង្ហាញនៅទីនេះ
        </h2>
        <p className="text-center text-sm md:text-base lg:text-lg text-gray-600 mb-12 font-khmer">
          សេចក្ដីស្រឡាញ់ និងពរ ពីភ្ញៀវជាទីគោរពរបស់យើង
        </p>

        {/* Wishes Horizontal Scroll */}
        {!loading && displayedWishes.length > 0 ? (
          <div
            ref={wishesRef}
            className={`overflow-x-auto pb-4 scroll-transition ${
              wishesVisible ? "scroll-animate-fade-up" : "scroll-hidden"
            }`}
          >
            <div className="flex gap-6 min-w-min px-2">
              {displayedWishes.map((wish) => (
                <div
                  key={wish.id}
                  className="shrink-0 w-72 bg-white rounded-xl p-6 shadow-md border border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all duration-300 animate-in fade-in slide-in-from-bottom"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm md:text-base lg:text-lg">
                        {wish.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">
                        {formatTime(wish.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 leading-relaxed text-xs md:text-sm line-clamp-4">
                    {wish.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💌</p>
            <p className="text-xl text-gray-600 font-khmer">
              មិនទាន់មានសារជូនពរទេ...
            </p>
            <p className="text-gray-500 mt-2 font-khmer">
              អ្នកអាចជាមនុស្សដំបូងដែលចែករំលែកសារជូនពររបស់អ្នក
              និងបញ្ជាក់ការចូលរួម!
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 font-khmer">កំពុងផ្ទុក...</p>
          </div>
        )}
      </div>
    </section>
  );
}

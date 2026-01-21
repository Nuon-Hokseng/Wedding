"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WeddingDetails from "@/components/WeddingDetails";
import PhotoGallery from "@/components/PhotoGallery";
import OurStory from "@/components/OurStory";
import RSVP from "@/components/RSVP";
import WishesFeed from "@/components/WishesFeed";
import { supabase } from "@/lib/supabase";

function HomeContent() {
  const searchParams = useSearchParams();

  // Helper function to get cookie value
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  // Get guest info from cookies instead of URL parameters
  const guestName = getCookie("guest_name") || "";
  const guestId = getCookie("guest_id")
    ? parseInt(getCookie("guest_id")!)
    : undefined;

  const [wishes, setWishes] = useState<
    Array<{
      id: string;
      name: string;
      message: string;
      guests: number;
      attending: boolean;
      timestamp: number;
    }>
  >([]);
  const [overlayFading, setOverlayFading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const autoScrollRaf = useRef<number | null>(null);
  const autoScrollStop = useRef(false);
  const autoScrollCleanup = useRef<(() => void) | null>(null);
  const lockedScrollY = useRef(0);

  // Load wishes from database on mount
  useEffect(() => {
    const loadWishes = async () => {
      const { data, error } = await supabase
        .from("wishes_feed")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) {
        const formattedWishes = data.map((wish) => ({
          id: wish.id.toString(),
          name: wish.name,
          message: wish.message,
          guests: wish.number_of_guests,
          attending: wish.will_attend,
          timestamp: new Date(wish.created_at).getTime(),
        }));
        setWishes(formattedWishes);
      }
    };

    loadWishes();

    // Subscribe to new wishes
    const channel = supabase
      .channel("wishes_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes_feed" },
        (payload) => {
          const newWish = payload.new as any;
          setWishes((prev) => [
            {
              id: newWish.id.toString(),
              name: newWish.name,
              message: newWish.message,
              guests: newWish.number_of_guests,
              attending: newWish.will_attend,
              timestamp: new Date(newWish.created_at).getTime(),
            },
            ...prev,
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const lockScroll = () => {
    if (typeof document === "undefined") return;
    lockedScrollY.current = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY.current}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo({ top: lockedScrollY.current });
  };

  const stopAutoScroll = () => {
    if (autoScrollRaf.current !== null) {
      cancelAnimationFrame(autoScrollRaf.current);
      autoScrollRaf.current = null;
    }
    if (autoScrollCleanup.current) {
      autoScrollCleanup.current();
      autoScrollCleanup.current = null;
    }
    autoScrollStop.current = true;
  };

  const startAutoScroll = () => {
    if (typeof window === "undefined") return;
    // Skip auto-scroll on mobile devices (< 768px)
    if (window.innerWidth < 768) return;

    stopAutoScroll();
    autoScrollStop.current = false;

    const onUserStop = () => stopAutoScroll();
    window.addEventListener("wheel", onUserStop, { passive: true });
    window.addEventListener("touchmove", onUserStop, { passive: true });
    window.addEventListener("keydown", onUserStop, { passive: true });
    autoScrollCleanup.current = () => {
      window.removeEventListener("wheel", onUserStop);
      window.removeEventListener("touchmove", onUserStop);
      window.removeEventListener("keydown", onUserStop);
    };

    const speed = 180; // px per second, smoother on mobile
    let last = performance.now();

    const step = (now: number) => {
      if (autoScrollStop.current) return;
      const dt = (now - last) / 1000;
      last = now;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = Math.min(window.scrollY + speed * dt, max);
      window.scrollTo({ top: next, behavior: "auto" });

      if (next >= max - 1) {
        stopAutoScroll();
        return;
      }

      autoScrollRaf.current = requestAnimationFrame(step);
    };

    autoScrollRaf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (overlayFading) {
      const timer = setTimeout(() => {
        setShowContent(true);
        setHideOverlay(true);
        // begin gentle auto-scroll shortly after reveal
        const autoScrollDelay = setTimeout(startAutoScroll, 750);
        return () => clearTimeout(autoScrollDelay);
      }, 2600); // Wait for envelope fly+spin (1.2s) + flap open (0.6s at 1.2s = ends at 1.8s) + overlay fade (700ms) + small buffer
      return () => clearTimeout(timer);
    }
  }, [overlayFading]);

  useEffect(() => () => stopAutoScroll(), []);

  useEffect(() => {
    if (!hideOverlay) {
      lockScroll();
      return unlockScroll;
    }
    unlockScroll();
    return undefined;
  }, [hideOverlay]);

  const addWish = (wish: {
    name: string;
    message: string;
    guests: number;
    attending: boolean;
  }) => {
    const newWish = {
      id: Date.now().toString(),
      ...wish,
      timestamp: Date.now(),
    };
    setWishes([newWish, ...wishes]);
  };

  const handleOpen = () => {
    if (!overlayFading) {
      setOverlayFading(true);
    }
  };

  return (
    <>
      {!hideOverlay && (
        <div
          className={`overflow-hidden fixed inset-0 z-40 flex items-center justify-center px-6 ${overlayFading ? "transition-opacity duration-700 delay-[1800ms] opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="mx-auto w-full max-w-lg rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/40 p-8 text-center space-y-6">
            <div
              className={`mx-auto envelope ${overlayFading ? "envelope-open" : ""}`}
              aria-hidden="true"
            />
            <div className="space-y-2">
              <p className="text-lg font-medium tracking-wide text-gray-800">
                អីយ៉ាស! មានសារគេផ្ញេីរមកមួយនេះ!
              </p>
              <p className="text-sm text-gray-600">សាកចុចមេីលមេីល</p>
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:scale-105 hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              ចុចខ្ញុំដើម្បីបើក
            </button>
          </div>
        </div>
      )}
      <main
        className={`w-full relative z-10 transition-opacity duration-700 ${showContent ? "opacity-100 animate-in" : "opacity-0 pointer-events-none"}`}
      >
        <Header coupleNames="P&M" />
        <Hero guestName={guestName} />
        <WeddingDetails />
        <PhotoGallery />
        <OurStory />
        <RSVP onWishSubmit={addWish} guestName={guestName} guestId={guestId} />
        <WishesFeed />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-rose-50" />}>
      <HomeContent />
    </Suspense>
  );
}

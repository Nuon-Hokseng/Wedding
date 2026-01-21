"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WeddingDetails from "@/components/WeddingDetails";
import PhotoGallery from "@/components/PhotoGallery";
import OurStory from "@/components/OurStory";
import RSVP from "@/components/RSVP";
import WishesFeed from "@/components/WishesFeed";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
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
  const [guestName, setGuestName] = useState("Guest");
  const [overlayFading, setOverlayFading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const autoScrollRaf = useRef<number | null>(null);
  const autoScrollStop = useRef(false);
  const autoScrollCleanup = useRef<(() => void) | null>(null);
  const lockedScrollY = useRef(0);

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
      }, 650);
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
      <AnimatedBackground />
      {!hideOverlay && (
        <div
          className={`overflow-hidden fixed inset-0 z-40 flex items-center justify-center px-6 transition-opacity duration-700 ${overlayFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="mx-auto w-full max-w-lg rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/40 p-8 text-center space-y-6">
            <div
              className={`mx-auto envelope ${overlayFading ? "envelope-open" : ""}`}
              aria-hidden="true"
            />
            <div className="space-y-2">
              <p className="text-lg font-medium tracking-wide text-gray-800">
                A special note awaits
              </p>
              <p className="text-sm text-gray-600">
                Tap the envelope to join Phorn & Mey&apos;s celebration
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:scale-105 hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              click me to open
            </button>
          </div>
        </div>
      )}
      <main
        className={`w-full relative z-10 transition-opacity duration-700 ${showContent ? "opacity-100 animate-in" : "opacity-0 pointer-events-none"}`}
      >
        <Header coupleNames="P&M" />
        <Hero />
        <WeddingDetails />
        <PhotoGallery />
        <OurStory />
        <RSVP onWishSubmit={addWish} guestName={guestName} />
        <WishesFeed wishes={wishes} />
      </main>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (overlayFading) {
      const timer = setTimeout(() => {
        setShowContent(true);
        setHideOverlay(true);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [overlayFading]);

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

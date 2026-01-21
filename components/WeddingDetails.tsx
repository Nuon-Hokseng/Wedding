"use client";

import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function WeddingDetails() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: countdownRef, isVisible: countdownVisible } = useScrollAnimation(
    { threshold: 0.1 },
  );
  const { ref: detailsRef, isVisible: detailsVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: scheduleRef, isVisible: scheduleVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const weddingDate = new Date("2026-04-25T17:00:00").getTime();
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const schedule = [
    { time: "5:00 PM", event: "Guests Arrival & Reception" },
    { time: "5:30 PM", event: "Ceremony Begins" },
    { time: "6:00 PM", event: "Cocktail Hour" },
    { time: "7:00 PM", event: "Dinner Service" },
    { time: "8:30 PM", event: "Toasts & Cake Cutting" },
    { time: "9:00 PM", event: "Dance & Celebration" },
  ];

  return (
    <section
      id="details"
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 bg-white scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          Save The Date
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          We can't wait to celebrate with you!
        </p>

        {/* Countdown Timer */}
        <div
          ref={countdownRef}
          className={`bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-8 md:p-12 mb-16 border border-rose-200 scroll-transition ${
            countdownVisible ? "scroll-animate-scale" : "scroll-hidden-scale"
          }`}
        >
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            Time Until Our Special Day
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Days", value: timeRemaining.days },
              { label: "Hours", value: timeRemaining.hours },
              { label: "Minutes", value: timeRemaining.minutes },
              { label: "Seconds", value: timeRemaining.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-rose-100">
                  <p className="text-3xl md:text-4xl font-bold text-rose-600">
                    {String(item.value).padStart(2, "0")}
                  </p>
                  <p className="text-sm md:text-base font-medium text-gray-600 mt-2">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details & Schedule */}
        <div className="grid md:grid-cols-2 gap-8">
          <div
            ref={detailsRef}
            className={`space-y-6 scroll-transition ${
              detailsVisible ? "scroll-animate-fade-left" : "scroll-hidden-left"
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-800">
              Wedding Details
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="text-3xl">📅</div>
                <div>
                  <p className="font-semibold text-gray-800">Date</p>
                  <p className="text-gray-600">Saturday, April 25, 2026</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-3xl">🕐</div>
                <div>
                  <p className="font-semibold text-gray-800">Time</p>
                  <p className="text-gray-600">5:00 PM</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="text-3xl">📍</div>
                <div>
                  <p className="font-semibold text-gray-800">Venue</p>
                  <p className="text-gray-600">
                    Grand Ballroom, Paradise Hotel
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}

          <div
            ref={scheduleRef}
            className={`space-y-6 scroll-transition ${
              scheduleVisible
                ? "scroll-animate-fade-right"
                : "scroll-hidden-right"
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-800">
              Wedding Schedule
            </h3>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-rose-50 transition border border-gray-200"
                >
                  <div className="text-sm font-bold text-rose-600 bg-white px-3 py-1 rounded-full w-fit">
                    {item.time}
                  </div>
                  <p className="text-gray-700 font-medium">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

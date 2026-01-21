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
    { time: "៥:០០​ ល្ងាច", event: "ពិធីទទួលភ្ញៀវកិត្តិយស" },
    { time: "៥:៣០ ល្ងាច", event: "ពិធីមង្គលចាប់ផ្តើម" },
    { time: "៦:០០​ ល្ងាច", event: "ពេលពិសាភេសជ្ជៈ" },
    { time: "៧:០០​ ល្ងាច", event: "ពិធីបម្រើអាហារពេលល្ងាច" },
    { time: "៨:៣០​ ល្ងាច", event: "ពិធីកាត់នំ" },
    { time: "៩:០០ ល្ងាច", event: "ពេលវេលារាំ និងអបអរសាទររួមគ្នា" },
  ];

  return (
    <section
      id="details"
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 bg-white/50 scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg md:text-2xl lg:text-5xl text-rose-600 font-khmer text-center mb-4">
          តោះមកដឹងព័ត៌មានលម្អិតពីពិធីមង្គលការរបស់យើង!
        </h2>

        {/* Countdown Timer */}
        <div
          ref={countdownRef}
          className={`bg-linear-to-r from-rose-50 to-amber-50 rounded-2xl p-8 md:p-12 mb-16 border border-rose-200 scroll-transition ${
            countdownVisible ? "scroll-animate-scale" : "scroll-hidden-scale"
          }`}
        >
          <h3 className="text-lg md:text-xl lg:text-2xl font-khmer text-center mb-8 text-gray-800">
            រយះពេលដែលនៅសល់រហូតដល់ថ្ងៃមង្គលការ
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "ថ្ងៃ", value: timeRemaining.days },
              { label: "ម៉ោង", value: timeRemaining.hours },
              { label: "នាទី", value: timeRemaining.minutes },
              { label: "វិនាទី", value: timeRemaining.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-rose-100">
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-rose-600">
                    {String(item.value).padStart(2, "0")}
                  </p>
                  <p className="text-xs md:text-sm lg:text-base font-khmer font-medium text-gray-600 mt-2">
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
            <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">
              Wedding Details
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="text-2xl md:text-3xl">📅</div>
                <div>
                  <p className="font-khmer text-gray-800 text-sm md:text-base">
                    នៅវេលាថ្ងៃទី
                  </p>
                  <p className="text-gray-600 text-md md:text-sm xl:text-lg">
                    សៅរ៏, មេសា ២៤, ២០២៦
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-2xl md:text-3xl">🕐</div>
                <div>
                  <p className="font-khmer text-gray-800 text-sm md:text-base">
                    នៅម៉ោង
                  </p>
                  <p className="text-gray-600 text-md md:text-sm xl:text-lg">
                    ៥:០០​ ល្ងាច
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="text-2xl md:text-3xl">📍</div>
                <div>
                  <p className="font-khmer text-gray-800 text-sm md:text-base">
                    ទីតាំងស្ថិតនៅ
                  </p>
                  <p className="text-gray-600 text-md md:text-sm text xl:text-lg">
                    ភូមិ: ភូមិក្របៅ ឃុំ: ក្របៅ ស្រុក: ស្រុកកំចាយមារ ខេត្ត: ខេត្តព្រៃវែង
                    <br />
                    <b>ក្បែរផ្សារក្របៅ</b>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d671.9099526779493!2d105.76242130268355!3d11.622650357628588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2skh!4v1769002630187!5m2!1sen!2skh"
                  width="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
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
            <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">
              Wedding Schedule
            </h3>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-rose-50 transition border border-gray-200"
                >
                  <div className="text-sm md:text-base lg:text-lg font-bold text-rose-600 bg-white px-3 py-1 rounded-full w-fit">
                    {item.time}
                  </div>
                  <p className="text-gray-700 font-khmer text-xs md:text-sm lg:text-base">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface RSVPFormData {
  name: string;
  guests: number;
  attending: boolean;
  wishes: string;
}

export default function RSVP({
  onWishSubmit,
  guestName,
}: {
  onWishSubmit: (wish: {
    name: string;
    message: string;
    guests: number;
    attending: boolean;
  }) => void;
  guestName: string;
}) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  const [formData, setFormData] = useState<RSVPFormData>({
    name: guestName,
    guests: 1,
    attending: true,
    wishes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.wishes.trim()) {
      onWishSubmit({
        name: formData.name || "Anonymous Guest",
        message: formData.wishes,
        guests: formData.guests,
        attending: formData.attending,
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: guestName,
        guests: 1,
        attending: true,
        wishes: "",
      });
    }, 3000);
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-white to-rose-50 scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          RSVP
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          We would love to have you celebrate with us!
        </p>

        <div
          ref={formRef}
          className={`bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-rose-200 scroll-transition ${
            formVisible ? "scroll-animate-scale" : "scroll-hidden-scale"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How many guests will be joining you?
              </label>
              <select
                value={formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Will you be joining us?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: true })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                    formData.attending
                      ? "bg-rose-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Yes, I&apos;ll be there! ✓
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: false })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                    !formData.attending
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Sorry, can&apos;t make it
                </button>
              </div>
            </div>

            {/* Wishes Box */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Best Wishes & Messages ✨
              </label>
              <textarea
                value={formData.wishes}
                onChange={(e) =>
                  setFormData({ ...formData, wishes: e.target.value })
                }
                placeholder="Share your heartfelt message, blessings, or advice for the newlyweds..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.wishes.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-lg font-bold text-lg hover:from-rose-600 hover:to-rose-700 transition shadow-lg"
            >
              {submitted ? "✓ Message Sent!" : "Send My RSVP & Wishes"}
            </button>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-medium">
                  Thank you! Your RSVP has been received. 💕
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have questions?{" "}
            <span className="text-rose-600 font-semibold">
              Contact us at phorn.mey@wedding.com
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

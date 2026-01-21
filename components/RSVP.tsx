"use client";

import React from "react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/lib/supabase";

interface RSVPFormData {
  guests: number;
  attending: boolean;
  wishes: string;
}

export default function RSVP({
  onWishSubmit,
  guestName,
  guestId,
}: {
  onWishSubmit: (wish: {
    name: string;
    message: string;
    guests: number;
    attending: boolean;
  }) => void;
  guestName: string;
  guestId?: number;
}) {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  const [formData, setFormData] = useState<RSVPFormData>({
    guests: 1,
    attending: true,
    wishes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.wishes.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      // If guestId is provided, save to database
      if (guestId) {
        const { error: dbError } = await supabase.from("wishes_feed").insert([
          {
            guest_id: guestId,
            name: guestName,
            number_of_guests: formData.guests,
            will_attend: formData.attending,
            message: formData.wishes,
          },
        ]);

        if (dbError) {
          // Check if it's a duplicate key error (unique constraint violation)
          if (dbError.code === "23505" || dbError.message.includes("unique")) {
            setError(
              "អ្នកបានផ្ញើសារជូនពររួចហើយ។ អ្នកមានលទ្ធភាពផ្ញើសារតែមួយដង។ សូមអរគុណ! 💌",
            );
          } else {
            setError("មានបញ្ហាក្នុងការរក្សាទុកសាររបស់អ្នក។ សូមព្យាយាមម្តងទៀត។");
          }
          setSubmitting(false);
          return;
        }
      }

      // Also call the parent callback for local state
      onWishSubmit({
        name: guestName,
        message: formData.wishes,
        guests: formData.guests,
        attending: formData.attending,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          guests: 1,
          attending: true,
          wishes: "",
        });
      }, 3000);
    } catch (err) {
      setError("មានកំហុសមិនរំពឹងទុក។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 bg-linear-to-b from-white/80 to-rose-50/50 scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-khmer text-center mb-4 text-gray-800">
          សារជូនពរដល់គូរស្វាមីភរិយាថ្មីមួយគូរនេះ
        </h2>
        <p className="text-center text-sm md:text-base lg:text-lg text-gray-600 mb-12 font-khmer">
          តោះមានសារជូនពរអីដល់គូរស្នេហ៏មួយគូរនេះអត់ អ្នកអាចសរសេរខាងក្រោម
        </p>

        <div
          ref={formRef}
          className={`bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-rose-200 scroll-transition ${
            formVisible ? "scroll-animate-scale" : "scroll-hidden-scale"
          }`}
        >
          {/* Error Modal */}
          {error && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-2xl animate-in fade-in scale-95">
                <div className="text-center">
                  <p className="text-5xl mb-4">⚠️</p>
                  <p className="text-gray-800 font-khmer text-base md:text-lg mb-6 leading-relaxed">
                    {error}
                  </p>
                  <button
                    onClick={() => setError(null)}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-8 rounded-lg transition"
                  >
                    យល់ព្រម
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Number of Guests */}
            <div>
              <label className="block text-xs md:text-sm font-khmer text-gray-700 mb-2">
                តើមានភ្ញៀវប៉ុន្មាននាក់នឹងចូលរួមជាមួយអ្នក?​
                (អត់ចង់ប្រាប់ក៏បានដែរ)
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
                    {num} {num === 1 ? "នាក់" : "នាក់"}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-xs md:text-sm font-khmer text-gray-700 mb-4">
                មកចូលរួមពិធីមង្គលការរបស់ពួកយើងទេ?
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
                  បាទ/ចាស, ខ្ញុំនឹងទៅ! ✓
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
                  ទេ, ខ្ញុំមិនអាចទៅបាន
                </button>
              </div>
            </div>

            {/* Wishes Box */}
            <div>
              <label className="block text-xs md:text-sm font-khmer text-gray-700 mb-2">
                សារជូនពរដល់គូរស្វាមីភរិយាថ្មីមួយគូនេះ ✨
              </label>
              <textarea
                value={formData.wishes}
                onChange={(e) =>
                  setFormData({ ...formData, wishes: e.target.value })
                }
                placeholder="សារជូនពររបស់អ្នកនៅទីនេះ..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {formData.wishes.length} អក្សរ
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-linear-to-r from-rose-500 to-rose-600 text-white py-4 rounded-lg font-bold text-sm md:text-base lg:text-lg hover:from-rose-600 hover:to-rose-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "កំពុងផ្ញើ..."
                : submitted
                  ? "✓ សារត្រូវបានផ្ញើ!"
                  : "ផ្ញើសារជូនពរ"}
            </button>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-medium">
                  សូមអរគុណ! សាររបស់អ្នកត្រូវបានទទួល។ 💕
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-sm md:text-base text-gray-600">
            ចង់បានវេបសាយចឹងដែរមែន?{" "}
            <span className="text-rose-600 font-semibold">
              ទំនាក់ទំនងមកពួកយើងតាមតេឡេក្រាម 0974242016
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

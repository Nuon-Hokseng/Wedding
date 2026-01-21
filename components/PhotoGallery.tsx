"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function PhotoGallery() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: thumbsRef, isVisible: thumbsVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: collageRef, isVisible: collageVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { ref: collageItemsRef, isVisible: collageItemsVisible } =
    useScrollAnimation({
      threshold: 0.1,
      triggerOnce: true,
    });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCollageIndex, setSelectedCollageIndex] = useState<
    number | null
  >(null);

  const photos = [
    { year: "2022", src: "/pic1.jpeg", title: "When We Met" },
    { year: "2023", src: "/pic2.jpeg", title: "Our Journey Begins" },
    { year: "2024", src: "/pic3.jpeg", title: "Growing Together" },
    { year: "2025", src: "/pic4.jpeg", title: "Almost Here!" },
  ];

  const collagePhotos = [
    { src: "/pic1.jpeg", title: "Laughter & Love" },
    { src: "/pic2.jpeg", title: "Cherished Moments" },
    { src: "/pic3.jpeg", title: "Together Forever" },
    { src: "/pic4.jpeg", title: "Beautiful Memories" },
    { src: "/pic1.jpeg", title: "Happiness" },
    { src: "/pic2.jpeg", title: "Our Story" },
    { src: "/pic3.jpeg", title: "Timeless Moments" },
  ];

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="w-full py-20 px-4 md:px-8 bg-linear-to-b from-white via-rose-50 to-white scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          Our Moments Together
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          A journey through years of love and laughter
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Main Photo */}
          <div
            ref={imageRef}
            className={`relative group scroll-transition ${
              imageVisible ? "scroll-animate-fade-left" : "scroll-hidden-left"
            }`}
          >
            <div className="relative h-96 md:h-125 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={photos[selectedIndex].src || "/placeholder.svg"}
                alt={photos[selectedIndex].title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-5xl">💕</div>
              <div className="absolute bottom-4 right-4 text-4xl">✨</div>
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Year & Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 text-white">
              <p className="text-5xl font-bold">{photos[selectedIndex].year}</p>
              <p className="text-xl">{photos[selectedIndex].title}</p>
            </div>
          </div>

          {/* Thumbnails Grid */}
          <div
            ref={thumbsRef}
            className={`grid grid-cols-2 gap-4 scroll-transition ${
              thumbsVisible
                ? "scroll-animate-fade-right"
                : "scroll-hidden-right"
            }`}
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`relative h-40 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-4 ${
                  selectedIndex === index
                    ? "border-rose-500 scale-105 shadow-lg"
                    : "border-transparent hover:border-rose-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                  <span className="text-white font-bold text-lg">
                    {photo.year}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Counter */}
        <div className="flex justify-center gap-2 mt-8">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                selectedIndex === index
                  ? "bg-rose-500 w-8"
                  : "bg-rose-200 hover:bg-rose-300"
              }`}
              aria-label={`View photo ${index + 1}`}
            />
          ))}
        </div>

        {/* Photo Collage Section */}
        <div
          ref={collageRef}
          className={`mt-20 pt-16 border-t border-rose-200 transition-all duration-1000 ${
            collageVisible ? "scroll-animate-fade-up" : "scroll-hidden"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Our Beautiful Collection
          </h3>
          <p className="text-center text-lg text-gray-600 mb-12">
            Precious moments captured through the lens of love
          </p>

          {/* Elegant Masonry Grid Collage */}
          <div
            ref={collageItemsRef}
            className={`grid grid-cols-2 md:grid-cols-3 grid-flow-dense gap-4 auto-rows-[280px] transition-all duration-1000 ${
              collageItemsVisible ? "scroll-animate-fade-up" : "scroll-hidden"
            }`}
          >
            {collagePhotos.map((photo, index) => {
              let colSpan = "col-span-1";
              let rowSpan = "row-span-1";

              // Create elegant masonry pattern
              if (index === 0) {
                colSpan = "col-span-2 md:col-span-2";
                rowSpan = "md:row-span-2";
              } else if (index === 3) {
                colSpan = "col-span-1";
                rowSpan = "md:row-span-2";
              } else if (index === 6) {
                // Make the last item wider on desktop to fill remaining space
                colSpan = "col-span-1 md:col-span-2";
              }

              return (
                <div
                  key={index}
                  onClick={() => setSelectedCollageIndex(index)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 ${colSpan} ${rowSpan} bg-linear-to-br from-rose-100 to-amber-100`}
                >
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Elegant overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-4">
                    <p className="text-white font-semibold text-lg">
                      {photo.title}
                    </p>
                  </div>

                  {/* Decorative corner accents */}
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for Collage Photo */}
        {selectedCollageIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedCollageIndex(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-96 md:h-150">
                <Image
                  src={
                    collagePhotos[selectedCollageIndex]?.src ||
                    "/placeholder.svg"
                  }
                  alt={collagePhotos[selectedCollageIndex]?.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 bg-linear-to-b from-white to-rose-50">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {collagePhotos[selectedCollageIndex]?.title}
                </h4>
                <p className="text-gray-600">
                  A precious moment in our love story
                </p>
              </div>

              <button
                onClick={() => setSelectedCollageIndex(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 font-bold text-xl transition-all shadow-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

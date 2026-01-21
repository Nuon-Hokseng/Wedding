import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  // Slight negative bottom rootMargin triggers exit a bit earlier, giving room for smooth transitions
  const { threshold = 0.1, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}

"use client";

import { useState, useEffect, useRef } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function ScrollButtons() {
  const [showButtons, setShowButtons] = useState(false);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const isNearTop = scrollY < 100;
      const isNearBottom = scrollY + windowHeight >= docHeight - 100;

      setShowUp(!isNearTop);
      setShowDown(!isNearBottom);
      setShowButtons(scrollY > 100); // only show after scrolling a bit (avoids flash)
    };

    const handleScroll = () => {
      updateVisibility();

      // Clear previous timer
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      // Hide all after 2 seconds of no scrolling
      scrollTimer.current = setTimeout(() => {
        setShowButtons(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateVisibility);
    updateVisibility(); // initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateVisibility);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (!showButtons) return null;

  return (
    <>
      {/* Down button (to bottom) – appears at top‑right */}
      {showDown && (
        <button
          onClick={scrollToBottom}
          className="fixed top-20 right-5 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Scroll to bottom"
        >
          <FaArrowDown size={20} />
        </button>
      )}
      {/* Up button (to top) – appears at bottom‑right */}
      {showUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
}
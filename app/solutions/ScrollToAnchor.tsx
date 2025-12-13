"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    // Handle hash anchor scrolling on client side
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        // Try to find the element
        const element = document.querySelector(hash);
        if (element) {
          // Add a temporary highlight to show which element was targeted
          element.classList.add("anchor-target");
          setTimeout(() => {
            element.classList.remove("anchor-target");
          }, 2000);

          // Scroll to element with offset for header
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          // Debug: log if element not found
          console.log("Anchor element not found:", hash, "Available IDs:", 
            Array.from(document.querySelectorAll("[id]")).map(el => el.id));
        }
      }
    };

    // Try immediately
    handleScroll();

    // Also try after delays in case content is still loading
    const timeout1 = setTimeout(handleScroll, 100);
    const timeout2 = setTimeout(handleScroll, 500);
    const timeout3 = setTimeout(handleScroll, 1000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [pathname]);

  return (
    <style jsx>{`
      :global(.anchor-target) {
        outline: 3px solid #0066cc !important;
        outline-offset: 4px;
        transition: outline 0.3s ease;
      }
    `}</style>
  );
}










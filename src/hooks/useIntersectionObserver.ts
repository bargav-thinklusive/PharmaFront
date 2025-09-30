import { useEffect, useState, useCallback } from 'react';

export const useIntersectionObserver = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Only update if user is scrolling, not clicking
        const isScrolling = !document.querySelector('[data-clicking="true"]');

        if (!isScrolling) return;

        // Find the section whose top is closest to the viewport top, preferring shallower depth
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestDistance = Infinity;
        let bestDepth = Infinity;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const rect = entry.boundingClientRect;
          const depth = entry.target.id.split('-').length;
          const distanceFromTop = Math.abs(rect.top - 100); // 100px from top

          // Prioritize closer to top, then shallower depth
          if (distanceFromTop < bestDistance ||
              (distanceFromTop === bestDistance && depth < bestDepth)) {
            bestDistance = distanceFromTop;
            bestDepth = depth;
            bestEntry = entry;
          }
        }

        if (bestEntry !== null) {
          setActiveSection(bestEntry.target.id);
        }
      },
      {
        threshold: 0.5,
        rootMargin: '-100px 0px -40% 0px'
      }
    );

    const headings = document.querySelectorAll('[id^="section-"]');
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    // Mark as clicking to prevent observer interference
    document.body.setAttribute('data-clicking', 'true');
    setActiveSection(sectionId);

    setTimeout(() => {
      document.body.removeAttribute('data-clicking');
    }, 1000);
  }, []);

  return { activeSection, handleNavigate };
};
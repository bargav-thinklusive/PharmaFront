import { useEffect, useState, useCallback } from 'react';

export const useIntersectionObserver = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Only update if user is scrolling, not clicking
        const isScrolling = !document.querySelector('[data-clicking="true"]');

        if (!isScrolling) return;

        // Find the most specific visible section near the top
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestDepth = -1;
        let bestTopDistance = Infinity;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const rect = entry.boundingClientRect;
          const depth = entry.target.id.split('-').length;
          const topDistance = Math.abs(rect.top - 100);

          // Prioritize deeper sections that are closer to top
          if (depth > bestDepth || (depth === bestDepth && topDistance < bestTopDistance)) {
            bestDepth = depth;
            bestTopDistance = topDistance;
            bestEntry = entry;
          }
        }

        if (bestEntry !== null) {
          setActiveSection(bestEntry.target.id);
        }
      },
      {
        threshold: [0, 0.1, 0.5, 1.0],
        rootMargin: '-150px 0px -70% 0px'
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
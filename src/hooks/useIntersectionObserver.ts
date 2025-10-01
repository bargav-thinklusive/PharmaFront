import { useEffect, useState, useCallback } from 'react';

export const useIntersectionObserver = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const updateActiveSection = () => {
      // Only update if user is scrolling, not clicking
      const isScrolling = !document.querySelector('[data-clicking="true"]');

      if (!isScrolling) return;

      const headings = document.querySelectorAll('[id^="section-"]');
      let bestSection = '';
      let bestDistance = Infinity;
      let bestDepth = 0;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const depth = heading.id.split('-').length;
        const distanceFromTop = Math.abs(rect.top);

        // Pick the section closest to viewport top, preferring deeper sections
        if (distanceFromTop < bestDistance || (distanceFromTop === bestDistance && depth > bestDepth)) {
          bestDistance = distanceFromTop;
          bestDepth = depth;
          bestSection = heading.id;
        }
      });

      if (bestSection) {
        setActiveSection(bestSection);
      }
    };

    const handleScroll = () => {
      updateActiveSection();
    };

    // Initial update
    updateActiveSection();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
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


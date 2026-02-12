import { useEffect, useState, useCallback } from 'react';

export const useIntersectionObserver = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const updateActiveSection = () => {
      // Only update if user is scrolling, not clicking
      const isScrolling = !document.querySelector('[data-clicking="true"]');

      if (!isScrolling) return;

      const headings = document.querySelectorAll('[id^="section-"]');
      const threshold = 150; // Pixels from top to trigger section change
      let currentSection = '';

      // Check for bottom of page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

      if (isAtBottom && headings.length > 0) {
        currentSection = headings[headings.length - 1].id;
      } else {
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentSection = heading.id;
          }
        });
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
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


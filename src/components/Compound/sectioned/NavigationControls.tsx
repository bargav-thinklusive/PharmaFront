
interface Section {
    id: number;
    title: string;
}

interface NavigationControlsProps {
    currentSection?: Section;
    prevSection: Section | null | undefined;
    nextSection: Section | null | undefined;
    onNavigate: (direction: 'next' | 'prev') => void;
}

/**
 * Footer component for section navigation.
 */
const NavigationControls = ({ currentSection, prevSection, nextSection, onNavigate }: NavigationControlsProps) => {
    return (
        <footer className="mt-12 flex justify-between items-center border-t pt-8 border-gray-100">
            <button
                onClick={() => onNavigate('prev')}
                disabled={!prevSection}
                className="section-nav-button text-gray-700 items-start"
                aria-label="Previous section"
            >
                {prevSection && (
                    <>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-black mb-1">Previous</span>
                        <span className="font-bold text-sm">← {prevSection.title}</span>
                    </>
                )}
            </button>

            <div className="hidden md:flex flex-col items-center opacity-60">
                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-black mb-1">Current</span>
                <span className="text-blue-600 font-black text-xs">{currentSection?.title}</span>
            </div>

            <button
                onClick={() => onNavigate('next')}
                disabled={!nextSection}
                className="section-nav-button text-gray-700 items-end"
                aria-label="Next section"
            >
                {nextSection && (
                    <>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-black mb-1">Next</span>
                        <span className="font-bold text-sm">{nextSection.title} →</span>
                    </>
                )}
            </button>
        </footer>
    );
};

export default NavigationControls;

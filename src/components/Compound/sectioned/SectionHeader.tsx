
interface Section {
    id: number;
    key: string;
    title: string;
}

interface SectionHeaderProps {
    sections: Section[];
    currentStep: number;
    onNavigate: (id: number) => void;
}

/**
 * Header component showing all section names as clickable navigation tabs.
 */
const SectionHeader = ({ sections, currentStep, onNavigate }: SectionHeaderProps) => {
    return (
        <header className="mb-6 border-b border-gray-200">
            <nav className="flex flex-wrap gap-1 pb-0">
                {sections.map((section) => {
                    const isActive = section.id === currentStep;
                    return (
                        <button
                            key={section.id}
                            onClick={() => onNavigate(section.id)}
                            className={`px-3 py-2 text-sm font-medium rounded-t-md transition-all duration-150 whitespace-nowrap border-b-2 ${isActive
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {section.title}
                        </button>
                    );
                })}
            </nav>
        </header>
    );
};

export default SectionHeader;

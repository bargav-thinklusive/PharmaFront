
import type { ReactNode } from 'react';

interface Section {
    id: number;
    key: string;
    title: string;
    icon?: ReactNode;
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
        <header className="mb-6 border-b border-slate-200">
            <nav className="flex flex-wrap gap-x-3 gap-y-1 pb-0">
                {sections.map((section) => {
                    const isActive = section.id === currentStep;
                    return (
                        <button
                            key={section.id}
                            onClick={() => onNavigate(section.id)}
                            className={`flex items-center gap-2 px-2.5 py-2 text-xs font-bold tracking-wide transition-all duration-150 whitespace-nowrap border-b-2 cursor-pointer ${
                                isActive
                                    ? 'border-[#0e8a67] text-[#0e8a67]'
                                    : 'border-transparent text-slate-500 hover:text-[#0e8a67]/70'
                            }`}
                        >
                            {section.icon && <span className="flex-shrink-0">{section.icon}</span>}
                            <span>{section.title}</span>
                        </button>
                    );
                })}
            </nav>
        </header>
    );
};

export default SectionHeader;

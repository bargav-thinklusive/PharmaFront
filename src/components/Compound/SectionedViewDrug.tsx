
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Summary from './Summary';
import { useUser } from '../../context/UserContext';
import './SectionedViewDrug.css';

// Modular Components
import SectionHeader from './sectioned/SectionHeader';
import SectionContent from './sectioned/SectionContent';
import NavigationControls from './sectioned/NavigationControls';
import { sampleDrugData } from './sectioned/sampleData';

/**
 * Main component for the section-based drug details view.
 * Handles state management, data fetching, and high-level layout.
 */
export default function SectionedViewDrug() {
    const { cid, version } = useParams();
    const { drugsData } = useUser();
    const [currentStep, setCurrentStep] = useState(1);

    // Find drug data
    const drugToDisplay = useMemo(() => {
        const found = drugsData.find((d: any) => d.cid === cid && d.version === parseInt(version || '1'));
        return found || sampleDrugData; // Fallback to sample data if not found
    }, [cid, version, drugsData]);

    // Format display data by excluding internal fields
    const displayData = useMemo(() => {
        if (!drugToDisplay) return null;
        return Object.keys(drugToDisplay).reduce((acc: any, key) => {
            if (!['_id', 'cid', 'version', 'createdAt', 'updatedAt', 'references'].includes(key)) {
                acc[key] = drugToDisplay[key];
            }
            return acc;
        }, {});
    }, [drugToDisplay]);

    // Build section list for navigation
    const sections = useMemo(() => {
        const sequence = [
            { id: 1, key: 'summary', title: 'Title and Summary' },
            { id: 2, key: 'marketInformation', title: 'Market Information' },
            { id: 3, key: 'physicalAndChemicalProperties', title: 'Physical and Chemical Properties' },
            { id: 4, key: 'analyticalDevelopment', title: 'Analytical Development' },
            { id: 5, key: 'drugProductInformation', title: 'Drug Product Information' },
            { id: 6, key: 'appendices', title: 'Appendices' },
        ];

        // Filter based on what exists in data, but keep Summary
        return sequence.filter(s => s.key === 'summary' || (displayData && displayData[s.key]));
    }, [displayData]);

    // Cleanup: Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    if (!drugToDisplay) {
        return (
            <div className="sectioned-view-container">
                <div className="p-8 text-center text-red-600 text-xl font-medium bg-white rounded-xl shadow-lg">
                    No data found for drug with CID: <span className="font-mono">{cid}</span>
                </div>
            </div>
        );
    }

    const currentSection = sections.find(s => s.id === currentStep);
    const prevSection = currentStep > 1 ? sections.find(s => s.id === currentStep - 1) : null;
    const nextSection = currentStep < sections.length ? sections.find(s => s.id === currentStep + 1) : null;

    const handleNavigate = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setCurrentStep(prev => Math.min(sections.length, prev + 1));
        } else {
            setCurrentStep(prev => Math.max(1, prev - 1));
        }
    };

    return (
        <div className="sectioned-view-container">
            <div className="sectioned-view-content">

                <SectionHeader
                    currentStep={currentStep}
                    totalSteps={sections.length}
                    title={currentSection?.title}
                />

                <main className="min-h-[50vh] animate-fadeIn">
                    {currentStep === 1 ? (
                        <Summary drug={drugToDisplay} sectionId={1} />
                    ) : (
                        <div>
                            <h1 className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-6 inline-block">
                                {currentStep}. {currentSection?.title}
                            </h1>
                            {displayData && currentSection && (
                                <SectionContent
                                    data={displayData[currentSection.key]}
                                    sectionIndex={`${currentStep}`}
                                />
                            )}
                        </div>
                    )}
                </main>

                <NavigationControls
                    currentSection={currentSection}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    onNavigate={handleNavigate}
                />
            </div>
        </div>
    );
}

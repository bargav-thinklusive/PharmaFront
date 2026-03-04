
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './SectionedViewDrug.css';

// Modular Components
import SectionHeader from './sectioned/SectionHeader';
import SectionContent from './sectioned/SectionContent';

/**
 * Main component for the section-based drug details view.
 * Handles state management, data fetching, and high-level layout.
 */
export default function SectionedViewDrug() {
    const { cid, version } = useParams();
    const { drugsData } = useUser();
    const [currentStep, setCurrentStep] = useState(1);

    // Find drug data by cid (version is nested inside MarketInformation/ProductOverview, not top-level)
    const drugToDisplay = useMemo(() => {
        const found = drugsData.find((d: any) => d.cid === cid);
        return found || null;
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
            { id: 1, key: 'ExecutiveSummary', title: 'Executive Summary' },
            { id: 2, key: 'ProductOverview', title: 'Product Overview' },
            { id: 3, key: 'RegulatoryInsights', title: 'Regulatory Insights' },
            { id: 4, key: 'GenericEntrants', title: 'Generic Entrants' },
            { id: 5, key: 'PhysicalChemicalProperties', title: 'Physical & Chemical Properties' },
            { id: 6, key: 'DrugSubstance', title: 'Drug Substance' },
            { id: 7, key: 'DrugProductInformation', title: 'Drug Product Information' },
            { id: 8, key: 'LabelingInformation', title: 'Labeling Information' },
            { id: 9, key: 'BaBeStudies', title: 'BA/BE Studies' },
            { id: 10, key: 'Sources', title: 'Sources' },
            { id: 11, key: 'Glossary', title: 'Glossary' },
            { id: 12, key: 'Appendices', title: 'Appendices' },
        ];

        // Always show all sections regardless of whether the data is populated
        return sequence;
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

    const handleNavigateById = (id: number) => {
        setCurrentStep(id);
    };

    return (
        <div className="sectioned-view-container">
            <div className="sectioned-view-content">

                <SectionHeader
                    sections={sections}
                    currentStep={currentStep}
                    onNavigate={handleNavigateById}
                />

                <main className="min-h-[50vh] animate-fadeIn">
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
                </main>


            </div>
        </div>
    );
}

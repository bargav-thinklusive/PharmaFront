import React from 'react';
import {
    FiLayers,
    FiFileText,
    FiShield,
    FiUsers,
    FiDroplet,
    FiCpu,
    FiPackage,
    FiTag,
    FiClipboard,
    FiLink,
    FiBookOpen,
    FiPaperclip
} from 'react-icons/fi';

export interface SectionItem {
    id: number;
    key: string;
    title: string;
    icon: React.ReactNode;
}

export const SECTIONS: SectionItem[] = [
    { id: 1, key: 'ExecutiveSummary', title: 'Executive Summary', icon: <FiFileText className="w-3.5 h-3.5" /> },
    { id: 2, key: 'ProductOverview', title: 'Product Overview', icon: <FiLayers className="w-3.5 h-3.5" /> },
    { id: 3, key: 'RegulatoryInsights', title: 'Regulatory Insights', icon: <FiShield className="w-3.5 h-3.5" /> },
    { id: 4, key: 'GenericEntrants', title: 'Generic Entrants', icon: <FiUsers className="w-3.5 h-3.5" /> },
    { id: 5, key: 'PhysicalChemicalProperties', title: 'Physical & Chemical Properties', icon: <FiDroplet className="w-3.5 h-3.5" /> },
    { id: 6, key: 'DrugSubstance', title: 'Drug Substance', icon: <FiCpu className="w-3.5 h-3.5" /> },
    { id: 7, key: 'DrugProductInformation', title: 'Drug Product Information', icon: <FiPackage className="w-3.5 h-3.5" /> },
    { id: 8, key: 'LabelingInformation', title: 'Labeling Information', icon: <FiTag className="w-3.5 h-3.5" /> },
    { id: 9, key: 'BaBeStudies', title: 'BA/BE Studies', icon: <FiClipboard className="w-3.5 h-3.5" /> },
    { id: 10, key: 'Sources', title: 'Sources', icon: <FiLink className="w-3.5 h-3.5" /> },
    { id: 11, key: 'Glossary', title: 'Glossary', icon: <FiBookOpen className="w-3.5 h-3.5" /> },
    { id: 12, key: 'Appendices', title: 'Appendices', icon: <FiPaperclip className="w-3.5 h-3.5" /> },
];

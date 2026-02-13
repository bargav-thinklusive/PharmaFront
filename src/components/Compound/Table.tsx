
import React, { useState, useEffect, useMemo } from "react";
import { toTitleCase } from "../../utils/utils";

interface TableProps {
  drug: any;
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
}

const Table: React.FC<TableProps> = ({ drug, activeSection, onNavigate }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sectionStructure = useMemo(() => {
    const excludedKeys = ['_id', 'cid', 'version', 'createdAt', 'updatedAt', 'references'];

    const dynamicKeys = Object.keys(drug || {}).filter(
      (key) => !excludedKeys.includes(key)
    );

    const structures = dynamicKeys.map((key, index) => {
      const sectionId = index + 2;
      const data = drug[key];

      let subsections: any[] = [];
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        // Special handling for Appendices / Manufacturing Routes to map array items to subsections
        if (key.toLowerCase().includes('appendic') && Array.isArray(data.appendices)) {
          subsections = data.appendices.map((item: any, idx: number) => ({
            key: `appendix-${idx}`,
            title: typeof item === 'object' ? (item.appendix || item.name || `Appendix ${idx + 1}`) : item,
            hasChildren: false
          }));
        } else {
          // Only include "complex" fields in TOC that will be rendered with headers in ViewDrug
          subsections = Object.entries(data)
            .filter(([_, v]) => Array.isArray(v) || (typeof v === 'object' && v !== null))
            .map(([subKey, subVal]) => ({
              key: subKey,
              title: toTitleCase(subKey),
              hasChildren: (Array.isArray(subVal) && subVal.length > 0) || (typeof subVal === 'object' && subVal !== null)
            }));
        }
      }

      return {
        id: sectionId,
        key: key,
        title: toTitleCase(key),
        hasSubsections: subsections.length > 0,
        subsections,
        data
      };
    });

    return [
      {
        id: 1,
        key: 'summary',
        title: 'Title and Summary',
        hasSubsections: false,
        subsections: [],
        data: null
      },
      ...structures
    ];
  }, [drug]);

  // Auto-expand/collapse based on activeSection
  useEffect(() => {
    if (!activeSection) return;
    const parts = activeSection.replace('section-', '').split('-').map(Number);
    if (parts.length >= 1) {
      const sectionId = parts[0];
      const section = sectionStructure.find(s => s.id === sectionId);
      if (section && section.hasSubsections) {
        setOpenSections(prev => ({ ...prev, [section.key]: true }));
      }
    }
  }, [activeSection, sectionStructure]);

  // Scroll TOC item into view when it changes
  useEffect(() => {
    if (activeSection) {
      const tocItem = document.querySelector(`[data-section-id="${activeSection}"]`);
      if (tocItem) {
        tocItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      onNavigate?.(sectionId);
    }
  };

  const renderSubsections = (section: any) => {
    if (!section.subsections) return null;

    return section.subsections.map((subsection: any, i: number) => {
      const subsectionId = `section-${section.id}-${i + 1}`;
      const isActiveSubsection = activeSection === subsectionId || activeSection.startsWith(`${subsectionId}-`);

      return (
        <div key={subsection.key} className="mb-1">
          <div
            data-section-id={subsectionId}
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(subsectionId);
            }}
            className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${isActiveSubsection ? 'bg-blue-500 text-white' : ''
              }`}
          >
            <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
              {section.id}.{i + 1} {subsection.title}
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
        Table of Contents
      </h3>
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {sectionStructure.map((section) => {
          const sectionId = `section-${section.id}`;
          const isActiveSection = activeSection === sectionId || activeSection.startsWith(`${sectionId}-`);
          const isOpen = openSections[section.key];
          const hasSubs = section.hasSubsections;

          return (
            <div key={section.key} className="group">
              <div
                data-section-id={sectionId}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSection(sectionId);
                  if (hasSubs) {
                    setOpenSections(prev => ({ ...prev, [section.key]: !prev[section.key] }));
                  }
                }}
                className={`flex justify-between items-center py-2 px-3 rounded-md transition-all duration-200 cursor-pointer text-sm
                  ${isActiveSection ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}
                `}
                role="button"
                tabIndex={0}
              >
                <span className="font-medium flex-1">
                  {section.id}. {section.title}
                </span>
                {hasSubs && (
                  <span className="ml-2 transition-transform duration-200">
                    {isOpen ? '▼' : '▶'}
                  </span>
                )}
              </div>

              {hasSubs && isOpen && (
                <div className="ml-5 mt-1 pl-2 border-l-2 border-blue-100 space-y-1 animate-fadeIn">
                  {renderSubsections(section)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;

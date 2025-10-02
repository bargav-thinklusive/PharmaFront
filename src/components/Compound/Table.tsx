


import React, { useState, useEffect, useMemo } from "react";
import { toTitleCase } from "../../utils/utils";

interface TableProps {
  drug: any;
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
}

const Table: React.FC<TableProps> = ({ drug, activeSection, onNavigate }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const hasContent = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
    return true;
  };

  const isPlainObject = (val: any) =>
    typeof val === "object" && val !== null && !Array.isArray(val);

  const sectionStructure = useMemo(() => [
    {
      id: 1,
      key: 'title_and_summary',
      title: 'Title and Summary',
      hasSubsections: false
    },
    {
      id: 2,
      key: 'marketInformation',
      title: 'Market Information',
      hasSubsections: false,
      data: drug?.marketInformation
    },
    {
      id: 3,
      key: 'drugSubstance',
      title: 'Drug Substance',
      hasSubsections: true,
      data: drug?.drugSubstance,
      subsections: [
        { key: 'physicalAndChemicalProperties', title: 'Physical And Chemical Properties' },
        { key: 'processDevelopment', title: 'Process Development' },
        { key: 'analyticalDevelopment', title: 'Analytical Development' },
        { key: 'manufacturingSites', title: 'Manufacturing Sites' }
      ]
    },
    {
      id: 4,
      key: 'drugProduct',
      title: 'Drug Product',
      hasSubsections: true,
      data: drug?.drugProduct?.information
    },
    {
      id: 5,
      key: 'appendices',
      title: 'Appendices',
      hasSubsections: true,
      data: drug?.appendices
    },
    {
      id: 6,
      key: 'references',
      title: 'References',
      hasSubsections: false,
      data: drug?.references
    }
  ], [drug]);

  // Auto-expand/collapse based on activeSection
  useEffect(() => {
    if (!activeSection) return;

    const newOpen: Record<string, boolean> = {};
    const parts = activeSection.replace('section-', '').split('-').map(Number);

    if (parts.length >= 1) {
      const sectionId = parts[0];
      const section = sectionStructure.find(s => s.id === sectionId);

      if (section && section.hasSubsections) {
        newOpen[section.key] = true;

        if (section.key === 'drugSubstance' && parts.length >= 2) {
          const subSectionIdx = parts[1] - 1;
          if (section.subsections && section.subsections[subSectionIdx]) {
            const subKey = section.subsections[subSectionIdx].key;
            newOpen[`${section.key}.${subKey}`] = true;
          }
        }

        if (section.key === 'appendices' && parts.length >= 2) {
          const appendixIdx = parts[1] - 1;
          const appendixKeys = ['appendix1', 'appendix2', 'appendix3', 'appendix4', 'appendix5'];
          if (appendixKeys[appendixIdx]) {
            const appendixKey = appendixKeys[appendixIdx];
            newOpen[`${section.key}.${appendixKey}`] = true;
          }
        }

        if (section.key !== 'drugSubstance' && section.key !== 'appendices' && parts.length >= 2) {
          const subSectionIdx = parts[1] - 1;
          if (section.data && isPlainObject(section.data)) {
            const visibleChildren = Object.entries(section.data).filter(
              ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
            );

            if (visibleChildren[subSectionIdx]) {
              const [subKey] = visibleChildren[subSectionIdx];
              newOpen[`${section.key}.${subKey}`] = true;
            }
          }
        }
      }
    }

    // Replace state completely, closing all other sections
    setOpenSections(newOpen);
  }, [activeSection, sectionStructure]);

  // Scroll TOC item into view when it changes
  useEffect(() => {
    if (activeSection) {
      // Scroll the TOC item into view
      const tocItem = document.querySelector(`[data-section-id="${activeSection}"]`);
      if (tocItem) {
        tocItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate position to scroll to, accounting for any fixed headers
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100; // Adjust for any fixed header

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Set active section immediately and after scroll
      onNavigate?.(sectionId);
      setTimeout(() => {
        onNavigate?.(sectionId);
      }, 600);
    }
  };

  const renderSubsections = (section: any, sectionData: any) => {
    if (section.key === 'drugSubstance' && section.subsections) {
      return section.subsections.map((subsection: any, i: number) => {
        const subsectionId = `section-${section.id}-${i + 1}`;
        const subsectionData = sectionData?.[subsection.key];
        // Exact match only
        const isActiveSubsection = activeSection === subsectionId;

        if (!hasContent(subsectionData)) return null;

        let childExpandable = isPlainObject(subsectionData) &&
          Object.entries(subsectionData).some(([k, v]) => !/^\d+$/.test(k) && hasContent(v));

        let visibleGrandChildren = childExpandable
          ? Object.entries(subsectionData).filter(([k, v]) => !/^\d+$/.test(k) && hasContent(v))
          : [];

        // For Process Development, only show Manufacturing Sites as sub-subsection
        if (subsection.key === 'processDevelopment') {
          visibleGrandChildren = visibleGrandChildren.filter(([k]) => k === 'manufacturingSites');
          childExpandable = visibleGrandChildren.length > 0;
        }
        // For Physical and Chemical Properties, remove all sub-subsections
        if (subsection.key === 'physicalAndChemicalProperties') {
          visibleGrandChildren = [];
          childExpandable = false;
        }

        return (
          <div key={subsection.key} className="mb-1">
            <div
              data-section-id={subsectionId}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(subsectionId);
              }}
              className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
                isActiveSubsection ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
                {section.id}.{i + 1} {subsection.title}
              </span>
              {childExpandable && (
                <span
                  className={`${isActiveSubsection ? 'text-white' : 'text-gray-400'} text-xs`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSections(prev => ({
                      ...prev,
                      [`${section.key}.${subsection.key}`]: !prev[`${section.key}.${subsection.key}`]
                    }));
                  }}
                >
                  {openSections[`${section.key}.${subsection.key}`] ? "▼" : "►"}
                </span>
              )}
            </div>

            {childExpandable && openSections[`${section.key}.${subsection.key}`] &&
             visibleGrandChildren.length > 0 && (
              <div className="ml-4 mt-1">
                {visibleGrandChildren.map(([gcKey], j) => {
                  const subSubsectionId = `section-${section.id}-${i + 1}-${j + 1}`;
                  const isActiveSubSubsection = activeSection === subSubsectionId;

                  return (
                    <div
                      key={gcKey}
                      data-section-id={subSubsectionId}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(subSubsectionId);
                      }}
                      className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                        isActiveSubSubsection ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
                        {section.id}.{i + 1}.{j + 1} {toTitleCase(gcKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
    } else if (section.key === 'appendices' && sectionData) {
      // Handle appendices with their specific structure
      const appendixKeys = ['appendix1', 'appendix2', 'appendix3', 'appendix4', 'appendix5'];
      return appendixKeys.map((appendixKey, i) => {
        const appendixData = sectionData[appendixKey];
        if (!hasContent(appendixData)) return null;

        const subsectionId = `section-${section.id}-${i + 1}`;
        const isActiveSubsection = activeSection === subsectionId;

        // Check if this appendix has sub-subsections
        const hasChildren = appendixKey === 'appendix1' ||
          (appendixKey === 'appendix2' && appendixData.specifications) ||
          (appendixKey === 'appendix3' && appendixData.inactiveIngredients) ||
          (appendixKey === 'appendix5' && appendixData.designations);

        return (
          <div key={appendixKey} className="mb-1">
            <div
              data-section-id={subsectionId}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(subsectionId);
              }}
              className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
                isActiveSubsection ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
                {section.id}.{i + 1} {appendixData.name || `Appendix ${i + 1}`}
              </span>
              {hasChildren && (
                <span
                  className={`${isActiveSubsection ? 'text-white' : 'text-gray-400'} text-xs`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSections(prev => ({
                      ...prev,
                      [`${section.key}.${appendixKey}`]: !prev[`${section.key}.${appendixKey}`]
                    }));
                  }}
                >
                  {openSections[`${section.key}.${appendixKey}`] ? "▼" : "►"}
                </span>
              )}
            </div>

            {hasChildren && openSections[`${section.key}.${appendixKey}`] && (
              <div className="ml-4 mt-1">
                {appendixKey === 'appendix1' && appendixData.modularSynthesis && (
                  <div className="mb-1">
                    <div
                      data-section-id={`section-${section.id}-${i + 1}-1`}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(`section-${section.id}-${i + 1}-1`);
                      }}
                      className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                        activeSection === `section-${section.id}-${i + 1}-1` ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      <span className={activeSection === `section-${section.id}-${i + 1}-1` ? 'text-white' : 'text-gray-800'}>
                        {section.id}.{i + 1}.1 Modular Synthesis
                      </span>
                    </div>
                    {appendixData.synthesisSteps && (
                      <div className="ml-4 mt-1">
                        <div
                          data-section-id={`section-${section.id}-${i + 1}-2`}
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection(`section-${section.id}-${i + 1}-2`);
                          }}
                          className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                            activeSection === `section-${section.id}-${i + 1}-2` ? 'bg-blue-500 text-white' : ''
                          }`}
                        >
                          <span className={activeSection === `section-${section.id}-${i + 1}-2` ? 'text-white' : 'text-gray-800'}>
                            {section.id}.{i + 1}.2 Synthesis Steps
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {appendixKey === 'appendix2' && appendixData.specifications && (
                  Object.keys(appendixData.specifications).map((specKey, j) => {
                    if (!hasContent(appendixData.specifications[specKey])) return null;
                    return (
                      <div key={specKey} className="mb-1">
                        <div
                          data-section-id={`section-${section.id}-${i + 1}-${j + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection(`section-${section.id}-${i + 1}-${j + 1}`);
                          }}
                          className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                            activeSection === `section-${section.id}-${i + 1}-${j + 1}` ? 'bg-blue-500 text-white' : ''
                          }`}
                        >
                          <span className={activeSection === `section-${section.id}-${i + 1}-${j + 1}` ? 'text-white' : 'text-gray-800'}>
                            {section.id}.{i + 1}.{j + 1} {toTitleCase(specKey)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                {appendixKey === 'appendix3' && appendixData.inactiveIngredients && (
                  <div className="mb-1">
                    <div
                      data-section-id={`section-${section.id}-${i + 1}-1`}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(`section-${section.id}-${i + 1}-1`);
                      }}
                      className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                        activeSection === `section-${section.id}-${i + 1}-1` ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      <span className={activeSection === `section-${section.id}-${i + 1}-1` ? 'text-white' : 'text-gray-800'}>
                        {section.id}.{i + 1}.1 Inactive Ingredients
                      </span>
                    </div>
                  </div>
                )}
                {appendixKey === 'appendix5' && appendixData.designations && (
                  Object.keys(appendixData.designations).map((designationKey, j) => {
                    if (!hasContent(appendixData.designations[designationKey])) return null;
                    return (
                      <div key={designationKey} className="mb-1">
                        <div
                          data-section-id={`section-${section.id}-${i + 1}-${j + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection(`section-${section.id}-${i + 1}-${j + 1}`);
                          }}
                          className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                            activeSection === `section-${section.id}-${i + 1}-${j + 1}` ? 'bg-blue-500 text-white' : ''
                          }`}
                        >
                          <span className={activeSection === `section-${section.id}-${i + 1}-${j + 1}` ? 'text-white' : 'text-gray-800'}>
                            {section.id}.{i + 1}.{j + 1} {toTitleCase(designationKey)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      });
    } else {
      if (!isPlainObject(sectionData)) return null;

      const visibleChildren = Object.entries(sectionData).filter(
        ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
      );

      return visibleChildren.map(([subKey], i) => {
        const subsectionId = `section-${section.id}-${i + 1}`;
        // Exact match only
        const isActiveSubsection = activeSection === subsectionId;

        return (
          <div
            key={subKey}
            data-section-id={subsectionId}
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(subsectionId);
            }}
            className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
              isActiveSubsection ? 'bg-blue-500 text-white' : ''
            }`}
          >
            <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
              {section.id}.{i + 1} {toTitleCase(subKey)}
            </span>
          </div>
        );
      });
    }
  };

  return (
    <div >
      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
        CONTENTS
      </h3>

      {sectionStructure.map((section) => {
        if (!hasContent(section.data) && section.key !== 'title_and_summary') return null;

        const sectionId = `section-${section.id}`;
        // Exact match only
        const isActiveSection = activeSection === sectionId;
        const expandable = section.hasSubsections && hasContent(section.data);

        return (
          <div key={section.key} className="mb-1">
            <div
              data-section-id={sectionId}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(sectionId);
              }}
              className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
                isActiveSection ? 'bg-blue-500 text-white' : ''
              }`}
              role="button"
              tabIndex={0}
            >
              <span className={isActiveSection ? 'text-white' : 'text-gray-800'}>
                {section.id}. {section.title}
              </span>
              {expandable && (
                <span 
                  className={`${isActiveSection ? 'text-white' : 'text-gray-400'} text-xs`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSections(prev => ({ ...prev, [section.key]: !prev[section.key] }));
                  }}
                >
                  {openSections[section.key] ? "▼" : "►"}
                </span>
              )}
            </div>

            {expandable && openSections[section.key] && (
              <div className="ml-4 mt-1">
                {renderSubsections(section, section.data)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Table;







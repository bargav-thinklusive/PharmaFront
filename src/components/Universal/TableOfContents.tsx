import React, { useState, useEffect } from 'react';
import { toTitleCase } from '../../utils/utils';
import type { SectionConfig } from './UniversalTemplate';

interface TableOfContentsProps {
  sections: (SectionConfig & { hasContent: boolean })[];
  data: any;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  data: _data,
  activeSection,
  onNavigate
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Helper functions
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

  // Auto-expand/collapse based on activeSection
  useEffect(() => {
    if (!activeSection) return;

    const newOpen: Record<string, boolean> = {};
    const parts = activeSection.replace('section-', '').split('-').map(Number);

    if (parts.length >= 1) {
      const sectionId = parts[0];
      const section = sections.find(s => s.id === sectionId);

      if (section && section.hasSubsections) {
        newOpen[section.key] = true;

        // Handle subsections
        if (parts.length >= 2) {
          const subSectionIdx = parts[1] - 1;
          
          if (section.subsections && section.subsections[subSectionIdx]) {
            const subKey = section.subsections[subSectionIdx].key;
            newOpen[`${section.key}.${subKey}`] = true;
          } else if (section.data && isPlainObject(section.data)) {
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

    setOpenSections(newOpen);
  }, [activeSection, sections]);

  // Scroll TOC item into view when activeSection changes
  useEffect(() => {
    if (activeSection) {
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
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      onNavigate(sectionId);
      setTimeout(() => {
        onNavigate(sectionId);
      }, 600);
    }
  };

  // Render subsections for TOC
  const renderSubsections = (section: SectionConfig & { hasContent: boolean }) => {
    if (!section.hasSubsections || !section.data) return null;

    // If subsections are explicitly defined
    if (section.subsections) {
      return section.subsections.map((subsection, i) => {
        const subsectionData = section.data[subsection.key];
        if (!hasContent(subsectionData)) return null;

        const subsectionId = `section-${section.id}-${i + 1}`;
        const isActiveSubsection = activeSection === subsectionId;

        // Check if this subsection has sub-subsections
        let hasChildren = false;
        let visibleGrandChildren: any[] = [];

        if (subsection.hasSubSubsections && subsection.subSubsections) {
          visibleGrandChildren = subsection.subSubsections.filter(subSub => 
            hasContent(subsectionData[subSub.key])
          );
          hasChildren = visibleGrandChildren.length > 0;
        } else if (isPlainObject(subsectionData)) {
          visibleGrandChildren = Object.entries(subsectionData).filter(
            ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
          );
          hasChildren = visibleGrandChildren.length > 0;
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
                isActiveSubsection ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
                {section.id}.{i + 1} {subsection.title}
              </span>
              {hasChildren && (
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

            {/* Render sub-subsections */}
            {hasChildren && openSections[`${section.key}.${subsection.key}`] && (
              <div className="ml-4 mt-1">
                {subsection.hasSubSubsections && subsection.subSubsections
                  ? visibleGrandChildren.map((subSub, j) => {
                      const subSubsectionId = `section-${section.id}-${i + 1}-${j + 1}`;
                      const isActiveSubSubsection = activeSection === subSubsectionId;

                      return (
                        <div
                          key={subSub.key}
                          data-section-id={subSubsectionId}
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection(subSubsectionId);
                          }}
                          className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                            isActiveSubSubsection ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
                            {section.id}.{i + 1}.{j + 1} {subSub.title}
                          </span>
                        </div>
                      );
                    })
                  : visibleGrandChildren.map(([gcKey], j) => {
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
                            isActiveSubSubsection ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
                            {section.id}.{i + 1}.{j + 1} {toTitleCase(gcKey)}
                          </span>
                        </div>
                      );
                    })
                }
              </div>
            )}
          </div>
        );
      });
    }

    // Auto-generate subsections from data
    if (!isPlainObject(section.data)) return null;

    const visibleChildren = Object.entries(section.data).filter(
      ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
    );

    return visibleChildren.map(([subKey, subValue], i) => {
      const subsectionId = `section-${section.id}-${i + 1}`;
      const isActiveSubsection = activeSection === subsectionId;

      // Check for sub-subsections
      const hasChildren = isPlainObject(subValue) &&
        Object.entries(subValue as Record<string, any>).some(([k, v]) => !/^\d+$/.test(k) && hasContent(v));

      return (
        <div key={subKey} className="mb-1">
          <div
            data-section-id={subsectionId}
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(subsectionId);
            }}
            className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
              isActiveSubsection ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
              {section.id}.{i + 1} {toTitleCase(subKey)}
            </span>
            {hasChildren && (
              <span
                className={`${isActiveSubsection ? 'text-white' : 'text-gray-400'} text-xs`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSections(prev => ({
                    ...prev,
                    [`${section.key}.${subKey}`]: !prev[`${section.key}.${subKey}`]
                  }));
                }}
              >
                {openSections[`${section.key}.${subKey}`] ? "▼" : "►"}
              </span>
            )}
          </div>

          {/* Render auto-generated sub-subsections */}
          {hasChildren && openSections[`${section.key}.${subKey}`] && (
            <div className="ml-4 mt-1">
              {Object.entries(subValue as Record<string, any>)
                .filter(([k, v]) => !/^\d+$/.test(k) && hasContent(v))
                .map(([subSubKey], j) => {
                  const subSubsectionId = `section-${section.id}-${i + 1}-${j + 1}`;
                  const isActiveSubSubsection = activeSection === subSubsectionId;

                  return (
                    <div
                      key={subSubKey}
                      data-section-id={subSubsectionId}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(subSubsectionId);
                      }}
                      className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                        isActiveSubSubsection ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
                        {section.id}.{i + 1}.{j + 1} {toTitleCase(subSubKey)}
                      </span>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
        CONTENTS
      </h3>

      <div className="space-y-1">
        {sections.map((section) => {
          if (!section.hasContent) return null;

          const sectionId = `section-${section.id}`;
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
                  isActiveSection ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
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

export default TableOfContents;

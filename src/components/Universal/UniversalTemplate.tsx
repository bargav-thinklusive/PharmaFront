import React, { useState, useEffect, useMemo } from 'react';
import { toTitleCase } from '../../utils/utils';
import DataRenderer from './DataRenderer';
import TableOfContents from './TableOfContents';

export interface SectionConfig {
  id: number;
  key: string;
  title: string;
  data?: any;
  hasSubsections?: boolean;
  subsections?: SubsectionConfig[];
}

export interface SubsectionConfig {
  key: string;
  title: string;
  hasSubSubsections?: boolean;
  subSubsections?: SubSubsectionConfig[];
}

export interface SubSubsectionConfig {
  key: string;
  title: string;
}

interface UniversalTemplateProps {
  data: any;
  sections: SectionConfig[];
  title?: string;
  showTableOfContents?: boolean;
  className?: string;
  onNavigate?: (sectionId: string) => void;
}

const UniversalTemplate: React.FC<UniversalTemplateProps> = ({
  data,
  sections,
  title = "Document",
  showTableOfContents = true,
  className = "",
  onNavigate
}) => {
  const [activeSection, setActiveSection] = useState<string>('');

  // Helper function to check if content exists and is meaningful
  const hasContent = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
    return true;
  };

  // Helper function to check if value is a plain object
  const isPlainObject = (val: any) =>
    typeof val === "object" && val !== null && !Array.isArray(val);

  // Process sections with actual data
  const processedSections = useMemo(() => {
    return sections.map(section => ({
      ...section,
      data: data?.[section.key] || section.data,
      hasContent: hasContent(data?.[section.key] || section.data)
    }));
  }, [data, sections]);

  // Handle navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    onNavigate?.(sectionId);
  };

  // Auto-scroll to section when activeSection changes
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 100;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection]);

  // Render subsections recursively
  const renderSubsections = (
    parentSection: SectionConfig,
    parentData: any
  ): React.ReactNode => {
    if (!parentSection.hasSubsections || !isPlainObject(parentData)) {
      return null;
    }

    // If subsections are explicitly defined, use them
    if (parentSection.subsections) {
      return parentSection.subsections.map((subsection, index) => {
        const subsectionData = parentData[subsection.key];
        if (!hasContent(subsectionData)) return null;

        const subsectionId = `section-${parentSection.id}-${index + 1}`;
        
        return (
          <div key={subsection.key} className="mb-8">
            <h3 
              id={subsectionId}
              className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
            >
              {parentSection.id}.{index + 1} {subsection.title}
            </h3>
            
            <div className="ml-4">
              <DataRenderer data={subsectionData} />
              
              {/* Render sub-subsections if they exist */}
              {subsection.hasSubSubsections && subsection.subSubsections && (
                <div className="mt-6">
                  {renderSubSubsections(parentSection, subsection, subsectionData, index + 1)}
                </div>
              )}
            </div>
          </div>
        );
      });
    }

    // Auto-generate subsections from data keys
    const visibleChildren = Object.entries(parentData).filter(
      ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
    );

    return visibleChildren.map(([subKey, subValue], index) => {
      const subsectionId = `section-${parentSection.id}-${index + 1}`;
      
      return (
        <div key={subKey} className="mb-8">
          <h3 
            id={subsectionId}
            className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2"
          >
            {parentSection.id}.{index + 1} {toTitleCase(subKey)}
          </h3>
          
          <div className="ml-4">
            <DataRenderer data={subValue} />
            
            {/* Auto-generate sub-subsections if the data is an object */}
            {isPlainObject(subValue) && (
              <div className="mt-6">
                {renderAutoSubSubsections(parentSection, subKey, subValue, index + 1)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // Render sub-subsections for explicitly defined subsections
  const renderSubSubsections = (
    parentSection: SectionConfig,
    subsection: SubsectionConfig,
    subsectionData: any,
    subsectionIndex: number
  ): React.ReactNode => {
    if (!subsection.subSubsections) return null;

    return subsection.subSubsections.map((subSubsection, index) => {
      const subSubsectionData = subsectionData[subSubsection.key];
      if (!hasContent(subSubsectionData)) return null;

      const subSubsectionId = `section-${parentSection.id}-${subsectionIndex}-${index + 1}`;
      
      return (
        <div key={subSubsection.key} className="mb-6">
          <h4 
            id={subSubsectionId}
            className="text-base font-medium text-gray-700 mb-3 border-l-4 border-blue-400 pl-3"
          >
            {parentSection.id}.{subsectionIndex}.{index + 1} {subSubsection.title}
          </h4>
          
          <div className="ml-6">
            <DataRenderer data={subSubsectionData} />
          </div>
        </div>
      );
    });
  };

  // Auto-generate sub-subsections from data
  const renderAutoSubSubsections = (
    parentSection: SectionConfig,
    subsectionKey: string,
    subsectionData: any,
    subsectionIndex: number
  ): React.ReactNode => {
    // subsectionKey is intentionally unused - it's for future extensibility
    void subsectionKey;
    if (!isPlainObject(subsectionData)) return null;

    const visibleGrandChildren = Object.entries(subsectionData).filter(
      ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
    );

    return visibleGrandChildren.map(([subSubKey, subSubValue], index) => {
      const subSubsectionId = `section-${parentSection.id}-${subsectionIndex}-${index + 1}`;
      
      return (
        <div key={subSubKey} className="mb-6">
          <h4 
            id={subSubsectionId}
            className="text-base font-medium text-gray-700 mb-3 border-l-4 border-blue-400 pl-3"
          >
            {parentSection.id}.{subsectionIndex}.{index + 1} {toTitleCase(subSubKey)}
          </h4>
          
          <div className="ml-6">
            <DataRenderer data={subSubValue} />
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-8 ${className}`}>
      {/* Table of Contents */}
      {showTableOfContents && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-4">
            <TableOfContents
              sections={processedSections}
              data={data}
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-4xl">
        {title && (
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-300 pb-4">
            {title}
          </h1>
        )}

        {processedSections.map((section) => {
          if (!section.hasContent) return null;

          const sectionId = `section-${section.id}`;
          
          return (
            <div key={section.key} className="mb-12">
              <h2 
                id={sectionId}
                className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-3"
              >
                {section.id}. {section.title}
              </h2>
              
              <div className="mb-6">
                <DataRenderer data={section.data} />
              </div>
              
              {/* Render subsections */}
              {section.hasSubsections && (
                <div className="mt-8">
                  {renderSubsections(section, section.data)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UniversalTemplate;

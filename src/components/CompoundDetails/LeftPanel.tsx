import React from 'react';
import CompoundSummary from './CompoundSummary';
import CompoundSections from './CompoundSections';


interface LeftPanelProps {
  item: any;
  sections: any[];
  renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
  activeId?: string;
  setSummaryRef?: (el: HTMLElement | null) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ item, sections, renderSection,  setSummaryRef }) => {
  return (
    <div className="flex-1 flex flex-col gap-6 min-w-0">
      {/* Title & Summary */}
      <div id="summary" ref={(el) => setSummaryRef && setSummaryRef(el)} className='py-8'>
        <CompoundSummary record={item.Record}  />
      </div>

      {/* All Sections */}
      <CompoundSections sections={sections} renderSection={renderSection} />
    </div>
  );
};

export default LeftPanel;


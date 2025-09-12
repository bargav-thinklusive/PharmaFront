import React from 'react';
import CompoundSections from '../components/CompoundSections';
import CompoundSummary from './CompoundSummary';


interface LeftColumnProps {
  item: any;
  sections: any[];
  renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
  activeId?: string;
  setSummaryRef?: (el: HTMLElement | null) => void;
}

const LeftColumn: React.FC<LeftColumnProps> = ({ item, sections, renderSection, activeId, setSummaryRef }) => {
  return (
    <div className="flex-1 flex flex-col gap-6 min-w-0">
      <div className="max-w-3xl" id="summary" ref={el => setSummaryRef && setSummaryRef(el)}>
        <CompoundSummary record={item.Record} activeId={activeId} />
      </div>
      <CompoundSections sections={sections} renderSection={renderSection} />
    </div>
  );
};

export default LeftColumn;

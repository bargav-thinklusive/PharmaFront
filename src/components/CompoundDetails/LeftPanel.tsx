// import React from 'react';
// import CompoundSections from '../components/CompoundSections';
// import CompoundSummary from './CompoundSummary';


// interface LeftPanelProps {
//   item: any;
//   sections: any[];
//   renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
//   activeId?: string;
//   setSummaryRef?: (el: HTMLElement | null) => void;
// }

// const LeftPanel: React.FC<LeftPanelProps> = ({ item, sections, renderSection, activeId, setSummaryRef }) => {
//   return (
//     <div className="flex-1 flex flex-col gap-6 min-w-0">
//       <div className="max-w-3xl" id="summary" ref={el => setSummaryRef && setSummaryRef(el)}>
//         <CompoundSummary record={item.Record} activeId={activeId} />
//       </div>
//       <CompoundSections sections={sections} renderSection={renderSection} />
//     </div>
//   );
// };

// export default LeftPanel;



// import React from 'react';
// import CompoundSummary from './CompoundSummary';
// import CompoundSections from '../components/CompoundSections';

// interface LeftPanelProps {
//   item: any;
//   sections: any[];
//   renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
//   activeId?: string;
//   setSummaryRef?: (el: HTMLElement | null) => void;
// }

// const LeftPanel: React.FC<LeftPanelProps> = ({ item, sections, renderSection, activeId, setSummaryRef }) => (
//   <div className="flex-1 flex flex-col gap-6 min-w-0">
//     <div id="summary" ref={el => setSummaryRef && setSummaryRef(el)}>
//       <CompoundSummary record={item.Record} activeId={activeId} />
//     </div>
//     <CompoundSections sections={sections} renderSection={renderSection} />
//   </div>
// );

// export default LeftPanel;

//corrected code

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
      <div id="summary" ref={(el) => setSummaryRef && setSummaryRef(el)}>
        <CompoundSummary record={item.Record}  />
      </div>

      {/* All Sections */}
      <CompoundSections sections={sections} renderSection={renderSection} />
    </div>
  );
};

export default LeftPanel;


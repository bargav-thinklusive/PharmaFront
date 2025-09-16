// import React from 'react';
// import TocPanel from '../components/TocPanel';


// interface RightPanelProps {
//   sections: any[];
//   renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
//   activeId: string;
//   recordTitle?: string;
// }

// const RightPanel: React.FC<RightPanelProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
//   return (
//     <div className="w-72 max-w-[18rem] min-w-[16rem]">
//       <TocPanel sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={recordTitle} />
//     </div>
//   );
// };

// export default RightPanel;



// import React from 'react';
// import TocPanel from '../components/TocPanel';

// interface RightPanelProps {
//   sections: any[];
//   renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
//   activeId: string;
//   recordTitle?: string;
// }

// const RightPanel: React.FC<RightPanelProps> = ({ sections, renderTOC, activeId, recordTitle }) => (
//   <div className="w-72 max-w-[18rem] min-w-[16rem] sticky top-24 self-start h-[calc(100vh-4rem)] overflow-y-auto">
//     <TocPanel sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={recordTitle} />
//   </div>
// );

// export default RightPanel;

//corrected code
// import React from 'react';
// import TocPanel from '../components/TocPanel';

// interface RightPanelProps {
//   sections: any[];
//   renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
//   activeId: string;
//   recordTitle?: string;
// }

// const RightPanel: React.FC<RightPanelProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
//   return (
//     <div className="w-72 max-w-[18rem] min-w-[16rem] flex-shrink-0">
//       <TocPanel sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={recordTitle} />
//     </div>
//   );
// };

// export default RightPanel;


import React from 'react';
import TocPanel from './TocPanel';

interface RightPanelProps {
  sections: any[];
  renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
  activeId: string;
  recordTitle?: string;
}

const RightPanel = React.forwardRef<HTMLDivElement, RightPanelProps>(
  ({ sections, renderTOC, activeId, recordTitle }, ref) => {
    return (
      <div className="w-72 max-w-[18rem] min-w-[16rem] flex-shrink-0" ref={ref}>
        <TocPanel
          sections={sections}
          renderTOC={renderTOC}
          activeId={activeId}
          recordTitle={recordTitle}
        />
      </div>
    );
  }
);

export default RightPanel;


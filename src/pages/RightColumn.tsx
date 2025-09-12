import React from 'react';
import TocPanel from '../components/TocPanel';

interface RightColumnProps {
  sections: any[];
  renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
  activeId: string;
  recordTitle?: string;
}

const RightColumn: React.FC<RightColumnProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
  return (
    <div className="w-72 max-w-[18rem] min-w-[16rem]">
      <TocPanel sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={recordTitle} />
    </div>
  );
};

export default RightColumn;

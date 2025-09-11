import { useState } from "react";

interface CompoundTOCProps {
  data: any[];
}

const CompoundTOC: React.FC<CompoundTOCProps> = ({ data }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Contents</h2>
      <ul className="space-y-2 text-sm">
        {data.map((item) =>
          item.Record.Section.map((section: any, idx: number) => {
            const sectionId = `${idx + 1}`;
            const isOpen = openSections[sectionId] ?? false;

            return (
              <li key={sectionId}>
                <button
                  onClick={() => toggleSection(sectionId)}
                  className="flex items-start gap-2 text-cyan-700 hover:underline font-medium"
                >
                  <span>{sectionId}. {section.TOCHeading}</span>
                  {section.Section && <span className="text-xs">{isOpen ? "▲" : "▼"}</span>}
                </button>

                {isOpen && section.Section && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {section.Section.map((sub: any, sIdx: number) => {
                      const subId = `${sectionId}.${sIdx + 1}`;
                      return (
                        <li key={subId}>
                          <a href={`#${subId}`} className="block text-gray-600 hover:text-cyan-700 hover:underline">
                            {subId}. {sub.TOCHeading}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default CompoundTOC;

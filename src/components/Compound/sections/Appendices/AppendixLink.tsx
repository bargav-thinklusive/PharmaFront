import React from 'react';
interface AppendixLinkProps {
  text: string;
}

const AppendixLink: React.FC<AppendixLinkProps> = ({ text }) => {
  if (text === "No data available") {
    return <span className="text-gray-500 italic">{text}</span>;
  }

  const handleClick = (sectionId: string) => {
    // Scroll to the section on the same page
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const parts = text.split(/(Appendix \d+)/gi);
  return <>{parts.map((part, index) => {
    if (/^Appendix \d+$/i.test(part)) {
      const num = part.match(/(\d+)/)?.[1];
      if (num) {
        return (
          <button
            key={index}
            onClick={() => handleClick(`section-5-${num}`)}
            className="text-blue-600 underline hover:text-blue-800 cursor-pointer bg-transparent border-none p-0"
          >
            {part}
          </button>
        );
      }
    }
    return part;
  })}</>;
};

export default AppendixLink;